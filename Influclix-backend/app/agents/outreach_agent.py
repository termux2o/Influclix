# app/agents/outreach_agent.py
import json
import logging
import re
from typing import Any

from app.agents.base import BaseAgent
from app.agents.prompts import load_prompt

logger = logging.getLogger("agents.outreach")

_SYSTEM = load_prompt("outreach_system.txt")


class OutreachAgent(BaseAgent):
    name = "outreach_writer"

    async def write(
        self,
        creator: dict[str, Any],
        campaign_brief: str,
        *,
        brand_name: str | None = None,
        tone: str = "friendly",
    ) -> dict[str, Any]:
        user_prompt = self._build_user_prompt(creator, campaign_brief, brand_name, tone)

        text, meta = await self._chat(
            system=_SYSTEM,
            user=user_prompt,
            temperature=0.7,
            max_tokens=2000,
            response_format_json=False,
        )

        subject, body = self._parse(text)
        return {"subject": subject, "body": body, "meta": meta}

    def _build_user_prompt(self, creator, campaign_brief, brand_name, tone) -> str:
        card = {
            "username": creator.get("username"),
            "display_name": creator.get("display_name"),
            "bio": creator.get("bio"),
            "category": creator.get("category"),
            "tags": creator.get("tags") or [],
            "followers": creator.get("followers"),
            "instagram": creator.get("instagram"),
            "youtube": creator.get("youtube"),
            "location": creator.get("location"),
        }
        return json.dumps(
            {
                "creator": card,
                "campaign_brief": campaign_brief,
                "brand_name": brand_name or "[Your Brand]",
                "tone": tone,
            },
            ensure_ascii=False,
            indent=2,
        )

    def _parse(self, text: str) -> tuple[str, str]:
        raw = (text or "").strip()
        if not raw:
            return "Collaboration opportunity", ""

        if raw.startswith("```"):
            raw = raw.lstrip("`")
            first_nl = raw.find("\n")
            if first_nl != -1 and first_nl < 15:
                raw = raw[first_nl + 1 :]
            raw = raw.rstrip("`").strip()

        json_match = re.search(r"\{.*\}", raw, re.DOTALL)
        if json_match:
            candidate = json_match.group(0)
            candidate_clean = re.sub(r",\s*([}\]])", r"\1", candidate)
            try:
                data = json.loads(candidate_clean)
                if isinstance(data, dict):
                    subject = self._to_clean_string(data.get("subject"))
                    body = self._flatten_body(data.get("body"))
                    if subject and body:
                        return subject, body
                    if body and not subject:
                        return "Collaboration opportunity", body
            except json.JSONDecodeError:
                logger.warning("OutreachAgent: JSON parse failed")

        if "---" in raw:
            head, _, tail = raw.partition("---")
            subject = head.split("SUBJECT:", 1)[-1].strip().strip('"').strip()
            body = tail.strip()
            if body.upper().startswith("BODY:"):
                body = body[5:].lstrip()
            body = body.strip().strip('"').strip()
            if subject and body and subject not in ("{", "}", "[", "]"):
                return subject, body

        lines = [ln for ln in raw.splitlines() if ln.strip()]
        if len(lines) >= 2:
            subject = lines[0].replace("SUBJECT:", "").strip().strip('"').strip()
            if subject and subject not in ("{", "}", "[", "]"):
                body = "\n".join(lines[1:]).strip()
                if body:
                    return subject, body

        return "Collaboration opportunity", raw

    def _to_clean_string(self, val) -> str:
        if val is None:
            return ""
        if isinstance(val, str):
            return val.strip()
        if isinstance(val, (int, float)):
            return str(val)
        if isinstance(val, dict):
            for v in val.values():
                s = self._to_clean_string(v)
                if s:
                    return s
        if isinstance(val, list):
            for v in val:
                s = self._to_clean_string(v)
                if s:
                    return s
        return ""

    def _flatten_body(self, val) -> str:
        if val is None:
            return ""
        if isinstance(val, str):
            return val.strip()
        if isinstance(val, dict):
            parts = []
            for v in val.values():
                s = self._flatten_body(v)
                if s:
                    parts.append(s)
            return "\n\n".join(parts)
        if isinstance(val, list):
            return "\n\n".join(self._flatten_body(v) for v in val if v)
        return str(val).strip()

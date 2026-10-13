# app/agents/base.py
import os
import time
import logging
from typing import Any
from openai import AsyncOpenAI
from dotenv import load_dotenv
load_dotenv()          # ← loads .env into os.environ     # ← loads .env into os.environ

logger = logging.getLogger("agents")


# Gemini via OpenAI-compatible endpoint
_api_key = os.getenv("GEMINI_API_KEY")
_client = AsyncOpenAI(
    api_key=_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
) if _api_key else None

DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# Gemini free tier: 0 cost
_MODEL_PRICING = {
    "gemini-2.0-flash":  {"in": 0.0, "out": 0.0},
    "gemini-2.5-flash":  {"in": 0.0, "out": 0.0},
    "gemini-1.5-flash":  {"in": 0.0, "out": 0.0},
}


class BaseAgent:
    """Shared plumbing for all LLM agents."""

    name: str = "base"

    def __init__(self, model: str = DEFAULT_MODEL):
        if _client is None:
            raise RuntimeError("GEMINI_API_KEY is not set")
        self.model = model

    async def _chat(
        self,
        system: str,
        user: str,
        *,
        temperature: float = 0.7,
        max_tokens: int = 900,
        response_format_json: bool = False,
    ) -> tuple[str, dict[str, Any]]:
        """Call the LLM. Returns (text, meta)."""
        start = time.time()

        kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format_json:
            kwargs["response_format"] = {"type": "json_object"}

        resp = await _client.chat.completions.create(**kwargs)

        elapsed_ms = int((time.time() - start) * 1000)
        text = resp.choices[0].message.content or ""

        meta = {
            "model": self.model,
            "latency_ms": elapsed_ms,
            "prompt_tokens": resp.usage.prompt_tokens,
            "completion_tokens": resp.usage.completion_tokens,
            "total_tokens": resp.usage.total_tokens,
            "cost_usd": self._estimate_cost(resp.usage),
        }
        return text, meta

    def _estimate_cost(self, usage) -> float:
        pricing = _MODEL_PRICING.get(self.model, {"in": 0.0, "out": 0.0})
        return (
            usage.prompt_tokens * pricing["in"]
            + usage.completion_tokens * pricing["out"]
        ) / 1_000_000
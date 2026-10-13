# app/services/agent_run_service.py
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

COLLECTION = "agent_runs"


async def log_run(
    db: AsyncIOMotorDatabase,
    *,
    user_id: str,
    agent: str,
    model: str,
    meta: dict,
    input_preview: str,
    output_preview: str,
    status: str = "success",
    error: str | None = None,
    extra: dict | None = None,
) -> None:
    """Append one row to agent_runs. Best-effort — never raise on logging."""
    try:
        uid = ObjectId(user_id)
    except (InvalidId, TypeError):
        uid = user_id  # fall back to raw value so we still record something

    doc = {
        "user_id": uid,
        "agent": agent,
        "model": model,
        "input_preview": (input_preview or "")[:500],
        "output_preview": (output_preview or "")[:500],
        "prompt_tokens": meta.get("prompt_tokens"),
        "completion_tokens": meta.get("completion_tokens"),
        "total_tokens": meta.get("total_tokens"),
        "cost_usd": meta.get("cost_usd", 0.0),
        "latency_ms": meta.get("latency_ms"),
        "status": status,
        "error": error,
        "extra": extra or {},
        "at": datetime.now(timezone.utc),
    }

    try:
        await db[COLLECTION].insert_one(doc)
    except Exception as e:
        # Logging must never break the request
        print(f"[agent_run_service] failed to log run: {e}")
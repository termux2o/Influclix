# app/services/user_service.py
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core import plans

USERS = "users"
ACTIVITY = "user_activity"


async def log_activity(
    db: AsyncIOMotorDatabase,
    user_id: str,
    action: str,
    filters: dict | None = None,
    result_count: int | None = None,
) -> None:
    try:
        uid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return

    await db[ACTIVITY].insert_one({
        "user_id": uid,
        "action": action,
        "filters": filters or {},
        "result_count": result_count,
        "at": datetime.now(timezone.utc),
    })


async def increment_search_count(
    db: AsyncIOMotorDatabase, user_id: str
) -> int:
    """Increments searches_used and returns the new count."""
    try:
        uid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return 0

    now = datetime.now(timezone.utc)
    result = await db[USERS].find_one_and_update(
        {"_id": uid},
        {
            "$inc": {"searches_used": 1},
            "$set": {"last_search_at": now, "updated_at": now},
        },
        return_document=True,
    )
    return (result or {}).get("searches_used", 0)


async def get_search_usage(
    db: AsyncIOMotorDatabase, user_id: str
) -> dict:
    try:
        uid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return {"used": 0, "limit": plans.FREE_SEARCH_LIMIT, "remaining": 0}

    user = await db[USERS].find_one(
        {"_id": uid},
        {"searches_used": 1, "subscription_type": 1},
    )
    if not user:
        return {"used": 0, "limit": plans.FREE_SEARCH_LIMIT, "remaining": 0}

    sub = user.get("subscription_type", plans.FREE)
    used = user.get("searches_used", 0)
    limit = plans.PLAN_INFO[sub]["search_limit"]

    return {
        "used": used,
        "limit": limit,
        "remaining": None if limit is None else max(0, limit - used),
        "subscription_type": sub,
    }
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.security import hash_password, verify_password

COLLECTION = "users"


async def create_user(
    db: AsyncIOMotorDatabase,
    email: str,
    password: str,
    full_name: str | None = None,
    company: str | None = None,
) -> dict:
    existing = await db[COLLECTION].find_one({"email": email.lower()})
    if existing:
        raise ValueError("Email already registered")

    now = datetime.now(timezone.utc)
    doc = {
        "email": email.lower(),
        "hashed_password": hash_password(password),
        "full_name": full_name,
        "company": company,
        "subscription_type": 0,
        "subscription_started_at": None,
        "subscription_ends_at": None,
        "searches_used": 0,
        "last_search_at": None,
        "created_at": now,
        "updated_at": now,
    }
    result = await db[COLLECTION].insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def authenticate_user(
    db: AsyncIOMotorDatabase, email: str, password: str
) -> dict | None:
    user = await db[COLLECTION].find_one({"email": email.lower()})
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> dict | None:
    return await db[COLLECTION].find_one({"email": email.lower()})


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name"),
        "company": user.get("company"),
        "subscription_type": user.get("subscription_type", 0),   # ← NEW
        "created_at": user["created_at"],
        "updated_at": user.get("updated_at", user["created_at"]),
    }
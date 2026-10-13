from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

class MongoDB:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None

mongodb = MongoDB()

async def connect_to_mongo() -> None:
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URI)
    mongodb.db = mongodb.client[settings.MONGODB_DB_NAME]

    # --- Create indexes (safe to call every startup) ---
    await mongodb.db.users.create_index("email", unique=True)
    await mongodb.db["influencers"].create_index([("category", 1), ("followers", -1)])
    # user_activity indexes
    await mongodb.db["user_activity"].create_index([("user_id", 1), ("at", -1)])
    await mongodb.db["user_activity"].create_index([("user_id", 1), ("action", 1)])
    await mongodb.db["user_activity"].create_index("at", expireAfterSeconds=60 * 60 * 24 * 180)
    # agent_runs indexes
    await mongodb.db["agent_runs"].create_index([("user_id", 1), ("at", -1)])
    await mongodb.db["agent_runs"].create_index([("agent", 1), ("at", -1)])
    await mongodb.db["agent_runs"].create_index("at", expireAfterSeconds=60 * 60 * 24 * 90)


async def close_mongo_connection() -> None:
    if mongodb.client:
        mongodb.client.close()

def get_db() -> AsyncIOMotorDatabase:
    assert mongodb.db is not None, "DB not initialized"
    return mongodb.db
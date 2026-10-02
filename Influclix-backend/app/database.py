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

async def close_mongo_connection() -> None:
    if mongodb.client:
        mongodb.client.close()

def get_db() -> AsyncIOMotorDatabase:
    assert mongodb.db is not None, "DB not initialized"
    return mongodb.db
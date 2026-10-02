import redis.asyncio as redis
from app.config import settings

class RedisPool:
    client: redis.Redis | None = None

redis_pool = RedisPool()


async def connect_to_redis() -> None:
    redis_pool.client = redis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
        max_connections=20,
        health_check_interval=30,
    )
    # sanity check
    await redis_pool.client.ping()


async def close_redis() -> None:
    if redis_pool.client:
        await redis_pool.client.aclose()


def get_redis() -> redis.Redis:
    assert redis_pool.client is not None, "Redis not initialized"
    return redis_pool.client
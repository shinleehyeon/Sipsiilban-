import redis.asyncio as redis

from utils.env_validator import settings

__all__ = ["redis_client"]


class RedisClient:
    def __init__(self, connection_url: str) -> None:
        self._pool = redis.ConnectionPool.from_url(connection_url)

    @property
    def connection(self):
        return redis.Redis(connection_pool=self._pool)


redis_client = RedisClient(connection_url=settings.REDIS_URI)

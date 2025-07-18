from typing import Literal
from functools import lru_cache
from pydantic import field_validator

from pydantic_settings import BaseSettings, SettingsConfigDict

__all__ = ["settings"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    APP_ENV: Literal["development", "production", "testing"]
    SERVER_PORT: int
    DATABASE_URI: str
    JWT_SECRET_KEY: str
    GOOGLE_IOS_CLIENT_ID: str
    GOOGLE_ANDROID_CLIENT_ID: str
    GOOGLE_WEB_CLIENT_ID: str
    GOOGLE_WEB_REDIRECT_URI: str
    GOOGLE_WEB_CLIENT_SECRET: str
    REDIS_URI: str

    PAYMENT_SESSION_EXPIRY: int = 240  # 4분

    @staticmethod
    @field_validator("SERVER_PORT")
    def check_port_range(value: int):
        if not 0 < value < 65536:
            raise ValueError("SERVER_PORT number must be between 1 and 65535")
        return value


@lru_cache()
def get_settings_cached() -> Settings:
    return Settings()


settings = get_settings_cached()

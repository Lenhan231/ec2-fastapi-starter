from __future__ import annotations

from functools import lru_cache
from typing import Any, Dict

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Easy Body API"
    database_url: str = "sqlite:///./app.db"
    sql_echo: bool = False
    cors_allow_origins: list[str] = [
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    secret_key: str = "super-secret-key-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=(".env",), extra="ignore")

    @property
    def connect_args(self) -> Dict[str, Any]:
        if self.database_url.startswith("sqlite"):  # pragma: no cover - simple helper
            return {"check_same_thread": False}
        return {}


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

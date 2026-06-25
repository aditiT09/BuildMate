from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/buildmate"

    SECRET_KEY: str

    REDIS_URL: str = "redis://localhost:6379/0"
    TEST_DATABASE_URL: str | None = None
    TESTING: bool = False

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, value: str) -> str:
        value = value.strip()

        weak_keys = {
            "secret",
            "password",
            "changeme",
            "123456",
            "admin",
        }

        if len(value) < 32:
            raise ValueError(
                "SECRET_KEY must be at least 32 characters long."
            )

        if value.lower() in weak_keys:
            raise ValueError(
                "SECRET_KEY is too weak. Use a securely generated random key."
            )

        return value

    class Settings(BaseSettings):
        model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
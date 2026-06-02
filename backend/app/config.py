from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/buildmate"

    SECRET_KEY: str = "secret"

    REDIS_URL: str
    TEST_DATABASE_URL: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()
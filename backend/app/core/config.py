from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Banda Sonora Literaria API"
    api_prefix: str = "/api/v1"
    database_url: str = "sqlite:///./citas.db"
    cors_origins: list[str] = ["*"]
    tesseract_cmd: str | None = None
    ocr_lang: str = "spa+eng"


settings = Settings()

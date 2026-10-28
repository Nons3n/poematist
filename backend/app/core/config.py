from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "Banda Sonora Literaria API"
    api_prefix: str = "/api/v1"


settings = Settings()

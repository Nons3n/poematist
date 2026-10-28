from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


class QuoteCreate(BaseModel):
    libro_id: str
    texto: str = Field(min_length=1)
    pagina_exacta: str | None = Field(default=None, max_length=30)
    origen: Literal["MANUAL", "FOTO"] = "MANUAL"


class Quote(QuoteCreate):
    id: str
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

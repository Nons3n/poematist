from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Origen = Literal["MANUAL", "FOTO"]


class QuoteCreate(BaseModel):
    libro_id: str
    texto: str = Field(min_length=1)
    pagina_exacta: str | None = Field(default=None, max_length=30)
    origen: Origen = "MANUAL"


class QuoteUpdate(BaseModel):
    texto: str | None = Field(default=None, min_length=1)
    pagina_exacta: str | None = Field(default=None, max_length=30)


class Quote(QuoteCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    fecha_creacion: datetime

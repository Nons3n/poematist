from datetime import datetime, timezone
from uuid import uuid4

from sqlmodel import Field, SQLModel


class Cita(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    libro_id: str = Field(foreign_key="libro.id", index=True)
    texto: str
    pagina_exacta: str | None = Field(default=None, max_length=30)
    origen: str = Field(default="MANUAL", max_length=10)
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)

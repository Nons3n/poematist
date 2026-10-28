from uuid import uuid4

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class AnalisisIA(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    cita_id: str = Field(foreign_key="cita.id", index=True)
    sentimiento_tono: str = Field(max_length=60)
    etiquetas: list[str] = Field(default_factory=list, sa_column=Column(JSON))


class BandaSonora(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    analisis_id: str = Field(foreign_key="analisisia.id", index=True)
    genero_musical: str = Field(max_length=100)
    canciones_recomendadas: list[dict] = Field(default_factory=list, sa_column=Column(JSON))

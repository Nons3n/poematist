from uuid import uuid4

from sqlmodel import Field, SQLModel


class Libro(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    titulo: str = Field(max_length=200)
    autor: str = Field(max_length=160, index=True)
    editorial: str | None = Field(default=None, max_length=160)
    genero: str | None = Field(default=None, max_length=100)

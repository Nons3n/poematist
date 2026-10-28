from pydantic import BaseModel, Field


class BookCreate(BaseModel):
    titulo: str = Field(min_length=1, max_length=200)
    autor: str = Field(min_length=1, max_length=160)
    editorial: str | None = Field(default=None, max_length=160)
    genero: str | None = Field(default=None, max_length=100)


class Book(BookCreate):
    id: str

from pydantic import BaseModel, ConfigDict, Field


class BookCreate(BaseModel):
    titulo: str = Field(min_length=1, max_length=200)
    autor: str = Field(min_length=1, max_length=160)
    editorial: str | None = Field(default=None, max_length=160)
    genero: str | None = Field(default=None, max_length=100)


class BookUpdate(BaseModel):
    titulo: str | None = Field(default=None, min_length=1, max_length=200)
    autor: str | None = Field(default=None, min_length=1, max_length=160)
    editorial: str | None = Field(default=None, max_length=160)
    genero: str | None = Field(default=None, max_length=100)


class Book(BookCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str

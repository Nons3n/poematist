from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    texto: str = Field(min_length=1)


class Song(BaseModel):
    titulo: str
    artista: str
    justificacion: str


class Soundtrack(BaseModel):
    genero_musical: str
    canciones_recomendadas: list[Song] = Field(min_length=3, max_length=3)


class AnalyzeResponse(BaseModel):
    sentimiento_tono: str
    etiquetas: list[str]
    banda_sonora: Soundtrack

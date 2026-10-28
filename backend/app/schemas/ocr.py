from pydantic import BaseModel


class OCRResponse(BaseModel):
    texto: str

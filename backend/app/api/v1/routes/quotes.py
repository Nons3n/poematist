from fastapi import APIRouter, HTTPException, status

from app.schemas.quote import Quote, QuoteCreate
from app.services.library import library

router = APIRouter()


@router.get("", response_model=list[Quote])
def list_quotes() -> list[Quote]:
    return library.list_quotes()


@router.post("", response_model=Quote, status_code=status.HTTP_201_CREATED)
def create_quote(payload: QuoteCreate) -> Quote:
    if library.get_book(payload.libro_id) is None:
        raise HTTPException(status_code=404, detail="Libro asociado no encontrado")
    return library.create_quote(payload)


@router.get("/{quote_id}", response_model=Quote)
def get_quote(quote_id: str) -> Quote:
    quote = library.get_quote(quote_id)
    if quote is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return quote

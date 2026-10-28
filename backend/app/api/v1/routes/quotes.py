from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from app.core.database import get_session
from app.models import Cita, Libro
from app.schemas.quote import Quote, QuoteCreate, QuoteUpdate
from app.services import quotes as service

router = APIRouter()


def get_quote_or_404(quote_id: str, session: Session = Depends(get_session)) -> Cita:
    quote = session.get(Cita, quote_id)
    if quote is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return quote


@router.get("", response_model=list[Quote])
def list_quotes(
    libro_id: str | None = None,
    autor: str | None = None,
    q: str | None = None,
    session: Session = Depends(get_session),
) -> list[Cita]:
    return service.list_quotes(session, libro_id=libro_id, autor=autor, q=q)


@router.post("", response_model=Quote, status_code=status.HTTP_201_CREATED)
def create_quote(payload: QuoteCreate, session: Session = Depends(get_session)) -> Cita:
    if session.get(Libro, payload.libro_id) is None:
        raise HTTPException(status_code=404, detail="Libro asociado no encontrado")
    return service.create_quote(session, payload)


@router.get("/{quote_id}", response_model=Quote)
def get_quote(quote: Cita = Depends(get_quote_or_404)) -> Cita:
    return quote


@router.patch("/{quote_id}", response_model=Quote)
def update_quote(
    payload: QuoteUpdate,
    quote: Cita = Depends(get_quote_or_404),
    session: Session = Depends(get_session),
) -> Cita:
    return service.update_quote(session, quote, payload)


@router.delete("/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(quote: Cita = Depends(get_quote_or_404), session: Session = Depends(get_session)) -> Response:
    service.delete_quote(session, quote)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

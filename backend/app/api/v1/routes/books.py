from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from app.core.database import get_session
from app.models import Libro
from app.schemas.book import Book, BookCreate, BookUpdate
from app.services import books as service

router = APIRouter()


def get_book_or_404(book_id: str, session: Session = Depends(get_session)) -> Libro:
    book = session.get(Libro, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return book


@router.get("", response_model=list[Book])
def list_books(session: Session = Depends(get_session)) -> list[Libro]:
    return service.list_books(session)


@router.post("", response_model=Book, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate, session: Session = Depends(get_session)) -> Libro:
    return service.create_book(session, payload)


@router.get("/{book_id}", response_model=Book)
def get_book(book: Libro = Depends(get_book_or_404)) -> Libro:
    return book


@router.patch("/{book_id}", response_model=Book)
def update_book(
    payload: BookUpdate,
    book: Libro = Depends(get_book_or_404),
    session: Session = Depends(get_session),
) -> Libro:
    return service.update_book(session, book, payload)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book: Libro = Depends(get_book_or_404), session: Session = Depends(get_session)) -> Response:
    service.delete_book(session, book)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

from fastapi import APIRouter, HTTPException, status

from app.schemas.book import Book, BookCreate
from app.services.library import library

router = APIRouter()


@router.get("", response_model=list[Book])
def list_books() -> list[Book]:
    return library.list_books()


@router.post("", response_model=Book, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate) -> Book:
    return library.create_book(payload)


@router.get("/{book_id}", response_model=Book)
def get_book(book_id: str) -> Book:
    book = library.get_book(book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return book

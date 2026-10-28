from sqlmodel import Session, select

from app.models import Cita, Libro
from app.schemas.book import BookCreate, BookUpdate
from app.services.quotes import remove_quote


def list_books(session: Session) -> list[Libro]:
    return list(session.exec(select(Libro).order_by(Libro.titulo)))


def create_book(session: Session, payload: BookCreate) -> Libro:
    book = Libro(**payload.model_dump())
    session.add(book)
    session.commit()
    session.refresh(book)
    return book


def update_book(session: Session, book: Libro, payload: BookUpdate) -> Libro:
    book.sqlmodel_update(payload.model_dump(exclude_unset=True))
    session.add(book)
    session.commit()
    session.refresh(book)
    return book


def delete_book(session: Session, book: Libro) -> None:
    for quote in session.exec(select(Cita).where(Cita.libro_id == book.id)):
        remove_quote(session, quote)
    session.delete(book)
    session.commit()

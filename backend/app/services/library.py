from uuid import uuid4

from app.schemas.book import Book, BookCreate
from app.schemas.quote import Quote, QuoteCreate


class InMemoryLibrary:
    """Temporary store for the API scaffold; replace with SQLite/PostgreSQL persistence."""

    def __init__(self) -> None:
        self.books: dict[str, Book] = {}
        self.quotes: dict[str, Quote] = {}

    def list_books(self) -> list[Book]:
        return list(self.books.values())

    def get_book(self, book_id: str) -> Book | None:
        return self.books.get(book_id)

    def create_book(self, payload: BookCreate) -> Book:
        book = Book(id=str(uuid4()), **payload.model_dump())
        self.books[book.id] = book
        return book

    def list_quotes(self) -> list[Quote]:
        return list(self.quotes.values())

    def get_quote(self, quote_id: str) -> Quote | None:
        return self.quotes.get(quote_id)

    def create_quote(self, payload: QuoteCreate) -> Quote:
        quote = Quote(id=str(uuid4()), **payload.model_dump())
        self.quotes[quote.id] = quote
        return quote


library = InMemoryLibrary()

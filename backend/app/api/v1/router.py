from fastapi import APIRouter

from app.api.v1.routes import books, quotes

api_router = APIRouter()
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["quotes"])

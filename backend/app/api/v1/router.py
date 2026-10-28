from fastapi import APIRouter

from app.api.v1.routes import ai, books, ocr, quotes

api_router = APIRouter()
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["quotes"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["ocr"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])

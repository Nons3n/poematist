import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

import app.models  # noqa: F401
from app.core.database import get_session
from app.main import app


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)

    def override_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_session
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_book_and_quote_crud(client):
    book = client.post("/api/v1/books", json={"titulo": "Rayuela", "autor": "Julio Cortázar"}).json()

    quote = client.post(
        "/api/v1/quotes",
        json={"libro_id": book["id"], "texto": "Andábamos sin buscarnos", "pagina_exacta": "7"},
    )
    assert quote.status_code == 201
    assert quote.json()["origen"] == "MANUAL"

    assert len(client.get("/api/v1/quotes", params={"autor": "cortázar"}).json()) == 1

    updated = client.patch(f"/api/v1/quotes/{quote.json()['id']}", json={"pagina_exacta": "8"})
    assert updated.json()["pagina_exacta"] == "8"

    assert client.delete(f"/api/v1/books/{book['id']}").status_code == 204
    assert client.get("/api/v1/quotes").json() == []


def test_quote_requires_existing_book(client):
    response = client.post("/api/v1/quotes", json={"libro_id": "no-existe", "texto": "Hola"})
    assert response.status_code == 404


def test_ai_is_pending(client):
    assert client.post("/api/v1/ai/analyze", json={"texto": "Hola"}).status_code == 501


def test_ocr_rejects_invalid_images(client):
    files = {"image": ("pagina.png", b"no es una imagen", "image/png")}
    assert client.post("/api/v1/ocr/process", files=files).status_code == 422
    files = {"image": ("notas.txt", b"hola", "text/plain")}
    assert client.post("/api/v1/ocr/process", files=files).status_code == 415


def test_ocr_joins_wrapped_lines():
    from app.services.ocr import _clean

    raw = "En un lugar de la Man-\ncha, de cuyo nombre\nno quiero acordarme\n\nOtro párrafo\n"
    assert _clean(raw) == "En un lugar de la Mancha, de cuyo nombre no quiero acordarme\n\nOtro párrafo"

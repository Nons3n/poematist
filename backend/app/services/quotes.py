from sqlmodel import Session, col, select

from app.models import AnalisisIA, BandaSonora, Cita, Libro
from app.schemas.quote import QuoteCreate, QuoteUpdate


def list_quotes(
    session: Session,
    libro_id: str | None = None,
    autor: str | None = None,
    q: str | None = None,
) -> list[Cita]:
    """Feed cronológico (más recientes primero) con filtros opcionales."""
    query = select(Cita).order_by(col(Cita.fecha_creacion).desc())
    if libro_id:
        query = query.where(Cita.libro_id == libro_id)
    if autor:
        query = query.join(Libro).where(col(Libro.autor).ilike(f"%{autor}%"))
    if q:
        query = query.where(col(Cita.texto).ilike(f"%{q}%"))
    return list(session.exec(query))


def create_quote(session: Session, payload: QuoteCreate) -> Cita:
    quote = Cita(**payload.model_dump())
    session.add(quote)
    session.commit()
    session.refresh(quote)
    return quote


def update_quote(session: Session, quote: Cita, payload: QuoteUpdate) -> Cita:
    quote.sqlmodel_update(payload.model_dump(exclude_unset=True))
    session.add(quote)
    session.commit()
    session.refresh(quote)
    return quote


def remove_quote(session: Session, quote: Cita) -> None:
    """Marca la cita y su análisis IA para borrado, sin confirmar la transacción."""
    for analysis in session.exec(select(AnalisisIA).where(AnalisisIA.cita_id == quote.id)):
        for soundtrack in session.exec(select(BandaSonora).where(BandaSonora.analisis_id == analysis.id)):
            session.delete(soundtrack)
        session.delete(analysis)
    session.delete(quote)


def delete_quote(session: Session, quote: Cita) -> None:
    remove_quote(session, quote)
    session.commit()

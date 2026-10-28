"""Modelos ORM (SQLModel) de la base de datos."""

from app.models.analysis import AnalisisIA, BandaSonora
from app.models.book import Libro
from app.models.quote import Cita

__all__ = ["AnalisisIA", "BandaSonora", "Cita", "Libro"]

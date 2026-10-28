import io
import re
import shutil
from pathlib import Path

import pytesseract
from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.config import settings

WINDOWS_DEFAULT = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")


class OCRError(RuntimeError):
    pass


class OCRNotConfiguredError(OCRError):
    pass


class InvalidImageError(OCRError):
    pass


def _tesseract_cmd() -> str:
    cmd = settings.tesseract_cmd or shutil.which("tesseract")
    if cmd is None and WINDOWS_DEFAULT.exists():
        cmd = str(WINDOWS_DEFAULT)
    if cmd is None:
        raise OCRNotConfiguredError("Tesseract no está instalado o no se encuentra (ver TESSERACT_CMD)")
    return cmd


def _clean(raw: str) -> str:
    """Une las líneas cortadas por el ancho de la página, conservando los párrafos."""
    text = re.sub(r"-\n(?=\w)", "", raw)
    paragraphs = re.split(r"\n\s*\n", text)
    return "\n\n".join(" ".join(p.split()) for p in paragraphs if p.strip())


def extract_text(image: bytes) -> str:
    try:
        picture = Image.open(io.BytesIO(image))
        picture = ImageOps.grayscale(ImageOps.exif_transpose(picture))
    except UnidentifiedImageError as exc:
        raise InvalidImageError("No se pudo leer la imagen") from exc

    pytesseract.pytesseract.tesseract_cmd = _tesseract_cmd()
    try:
        raw = pytesseract.image_to_string(picture, lang=settings.ocr_lang)
    except pytesseract.TesseractError as exc:
        raise OCRNotConfiguredError(f"Error de Tesseract (¿falta el idioma '{settings.ocr_lang}'?)") from exc
    return _clean(raw)

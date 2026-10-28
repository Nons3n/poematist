from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.concurrency import run_in_threadpool

from app.schemas.ocr import OCRResponse
from app.services import ocr as service

router = APIRouter()


@router.post("/process", response_model=OCRResponse)
async def process_image(image: UploadFile = File(...)) -> OCRResponse:
    # Algunos clientes (fetch de Expo) envían el archivo sin tipo; Pillow valida el contenido después.
    content_type = image.content_type or "application/octet-stream"
    if not content_type.startswith("image/") and content_type != "application/octet-stream":
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Se esperaba una imagen")
    try:
        texto = await run_in_threadpool(service.extract_text, await image.read())
    except service.InvalidImageError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except service.OCRNotConfiguredError as exc:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(exc)) from exc
    return OCRResponse(texto=texto)

from fastapi import APIRouter, HTTPException, status

from app.schemas.ai import AnalyzeRequest, AnalyzeResponse
from app.services import ai as service

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    try:
        return service.analyze_quote(payload.texto)
    except service.LLMNotConfiguredError as exc:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(exc)) from exc

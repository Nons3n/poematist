from app.schemas.ai import AnalyzeResponse

SYSTEM_PROMPT = (
    "Eres un experto en crítica literaria y musicología. Analiza el siguiente texto extraído "
    "de un libro. Determina su tono emocional, sentimiento general y etiquetas temáticas. "
    "Adicionalmente, crea una 'Banda Sonora Literaria' recomendando un género musical "
    "representativo y exactamente 3 canciones reales con su artista y breve justificación. "
    "Responde estrictamente en formato JSON."
)


class LLMNotConfiguredError(RuntimeError):
    pass


def build_messages(texto: str) -> list[dict[str, str]]:
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Texto de la cita: '{texto}'"},
    ]


def analyze_quote(texto: str) -> AnalyzeResponse:
    """Analiza el tono de la cita y genera su Banda Sonora Literaria.

    Pendiente: enviar build_messages(texto) al cliente LLM elegido y validar la
    respuesta JSON con AnalyzeResponse.model_validate_json(...).
    """
    raise LLMNotConfiguredError("El cliente LLM aún no está configurado")

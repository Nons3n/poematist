# Banda Sonora Literaria

Base inicial para una aplicación móvil que organiza citas de libros y, en etapas posteriores, permitirá capturarlas, analizarlas y acompañarlas con recomendaciones musicales.

## Estructura

- `mobile/`: aplicación React Native con Expo y una primera pantalla de biblioteca.
- `backend/`: API REST con FastAPI, documentación automática y rutas iniciales para libros y citas.

## Iniciar la aplicación móvil

```sh
cd mobile
npm install
npm start
```

## Iniciar la API

```sh
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000`; su documentación interactiva está en `/docs`.

## Alcance de esta base

La pantalla móvil es una maqueta inicial con citas de ejemplo y texto en cursiva. La API permite crear y consultar libros y citas relacionadas, pero usa memoria temporal: sus datos se reinician al reiniciar el servidor. OCR, análisis con IA, almacenamiento persistente, sincronización y navegación completa quedan preparados para construirse por etapas.
>>>>>>> b8e53afe (Base inicial del proyecto)

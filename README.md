# Banda Sonora Literaria

Aplicación móvil para guardar y organizar citas de libros. Permite capturar fragmentos con la cámara mediante OCR, editarlos antes de guardarlos y, en próximas versiones, analizar su tono emocional para recomendar una "Banda Sonora Literaria".

## Funcionalidades

| Módulo | Estado |
| --- | --- |
| Biblioteca de libros y citas (texto siempre en cursiva) | Disponible |
| Captura de citas desde foto o galería con recorte y edición del texto antes de guardar | Disponible |
| Análisis de sentimiento y Banda Sonora Literaria con LLM | Contrato de API definido; integración pendiente |
| Feed, búsqueda avanzada y exportación de Quote Cards | Pendiente |
| Almacenamiento local offline y sincronización | Pendiente |

## Stack

- **Móvil:** React Native con Expo SDK 58, Expo Image Picker y Expo File System.
- **Backend:** Python, FastAPI y SQLModel.
- **Base de datos:** SQLite en desarrollo; PostgreSQL en producción.
- **OCR:** Tesseract.

## Estructura

```
mobile/                     Aplicación React Native + Expo
  App.js                    Punto de entrada y cambio de pantallas
  src/components/           Componentes reutilizables (QuoteCard, Button)
  src/screens/              Pantallas (LibraryScreen, OCREditorScreen)
  src/services/             Clientes de la API (apiClient, ocrService, iaService)
  src/database/             Almacenamiento local y datos de ejemplo
  src/navigation/           Navegadores
  src/theme.js              Colores y tipografía
backend/                    API REST con FastAPI
  app/api/v1/routes/        Endpoints: books, quotes, ocr, ai
  app/core/                 Configuración y conexión a la base de datos
  app/models/               Modelos ORM: Libro, Cita, AnalisisIA, BandaSonora
  app/schemas/              Schemas de request/response
  app/services/             Lógica de negocio, OCR y prompts del LLM
  tests/                    Pruebas de la API
```

## Requisitos

- Python 3.12 o superior
- Node.js 20 o superior
- Tesseract OCR con el idioma español
- Expo Go (SDK 58) en un dispositivo, o un emulador de Android/iOS

### Instalar Tesseract

| Sistema | Comando |
| --- | --- |
| Windows | `winget install UB-Mannheim.TesseractOCR` |
| macOS | `brew install tesseract tesseract-lang` |
| Debian/Ubuntu | `sudo apt install tesseract-ocr tesseract-ocr-spa` |

Verifica que esté disponible el idioma `spa` con `tesseract --list-langs`. Si falta, descarga [`spa.traineddata`](https://github.com/tesseract-ocr/tessdata) y cópialo en la carpeta `tessdata` de la instalación.

## Backend

```sh
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env             # Windows: copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0
```

La API queda disponible en `http://localhost:8000`, con documentación interactiva en `/docs` y estado de salud en `/health`.

### Variables de entorno

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `DATABASE_URL` | Cadena de conexión de SQLAlchemy | `sqlite:///./citas.db` |
| `CORS_ORIGINS` | Orígenes permitidos (lista JSON) | `["*"]` |
| `TESSERACT_CMD` | Ruta al ejecutable de Tesseract, si no está en el PATH | Detección automática |
| `OCR_LANG` | Idiomas de Tesseract | `spa+eng` |

Para usar PostgreSQL, instala `psycopg[binary]` y define `DATABASE_URL=postgresql+psycopg://usuario:clave@host:5432/citas`.

### Pruebas

```sh
cd backend
pytest
```

### Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET`, `POST` | `/api/v1/books` | Listar y crear libros |
| `GET`, `PATCH`, `DELETE` | `/api/v1/books/{id}` | Consultar, editar y eliminar un libro (con sus citas) |
| `GET`, `POST` | `/api/v1/quotes` | Listar citas (filtros `libro_id`, `autor`, `q`) y crearlas |
| `GET`, `PATCH`, `DELETE` | `/api/v1/quotes/{id}` | Consultar, editar y eliminar una cita |
| `POST` | `/api/v1/ocr/process` | Extraer texto de una imagen (`multipart/form-data`, campo `image`) |
| `POST` | `/api/v1/ai/analyze` | Análisis de sentimiento y Banda Sonora Literaria (responde `501` hasta integrar el LLM) |

## Aplicación móvil

```sh
cd mobile
npm install
cp .env.example .env             # Windows: copy .env.example .env
npx expo start
```

Escanea el código QR con Expo Go o abre un emulador desde la consola de Expo.

### Configuración

`EXPO_PUBLIC_API_URL` en `mobile/.env` indica dónde está la API:

| Entorno | Valor |
| --- | --- |
| Dispositivo físico | `http://<IP-del-equipo-con-la-API>:8000/api/v1` |
| Emulador de Android | `http://10.0.2.2:8000/api/v1` |
| Simulador de iOS / web | `http://localhost:8000/api/v1` |

El dispositivo debe estar en la misma red que el equipo que ejecuta la API. Tras modificar `.env`, reinicia Expo con `npx expo start -c`.

## Solución de problemas

- **El dispositivo no se conecta a la API:** comprueba que la API se inició con `--host 0.0.0.0`, que el firewall permite el puerto 8000 y que `http://<IP>:8000/health` abre desde el navegador del dispositivo.
- **"Project is incompatible with this version of Expo Go":** la versión de Expo Go no coincide con el SDK del proyecto. Actualiza Expo Go o alinea el proyecto con `npx expo install expo@^<SDK> --fix`.
- **El OCR responde `501`:** Tesseract no está instalado, no se encuentra (define `TESSERACT_CMD`) o falta algún idioma de `OCR_LANG`.
- **Windows: "la ejecución de scripts está deshabilitada" en PowerShell:** ejecuta `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` o usa CMD.

## Notas de desarrollo

- Las fotos se suben con `uploadAsync` de `expo-file-system/legacy`, ya que el `fetch` de Expo SDK 58 no admite el `FormData` con `{ uri }` de React Native.
- La navegación es un cambio de pantallas por estado en `App.js`; se reemplazará por React Navigation.

## Hoja de ruta

- Integrar el cliente LLM en `backend/app/services/ai.py`.
- Navegación con React Navigation y pantallas de detalle de cita y feed.
- Almacenamiento local con SQLite/WatermelonDB y sincronización con la API.
- Exportación de Quote Cards con React Native View Shot.
- Migraciones de base de datos con Alembic.

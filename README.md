# Banda Sonora Literaria

Gestor de citas literarias con IA: organiza fragmentos de tus libros, captúralos con la cámara (OCR) y recibe una "Banda Sonora Literaria" según su tono emocional.

## Qué funciona hoy

- **Biblioteca:** lista las citas guardadas en la API (más recientes primero). Si la API no responde, muestra citas de ejemplo y lo avisa.
- **Cita desde foto:** tomar foto o elegirla de la galería, recortarla, transcribirla con OCR y **editar el texto antes de guardarlo** (dejar solo el fragmento que interesa). Luego se asocia a un libro existente o nuevo y a una página.
- **API:** CRUD de libros y citas sobre SQLite, OCR con Tesseract y contrato del análisis con IA (aún sin LLM conectado).
- El texto de las citas se muestra siempre en cursiva.

## Estructura

```
mobile/                     React Native + Expo (SDK 58)
  App.js                    Cambio de pantallas por estado (temporal)
  src/components/           QuoteCard, Button
  src/screens/              LibraryScreen, OCREditorScreen
  src/services/             apiClient, ocrService, iaService
  src/database/             Almacenamiento local (por ahora, datos de muestra)
  src/navigation/           Navegadores (pendiente)
  src/theme.js              Colores y tipografía
backend/                    FastAPI
  app/api/v1/routes/        books, quotes, ocr, ai
  app/core/                 Configuración (.env) y conexión a base de datos
  app/models/               Modelos SQLModel: Libro, Cita, AnalisisIA, BandaSonora
  app/schemas/              Schemas Pydantic de request/response
  app/services/             Lógica de negocio, OCR (Tesseract) y prompt del LLM
  tests/                    Pruebas de la API (pytest)
```

## Requisitos

- Python 3.12+ y Node.js 20+.
- [Tesseract OCR](#ocr-tesseract) con el idioma español.
- En el celular, **Expo Go para SDK 58**, conectado a la misma red que la PC.

> **Windows / PowerShell:** si sale "la ejecución de scripts está deshabilitada" al usar `npm` o activar el venv, ejecuta una vez
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` y vuelve a abrir la terminal (o usa CMD).

## Iniciar la API

```sh
cd backend
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
copy .env.example .env            # opcional (macOS/Linux: cp)
uvicorn app.main:app --reload --host 0.0.0.0
```

- Documentación interactiva: `http://127.0.0.1:8000/docs`. Comprobación rápida: `/health`.
- `--host 0.0.0.0` es necesario para que el celular pueda conectarse. Si no conecta, revisa que el Firewall de Windows permita Python en redes privadas.
- Por defecto usa SQLite (`backend/citas.db`). Para PostgreSQL instala `psycopg[binary]` y cambia `DATABASE_URL` en `.env`.
- Pruebas: `pytest`.

### OCR (Tesseract)

1. Instala Tesseract (desde cualquier carpeta):
   ```sh
   winget install UB-Mannheim.TesseractOCR
   ```
2. Si no trae español, descarga el idioma desde **PowerShell como administrador**:
   ```powershell
   Invoke-WebRequest -Uri "https://github.com/tesseract-ocr/tessdata/raw/main/spa.traineddata" -OutFile "C:\Program Files\Tesseract-OCR\tessdata\spa.traineddata"
   ```
3. Comprueba que aparezca `spa` (en PowerShell hace falta el `&`):
   ```powershell
   & "C:\Program Files\Tesseract-OCR\tesseract.exe" --list-langs
   ```

El backend busca Tesseract en el PATH y en `C:\Program Files\Tesseract-OCR`. Si está en otro lugar, define `TESSERACT_CMD` en `.env`. El idioma se configura con `OCR_LANG` (por defecto `spa+eng`).

### Endpoints

| Método | Ruta | Estado |
| --- | --- | --- |
| GET, POST | `/api/v1/books` | Listo |
| GET, PATCH, DELETE | `/api/v1/books/{id}` | Listo (borra también sus citas) |
| GET, POST | `/api/v1/quotes` (filtros `libro_id`, `autor`, `q`) | Listo |
| GET, PATCH, DELETE | `/api/v1/quotes/{id}` | Listo |
| POST | `/api/v1/ocr/process` (multipart, campo `image`) | Listo (501 si Tesseract no está instalado) |
| POST | `/api/v1/ai/analyze` | Contrato y prompt definidos, responde 501 |

## Iniciar la aplicación móvil

```sh
cd mobile
npm install
copy .env.example .env            # macOS/Linux: cp
npx expo start -c
```

En `mobile/.env`, `EXPO_PUBLIC_API_URL` debe apuntar a la **IPv4 de la PC** donde corre la API, con el puerto 8000:

```
EXPO_PUBLIC_API_URL=http://192.168.1.50:8000/api/v1
```

- La IP se obtiene con `ipconfig` (adaptador Wi-Fi o Ethernet). No uses `127.0.0.1`: desde el celular apunta al propio celular.
- En el emulador de Android usa `http://10.0.2.2:8000/api/v1`.
- Tras cambiar `.env`, reinicia Expo con `npx expo start -c`.
- Para comprobar la conexión, abre `http://TU_IP:8000/health` en el navegador del celular.
- Si Expo Go dice que el proyecto es de otro SDK, actualiza Expo Go o alinea el proyecto con `npx expo install expo@^<versión> --fix`.

### Notas técnicas

- La foto se sube con `uploadAsync` de `expo-file-system/legacy` porque el `fetch` de Expo SDK 58 no acepta el `FormData` con `{ uri }` de React Native ("Unsupported FormDataPart implementation").
- Se usa `react-native-safe-area-context` en lugar del `SafeAreaView` de React Native, que está obsoleto.

## Pendiente

- Integrar el cliente LLM (`backend/app/services/ai.py`).
- Navegación (React Navigation, Stack/Tabs), pantallas QuoteDetail y Feed.
- Almacenamiento local con SQLite/WatermelonDB y sincronización con la API.
- Exportación de Quote Cards con React Native View Shot.
- Migraciones de base de datos (Alembic) antes de pasar a PostgreSQL.

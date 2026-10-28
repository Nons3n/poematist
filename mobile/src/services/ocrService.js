import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';

import { API_URL } from './apiClient';

// Envía una foto (asset de Expo Image Picker) y devuelve el texto extraído.
// La subida es nativa: el fetch de Expo (SDK 58) no acepta el FormData con { uri } de React Native.
export async function extractText(asset) {
  const response = await uploadAsync(`${API_URL}/ocr/process`, asset.uri, {
    httpMethod: 'POST',
    uploadType: FileSystemUploadType.MULTIPART,
    fieldName: 'image',
    mimeType: asset.mimeType ?? 'image/jpeg',
  });

  const data = JSON.parse(response.body || '{}');
  if (response.status >= 400) {
    throw new Error(data.detail ?? `Error ${response.status}`);
  }
  return data.texto;
}

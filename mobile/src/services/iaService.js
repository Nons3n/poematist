import { request } from './apiClient';

// Devuelve { sentimiento_tono, etiquetas, banda_sonora: { genero_musical, canciones_recomendadas } }.
export function analyzeQuote(texto) {
  return request('/ai/analyze', { method: 'POST', body: { texto } });
}

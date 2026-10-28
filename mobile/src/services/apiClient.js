// En un dispositivo físico usa la IP de la PC con el puerto 8000, no 127.0.0.1 (ver mobile/.env.example).
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';

// Peticiones JSON. Las fotos se suben aparte con uploadAsync (ver ocrService.js).
export async function request(path, { method = 'GET', body, headers } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? `Error ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

export const booksApi = {
  list: () => request('/books'),
  get: (id) => request(`/books/${id}`),
  create: (book) => request('/books', { method: 'POST', body: book }),
  update: (id, changes) => request(`/books/${id}`, { method: 'PATCH', body: changes }),
  remove: (id) => request(`/books/${id}`, { method: 'DELETE' }),
};

export const quotesApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString();
    return request(`/quotes${params ? `?${params}` : ''}`);
  },
  get: (id) => request(`/quotes/${id}`),
  create: (quote) => request('/quotes', { method: 'POST', body: quote }),
  update: (id, changes) => request(`/quotes/${id}`, { method: 'PATCH', body: changes }),
  remove: (id) => request(`/quotes/${id}`, { method: 'DELETE' }),
};

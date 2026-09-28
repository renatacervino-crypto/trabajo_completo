const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registrar(datos) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (res.status === 400) throw new Error('Ese email ya está registrado');
  if (res.status === 422) throw new Error('Revisá los datos: la clave va de 8 caracteres para arriba y debe aceptar el consentimiento');
  if (!res.ok) throw new Error('No se pudo crear la cuenta');

  return res.json();
}

export async function login(email, password) {
  const body = new URLSearchParams({
    username: email, // FastAPI OAuth2 espera username
    password,
  });

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (res.status === 401) throw new Error('Email o contraseña incorrectos');
  if (!res.ok) throw new Error('No se pudo iniciar sesión');

  return res.json();
}

export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Sesión vencida');
  return res.json();
}

export async function getProductos({ page = 0, limit = 4, nombre = '' } = {}) {
  const params = new URLSearchParams();
  if (page !== undefined && page !== null) {
    params.append('page', page);
  }
  if (limit !== undefined && limit !== null) {
    params.append('limit', limit);
  }
  if (nombre) {
    params.append('nombre', nombre);
  }

  const query = params.toString();
  const url = query ? `${API_URL}/productos?${query}` : `${API_URL}/productos`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error('Error al consultar el backend');
  }
  return await respuesta.json();
}

export default {
  getProductos,
  registrar,
  login,
  getMe,
  authHeaders,
};

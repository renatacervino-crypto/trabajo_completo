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

export async function crearPedido(items) {
  // LA REGLA QUE NO SE NEGOCIA:
  // Al backend le mandás producto_id y cantidad, nada más.
  // El precio está en pantalla para dibujar el carrito, pero no viaja:
  // el total lo calcula el servidor con los precios de su propia base de datos.
  const payload = {
    items: items.map((item) => ({
      producto_id: Number(item.id),
      cantidad: Number(item.cantidad || 1),
    })),
  };

  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new Error('Debes iniciar sesión para confirmar tu compra.');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'No se pudo confirmar el pedido');
  }

  return res.json();
}

export async function getMisPedidos() {
  const res = await fetch(`${API_URL}/pedidos/mios`, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    throw new Error('Sesión no autorizada o expirada');
  }

  if (!res.ok) {
    throw new Error('No se pudo obtener el historial de pedidos');
  }

  return res.json();
}

export async function solicitarArrepentimiento({ pedidoId, motivo = '' }) {
  const res = await fetch(`${API_URL}/derechos/arrepentimiento`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      pedido_id: Number(pedidoId),
      motivo: motivo || undefined,
    }),
  });

  if (res.status === 401) {
    throw new Error('Debes iniciar sesión para solicitar la revocación.');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'No se pudo procesar la solicitud de arrepentimiento');
  }

  return res.json();
}

export async function getDatosPersonales() {
  const res = await fetch(`${API_URL}/derechos/mis-datos`, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    throw new Error('Debes iniciar sesión para consultar tus datos registrados.');
  }

  if (!res.ok) {
    throw new Error('No se pudo acceder al registro de datos personales.');
  }

  return res.json();
}

export async function solicitarBaja({ motivo = '' } = {}) {
  const res = await fetch(`${API_URL}/derechos/baja`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      motivo: motivo || undefined,
    }),
  });

  if (res.status === 401) {
    throw new Error('Debes iniciar sesión para tramitar la baja de tu cuenta.');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'No se pudo tramitar la baja.');
  }

  return res.json();
}

export async function crearProducto(productoData) {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(productoData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'No se pudo crear el producto');
  }

  return res.json();
}

export async function subirImagenProducto(productoId, archivo) {
  const formData = new FormData();
  formData.append('file', archivo);

  // LA REGLA QUE MÁS SE OLVIDA:
  // Cuando mandás un FormData, NO le pongas el Content-Type al fetch.
  // El navegador lo arma solo con el boundary.
  const headers = authHeaders(); // Incluye solo Authorization: Bearer <token>

  const res = await fetch(`${API_URL}/productos/${productoId}/imagen`, {
    method: 'POST',
    headers, // SIN 'Content-Type'
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al subir la imagen');
  }

  return res.json();
}

export async function eliminarProducto(productoId) {
  const res = await fetch(`${API_URL}/productos/${productoId}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'No se pudo eliminar el producto');
  }

  return res.json();
}

export default {
  getProductos,
  registrar,
  login,
  getMe,
  authHeaders,
  crearPedido,
  getMisPedidos,
  solicitarArrepentimiento,
  getDatosPersonales,
  solicitarBaja,
  crearProducto,
  subirImagenProducto,
  eliminarProducto,
};




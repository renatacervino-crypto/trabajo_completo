const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
};

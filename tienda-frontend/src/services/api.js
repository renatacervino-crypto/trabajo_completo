const API_URL = '/api';

export async function getProductos() {
  const respuesta = await fetch(`${API_URL}/productos`);
  if (!respuesta.ok) {
    throw new Error('Error al consultar el backend');
  }
  return await respuesta.json();
}

export default {
  getProductos,
};

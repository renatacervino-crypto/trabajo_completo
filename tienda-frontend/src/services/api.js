const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return await response.json();
  } catch (error) {
    console.warn('API aún no conectada con el backend:', error.message);
    return [];
  }
};

export default {
  getProducts,
};

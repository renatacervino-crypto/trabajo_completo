import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api';
import { useCart } from '../context/CartContext';

export default function CatalogPage({ onSelectProduct }) {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');

  const cargarProductos = () => {
    setIsLoading(true);
    setError(null);
    getProductos()
      .then((data) => {
        setProductos(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Error al obtener productos:', err);
        setError('No se pudo conectar con el servidor. Por favor, verifica que el backend esté encendido.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`¡"${product.nombre}" agregado a la bolsa!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredProducts = productos.filter((prod) =>
    prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 border border-amber-700 animate-bounce">
          <span>🛍️</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Intro */}
        <div className="mb-8 text-center max-w-xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-amber-700 uppercase font-semibold mb-2">
            Colección de Fragancias de Autor
          </p>
          <h2 className="text-3xl font-serif text-stone-900">
            Catálogo de Productos
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-light">
            Haz clic en cualquier fragancia para ver su ficha técnica detallada o agrégala directamente a tu bolsa.
          </p>
        </div>

        {/* 1. Estado de Carga (isLoading === true) */}
        {isLoading && (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200 shadow-sm p-8 max-w-md mx-auto">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-stone-200 border-t-amber-700 mb-4"></div>
            <h3 className="text-base font-semibold text-stone-800">Cargando productos...</h3>
            <p className="text-xs text-stone-500 mt-1">Consultando la base de datos del servidor.</p>
          </div>
        )}

        {/* 2. Estado de Error (error !== null) */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto text-center shadow-sm my-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg">
              ✕
            </div>
            <h3 className="text-red-900 font-semibold text-base mb-1">
              Error al cargar los productos
            </h3>
            <p className="text-xs text-red-700 leading-relaxed mb-4">
              {error}
            </p>
            <button
              onClick={cargarProductos}
              className="text-xs font-semibold bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded transition-colors cursor-pointer"
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {/* 3. Estado de Catálogo Vacío (!isLoading && !error && productos.length === 0) */}
        {!isLoading && !error && productos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-stone-200 p-8 max-w-md mx-auto my-6 shadow-sm">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-lg">
              📭
            </div>
            <h3 className="text-stone-800 font-semibold text-base mb-1">
              Catálogo vacío
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              No hay productos disponibles en el catálogo en este momento.
            </p>
          </div>
        )}

        {/* 4. Lista de Productos (!isLoading && !error && productos.length > 0) */}
        {!isLoading && !error && productos.length > 0 && (
          <>
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-96 relative">
                <input
                  type="text"
                  placeholder="Buscar producto por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-700 bg-stone-50"
                />
              </div>

              <div className="text-xs text-stone-500 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const precioFinal = prod.precio_final ?? prod.precio ?? 0;
                const cuotasCantidad = prod.cuotas_cantidad ?? 6;
                const cuotasValor =
                  prod.cuotas_valor ??
                  (precioFinal > 0 ? Math.round(precioFinal / cuotasCantidad) : 0);
                const garantiaMeses = prod.garantia_meses ?? 12;

                const fullProductData = {
                  ...prod,
                  precio_final: precioFinal,
                  cuotas_cantidad: cuotasCantidad,
                  cuotas_valor: cuotasValor,
                  garantia_meses: garantiaMeses,
                };

                return (
                  <ProductCard
                    key={prod.id || prod.nombre}
                    nombre={prod.nombre}
                    precio_final={precioFinal}
                    cuotas_cantidad={cuotasCantidad}
                    cuotas_valor={cuotasValor}
                    garantia_meses={garantiaMeses}
                    imagen={
                      prod.imagen ||
                      prod.image ||
                      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
                    }
                    onSelect={() => onSelectProduct && onSelectProduct(fullProductData)}
                    onAddToCart={() => handleAddToCart(fullProductData)}
                  />
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 text-stone-500 text-sm">
                No se encontraron productos que coincidan con "{searchTerm}".
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

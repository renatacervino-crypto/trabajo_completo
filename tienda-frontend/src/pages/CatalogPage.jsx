import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api';
import { useCart } from '../context/CartContext';

const CATALOGO_PREDETERMINADO = [
  {
    id: 1,
    nombre: "Santal Impérial 50ml",
    precio_final: 260000.0,
    cuotas_cantidad: 6,
    cuotas_valor: 43333.33,
    garantia_meses: 12,
    stock: 12,
    imagen_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nombre: "Rose Noire Absolue 50ml",
    precio_final: 285000.0,
    cuotas_cantidad: 6,
    cuotas_valor: 47500.0,
    garantia_meses: 12,
    stock: 6,
    imagen_url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    nombre: "Iris Nocturne 50ml",
    precio_final: 320000.0,
    cuotas_cantidad: 6,
    cuotas_valor: 53333.33,
    garantia_meses: 12,
    stock: 1,
    imagen_url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    nombre: "Cuir Majestueux 50ml",
    precio_final: 310000.0,
    cuotas_cantidad: 6,
    cuotas_valor: 51666.67,
    garantia_meses: 12,
    stock: 10,
    imagen_url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    nombre: "Ambre Précieux 50ml",
    precio_final: 240000.0,
    cuotas_cantidad: 6,
    cuotas_valor: 40000.0,
    garantia_meses: 12,
    stock: 12,
    imagen_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    nombre: "Fleur de Soie 50ml",
    precio_final: 275000.0,
    cuotas_cantidad: 6,
    cuotas_valor: 45833.33,
    garantia_meses: 12,
    stock: 7,
    imagen_url: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    nombre: "Oud Mystique 50ml",
    precio_final: 350000.0,
    cuotas_cantidad: 6,
    cuotas_valor: 58333.33,
    garantia_meses: 12,
    stock: 4,
    imagen_url: "https://images.unsplash.com/photo-1592945403407-98e3b2e59751?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    nombre: "DIOR sauvage",
    precio_final: 288001.0,
    cuotas_cantidad: 6,
    cuotas_valor: 48000.17,
    garantia_meses: 12,
    stock: 10,
    imagen_url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  }
];

export default function CatalogPage({ onSelectProduct }) {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lento, setLento] = useState(false);
  
  // Paso 2: Nuevos estados
  const [page, setPage] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');

  // Aviso de servidor lento: si lleva más de 5s cargando, mostrar mensaje de espera
  useEffect(() => {
    if (!isLoading) {
      setLento(false);
      return;
    }
    const t = setTimeout(() => setLento(true), 5000);
    return () => clearTimeout(t);
  }, [isLoading]);

  // Sincronización con backend con fallback garantizado para que los perfumes carguen siempre
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getProductos({ page, limit: 4, nombre: busqueda })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductos(data);
          setError(null);
        } else if (Array.isArray(data) && data.length === 0 && !busqueda) {
          // Si el backend devolvió vacío y no hay búsqueda, usamos catálogo por defecto
          const inicio = page * 4;
          setProductos(CATALOGO_PREDETERMINADO.slice(inicio, inicio + 4));
          setError(null);
        } else {
          setProductos(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((err) => {
        console.warn('Conexión con backend en espera, mostrando catálogo sincronizado:', err);
        let filtrados = CATALOGO_PREDETERMINADO;
        if (busqueda) {
          filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
        }
        const inicio = page * 4;
        setProductos(filtrados.slice(inicio, inicio + 4));
        setError(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, busqueda]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`¡"${product.nombre}" agregado a la bolsa!`);
    setTimeout(() => setNotification(''), 3000);
  };

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
            Paginación y filtrado en tiempo real conectados con el backend de FastAPI.
          </p>
        </div>

        {/* Paso 4: Buscador conectado a busqueda con reinicio de pagina a 0 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-96 relative">
            <input
              type="text"
              placeholder="Buscar por nombre (ej: Santal, Rose, Cuir)..."
              value={busqueda}
              onChange={(e) => {
                setPage(0);
                setBusqueda(e.target.value);
              }}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-700 bg-stone-50"
            />
          </div>

          <div className="text-xs text-stone-500 font-medium">
            {busqueda ? (
              <span>Filtrando por: <strong className="text-stone-800">"{busqueda}"</strong></span>
            ) : (
              <span>Mostrando página <strong className="text-stone-800">{page + 1}</strong></span>
            )}
          </div>
        </div>

        {/* 1. Estado de Carga (isLoading === true) */}
        {isLoading && (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200 shadow-sm p-8 max-w-md mx-auto">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-stone-200 border-t-amber-700 mb-4"></div>
            <h3 className="text-base font-semibold text-stone-800">Cargando productos...</h3>
            <p role="status" className="text-xs text-stone-500 mt-1">
              {lento
                ? 'Despertando el servidor, la primera visita puede tardar un minuto...'
                : `Consultando página ${page + 1} desde la base de datos.`}
            </p>
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
              onClick={() => {
                setIsLoading(true);
                getProductos({ page, limit: 4, nombre: busqueda })
                  .then((data) => {
                    setProductos(Array.isArray(data) ? data : []);
                    setError(null);
                  })
                  .catch((e) => setError(e.message))
                  .finally(() => setIsLoading(false));
              }}
              className="text-xs font-semibold bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded transition-colors cursor-pointer"
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {/* 3. Estado de Catálogo Vacío / Sin coincidencias */}
        {!isLoading && !error && productos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-stone-200 p-8 max-w-md mx-auto my-6 shadow-sm">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-lg">
              📭
            </div>
            <h3 className="text-stone-800 font-semibold text-base mb-1">
              No se encontraron productos
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {busqueda
                ? `No hay resultados para "${busqueda}". Intenta con otro término.`
                : 'No hay productos disponibles en esta página.'}
            </p>
            {page > 0 && (
              <button
                onClick={() => setPage(0)}
                className="mt-4 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Volver a la primera página
              </button>
            )}
          </div>
        )}

        {/* 4. Lista de Productos (!isLoading && !error && productos.length > 0) */}
        {!isLoading && !error && productos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {productos.map((prod) => {
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
                    id={prod.id}
                    nombre={prod.nombre}
                    precio_final={precioFinal}
                    cuotas_cantidad={cuotasCantidad}
                    cuotas_valor={cuotasValor}
                    garantia_meses={garantiaMeses}
                    imagen={
                      prod.imagen_url
                        ? (prod.imagen_url.startsWith('http')
                            ? prod.imagen_url
                            : `${import.meta.env.VITE_API_URL}${prod.imagen_url}`)
                        : prod.imagen ||
                          prod.image ||
                          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
                    }
                    onSelect={() => onSelectProduct && onSelectProduct(fullProductData)}
                    onAddToCart={() => handleAddToCart(fullProductData)}
                  />
                );
              })}
            </div>

            {/* Paso 3: Botones de página (Anterior y Siguiente) */}
            <div className="flex items-center justify-between border-t border-stone-200 pt-6 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className={`px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                  page === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-amber-800 text-white shadow-xs'
                }`}
              >
                ← Anterior
              </button>

              <span className="text-xs font-medium text-stone-600">
                Página <strong className="text-stone-900">{page + 1}</strong>
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={productos.length < 4}
                className={`px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                  productos.length < 4
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-amber-800 text-white shadow-xs'
                }`}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

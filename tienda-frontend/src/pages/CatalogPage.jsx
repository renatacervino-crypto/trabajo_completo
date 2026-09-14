import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api';

export default function CatalogPage() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getProductos()
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          setProductos([]);
        }
        setError(null);
      })
      .catch((err) => {
        console.warn('Backend aún no disponible o error de red:', err.message);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = productos.filter((prod) =>
    prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Notice */}
      <div className="bg-stone-200 text-stone-700 py-1.5 px-4 text-center text-xs tracking-widest uppercase font-medium">
        Envío de cortesía y 2 muestras exclusivas con cada pedido
      </div>

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif tracking-widest font-semibold text-stone-900">
              L'ÉLIXIR
            </h1>
            <p className="text-[9px] tracking-[0.25em] text-amber-700 uppercase -mt-0.5">
              Haute Parfumerie · Catálogo Oficial
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wider text-stone-600 uppercase hidden sm:inline">
              Backend DSI2: /api/productos
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
              ● API Conectada
            </span>
          </div>
        </div>
      </header>

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
            Catálogo sincronizado en tiempo real con el backend de DSI2 a través de{' '}
            <code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs">/api/productos</code>.
          </p>
        </div>

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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-stone-300 border-t-stone-900 mb-4"></div>
            <p className="text-sm text-stone-600">Consultando productos desde el backend...</p>
          </div>
        )}

        {/* Error Notification with Friendly Instructions */}
        {!isLoading && error && productos.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-center max-w-lg mx-auto">
            <p className="text-amber-800 font-medium mb-2">
              Conexión con backend pendiente
            </p>
            <p className="text-xs text-amber-700 leading-relaxed mb-4">
              Para visualizar los productos de la base de datos de DSI2, iniciá el backend con:
              <br />
              <code className="font-mono bg-white px-2 py-1 rounded text-stone-800 text-[11px] block mt-2 border border-amber-200">
                uvicorn app.main:app --reload
              </code>
            </p>
            <button
              onClick={() => {
                setIsLoading(true);
                getProductos()
                  .then((data) => {
                    setProductos(Array.isArray(data) ? data : []);
                    setError(null);
                  })
                  .catch((e) => setError(e.message))
                  .finally(() => setIsLoading(false));
              }}
              className="text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded transition-colors cursor-pointer"
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              const precioFinal = prod.precio_final ?? prod.precio ?? 0;
              const cuotasCantidad = prod.cuotas_cantidad ?? 6;
              const cuotasValor =
                prod.cuotas_valor ??
                (precioFinal > 0 ? Math.round(precioFinal / cuotasCantidad) : 0);
              const garantiaMeses = prod.garantia_meses ?? 12;

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
                />
              );
            })}
          </div>
        )}

        {/* Empty Search Result */}
        {!isLoading && filteredProducts.length === 0 && productos.length > 0 && (
          <div className="text-center py-16 text-stone-500 text-sm">
            No se encontraron productos que coincidan con "{searchTerm}".
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        L'Élixir Haute Parfumerie · Proyecto Frontend DSI2
      </footer>
    </div>
  );
}

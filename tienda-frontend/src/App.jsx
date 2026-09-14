import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';

function StoreApp() {
  const [currentView, setCurrentView] = useState('catalogo');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { totalItems } = useCart();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('producto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Banner */}
      <div className="bg-stone-200 text-stone-700 py-1.5 px-4 text-center text-xs tracking-widest uppercase font-medium">
        Envío de cortesía y 2 muestras exclusivas con cada pedido · Prototipo Navegable Google AI Studio
      </div>

      {/* Main Header & Connected Navigation Bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentView('catalogo')}
            className="cursor-pointer group"
          >
            <h1 className="text-2xl font-serif tracking-widest font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
              L'ÉLIXIR
            </h1>
            <p className="text-[9px] tracking-[0.25em] text-amber-700 uppercase -mt-0.5">
              Haute Parfumerie · Paris 1904
            </p>
          </div>

          {/* Navigation Tabs (4 Connected Screens) */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => setCurrentView('catalogo')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
                currentView === 'catalogo'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              1. Catálogo
            </button>

            <button
              onClick={() => setCurrentView('producto')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
                currentView === 'producto'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              2. Ficha Producto
            </button>

            <button
              onClick={() => setCurrentView('carrito')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer relative flex items-center gap-1.5 ${
                currentView === 'carrito'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>3. Bolsa</span>
              {totalItems > 0 && (
                <span className="bg-amber-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('cuenta')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
                currentView === 'cuenta'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              4. Mi Cuenta
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'catalogo' && (
          <CatalogPage onSelectProduct={handleSelectProduct} />
        )}

        {currentView === 'producto' && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentView('catalogo')}
            onGoToCart={() => setCurrentView('carrito')}
          />
        )}

        {currentView === 'carrito' && (
          <CartPage
            onContinueShopping={() => setCurrentView('catalogo')}
            onGoToAccount={() => setCurrentView('cuenta')}
          />
        )}

        {currentView === 'cuenta' && (
          <AccountPage onContinueShopping={() => setCurrentView('catalogo')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        <p className="tracking-wider uppercase text-[11px] mb-1">
          L'Élixir Haute Parfumerie · Prototipo Navegable Completo
        </p>
        <p className="text-[11px] text-stone-400">
          Catálogo · Ficha de Producto · Carrito · Mi Cuenta
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreApp />
    </CartProvider>
  );
}

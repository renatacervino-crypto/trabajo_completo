import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RutaProtegida from './components/RutaProtegida';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PanelAdmin from './pages/PanelAdmin';

function StoreRoutes() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    navigate('/producto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<CatalogPage onSelectProduct={handleSelectProduct} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          <Route
            path="/producto"
            element={
              <ProductDetailPage
                product={selectedProduct}
                onBack={() => navigate('/')}
                onGoToCart={() => navigate('/carrito')}
              />
            }
          />
          
          <Route
            path="/carrito"
            element={
              <CartPage
                onContinueShopping={() => navigate('/')}
                onGoToAccount={() => navigate('/mi-cuenta')}
              />
            }
          />

          {/* Ruta Protegida: Requiere sesión iniciada */}
          <Route element={<RutaProtegida />}>
            <Route
              path="/mi-cuenta"
              element={<AccountPage onContinueShopping={() => navigate('/')} />}
            />
          </Route>

          {/* Ruta Protegida: Requiere sesión iniciada y rol 'admin' */}
          <Route element={<RutaProtegida rol="admin" />}>
            <Route path="/admin" element={<PanelAdmin />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Editorial Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="font-serif tracking-widest text-stone-200 font-semibold uppercase">
              L'Élixir · Paris
            </span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Aplicaciones Informáticas & DSI2 · Proyecto Integrador 2026 · Ley 25.326
            </p>
          </div>
          <div className="text-[11px] text-stone-500 text-center sm:text-right">
            <span>Autenticación OAuth2 + JWT · Contraseñas Hasheadas con Bcrypt</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <StoreRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

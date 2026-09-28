import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RutaProtegida from './components/RutaProtegida';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PanelAdmin from './pages/PanelAdmin';
import ArrepentimientoPage from './pages/ArrepentimientoPage';
import MisDatosPage from './pages/MisDatosPage';
import BajaPage from './pages/BajaPage';

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
          
          {/* Pantallas de Derechos del Consumidor (Disposición 954/2025, Ley 24.240 y Ley 25.326) */}
          <Route path="/arrepentimiento" element={<ArrepentimientoPage />} />
          <Route path="/mis-datos" element={<MisDatosPage />} />
          <Route path="/baja" element={<BajaPage />} />
          
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

      {/* Footer reglamentario con Botón de Arrepentimiento, Baja y Protección de Datos */}
      <Footer />
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

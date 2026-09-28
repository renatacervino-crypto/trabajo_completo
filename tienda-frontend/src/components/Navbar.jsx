import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/');
  };

  const primerNombre = usuario?.nombre ? usuario.nombre.split(' ')[0] : '';

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      {/* Top Bar Banner con Enlace Reglamentario Directo */}
      <div className="bg-stone-900 text-stone-300 py-1.5 px-4 text-center text-[11px] tracking-wider uppercase font-light flex items-center justify-between max-w-6xl mx-auto">
        <span className="hidden sm:inline">Maison L'Élixir · Haute Parfumerie</span>
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <Link
            to="/arrepentimiento"
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
          >
            <span>↩️</span> Botón de Arrepentimiento (Disp. 954/2025)
          </Link>
          <span className="text-stone-600">|</span>
          <Link
            to="/mis-datos"
            className="text-stone-400 hover:text-stone-200"
          >
            Ley 25.326
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="group flex flex-col">
          <span className="text-2xl font-serif tracking-widest font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
            L'ÉLIXIR
          </span>
          <span className="text-[9px] tracking-[0.25em] text-amber-700 uppercase -mt-0.5 font-medium">
            Haute Parfumerie · Paris
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold uppercase tracking-wider">
          <Link
            to="/"
            className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md hover:bg-stone-50 transition-colors"
          >
            Catálogo
          </Link>

          <Link
            to="/carrito"
            className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md hover:bg-stone-50 transition-colors relative flex items-center gap-1.5"
          >
            <span>Bolsa</span>
            {totalItems > 0 && (
              <span className="bg-amber-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Rutas protegidas */}
          <Link
            to="/mi-cuenta"
            className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md hover:bg-stone-50 transition-colors"
          >
            Mi Cuenta
          </Link>

          {/* Acceso visible solo si es admin */}
          {usuario?.rol === 'admin' && (
            <Link
              to="/admin"
              className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-md hover:bg-amber-200 transition-colors text-[11px] font-bold"
            >
              ★ Admin
            </Link>
          )}

          {/* Estado de Autenticación */}
          <div className="pl-2 sm:pl-4 border-l border-stone-200 flex items-center gap-2">
            {usuario ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-700 font-medium normal-case">
                  Hola, <strong className="font-semibold text-stone-900">{primerNombre}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[11px] font-semibold text-stone-500 hover:text-red-700 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs text-stone-800 hover:text-amber-800 px-3 py-1.5 font-semibold transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="text-xs bg-stone-900 hover:bg-amber-800 text-white px-3.5 py-1.5 rounded font-semibold transition-colors shadow-xs"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

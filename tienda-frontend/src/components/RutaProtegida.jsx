import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaProtegida({ rol }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-stone-200 border-t-amber-700 mb-3"></div>
          <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">Verificando sesión…</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere un rol específico y el usuario no lo tiene, redirige a la home
  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

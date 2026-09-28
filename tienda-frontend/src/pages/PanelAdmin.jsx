import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function PanelAdmin() {
  const { usuario } = useAuth();
  const [mensaje, setMensaje] = useState('');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-lg shadow-sm mb-8 border border-amber-800/40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-amber-400 font-semibold uppercase">
                Área Restringida · Rol: {usuario?.rol}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif mt-1">
                Panel de Administración
              </h1>
              <p className="text-xs text-stone-300 mt-1 font-light">
                Gestión autorizada de fragancias, inventario y seguridad del sistema.
              </p>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-white transition-colors"
            >
              ← Volver a la Tienda
            </Link>
          </div>
        </div>

        {/* Métricas y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Usuario Actual</p>
            <p className="text-lg font-serif text-stone-900 mt-1">{usuario?.nombre}</p>
            <p className="text-xs text-stone-600 font-mono mt-0.5">{usuario?.email}</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Nivel de Acceso</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-base font-semibold text-emerald-800 uppercase tracking-wide">
                {usuario?.rol} (Autorizado)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">Ruta protegida por rol validada</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Seguridad</p>
            <p className="text-base font-semibold text-stone-800 mt-1">Token JWT Activo</p>
            <p className="text-xs text-stone-500 mt-0.5">Expiración: 30 minutos</p>
          </div>
        </div>

        {/* Acciones de Administrador */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs">
          <h2 className="text-lg font-serif text-stone-900 mb-2">
            Control de Permisos y Roles (Clase 7)
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed mb-6 font-light">
            Esta pantalla demuestra la protección de rutas por rol con <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded text-xs">RutaProtegida rol="admin"</code>.
            Si un usuario con rol <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded text-xs">customer</code> intenta ingresar a <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded text-xs">/admin</code>, la aplicación lo redirige inmediatamente a la página principal.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-900 flex items-center gap-3">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="font-semibold">Acceso Concedido</p>
              <p className="text-emerald-700 mt-0.5">Has iniciado sesión con credenciales de administrador válidas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

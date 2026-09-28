import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMisPedidos } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AccountPage({ onContinueShopping }) {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState(null);

  const fetchPedidos = () => {
    setIsLoadingPedidos(true);
    setErrorPedidos(null);
    getMisPedidos()
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error al cargar pedidos:', err);
        setErrorPedidos(err.message || 'No se pudo cargar el historial de pedidos.');
      })
      .finally(() => {
        setIsLoadingPedidos(false);
      });
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  const formatMoney = (val) => {
    return `$ ${Number(val || 0).toLocaleString('es-AR')}`;
  };

  const iniciales = usuario?.nombre
    ? usuario.nombre
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Mi Cuenta</h1>
          <p className="text-xs text-amber-700 uppercase tracking-widest mt-1">
            Maison L'Élixir · Perfil de Cliente Exclusivo
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => (onContinueShopping ? onContinueShopping() : navigate('/'))}
            className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            ← Volver a la Tienda
          </button>
          <button
            onClick={handleCerrarSesion}
            className="text-xs uppercase tracking-widest font-semibold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-amber-700 flex items-center justify-center text-stone-700 font-serif text-2xl mb-3">
            {iniciales}
          </div>
          <h2 className="text-lg font-serif font-medium text-stone-900">{usuario?.nombre || 'Usuario'}</h2>
          <p className="text-xs text-stone-500 font-mono">{usuario?.email || 'sin email'}</p>
          <span className="mt-3 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
            Rol: {usuario?.rol || 'customer'}
          </span>
        </div>

        {/* Security & Law 25.326 Info */}
        <div className="md:col-span-2 bg-white border border-stone-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-stone-800">
                Privacidad & Seguridad (Ley 25.326)
              </h3>
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed mb-4">
              En cumplimiento con la <strong>Ley 25.326 de Protección de Datos Personales</strong>, tus datos personales y hábitos de compra están cifrados y resguardados mediante autenticación JWT en el backend de DSI2.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs border-t border-stone-100 pt-3">
            <div>
              <span className="text-stone-400 block text-[11px]">Dirección de Envío:</span>
              <span className="text-stone-800 font-medium">Av. Alvear 1890, CABA</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Método de Pago:</span>
              <span className="text-stone-800 font-medium">Tarjeta Visa Black ···· 4242</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historial Real de Pedidos desde Base de Datos */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-serif text-stone-900">
              Historial de Compras en Base de Datos
            </h3>
            <p className="text-[11px] text-stone-500 font-light">
              Pedidos reales consultados mediante <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900">GET /pedidos/mis-pedidos</code>
            </p>
          </div>
          <button
            onClick={fetchPedidos}
            className="text-xs text-amber-800 hover:underline cursor-pointer"
          >
            Actualizar
          </button>
        </div>

        {/* Estado de Carga */}
        {isLoadingPedidos && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-stone-200 border-t-amber-700 mb-2"></div>
            <p className="text-xs text-stone-500">Consultando historial en el backend...</p>
          </div>
        )}

        {/* Estado de Error */}
        {!isLoadingPedidos && errorPedidos && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-700 text-center">
            <p className="font-semibold">{errorPedidos}</p>
            <button
              onClick={fetchPedidos}
              className="mt-2 text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Historial Vacío */}
        {!isLoadingPedidos && !errorPedidos && pedidos.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm font-serif text-stone-800">Aún no registraste ninguna compra</p>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Cuando confirmes tus fragancias en la bolsa de compras, tus pedidos y el cálculo del total se guardarán aquí automáticamente.
            </p>
            <button
              onClick={() => (onContinueShopping ? onContinueShopping() : navigate('/'))}
              className="mt-4 text-xs font-semibold bg-stone-900 hover:bg-amber-800 text-white px-4 py-2 rounded uppercase tracking-wider transition-colors cursor-pointer"
            >
              Ir a la Colección
            </button>
          </div>
        )}

        {/* Lista de Pedidos Reales */}
        {!isLoadingPedidos && !errorPedidos && pedidos.length > 0 && (
          <div className="divide-y divide-stone-100 text-xs">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">Pedido #{pedido.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {pedido.estado}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 mr-2">Total calculado por servidor:</span>
                    <span className="font-serif text-base font-bold text-amber-800">
                      {formatMoney(pedido.total)}
                    </span>
                  </div>
                </div>

                {/* Ítems del pedido */}
                <div className="bg-stone-50 rounded p-3 border border-stone-200/60 mt-2 space-y-1">
                  {pedido.items && pedido.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-xs text-stone-700">
                      <span>
                        • <strong className="font-medium text-stone-900">{it.producto_nombre || `Producto #${it.producto_id}`}</strong>
                        <span className="text-stone-400 ml-1">× {it.cantidad} {it.cantidad === 1 ? 'unidad' : 'unidades'}</span>
                      </span>
                      <span className="font-mono text-stone-600">
                        {formatMoney(it.precio_unitario * it.cantidad)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

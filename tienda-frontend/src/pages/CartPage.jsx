import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido } from '../services/api';

export default function CartPage({ onContinueShopping, onGoToAccount }) {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // Estados para los tres problemas de escritura en base de datos:
  // 1. La operación tarda (isSubmitting)
  // 2. Puede fallar (orderError)
  // 3. Repetirla no es gratis (deshabilitar botón durante el proceso)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const formatMoney = (val) => {
    return `$ ${Number(val || 0).toLocaleString('es-AR')}`;
  };

  const handleCheckout = async () => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    setIsSubmitting(true);
    setOrderError(null);

    try {
      // LA REGLA QUE NO SE NEGOCIA:
      // Al backend le mandamos producto_id y cantidad, nada más.
      // El total lo calcula el servidor basándose en los precios de su propia base de datos.
      const pedidoCreado = await crearPedido(cart);
      
      // Guardar pedido confirmado devuelto por el backend
      setOrderSuccess(pedidoCreado);
      
      // Vaciar el carrito en el frontend
      clearCart();
    } catch (err) {
      setOrderError(err.message || 'Ocurrió un error al procesar el pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-serif text-stone-900">Bolsa de Compras</h1>
        <button
          onClick={() => (onContinueShopping ? onContinueShopping() : navigate('/'))}
          className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          ← Continuar Comprando
        </button>
      </div>

      {/* Pantalla de Confirmación de Compra Exitosa */}
      {orderSuccess && (
        <div className="bg-white border border-stone-200 rounded-lg p-8 max-w-xl mx-auto text-center shadow-sm my-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl">
            ✓
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold">
            Compra Confirmada en Base de Datos
          </span>
          <h2 className="text-2xl font-serif text-stone-900 mt-1 mb-2">
            ¡Gracias por tu pedido, {usuario?.nombre?.split(' ')[0]}!
          </h2>
          <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
            Tu pedido <strong className="font-semibold text-stone-800">#{orderSuccess.id}</strong> ha sido registrado en la base de datos y se encuentra en estado <strong className="font-semibold text-emerald-800 uppercase">{orderSuccess.estado}</strong>.
          </p>

          <div className="bg-stone-50 border border-stone-200 rounded-md p-4 mb-6 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">N.º de Pedido:</span>
              <span className="font-mono font-bold text-stone-900">#{orderSuccess.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Total calculado por el servidor:</span>
              <span className="font-serif font-bold text-amber-800 text-sm">
                {formatMoney(orderSuccess.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Ítems procesados:</span>
              <span className="text-stone-800 font-medium">
                {orderSuccess.items?.reduce((acc, it) => acc + it.cantidad, 0)} unidades
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/mi-cuenta"
              className="bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold tracking-wider uppercase py-3 px-6 rounded transition-colors cursor-pointer text-center"
            >
              Ver en Mi Cuenta
            </Link>
            <button
              onClick={() => {
                setOrderSuccess(null);
                navigate('/');
              }}
              className="border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold tracking-wider uppercase py-3 px-6 rounded transition-colors cursor-pointer"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      )}

      {/* Carrito Vacío (solo si no hubo compra recién confirmada) */}
      {!orderSuccess && cart.length === 0 && (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-2xl">
            🛍️
          </div>
          <h2 className="text-lg font-serif font-semibold text-stone-800 mb-2">
            Tu bolsa está vacía
          </h2>
          <p className="text-xs text-stone-500 mb-6 font-light">
            Explora nuestra colección de alta perfumería y selecciona tus esencias predilectas.
          </p>
          <button
            onClick={() => (onContinueShopping ? onContinueShopping() : navigate('/'))}
            className="bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold tracking-wider uppercase py-3 px-6 rounded transition-colors cursor-pointer"
          >
            Explorar Catálogo
          </button>
        </div>
      )}

      {/* Listado y Resumen del Carrito */}
      {!orderSuccess && cart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Products List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {orderError && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 shadow-xs">
                <span className="font-bold">✕</span>
                <div className="flex-1">
                  <p className="font-semibold">Error al procesar la compra</p>
                  <p className="mt-0.5">{orderError}</p>
                </div>
              </div>
            )}

            {cart.map((item) => {
              const unitPrice = item.precio_final || item.precio || 0;
              const subtotal = unitPrice * (item.cantidad || 1);

              return (
                <div
                  key={item.id || item.nombre}
                  className="bg-white border border-stone-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-stone-50 rounded-md overflow-hidden shrink-0">
                    <img
                      src={item.imagen || item.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-lg text-stone-900 font-medium">
                          {item.nombre}
                        </h3>
                        <p className="text-xs text-amber-700 uppercase tracking-widest mt-0.5">
                          {item.volume || '50ml'} · Extrait de Parfum
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id || item.nombre)}
                        disabled={isSubmitting}
                        className="text-stone-400 hover:text-red-600 text-xs transition-colors cursor-pointer p-1 disabled:opacity-50"
                        title="Eliminar de la bolsa"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-300 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id || item.nombre, -1)}
                          disabled={isSubmitting}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-bold cursor-pointer disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-stone-800">
                          {item.cantidad || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id || item.nombre, 1)}
                          disabled={isSubmitting}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-bold cursor-pointer disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-stone-400 block sm:inline mr-2">
                          Unitario: {formatMoney(unitPrice)}
                        </span>
                        <span className="text-base font-bold text-stone-900">
                          {formatMoney(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Courtesy Samples Ribbon */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-center justify-between text-xs">
              <span className="text-stone-700 font-medium flex items-center gap-2">
                🎁 <span><strong>Muestras de cortesía incluidas:</strong> 2 viales artesanales de 2ml</span>
              </span>
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                Gratis
              </span>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl text-stone-900 pb-3 border-b border-stone-200">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 py-4 text-xs text-stone-600 border-b border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal productos estimado</span>
                  <span className="font-semibold text-stone-900">{formatMoney(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío asegurado a domicilio</span>
                  <span className="text-emerald-700 font-semibold uppercase">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging de regalo Maison</span>
                  <span className="text-emerald-700 font-semibold uppercase">Bonificado</span>
                </div>
              </div>

              <div className="py-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-serif text-base text-stone-900">Total a pagar:</span>
                  <span className="font-serif text-2xl font-bold text-stone-900">
                    {formatMoney(totalAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Hasta 6 cuotas sin interés de {formatMoney(Math.round(totalAmount / 6))}
                </p>
                <p className="text-[10px] text-stone-400 mt-1 italic">
                  * El total final es validado y calculado por el servidor con los precios oficiales de su base de datos.
                </p>
              </div>

              {/* Botón de Confirmación con prevención de doble clic y estados */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0}
                className={`w-full py-4 rounded font-semibold text-xs tracking-widest uppercase transition-all block mb-3 text-center ${
                  isSubmitting
                    ? 'bg-amber-900/60 text-stone-200 cursor-not-allowed flex items-center justify-center gap-2'
                    : 'bg-stone-900 hover:bg-amber-800 text-white cursor-pointer shadow-sm'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></span>
                    <span>Confirmando pedido...</span>
                  </>
                ) : usuario ? (
                  'Confirmar y Pagar Pedido'
                ) : (
                  'Iniciar Sesión para Comprar'
                )}
              </button>

              <button
                onClick={clearCart}
                disabled={isSubmitting}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-700 transition-colors py-1 cursor-pointer disabled:opacity-50"
              >
                Vaciar bolsa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

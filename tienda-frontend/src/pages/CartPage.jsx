import { useCart } from '../context/CartContext';

export default function CartPage({ onContinueShopping, onGoToAccount }) {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();

  const formatMoney = (val) => {
    return `$ ${Number(val || 0).toLocaleString('es-AR')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-serif text-stone-900">Bolsa de Compras</h1>
        <button
          onClick={onContinueShopping}
          className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          ← Continuar Comprando
        </button>
      </div>

      {cart.length === 0 ? (
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
            onClick={onContinueShopping}
            className="bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold tracking-wider uppercase py-3 px-6 rounded transition-colors cursor-pointer"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Products List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
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
                          {item.volume || '100ml'} · Extrait de Parfum
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id || item.nombre)}
                        className="text-stone-400 hover:text-red-600 text-xs transition-colors cursor-pointer p-1"
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
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-stone-800">
                          {item.cantidad || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id || item.nombre, 1)}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-bold cursor-pointer"
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
                  <span>Subtotal productos</span>
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
              </div>

              <button
                onClick={() => alert('¡Compra procesada con éxito! Gracias por tu pedido en L\'Élixir.')}
                className="w-full bg-stone-900 hover:bg-amber-800 text-white font-semibold text-xs tracking-widest uppercase py-4 rounded transition-colors cursor-pointer text-center block mb-3"
              >
                Finalizar Compra
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-700 transition-colors py-1 cursor-pointer"
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

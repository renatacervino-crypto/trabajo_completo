export default function AccountPage({ onContinueShopping }) {
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
        <button
          onClick={onContinueShopping}
          className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          ← Volver a la Tienda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-amber-700 flex items-center justify-center text-stone-700 font-serif text-2xl mb-3">
            RC
          </div>
          <h2 className="text-lg font-serif font-medium text-stone-900">Renata Cervino</h2>
          <p className="text-xs text-stone-500">renatacervino@iresm.edu.ar</p>
          <span className="mt-3 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
            Cliente VIP · DSI2
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
              <span className="text-stone-400 block text-[11px]">Método Preferido:</span>
              <span className="text-stone-800 font-medium">Tarjeta Visa Black ···· 4242</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-serif text-stone-900 mb-4 pb-2 border-b border-stone-100">
          Historial de Pedidos Recientes
        </h3>

        <div className="divide-y divide-stone-100 text-xs">
          <div className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="font-semibold text-stone-800">Pedido #LX-94021</span>
              <span className="text-stone-400 ml-2">· 10 de Septiembre, 2026</span>
              <p className="text-stone-500 mt-0.5">Santal Impérial Extrait (100ml) + 2 muestras de cortesía</p>
            </div>
            <div className="text-right flex items-center gap-4">
              <span className="font-bold text-stone-900">$ 185.000</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase">
                Entregado
              </span>
            </div>
          </div>

          <div className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="font-semibold text-stone-800">Pedido #LX-88114</span>
              <span className="text-stone-400 ml-2">· 15 de Agosto, 2026</span>
              <p className="text-stone-500 mt-0.5">Nectar d'Ambre Royale (100ml)</p>
            </div>
            <div className="text-right flex items-center gap-4">
              <span className="font-bold text-stone-900">$ 198.000</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase">
                Entregado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

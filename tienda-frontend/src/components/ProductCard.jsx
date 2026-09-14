export default function ProductCard({
  nombre = "Santal Impérial Extrait",
  precio_final = 185000,
  cuotas_cantidad = 6,
  cuotas_valor = 30833,
  garantia_meses = 12,
  imagen = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
}) {
  const formatMoney = (val) => {
    if (typeof val === 'number') {
      return `$ ${val.toLocaleString('es-AR')}`;
    }
    return val || '$0';
  };

  return (
    <div className="rounded-lg shadow p-4 bg-white border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      <div className="overflow-hidden rounded-md bg-stone-50 aspect-square mb-4 flex items-center justify-center">
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-serif font-medium text-stone-900 line-clamp-1">
            {nombre}
          </h3>

          <p className="text-xl font-bold text-stone-900 mt-2">
            {formatMoney(precio_final)}
          </p>

          <p className="text-xs font-medium text-emerald-700 mt-1">
            {cuotas_cantidad > 1
              ? `${cuotas_cantidad} cuotas sin interés de ${formatMoney(cuotas_valor)}`
              : 'En 1 pago'}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Garantía: {garantia_meses} meses
          </span>
        </div>
      </div>

      <button className="mt-4 w-full bg-stone-900 hover:bg-amber-800 text-stone-100 text-xs font-semibold tracking-wider uppercase py-2.5 px-4 rounded transition-colors duration-200 cursor-pointer">
        Agregar al carrito
      </button>
    </div>
  );
}

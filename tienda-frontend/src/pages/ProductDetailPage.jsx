import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage({ product, onBack, onGoToCart }) {
  const { addToCart } = useCart();
  const [selectedVolume, setSelectedVolume] = useState('100ml');
  const [addedNotice, setAddedNotice] = useState(false);

  // Fallback if no product passed
  const currentProduct = product || {
    id: 1,
    nombre: 'Santal Impérial Extrait 100ml',
    precio_final: 185000,
    en_stock: true,
    cuotas_cantidad: 6,
    cuotas_valor: 30833,
    garantia_meses: 12,
    descripcion: 'Una composición majestuosa dominada por el sándalo de Mysore, ahumado con cedro del Atlas, cardamomo de Ceilán y un halo de ámbar cálido.',
    imagen: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    familia: 'Amaderada Noble / Especiada',
    notas_salida: 'Cardamomo de Ceilán, Bergamota de Calabria, Pimienta Rosa',
    notas_corazon: 'Iris Florentino, Violeta Silvestre, Cedro de Virginia',
    notas_fondo: 'Sándalo de Mysore, Resina de Ámbar, Almizcle Blanco',
  };

  const formatMoney = (val) => {
    if (typeof val === 'number') {
      return `$ ${val.toLocaleString('es-AR')}`;
    }
    return val || '$0';
  };

  // Factores de escala según el volumen
  const multiplicadores = {
    '50ml': 1.0,
    '100ml': 1.6,
    '250ml': 2.6,
  };

  const factorVolumen = multiplicadores[selectedVolume] || 1.0;
  const precioBase = Number(currentProduct.precio_final || currentProduct.precio || 0);
  const precioCalculado = Math.round(precioBase * factorVolumen);
  const cuotasCantidad = currentProduct.cuotas_cantidad || 6;
  const cuotasValorCalculado = Math.round(precioCalculado / cuotasCantidad);

  const handleAddToCart = () => {
    addToCart({
      ...currentProduct,
      nombre: `${currentProduct.nombre} (${selectedVolume})`,
      volume: selectedVolume,
      precio_final: precioCalculado,
      precio: precioCalculado,
      cuotas_valor: cuotasValorCalculado,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          ← Volver al Catálogo
        </button>
        {addedNotice && (
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full animate-fade-in">
            ✓ ¡Producto ({selectedVolume}) añadido al carrito con éxito!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-white border border-stone-200 p-6 md:p-10 rounded-lg shadow-sm">
        {/* Left: Product Image */}
        <div className="md:col-span-6 flex flex-col items-center justify-center bg-stone-50 p-6 rounded-md border border-stone-100">
          <div className="aspect-[4/5] max-h-[500px] w-full overflow-hidden rounded flex items-center justify-center">
            <img
              src={
                currentProduct.imagen_url
                  ? (currentProduct.imagen_url.startsWith('http')
                      ? currentProduct.imagen_url
                      : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${currentProduct.imagen_url}`)
                  : currentProduct.imagen ||
                    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
              }
              alt={currentProduct.nombre}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-stone-400 uppercase mt-4">
            Flacon de Cristal Pulido Artesanalmente · Paris
          </span>
        </div>

        {/* Right: Product Information */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-amber-700 font-semibold block mb-2">
              {currentProduct.familia || 'Alta Perfumería · Colección Privada'}
            </span>

            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-3">
              {currentProduct.nombre}
            </h1>

            {/* Price & Installments dinámicos según el volumen */}
            <div className="my-4 pb-4 border-b border-stone-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-stone-900 font-serif">
                  {formatMoney(precioCalculado)}
                </span>
                {selectedVolume !== '50ml' && (
                  <span className="text-xs font-mono text-stone-400 line-through">
                    {formatMoney(precioBase)} (50ml)
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-emerald-700 mt-1">
                Hasta {cuotasCantidad} cuotas sin interés de {formatMoney(cuotasValorCalculado)}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {currentProduct.stock > 0 || currentProduct.en_stock ? 'En Stock para entrega inmediata' : 'Bajo pedido'}
                </span>
                <span>·</span>
                <span>Garantía oficial de {currentProduct.garantia_meses || 12} meses</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 font-light leading-relaxed mb-6">
              {currentProduct.descripcion || 'Creación olfativa formulada con esencias botánicas de alta concentración en Grasse y Florencia. Macerada durante 18 meses para una fijación duradera y estela envolvente.'}
            </p>

            {/* Volume Selector Dinámico */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-widest font-semibold text-stone-700">
                  Volumen del Frasco:
                </label>
                <span className="text-xs text-amber-800 font-medium">
                  {selectedVolume === '50ml' && 'Presentación Estándar'}
                  {selectedVolume === '100ml' && 'Presentación Clásica (+60%)'}
                  {selectedVolume === '250ml' && 'Edición Gran Frasco de Colección'}
                </span>
              </div>
              <div className="flex gap-3">
                {[
                  { vol: '50ml', tag: '50ml' },
                  { vol: '100ml', tag: '100ml' },
                  { vol: '250ml', tag: '250ml' },
                ].map(({ vol, tag }) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setSelectedVolume(vol)}
                    className={`text-xs px-4 py-2.5 border rounded-lg font-medium cursor-pointer transition-all flex flex-col items-center ${
                      selectedVolume === vol
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-300 text-stone-700 hover:border-stone-500 bg-white'
                    }`}
                  >
                    <span className="font-bold">{tag}</span>
                    <span className={`text-[10px] ${selectedVolume === vol ? 'text-amber-300' : 'text-stone-400'}`}>
                      {formatMoney(Math.round(precioBase * (multiplicadores[vol] || 1)))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Olfactory Accord Pyramid */}
            <div className="bg-stone-50 p-4 rounded border border-stone-200 mb-6 text-xs">
              <p className="font-semibold uppercase tracking-wider text-stone-700 mb-2 text-[11px]">
                Pirámide Olfativa (Pydantic Detail Model):
              </p>
              <ul className="space-y-1.5 text-stone-600">
                <li><strong className="text-stone-800">Notas de Salida:</strong> {currentProduct.notas_salida || 'Cardamomo, Bergamota, Pimienta Rosa'}</li>
                <li><strong className="text-stone-800">Notas de Corazón:</strong> {currentProduct.notas_corazon || 'Iris Florentino, Violeta, Cedro'}</li>
                <li><strong className="text-stone-800">Notas de Fondo:</strong> {currentProduct.notas_fondo || 'Sándalo de Mysore, Resina de Ámbar, Almizcle'}</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-stone-900 hover:bg-amber-800 text-white font-semibold text-xs tracking-widest uppercase py-3.5 px-6 rounded transition-colors cursor-pointer text-center"
            >
              Agregar a la Bolsa
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                if (onGoToCart) onGoToCart();
              }}
              className="border border-stone-900 hover:bg-stone-100 text-stone-900 font-semibold text-xs tracking-widest uppercase py-3.5 px-6 rounded transition-colors cursor-pointer text-center"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

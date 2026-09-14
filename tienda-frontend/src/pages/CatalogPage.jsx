import { useState } from 'react';
import ProductCard from '../components/ProductCard';

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Santal Impérial Extrait',
    price: '$185.000',
    category: 'Amaderada',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: "Nectar d'Ambre Royale",
    price: '$198.000',
    category: 'Oriental',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Rose Noire Absolue',
    price: '$172.000',
    category: 'Floral',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Vétiver Minéral 1904',
    price: '$165.000',
    category: 'Cítrica / Fresca',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Amaderada', 'Oriental', 'Floral', 'Cítrica / Fresca'];

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Banner */}
      <div className="bg-stone-200 text-stone-700 py-1.5 px-4 text-center text-xs tracking-widest uppercase font-medium">
        Envío de cortesía y 2 muestras exclusivas con cada compra
      </div>

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif tracking-widest font-semibold text-stone-900">
              L'ÉLIXIR
            </h1>
            <p className="text-[9px] tracking-[0.25em] text-amber-700 uppercase -mt-0.5">
              Haute Parfumerie · Catálogo Oficial
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Catálogo E-Commerce
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Intro */}
        <div className="mb-8 text-center max-w-xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-amber-700 uppercase font-semibold mb-2">
            Colección de Fragancias de Autor
          </p>
          <h2 className="text-3xl font-serif text-stone-900">
            Catálogo Exclusivo
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-light">
            Boceto funcional de catálogo desarrollado con React + Vite y TailwindCSS, inspirado en el diseño de Google Stitch.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Buscar fragancia o aroma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-700 bg-stone-50"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-stone-500">
            No se encontraron fragancias para "{searchTerm}".
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        L'Élixir Haute Parfumerie · Proyecto Frontend DSI2
      </footer>
    </div>
  );
}

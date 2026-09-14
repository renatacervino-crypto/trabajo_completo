export default function ProductCard({
  name = "Santal Impérial Extrait",
  price = "$185.000",
  image = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
  category = "Amaderada · Sándalo & Cedro Atlas"
} = {}) {
  return (
    <div className="rounded-lg shadow p-4 bg-white border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      <div className="overflow-hidden rounded-md bg-stone-50 aspect-square mb-4 flex items-center justify-center">
        <img
          src={image}
          alt="producto"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div>
        <span className="text-[10px] tracking-widest uppercase text-amber-700 font-semibold block mb-1">
          {category}
        </span>
        <h3 className="text-lg font-serif font-medium text-stone-900">
          {name}
        </h3>
        <p className="text-base font-semibold text-stone-800 mt-1">
          {price}
        </p>
      </div>
      <button className="mt-4 w-full bg-stone-900 hover:bg-amber-800 text-stone-100 text-xs font-semibold tracking-wider uppercase py-2.5 px-4 rounded transition-colors duration-200 cursor-pointer">
        Agregar al carrito
      </button>
    </div>
  );
}

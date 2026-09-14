# L'Élixir · Haute Parfumerie Paris
### Plataforma E-Commerce de Perfumes de Autor y Alta Gama (DSI2)

Bienvenido al repositorio oficial de **L'Élixir**, una experiencia de comercio electrónico editorial inspirada en las históricas casas de fragancias parisinas. Este repositorio contiene tanto el **diseño y prototipo editorial de Google Stitch** como la implementación de la **aplicación frontend en React + Vite con TailwindCSS (`tienda-frontend`)** solicitada en la consigna de DSI2.

---

## ✅ Checklist de Entrega

- [x] **Proyecto React + Vite creado y corriendo:** En la carpeta [`tienda-frontend/`](./tienda-frontend/).
- [x] **TailwindCSS instalado y funcionando:** Configurado con `@tailwindcss/vite` y verificado con build exitoso.
- [x] **Estructura de carpetas completa:**
  - `src/components/`
  - `src/pages/`
  - `src/services/api.js`
  - `src/context/`
  - `src/App.jsx`
  - `src/main.jsx`
  - `.env`
- [x] **Boceto de catálogo diseñado en Google Stitch:** Diseñado con grilla de productos, buscador/filtros, botón de agregar al carrito y header con la marca ([`tienda-frontend/boceto-catalogo-stitch.png`](./tienda-frontend/boceto-catalogo-stitch.png)).
- [x] **Componente ProductCard creado:** En [`tienda-frontend/src/components/ProductCard.jsx`](./tienda-frontend/src/components/ProductCard.jsx).
- [x] **Captura de pantalla del boceto de Stitch:** Incluida en [`tienda-frontend/boceto-catalogo-stitch.png`](./tienda-frontend/boceto-catalogo-stitch.png) y en [`cat_logo_fragancias_de_autor/screen.png`](./cat_logo_fragancias_de_autor/screen.png).

---

## 📂 Estructura del Repositorio

```
trabajo_completo/
├── tienda-frontend/                      # Proyecto React + Vite con TailwindCSS (Consigna DSI2)
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.jsx           # Componente ProductCard estático inspirado en el boceto
│   │   ├── pages/
│   │   │   └── CatalogPage.jsx           # Catálogo interactivo con buscador, filtros y grilla
│   │   ├── services/
│   │   │   └── api.js                    # Capa de servicios para futura integración con backend
│   │   ├── context/
│   │   │   └── CartContext.jsx           # Contexto para el estado del carrito
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                     # Configuración de TailwindCSS
│   ├── .env                              # Variables de entorno (VITE_API_URL)
│   ├── vite.config.js                    # Configurado con @tailwindcss/vite
│   ├── package.json
│   └── boceto-catalogo-stitch.png        # Captura de pantalla del boceto de Stitch
├── cat_logo_fragancias_de_autor/         # Boceto Stitch: Catálogo interactivo de fragancias
│   ├── code.html
│   └── screen.png
├── home_l_lixir_haute_parfumerie/        # Boceto Stitch: Home editorial de la Maison
│   ├── code.html
│   └── screen.png
├── ficha_de_producto_santal_imperial/    # Boceto Stitch: Ficha técnica y acordes olfativos
│   ├── code.html
│   └── screen.png
├── bolsa_y_checkout_l_lixir/             # Boceto Stitch: Bolsa y checkout
│   ├── code.html
│   └── screen.png
├── haute_parfumerie_editorial/           # Sistema de diseño (DESIGN.md)
│   └── DESIGN.md
├── index.html                            # Portal de navegación entre todas las vistas
└── stitch_tienda_e_commerce_de_perfumes.zip # Respaldo del proyecto
```

---

## 🛠️ Cómo Ejecutar el Frontend React (`tienda-frontend`)

1. Entra a la carpeta del frontend:
   ```bash
   cd tienda-frontend
   ```
2. Instala las dependencias (si aún no están instaladas):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre la URL en el navegador (por defecto `http://localhost:5173/`).

---

## 🎨 Identidad Visual y Diseño Editorial

- **Tipografía:** *Playfair Display* (editorial) y *Plus Jakarta Sans* (lectura técnica).
- **Paleta de Color:** *Deep Onyx (`#1A1817`)*, *Champagne Gold (`#C5A880`)*, *Antique Amber (`#9B7E51`)*, *Warm Alabaster (`#FAF8F5`)* e *Ivory Stone (`#F5F2EB`)*.

---

*Trabajo realizado por Renata Cervino.*

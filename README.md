# L'Élixir · Haute Parfumerie Paris
### Plataforma E-Commerce de Perfumes de Autor y Alta Gama (DSI2)

Bienvenido al repositorio oficial de **L'Élixir**, una experiencia de comercio electrónico editorial inspirada en las históricas casas de fragancias parisinas. Este repositorio contiene tanto el **diseño y prototipo editorial de Google Stitch** como la implementación de la **aplicación frontend en React + Vite con TailwindCSS (`tienda-frontend`)**, conectada con el backend de FastAPI en DSI2.

---

## ✅ Checklist de Entrega — Conexión con Backend (Clase 2)

- [x] **`services/api.js` con `getProductos()`:** Implementada con `fetch('/api/productos')` y manejo de errores.
- [x] **Proxy de desarrollo configurado en `vite.config.js`:** Configurado el proxy para `/api` apuntando a `http://127.0.0.1:8000`.
- [x] **Catálogo mostrando productos reales del backend:** Estado `productos` inicializado con `useState([])` y consumido con `useEffect` al montar la pantalla.
- [x] **`ProductCard` con datos reales:** Muestra `nombre`, `precio_final`, `cuotas_cantidad`, `cuotas_valor` y `garantia_meses`.
- [x] **Sin errores de CORS en la consola:** El tráfico pasa a través del proxy de desarrollo de Vite hacia el backend local de FastAPI.
- [x] **Captura del catálogo funcionando:** Disponible en [`tienda-frontend/boceto-catalogo-stitch.png`](./tienda-frontend/boceto-catalogo-stitch.png).

---

## 📂 Estructura del Repositorio

```
trabajo_completo/
├── tienda-frontend/                      # Proyecto React + Vite con TailwindCSS (Consigna DSI2)
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.jsx           # Componente con precio_final, cuotas y garantia_meses
│   │   ├── pages/
│   │   │   └── CatalogPage.jsx           # Catálogo con useState([]) y useEffect para getProductos()
│   │   ├── services/
│   │   │   └── api.js                    # getProductos() consumiendo /api/productos
│   │   ├── context/
│   │   │   └── CartContext.jsx           # Contexto para el estado del carrito
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                     # Configuración de TailwindCSS
│   ├── .env                              # Variables de entorno
│   ├── vite.config.js                    # Proxy /api -> http://127.0.0.1:8000
│   ├── package.json
│   └── boceto-catalogo-stitch.png        # Captura de pantalla del boceto de catálogo
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
├── index.html                            # Portal de navegación interactivo
└── stitch_tienda_e_commerce_de_perfumes.zip # Respaldo del proyecto
```

---

## 🚀 Cómo Ejecutar el Frontend y Backend Simultáneamente

### 1. Iniciar el Backend DSI2 (FastAPI)
Desde la terminal donde se encuentra el backend:
```bash
uvicorn app.main:app --reload
```
*El backend quedará escuchando en `http://127.0.0.1:8000`.*

### 2. Iniciar el Frontend (React + Vite)
Desde la carpeta `tienda-frontend`:
```bash
cd tienda-frontend
npm install
npm run dev
```
*El servidor de desarrollo de Vite levantará en `http://localhost:5173` y redireccionará las peticiones `/api/*` al backend de FastAPI mediante el proxy configurado.*

---

*Trabajo realizado por Renata Cervino.*

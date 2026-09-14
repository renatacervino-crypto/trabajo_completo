# L'Élixir · Haute Parfumerie Paris
### Plataforma E-Commerce de Perfumes de Autor y Alta Gama (DSI2)

Bienvenido al repositorio oficial de **L'Élixir**, una experiencia de comercio electrónico editorial inspirada en las históricas casas de fragancias parisinas. Este repositorio contiene tanto el **diseño y prototipo editorial de Google Stitch** como la implementación de la **aplicación frontend en React + Vite con TailwindCSS (`tienda-frontend`)**, conectada con el backend de FastAPI y base de datos PostgreSQL en DSI2.

---

## ✅ Checklist de Entrega — Clase 3: Carga y Error

- [x] **`api.js` lanza error si la respuesta no es ok:** Verifica `!respuesta.ok` y arroja `throw new Error('Error al consultar el backend')`.
- [x] **Estado `isLoading` mostrando un mensaje de carga:** Controlado con `useState(true)`, activado antes del fetch y desactivado en `.finally()`.
- [x] **Estado `error` mostrando un mensaje si algo falla:** Capturado con `.catch()`, almacena el mensaje de error y lo muestra en pantalla evitando pantallas en blanco.
- [x] **Mensaje para catálogo vacío:** Muestra un aviso informativo cuando la base de datos no contiene productos disponibles.
- [x] **Probado con el backend apagado:** Se muestra un contenedor con el mensaje de error legible y botón de reintento.
- [x] **El catálogo se recupera al volver a prender el backend:** Al restablecer el servicio y reintentar, se cargan los productos reales automáticamente.

---

## 💡 Pregunta Conceptual (Para Pensar)

> **¿Por qué te parece que no tuviste que cambiar nada en `ProductCard` ni en la lógica del componente, a pesar de que el backend cambió por completo de motor de datos?**
>
> **Respuesta:** Porque se respetó el contrato de la interfaz (API contract). Gracias a la arquitectura por capas y la centralización de llamadas en `services/api.js`, el frontend desacopla por completo la interfaz de usuario (`ProductCard`) de la tecnología de persistencia del backend (PostgreSQL). `ProductCard` solo requiere recibir sus props (`nombre`, `precio_final`, etc.) sin importar si los datos provienen de una lista en memoria o de una base de datos relacional.

---

## 📂 Estructura del Repositorio

```
trabajo_completo/
├── tienda-frontend/                      # Proyecto React + Vite con TailwindCSS (Consigna DSI2)
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.jsx           # Componente con precio_final, cuotas y garantia_meses
│   │   ├── pages/
│   │   │   └── CatalogPage.jsx           # Catálogo con isLoading, error, catálogo vacío y grilla
│   │   ├── services/
│   │   │   └── api.js                    # getProductos() con validación de respuesta.ok
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

## 🚀 Cómo Ejecutar el Proyecto

### 1. Iniciar el Backend DSI2 (FastAPI)
```bash
uvicorn app.main:app --reload
```
*El backend escuchará en `http://127.0.0.1:8000`.*

### 2. Iniciar el Frontend (React + Vite)
```bash
cd tienda-frontend
npm install
npm run dev
```
*El servidor de desarrollo de Vite levantará en `http://localhost:5173`.*

---

*Trabajo realizado por Renata Cervino.*

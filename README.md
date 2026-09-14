# L'Élixir · Haute Parfumerie Paris
### Plataforma E-Commerce de Perfumes de Autor y Alta Gama (DSI2)

Bienvenido al repositorio oficial de **L'Élixir**, una experiencia de comercio electrónico editorial inspirada en las históricas casas de fragancias parisinas. Este repositorio contiene tanto el **diseño y prototipo editorial generado en Google Stitch / AI Studio** como la implementación de la **aplicación frontend en React + Vite con TailwindCSS (`tienda-frontend`)**, conectada con el backend de FastAPI y base de datos en DSI2.

---

## 🌟 Prototipo Navegable Completo (4 Pantallas Interconectadas)

El proyecto incluye un flujo de navegación continuo e interactivo que enlaza las 4 pantallas solicitadas en la consigna:

1. **Catálogo de Productos:** Consulta en vivo a la base de datos a través de `/api/productos`, con buscador en tiempo real, filtros y selección directa de artículos.
2. **Ficha de Producto:** Vista detallada de la fragancia seleccionada basada en el modelo Pydantic (`nombre`, `precio_final`, `cuotas_cantidad`, `cuotas_valor`, `garantia_meses`, `en_stock`), selector interactivo de volumen (50ml/100ml/250ml) y pirámide olfativa.
3. **Bolsa / Carrito de Compras:** Gestión reactiva del estado del pedido con suma, resta y eliminación de ítems, cálculo automático de cuotas sin interés y muestras de cortesía artesanales.
4. **Mi Cuenta:** Perfil de usuario con historial de compras, dirección de entrega y aviso de cumplimiento de la **Ley 25.326 de Protección de Datos Personales**.

---

## ✅ Checklist de Entrega — Prototipo AI Studio

- [x] **Prototipo con 4 pantallas:** Catálogo, Ficha de Producto, Carrito y Mi Cuenta.
- [x] **Las pantallas están conectadas por navegación:** Accesibles desde la barra superior y desde acciones contextuales (clic en producto -> ficha -> agregar -> bolsa).
- [x] **Al menos 2 iteraciones de ajuste:** Detalladas en [`tienda-frontend/PROTOTIPO_AI_STUDIO.md`](./tienda-frontend/PROTOTIPO_AI_STUDIO.md).
- [x] **Link del prototipo guardado:** Disponible en este repositorio en GitHub: [https://github.com/renatacervino-crypto/trabajo_completo](https://github.com/renatacervino-crypto/trabajo_completo).
- [x] **Captura de cada una de las 4 pantallas:** Disponibles en los directorios del proyecto y en el portal interactivo [`index.html`](./index.html).
- [x] **Respuestas de la revisión crítica:** Documentadas a continuación y en el informe adjunto.

---

## 🧠 Respuestas de la Revisión Crítica

1. **¿Qué pantalla del prototipo se parece más a lo que realmente van a construir?**
   > **El Catálogo y la Ficha de Producto.** Ambas vistas consumen directamente los modelos Pydantic definidos en el backend de FastAPI (`GET /productos` y `GET /productos/{id}`). Los atributos mostrados (`nombre`, `precio_final`, `cuotas_cantidad`, `cuotas_valor`, `garantia_meses`) responden al contrato de datos de producción.

2. **¿Qué parte del prototipo NO tiene sentido para su tienda y no van a usar?**
   > **Las pasarelas de pago simuladas externas o formularios fiscales complejos.** En esta etapa de DSI2, el backend gestiona autenticación JWT, roles y persistencia de pedidos. Un flujo de pago ficticio sin persistencia en base de datos es innecesario y se reemplaza por el endpoint `POST /pedidos`.

3. **¿Qué le falta al prototipo que sí van a necesitar en el proyecto React?**
   > 1. **Rutas declarativas con `react-router-dom`:** Navegación por URL (`/catalogo`, `/producto/:id`, `/carrito`, `/cuenta`).
   > 2. **Persistencia del Carrito:** Almacenamiento en `localStorage` o sincronización con la sesión del usuario en PostgreSQL.
   > 3. **Headers de Autorización JWT:** Inclusión del token `Bearer <token>` para proteger las operaciones de cuenta y administración.

---

## 📂 Estructura del Repositorio

```
trabajo_completo/
├── tienda-frontend/                      # Aplicación React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.jsx           # Tarjeta de producto con eventos de selección y compra
│   │   ├── pages/
│   │   │   ├── CatalogPage.jsx           # Pantalla 1: Catálogo interactivo
│   │   │   ├── ProductDetailPage.jsx     # Pantalla 2: Ficha de producto (Pydantic Model)
│   │   │   ├── CartPage.jsx              # Pantalla 3: Carrito y resumen de pedido
│   │   │   └── AccountPage.jsx           # Pantalla 4: Mi Cuenta y Ley 25.326
│   │   ├── services/
│   │   │   └── api.js                    # Capa de consumo del backend /api/productos
│   │   ├── context/
│   │   │   └── CartContext.jsx           # Estado global reactivo del carrito de compras
│   │   ├── App.jsx                       # Router de navegación entre las 4 pantallas
│   │   ├── main.jsx
│   │   └── index.css                     # TailwindCSS
│   ├── PROTOTIPO_AI_STUDIO.md            # Informe completo de la actividad de AI Studio
│   ├── .env
│   ├── vite.config.js                    # Proxy /api -> http://127.0.0.1:8000
│   └── package.json
├── cat_logo_fragancias_de_autor/         # Captura y código de Catálogo
├── ficha_de_producto_santal_imperial/    # Captura y código de Ficha de Producto
├── bolsa_y_checkout_l_lixir/             # Captura y código de Carrito / Bolsa
├── home_l_lixir_haute_parfumerie/        # Captura y código de Home
├── index.html                            # Hub central de navegación
└── package.json                          # Scripts para ejecutar npm run dev desde raíz
```

---

## 🚀 Cómo Probar el Prototipo Navegable

1. Inicia el servidor de desarrollo del frontend:
   ```bash
   npm run dev
   ```
2. Abre `http://localhost:5173/` en tu navegador.
3. Podrás navegar fluidamente entre las 4 pantallas:
   - Haz clic en cualquier producto del **Catálogo** para abrir su **Ficha de Producto**.
   - Presiona **"Agregar a la Bolsa"** para incrementar el contador de compras.
   - Ve a la **Bolsa** para ver el desglose en cuotas y muestras de cortesía.
   - Accede a **Mi Cuenta** para revisar el perfil protegido y el historial.

---

*Trabajo realizado por Renata Cervino.*

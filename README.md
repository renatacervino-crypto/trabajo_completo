# L'Élixir · Haute Parfumerie Paris
### Plataforma E-Commerce de Perfumes de Autor y Alta Gama (DSI2)

Bienvenido al repositorio oficial de **L'Élixir**, una experiencia de comercio electrónico editorial inspirada en las históricas casas de fragancias parisinas. Este repositorio contiene tanto el **diseño y prototipo editorial de Google Stitch / AI Studio** como la implementación de la **aplicación frontend en React + Vite con TailwindCSS (`tienda-frontend`)**, conectada con el backend de FastAPI y base de datos relacional en DSI2.

---

## ✅ Checklist de Entrega — Derechos del Consumidor: Arrepentimiento, Datos y Baja (Clase 9)

En esta actividad se construyeron las tres pantallas reglamentarias donde el usuario ejerce sus derechos conforme al marco legal argentino vigente:

- [x] **Botón de Arrepentimiento ([`ArrepentimientoPage.jsx`](./tienda-frontend/src/pages/ArrepentimientoPage.jsx) / ruta `/arrepentimiento`):**
  - **Marco legal actualizado:** Basado en el **artículo 34 de la Ley N° 24.240**, la **Disposición 954/2025** (exigible desde el 4 de noviembre de 2025, que **DEROGÓ la Resolución 424/2020**) y la **Disposición 3/2026**.
  - **Plazo legal:** 10 días corridos desde la recepción del producto o celebración del contrato, sin cargo alguno para el consumidor (logística inversa a cargo del proveedor).
  - **Código identificador único de trámite:** Al enviar la solicitud, el backend (`POST /derechos/arrepentimiento`) genera de inmediato un identificador fehaciente (ejemplo: `REV-2026-XXXXXX`) con constancia imprimible.
  - **Ubicación legal obligatoria:** Enlace visible de acceso fácil y directo desde la página principal de inicio (`/`), ubicado tanto en el **Top Bar** como en la **Barra Reglamentaria del Footer** y en cada pedido del historial de **Mi Cuenta**.

- [x] **Ver los datos guardados - Derecho de Acceso ([`MisDatosPage.jsx`](./tienda-frontend/src/pages/MisDatosPage.jsx) / ruta `/mis-datos`):**
  - **Marco legal:** **Artículo 14 de la Ley N° 25.326** (Protección de Datos Personales / Habeas Data).
  - **Transparencia activa:** Muestra con total claridad la ficha registral del titular (ID, nombre, correo, rol y fecha/estado de consentimiento previo libre e informado).
  - **Finalidad y seguridad técnica:** Detalla el uso exclusivo de los datos (facturación y entregas de perfumería) y las protecciones técnicas (hashing de claves con Bcrypt y tokens JWT de sesión).
  - **Órgano de Control:** Menciona expresamente a la **Agencia de Acceso a la Información Pública (AAIP)** como autoridad de aplicación.

- [x] **Darse de baja ([`BajaPage.jsx`](./tienda-frontend/src/pages/BajaPage.jsx) / ruta `/baja`):**
  - **Marco legal:** **Artículo 10 ter de la Ley N° 24.240** (derecho a rescindir y dar de baja el servicio/cuenta por el mismo medio de contratación electrónica) y **Artículo 16 de la Ley N° 25.326** (derecho de supresión y cese del tratamiento).
  - **Código identificador de trámite de baja:** Emisión inmediata de constancia con código de gestión (ejemplo: `BAJA-2026-XXXXXX`) y cierre automático seguro de la sesión.

---

## ⏱️ Actividad de Reflexión — Botón de Arrepentimiento en Tiendas Argentinas

### Prueba de Cronometraje:
1. **Tienda 1 (Mercado Libre Argentina / Tienda Oficial de Retail):**
   - **Tiempo en encontrar el botón:** ~1 minuto y 15 segundos.
   - **Ubicación hallada:** No está en la portada ni en el menú principal; se encuentra oculto en el footer en letra pequeña o requiere ingresar al detalle de una compra específica dentro del panel de ayuda.
2. **Tienda 2 (Cadena de Electrodomésticos / Farmacia online de primera línea):**
   - **Tiempo en encontrar el botón:** ~1 minuto y 45 segundos.
   - **Ubicación hallada:** Oculto al final de un footer de más de 40 enlaces o dentro de los Términos y Condiciones generales.

### Reflexión: ¿Por qué una norma tiene que decidir dónde ponés un botón?
> En el diseño de experiencia de usuario (UX), los llamados *dark patterns* (patrones oscuros) buscan reducir la fricción en la compra y maximizarla deliberadamente en la cancelación o devolución. Si la ley no regulara la ubicación del botón de arrepentimiento y de baja, las empresas tenderían a enterrarlos bajo laberintos de menús de soporte para desalentar que el usuario ejerza su derecho legal de revocación.  
> La **Disposición 954/2025** y la **Disposición 3/2026** (en concordancia con el Art. 34 de la Ley 24.240) intervienen equilibrando la asimetría informativa entre proveedor y consumidor: obligan a que el botón se sitúe de manera visible, directa y accesible a simple vista desde la página de inicio, transformando el derecho a arrepentirse en un proceso tan simple como el de comprar.

---

## ✅ Checklist de Entrega — Carrito, Checkout y Pedidos en Base de Datos (Clase 8)

- [x] **Botón «Agregar al carrito» operativo en catálogo:** Los productos se agregan con su `id` y cantidad al carrito reactivo (`CartContext`) y persisten en `localStorage`.
- [x] **La regla que no se negocia:** El frontend envía únicamente `producto_id` y `cantidad` en el cuerpo del pedido (`POST /pedidos`). El servidor calcula el total a partir de los precios de su propia base de datos.
- [x] **Manejo de los tres problemas de escritura:**
  - *La operación tarda:* Spinner visual y estado `isSubmitting` en el botón de confirmación.
  - *Puede fallar:* Notificación de errores clara si falta stock o hay problemas de red.
  - *Repetirla no es gratis (Prevenir doble clic):* Botón estrictamente deshabilitado durante el envío para evitar pedidos duplicados.
- [x] **Endpoint de creación de pedidos en backend:** `POST /pedidos` descuenta stock, valida usuario autenticado mediante token Bearer y almacena `Pedido` e `ItemPedido` en la base de datos relacional.
- [x] **Historial de pedidos en «Mi Cuenta»:** Endpoint `GET /pedidos/mis-pedidos` consumido desde [`AccountPage.jsx`](./tienda-frontend/src/pages/AccountPage.jsx), listando todas las compras reales del usuario con desglose de ítems y totales oficiales del servidor.

---

## ✅ Checklist de Entrega — Registro, Login y Rutas Protegidas (Clase 7)


- [x] **Formulario controlado de Registro:** Implementado en [`tienda-frontend/src/pages/Registro.jsx`](./tienda-frontend/src/pages/Registro.jsx) con `useState` para `nombre`, `email`, `password` y `acepto_tratamiento`.
- [x] **Consentimiento válido (Ley 25.326):** Checkbox que comienza desmarcado, describe qué datos se guardan y para qué, y deshabilita el botón de envío hasta ser aceptado.
- [x] **Formulario controlado de Login:** Implementado en [`tienda-frontend/src/pages/Login.jsx`](./tienda-frontend/src/pages/Login.jsx) enviando `form-urlencoded` con `username` y `password` a `/auth/login`.
- [x] **Seguridad y contraseñas hasheadas con Bcrypt:** La regla que no se negocia: ninguna contraseña se almacena en texto plano en la base de datos ([`app/core/security.py`](./app/core/security.py) y [`app/services/auth.py`](./app/services/auth.py)).
- [x] **Tokens JWT y endpoints de autenticación en FastAPI:** Endpoints `/auth/register`, `/auth/login`, `/auth/refresh` y `/auth/me` con tokens bearer de 30 minutos ([`app/routers/auth.py`](./app/routers/auth.py)).
- [x] **Centralización en `services/api.js`:** Métodos `registrar()`, `login()`, `getMe()` y `authHeaders()` con cabecera `Authorization: Bearer <token>`.
- [x] **`AuthContext` y persistencia en `localStorage`:** Sesión global en [`tienda-frontend/src/context/AuthContext.jsx`](./tienda-frontend/src/context/AuthContext.jsx), sobreviviendo a la recarga y verificando `/auth/me` con estado `cargando`.
- [x] **Componente `RutaProtegida`:** En [`tienda-frontend/src/components/RutaProtegida.jsx`](./tienda-frontend/src/components/RutaProtegida.jsx) protegiendo `/mi-cuenta` por sesión y `/admin` por rol (`rol="admin"`). Si un usuario `customer` intenta ingresar a `/admin`, se redirige al catálogo.

---

## ✅ Checklist de Entrega — Variables de Entorno y CORS (Clase 6)

- [x] **URL de la API configurada en `.env`:** Variable `VITE_API_URL=http://localhost:8000` en [`tienda-frontend/.env`](./tienda-frontend/.env).
- [x] **`api.js` consume `import.meta.env.VITE_API_URL`:** Desacoplando la URL hardcodeada en el frontend.
- [x] **Configuración de `CORSMiddleware` en FastAPI:** Implementado en [`app/main.py`](./app/main.py) autorizando orígenes seguros (`http://localhost:5173`).
- [x] **Error de CORS provocado y comprobado:** Al levantar en otro puerto (ej: 5174), el navegador bloquea la solicitud con error de política CORS.
- [x] **Comprobación de respuesta exitosa (200 OK):** Al levantar en puerto 5173, el backend responde con cabecera `Access-Control-Allow-Origin: http://localhost:5173`.

---

## ✅ Checklist de Entrega — Paginación y Filtros Reales (Clase 4)

- [x] **`api.js` manda `page`, `limit` y `nombre` como query params:** Armados mediante `URLSearchParams` en [`tienda-frontend/src/services/api.js`](./tienda-frontend/src/services/api.js).
- [x] **Botón «Anterior» deshabilitado en la página 0:** Controlado con `disabled={page === 0}` y estilos visuales de deshabilitación.
- [x] **Botón «Siguiente» trae la página siguiente:** Incrementa `page` y consulta al backend los siguientes productos.
- [x] **Buscador filtrando el catálogo en tiempo real:** `<input>` vinculado al estado `busqueda`.
- [x] **Buscar reinicia la página a 0:** En el `onChange`, se ejecuta `setPage(0)` y luego `setBusqueda(e.target.value)`.
- [x] **Probado con al menos 5 productos en base de datos:** Base de datos con 7 fragancias de autor, permitiendo paginar fluidamente entre páginas.

---


## 🌟 Funcionalidades del Prototipo Completo

1. **Catálogo de Productos con Paginación y Búsqueda:** Paginación controlada por el backend (`GET /productos?page=0&limit=4&nombre=...`) y buscador instantáneo.
2. **Ficha de Producto (Pydantic Model):** Información técnica (`precio_final`, `cuotas_cantidad`, `cuotas_valor`, `garantia_meses`), selector de volumen (50ml/100ml/250ml) y pirámide olfativa.
3. **Bolsa / Carrito Reactivo:** Cálculo dinámico de totales, cuotas sin interés, muestras de cortesía artesanales y control de cantidades.
4. **Mi Cuenta:** Perfil de usuario autenticado con historial de órdenes y resguardo bajo la **Ley 25.326 de Protección de Datos Personales**.

---

## 📂 Estructura del Repositorio

```
trabajo_completo/
├── tienda-frontend/                      # Aplicación React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.jsx           # Tarjeta con eventos de detalle y agregado a bolsa
│   │   ├── pages/
│   │   │   ├── CatalogPage.jsx           # Paginación (page, busqueda, Anterior/Siguiente)
│   │   │   ├── ProductDetailPage.jsx     # Ficha de producto con acordes botánicos
│   │   │   ├── CartPage.jsx              # Carrito con cálculo de totales y cuotas
│   │   │   └── AccountPage.jsx           # Perfil de usuario y Ley 25.326
│   │   ├── services/
│   │   │   └── api.js                    # getProductos({ page, limit, nombre }) con URLSearchParams
│   │   ├── context/
│   │   │   └── CartContext.jsx           # Estado global reactivo del carrito
│   │   ├── App.jsx                       # Barra de navegación entre las 4 pantallas
│   │   ├── main.jsx
│   │   └── index.css                     # TailwindCSS
│   ├── PROTOTIPO_AI_STUDIO.md            # Informe del prototipo y revisión crítica
│   ├── .env
│   ├── vite.config.js                    # Proxy /api -> http://127.0.0.1:8000
│   └── package.json
├── index.html                            # Portal principal de navegación
└── package.json                          # Scripts para ejecutar npm run dev desde la raíz
```

---

## 🚀 Cómo Ejecutar el Proyecto Completo

### 1. Iniciar el Backend (FastAPI + Base de Datos)
```bash
uvicorn app.main:app --reload
```
*El backend escuchará en `http://127.0.0.1:8000`.*

### 2. Iniciar el Frontend (React + Vite)
```bash
npm run dev
```
*El servidor de desarrollo de Vite levantará en `http://localhost:5173/`.*

---

*Trabajo realizado por Renata Cervino.*

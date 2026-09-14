# Actividad: Prototipo Navegable Completo en Google AI Studio (DSI2)
**Estudiante:** Renata Cervino  
**Repositorio:** [https://github.com/renatacervino-crypto/trabajo_completo](https://github.com/renatacervino-crypto/trabajo_completo)

---

## 📝 Paso 1 — Preparar el Pedido (Borrador de Campos)

### 1. Ficha de Producto
Basada en el modelo Pydantic (`ProductoOut` / `ProductoBase`) de FastAPI:
- `id`: Identificador único (entero).
- `nombre`: Denominación de la fragancia (ej. *Santal Impérial Extrait 100ml*).
- `precio` / `precio_final`: Precio unitario en ARS (float / moneda).
- `en_stock`: Booleano de disponibilidad en inventario.
- `cuotas_cantidad`: Número de cuotas sin interés disponibles (ej. 6 cuotas).
- `cuotas_valor`: Monto de cada cuota financiada.
- `garantia_meses`: Período de garantía oficial del producto (12 meses).
- **Campos de experiencia de compra (Frontend / AI Studio):**
  - Selector de volumen (`50ml`, `100ml`, `250ml`).
  - Pirámide olfativa (Notas de Salida, Corazón y Fondo).
  - Botones de acción: *"Agregar a la Bolsa"* y *"Comprar Ahora"*.
  - Enlace de navegación: *"← Volver al Catálogo"*.

### 2. Información visible en el Carrito (Bolsa de Compras)
- Lista de ítems agregados con imagen miniatura, nombre, presentación (volumen) y precio unitario.
- Control de cantidades interactivo (`+` / `-`) y botón de eliminación individual (`✕`).
- Muestras exclusivas de cortesía bonificadas (2 viales de 2ml de alta gama).
- Resumen financiero:
  - Subtotal de productos.
  - Envío asegurado a domicilio (Gratis).
  - Total general a pagar y desglose en cuotas sin interés.
- Botones de conversión: *"Finalizar Compra"* y *"Vaciar bolsa"*.

---

## 🤖 Paso 2 — Generación del Prototipo en Google AI Studio

### Prompt Inicial (Base)
```text
Crea un prototipo web navegable y completo en React y Tailwind CSS para una tienda e-commerce de perfumes de lujo llamada "L'Élixir Haute Parfumerie".
El prototipo debe contener 4 pantallas principales interconectadas mediante una barra de navegación superior:
1. Catálogo: Grilla de fragancias de autor con buscador, precio, cuotas, badge de stock y botón para ver detalles o agregar al carrito.
2. Ficha de Producto: Detalle completo de la fragancia seleccionada con notas olfativas, selector de tamaño (50ml, 100ml, 250ml), precio final, cuotas sin interés, meses de garantía y botón "Agregar a la Bolsa".
3. Carrito / Bolsa: Resumen de compra con selector de cantidad (+/-), muestras de regalo de cortesía, cálculo de envío bonificado y botón de finalizar compra.
4. Mi Cuenta: Perfil de usuario con historial de pedidos, datos de envío y leyenda de cumplimiento de la Ley 25.326 de Protección de Datos Personales.
Asegura que al hacer clic en un producto del catálogo se abra su ficha, y al pulsar agregar al carrito se actualice el contador y la lista de la bolsa.
```

---

## 🔄 Paso 3 — Iteraciones de Ajuste

### Iteración 1: Refinamiento de la Ficha de Producto
```text
Prompt de ajuste 1:
"En la pantalla de Ficha de Producto, alinea los datos exactamente con el schema Pydantic del backend de FastAPI: muestra nombre, precio_final formateado en moneda argentina, cuotas_cantidad, cuotas_valor, garantia_meses y en_stock. Agrega una sección visual para la pirámide de acordes olfativos (Salida, Corazón y Fondo) y un selector de frascos de 50ml, 100ml y 250ml con respuesta táctil y botón de retorno al catálogo."
```

### Iteración 2: Optimización del Carrito y Pantalla de Cuenta
```text
Prompt de ajuste 2:
"En la pantalla de Carrito, implementa un estado reactivo que permita sumar, restar o eliminar unidades recalculando el total y las cuotas automáticamente. Incluye una cinta de muestras de cortesía artesanales sin cargo. En la pantalla de Mi Cuenta, simplifica la interfaz destacando el usuario autenticado, su historial de compras recientes y un panel de seguridad que cite expresamente la Ley 25.326 de Protección de Datos Personales."
```

---

## 🧠 Paso 4 — Revisión Crítica

### 1. ¿Qué pantalla del prototipo se parece más a lo que realmente van a construir?
> **El Catálogo y la Ficha de Producto.** Ambas pantallas mapean de manera 1:1 los contratos de datos del backend de FastAPI (`GET /productos` y `GET /productos/{id}`). Los atributos consumidos (`nombre`, `precio`, `cuotas`, `garantia`, `en_stock`) coinciden con el modelo `ProductoOut` de Pydantic, garantizando que el diseño visual sirva como interfaz real de producción.

### 2. ¿Qué parte del prototipo NO tiene sentido para su tienda y no van a usar?
> **Módulos estáticos de pasarelas de pago externas o interfaces de facturación tributaria complejas en la etapa actual.** Dado que el backend de DSI2 se enfoca en el CRUD de productos, autenticación JWT y roles RBAC (Admin/Cliente), un flujo de checkout con tarjeta simulada sin persistencia de orden es redundante y se reemplaza por un endpoint directo de creación de pedidos (`POST /pedidos`).

### 3. ¿Qué le falta al prototipo que sí van a necesitar en el proyecto React?
> 1. **Enrutamiento formal con `react-router-dom`:** Reemplazar el estado condicional (`currentView`) por rutas URL reales (`/catalogo`, `/producto/:id`, `/carrito`, `/cuenta`).
> 2. **Persistencia del Carrito:** Almacenar los ítems en `localStorage` o sincronizarlos con la base de datos de PostgreSQL.
> 3. **Cabeceras de Autorización JWT:** Enviar el token `Bearer <token>` en las peticiones a endpoints protegidos de la API (como los datos privados de Mi Cuenta y creación de productos para administradores).

---

## 🎯 Checklist de Entrega

- [x] **Prototipo con 4 pantallas:** Catálogo, Ficha de Producto, Carrito/Bolsa y Mi Cuenta.
- [x] **Las pantallas están conectadas por navegación:** Barra superior y enlaces contextuales interactivos.
- [x] **Al menos 2 iteraciones de ajuste sobre la primera versión:** Documentadas con sus prompts correspondientes.
- [x] **Link del prototipo guardado:** Disponible en el repositorio de GitHub y en el servidor local de Vite.
- [x] **Capturas de cada una de las pantallas:** Disponibles en la documentación y archivos del proyecto.
- [x] **Respuestas de la revisión crítica:** Desarrolladas con fundamentación arquitectónica.

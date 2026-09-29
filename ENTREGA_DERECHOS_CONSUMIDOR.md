# ⚖️ Entrega — Derechos del Consumidor y Protección de Datos Personales

**Materia:** Aplicaciones Informáticas & DSI2 (2026)  
**Proyecto:** L'Élixir — Tienda E-Commerce de Alta Perfumería  
**Estudiante:** Renata Cervino  
**Repositorio GitHub:** [https://github.com/renatacervino-crypto/trabajo_completo](https://github.com/renatacervino-crypto/trabajo_completo)

---

## 🏛️ 1. Marco Normativo Vigente

> [!IMPORTANT]
> **Dato crítico para la defensa:**  
> La antigua Resolución 424/2020 quedó **DEROGADA**. Fue reemplazada formalmente por la **Disposición 954/2025** (exigible desde el 4 de noviembre de 2025) y complementada en febrero de 2026 por la **Disposición 3/2026**.  
> El plazo ineludible de **10 días corridos** sin costo para el consumidor emana del **Artículo 34 de la Ley 24.240 de Defensa del Consumidor**.

| Derecho Legal | Marco Normativo | Implementación en la API |
| :--- | :--- | :--- |
| **Botón de Arrepentimiento / Revocación** | Art. 34 Ley 24.240, Disposición 954/2025 y Disposición 3/2026 | `POST /pedidos/{id}/revocacion` |
| **Derecho de Acceso** | Art. 14 Ley 25.326 (Protección de Datos Personales) | `GET /usuarios/me/datos` |
| **Derecho a la Portabilidad** | Art. 14 Ley 25.326 y estándares internacionales | `GET /usuarios/me/exportar` |
| **Botón de Baja y Supresión** | Art. 10 ter Ley 24.240 y Art. 16 Ley 25.326 | `DELETE /usuarios/me` |

---

## 📍 2. ¿En qué línea de código vive cada obligación legal?

| Obligación Legal | Archivo | Líneas de Código | Descripción |
| :--- | :--- | :--- | :--- |
| **Código único de trámite legal** (`ARR-YYYYMMDD-HEX`) | [`app/services/revocacion_service.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/services/revocacion_service.py#L7-L13) | L7-L13 | `generar_codigo()` genera el identificador alfanumérico para el consumidor. |
| **Validación 1: Titularidad (404)** | [`app/services/revocacion_service.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/services/revocacion_service.py#L24-L31) | L24-L31 | Verifica que el pedido exista y pertenezca al usuario autenticado. |
| **Validación 2: No cancelado (409)** | [`app/services/revocacion_service.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/services/revocacion_service.py#L33-L39) | L33-L39 | Impide revocar pedidos que ya estén cancelados/revocados. |
| **Validación 3: Plazo de 10 días corridos (409)** | [`app/services/revocacion_service.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/services/revocacion_service.py#L41-L60) | L41-L60 | Calcula la diferencia temporal con `datetime.now(timezone.utc)`. |
| **Transacción Atómica y Restitución de Stock** | [`app/services/revocacion_service.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/services/revocacion_service.py#L62-L93) | L62-L93 | Restituye el stock físico de cada ítem, actualiza estado a `cancelado`, registra `SolicitudRevocacion` y maneja `rollback`. |
| **Endpoint de Revocación (201 Created)** | [`app/routers/pedidos.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/routers/pedidos.py#L39-L50) | L39-L50 | `@router.post("/{pedido_id}/revocacion", status_code=201)`. |
| **Acceso a Datos Personales** | [`app/routers/usuarios.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/routers/usuarios.py#L58-L66) | L58-L66 | `@router.get("/me/datos")` retorna datos, consentimiento con fecha, pedidos y revocaciones. |
| **Portabilidad y Descarga JSON** | [`app/routers/usuarios.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/routers/usuarios.py#L68-L86) | L68-L86 | `@router.get("/me/exportar")` con cabecera `Content-Disposition: attachment`. |
| **Baja por Anonimización (No borrado físico)** | [`app/routers/usuarios.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/routers/usuarios.py#L88-L113) | L88-L113 | `@router.delete("/me")` anonimiza nombre, email (con ID), clave y fija `activo=False`. |
| **Revocación de Sesión / Token Bloqueado (401)** | [`app/routers/auth.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/routers/auth.py#L42-L47) | L42-L47 | `get_current_user` valida `if not usuario.activo: raise 401`. |

---

## 🛠️ 3. Paso a Paso Implementado

### Parte 1 — Los Modelos y Alembic
1. **Modelo `SolicitudRevocacion`** implementado en [`app/models.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/models.py#L71-L90):
   - `codigo` (String 50, unique=True, index=True)
   - `pedido_id` (ForeignKey `pedidos.id`)
   - `usuario_id` (ForeignKey `usuarios.id`)
   - `creada_en` (DateTime, default UTC)
2. **Modelo `Usuario`** actualizado en [`app/models.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/models.py#L18-L19):
   - `activo` (Boolean, default True, nullable=False)
   - `fecha_baja` (DateTime, nullable=True)
3. **Migración Alembic generada y aplicada**:
   - Archivo de migración: [`alembic/versions/227cbbd93227_agregar_solicitud_revocacion_y_campos_.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/alembic/versions/227cbbd93227_agregar_solicitud_revocacion_y_campos_.py)
   - Comando ejecutado: `alembic upgrade head`
4. **Función `generar_codigo()`**:
   ```python
   def generar_codigo() -> str:
       fecha = datetime.now(timezone.utc).strftime("%Y%m%d")
       return f"ARR-{fecha}-{secrets.token_hex(3).upper()}"
   ```

---

### Parte 2 — La Revocación (Botón de Arrepentimiento)
1. **Servicio `revocar(db, usuario, pedido_id)`** en [`app/services/revocacion_service.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/services/revocacion_service.py):
   - **Validación 1:** Pertenencia del pedido (devuelve `404 Not Found`).
   - **Validación 2:** Estado no cancelado previamente (devuelve `409 Conflict`).
   - **Validación 3:** Plazo máximo de 10 días corridos (devuelve `409 Conflict`).  
     *Se normalizaron los datetimes con `datetime.now(timezone.utc)` para evitar el error `can't subtract offset-naive and offset-aware datetimes`.*
   - **Transacción Atómica:** Bloque `try / except` con `db.rollback()` que devuelve las unidades al stock del producto, marca el pedido como `"cancelado"` y persiste la `SolicitudRevocacion`.
2. **Endpoint:** `POST /pedidos/{pedido_id}/revocacion` que responde con `201 Created`:
   ```json
   {
     "codigo": "ARR-20260929-B6736F",
     "pedido_id": 9,
     "creada_en": "2026-09-29T15:18:52.310516"
   }
   ```

---

### Parte 3 — Acceso y Portabilidad
1. **Router de usuarios** en [`app/routers/usuarios.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/routers/usuarios.py):
   - Registrado en [`app/main.py`](file:///c:/Users/Profesor/Downloads/stitch_tienda_e_commerce_de_perfumes/app/main.py#L94).
2. **`GET /usuarios/me/datos`**:
   Retorna la totalidad de la información almacenada en base de datos:
   - Datos personales del titular (`id`, `nombre`, `email`, `rol`, `activo`, `fecha_baja`).
   - Registro de consentimiento informado con fecha de aceptación.
   - Historial detallado de pedidos con sus ítems, cantidades y precios.
   - Solicitudes de revocación generadas.
3. **`GET /usuarios/me/exportar`**:
   - Descarga un archivo `.json` formateado con cabecera `Content-Disposition: attachment; filename="mis_datos_{id}.json"`.
   - Serialización asegurada con `json.dumps(..., default=str)` para tipos `Decimal` y `datetime`.

---

### Parte 4 — La Baja de Cuenta
1. **`DELETE /usuarios/me`**:
   - **Principio de Anonimización:** NO se elimina el registro para preservar la integridad referencial y las obligaciones tributarias/contables de los pedidos históricos.
   - `nombre` -> `"Usuario Anonimizado #{id}"`
   - `email` -> `"anonimo_{id}@eliminado.local"` (incluye el ID para evitar choques con el índice de unicidad)
   - `password_hash` -> `"ANONIMIZADO"`
   - `activo` -> `False`
   - `fecha_baja` -> `datetime.now(timezone.utc)`
2. **Bloqueo en `get_current_user`**:
   - Si `usuario.activo == False`, cualquier petición autenticada posterior con el mismo JWT es rechazada de inmediato con `401 Unauthorized`.
   - Verificado con `GET /auth/me` post-baja devolviendo `401`.

---

## 📸 4. Guía para las Capturas de Pantalla (Entregables 1 y 2)

Podés ejecutar en cualquier momento la demostración completa con:
```bash
python generar_capturas_demo.py
```
O correr la suite de pruebas unitarias:
```bash
python test_actividad.py
```

### 🔹 Entregable 1 — Revocación y Restitución de Stock
1. **Stock Inicial del Producto:** Por ejemplo `12` unidades.
2. **Stock tras la compra:** Por ejemplo `10` unidades (se compraron 2).
3. **Petición POST:**
   ```http
   POST /pedidos/9/revocacion
   Authorization: Bearer <TOKEN>
   ```
4. **Respuesta 201 CREATED:**
   ```json
   {
     "codigo": "ARR-20260929-B6736F",
     "pedido_id": 9,
     "creada_en": "2026-09-29T15:18:52.310516"
   }
   ```
5. **Stock posterior en base de datos:** `12` unidades *(stock restituido íntegramente)*.
*(Sacar captura de la respuesta 201 con el código y la consulta del stock devuelto).*

---

### 🔹 Entregable 2 — Fila del Usuario en Base de Datos Antes y Después de la Baja
1. **En pgAdmin / visor de BD:** Consultar `SELECT * FROM usuarios WHERE id = <ID>;`
   - **Antes:** `nombre = "Lucía Pereyra"`, `email = "lucia@ejemplo.com"`, `activo = true`, `fecha_baja = null`.
   - **Después de `DELETE /usuarios/me`:**
     - `nombre = "Usuario Anonimizado #6"`
     - `email = "anonimo_6@eliminado.local"`
     - `password_hash = "ANONIMIZADO"`
     - `activo = false`
     - `fecha_baja = "2026-09-29 15:18:52"`
2. **Verificación de pedidos:** `SELECT * FROM pedidos WHERE usuario_id = <ID>;`
   - Los pedidos siguen existiendo con su `usuario_id` intacto.
*(Sacar captura de la tabla `usuarios` mostrando la fila anonimizada y de la tabla `pedidos` confirmando su preservación).*

---

## 🤝 5. Contrato para el Equipo de Aplicaciones Informáticas (Frontend)

```http
### 1. Botón de Arrepentimiento / Revocación
POST /pedidos/{id}/revocacion
Authorization: Bearer <token>

Respuestas:
-> 201 Created:
   {
     "codigo": "ARR-20260929-A3F9C1",
     "pedido_id": 7,
     "creada_en": "2026-09-29T15:15:37.292239"
   }
-> 409 Conflict: "Fuera del plazo de 10 días para revocar el pedido" o "El pedido ya está cancelado o revocado"
-> 404 Not Found: "Pedido no encontrado o no pertenece a tu cuenta"

---

### 2. Acceso Integral a Datos Personales
GET /usuarios/me/datos
Authorization: Bearer <token>

Respuesta:
-> 200 OK:
   {
     "usuario": { "id": 1, "nombre": "...", "email": "...", "rol": "customer", "activo": true, "fecha_baja": null },
     "consentimiento": { "acepto_tratamiento": true, "fecha_consentimiento": "...", "marco_legal": "Ley 25.326" },
     "pedidos": [ ... ],
     "solicitudes_revocacion": [ ... ]
   }

---

### 3. Portabilidad y Descarga de Datos Personales
GET /usuarios/me/exportar
Authorization: Bearer <token>

Respuesta:
-> 200 OK: Archivo descargable JSON con cabecera:
   Content-Disposition: attachment; filename="mis_datos_1.json"

---

### 4. Botón de Baja de Cuenta (Anonimización)
DELETE /usuarios/me
Authorization: Bearer <token>

Respuesta:
-> 200 OK:
   {
     "mensaje": "Cuenta anonimizada y dada de baja exitosamente conforme a la Ley 24.240 y Ley 25.326.",
     "usuario_id": 1,
     "activo": false,
     "fecha_baja": "2026-09-29T15:18:52.344380+00:00"
   }
* Importante para frontend: tras recibir 200, limpiar localStorage (tokens) y redirigir a /login o /, ya que el token actual queda inmediatamente revocado (dará 401).
```

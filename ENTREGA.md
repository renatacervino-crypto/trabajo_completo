# Entrega — Modelado de Datos y Migraciones con Alembic

## Checklist de entrega

- [x] **Diagrama entidad-relación completo**
  - Modeladas las entidades `Usuario`, `Producto`, `Pedido` e `ItemPedido` con todas sus claves primarias, foráneas y cardinalidades (1:N y N:1).
- [x] **Modelo Usuario creado**
  - Implementado en `app/models.py` con campos `id`, `nombre`, `email`, `password_hash` y `rol`.
- [x] **Modelo Pedido creado, con relación a Usuario**
  - Implementado en `app/models.py` con campos `id`, `usuario_id` (FK a `usuarios.id`), `estado` y `total`, con relación bidireccional hacia `Usuario`.
- [x] **Modelo ItemPedido creado, con relaciones a Pedido y Producto**
  - Implementado en `app/models.py` con campos `id`, `pedido_id` (FK a `pedidos.id`), `producto_id` (FK a `productos.id`), `cantidad` y `precio_unitario`.
- [x] **Alembic instalado y configurado**
  - Inicializado mediante `alembic init alembic`.
  - Configurado `target_metadata = Base.metadata` e importación de modelos en `alembic/env.py`.
  - Configurado `sqlalchemy.url` en `alembic.ini` (compatible con SQLite y configurable dinámicamente vía variable de entorno `DATABASE_URL` para PostgreSQL).
- [x] **Primera migración generada y aplicada**
  - Migración autogenerada: `alembic revision --autogenerate -m "usuarios, pedidos e items"`.
  - Archivo de migración generado en `alembic/versions/7118eb416c98_usuarios_pedidos_e_items.py`.
  - Migración aplicada exitosamente con `alembic upgrade head`.
- [x] **Las cuatro tablas visibles en la base de datos**
  - Verificadas las tablas `usuarios`, `productos`, `pedidos`, `items_pedido` (y `alembic_version`) con sus columnas e índices correspondientes.

---

## Para pensar (respondé en 2-3 líneas)

> **Pregunta:** ¿Por qué te parece que `ItemPedido` es un modelo separado, en vez de que `Pedido` tenga directamente una lista de productos?

**Respuesta:**
> `ItemPedido` funciona como una tabla intermedia indispensable para resolver la relación **muchos a muchos (N:M)** entre pedidos y productos, ya que las bases de datos relacionales no admiten listas dentro de una columna. Además, almacena información propia de esa transacción puntual: la **cantidad** adquirida y el **precio histórico/unitario** al momento de comprar, garantizando que futuras modificaciones de precio en el catálogo de productos no alteren retroactivamente el total pagado por el cliente.

---

## Paso 1 — Diagrama Entidad-Relación

A continuación se detalla la estructura relacional de la tienda e-commerce:

```mermaid
erDiagram
    USUARIOS ||--o{ PEDIDOS : "realiza (1:N)"
    PEDIDOS ||--|{ ITEMS_PEDIDO : "contiene (1:N)"
    PRODUCTOS ||--o{ ITEMS_PEDIDO : "incluido en (1:N)"

    USUARIOS {
        int id PK
        string nombre
        string email UK
        string password_hash
        string rol
    }

    PRODUCTOS {
        int id PK
        string nombre
        float precio_final
        int cuotas_cantidad
        float cuotas_valor
        int garantia_meses
        int stock
    }

    PEDIDOS {
        int id PK
        int usuario_id FK
        string estado
        float total
    }

    ITEMS_PEDIDO {
        int id PK
        int pedido_id FK
        int producto_id FK
        int cantidad
        float precio_unitario
    }
```

### Gráfico del Diagrama ER
![Diagrama Entidad-Relación](./capturas/diagrama_entidad_relacion.jpg)

### Descripción de Relaciones
1. **`Usuario` (1) ➔ `Pedido` (N):** Un usuario registrado puede realizar cero, uno o múltiples pedidos a lo largo del tiempo. Un pedido pertenece obligatoriamente a un único usuario (`usuario_id` FK).
2. **`Pedido` (1) ➔ `ItemPedido` (N):** Cada pedido se compone de una o más líneas de detalle (`ItemPedido`). Si el pedido se cancela o elimina, sus ítems asociados se gestionan en cascada.
3. **`Producto` (1) ➔ `ItemPedido` (N):** Un producto del catálogo puede aparecer en múltiples ítems de diferentes pedidos. Cada ítem referencia al producto mediante `producto_id` FK y registra su cantidad y precio unitario pactado.

---

## Paso 2 — Definición de Modelos SQLAlchemy (`app/models.py`)

Se definieron los modelos ORM que representan fielmente las entidades y sus relaciones:

```python
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(50), default="cliente", nullable=False)

    pedidos = relationship("Pedido", back_populates="usuario")


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False, index=True)
    precio_final = Column(Float, nullable=False)
    cuotas_cantidad = Column(Integer, nullable=True, default=1)
    cuotas_valor = Column(Float, nullable=True, default=0.0)
    garantia_meses = Column(Integer, nullable=True, default=0)
    stock = Column(Integer, nullable=False, default=0)

    items = relationship("ItemPedido", back_populates="producto")


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    estado = Column(String(50), default="pendiente", nullable=False)
    total = Column(Float, default=0.0, nullable=False)

    usuario = relationship("Usuario", back_populates="pedidos")
    items = relationship("ItemPedido", back_populates="pedido", cascade="all, delete-orphan")


class ItemPedido(Base):
    __tablename__ = "items_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False, default=1)
    precio_unitario = Column(Float, nullable=False)

    pedido = relationship("Pedido", back_populates="items")
    producto = relationship("Producto", back_populates="items")
```

---

## Paso 3 — Configuración de Alembic

1. **Inicialización:**
   ```bash
   alembic init alembic
   ```
2. **Configuración en `alembic.ini`:**
   ```ini
   sqlalchemy.url = sqlite:///./ecommerce.db
   ```
   *(Permite también configurar PostgreSQL mediante `DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce`).*

3. **Configuración en `alembic/env.py`:**
   ```python
   from app.database import Base, DATABASE_URL
   import app.models  # Registra los 4 modelos en Base.metadata

   target_metadata = Base.metadata

   if DATABASE_URL:
       config.set_main_option("sqlalchemy.url", DATABASE_URL)
   ```
   Se habilitó `render_as_batch=True` para compatibilidad completa de migraciones y restricciones.

---

## Paso 4 — Ejecución y Verificación de Migraciones

### 1. Generación de la migración automática
```bash
alembic revision --autogenerate -m "usuarios, pedidos e items"
```
**Salida de Alembic:**
```text
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.autogenerate.compare.tables] Detected added table 'productos'
INFO  [alembic.autogenerate.compare.tables] Detected added table 'usuarios'
INFO  [alembic.autogenerate.compare.tables] Detected added table 'pedidos'
INFO  [alembic.autogenerate.compare.tables] Detected added table 'items_pedido'
Generating ...\alembic\versions\7118eb416c98_usuarios_pedidos_e_items.py ... done
```

### 2. Aplicación de la migración
```bash
alembic upgrade head
```
**Salida de Alembic:**
```text
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 7118eb416c98, usuarios, pedidos e items
```

### 3. Verificación de tablas en la base de datos
Al consultar las tablas creadas por Alembic:
- `usuarios`
- `productos`
- `pedidos`
- `items_pedido`
- `alembic_version` (versión actual: `7118eb416c98`)

Todas las columnas, tipos de datos, claves primarias e índices quedaron creados y sincronizados exitosamente.

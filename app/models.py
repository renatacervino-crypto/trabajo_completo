from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Numeric, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(50), default="customer", nullable=False)
    acepto_tratamiento = Column(Boolean, default=False, nullable=False)

    # Campos de baja (Parte 1 consigna: Ley 24.240 art. 10 ter y Ley 25.326 art. 16)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_baja = Column(DateTime, nullable=True)

    # Relaciones
    pedidos = relationship("Pedido", back_populates="usuario")
    solicitudes_revocacion = relationship("SolicitudRevocacion", back_populates="usuario")


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False, index=True)
    precio_final = Column(Float, nullable=False)
    cuotas_cantidad = Column(Integer, nullable=True, default=1)
    cuotas_valor = Column(Float, nullable=True, default=0.0)
    garantia_meses = Column(Integer, nullable=True, default=0)
    stock = Column(Integer, nullable=False, default=0)
    imagen_url = Column(String(500), nullable=True)

    # Relación 1 a N: Un producto puede aparecer en múltiples ítems de pedido
    items = relationship("ItemPedido", back_populates="producto")


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    estado = Column(String(50), default="pendiente", nullable=False)
    total = Column(Numeric(12, 2), default=0.0, nullable=False)

    # Relaciones
    usuario = relationship("Usuario", back_populates="pedidos")
    items = relationship("ItemPedido", back_populates="pedido", cascade="all, delete-orphan")
    solicitudes_revocacion = relationship("SolicitudRevocacion", back_populates="pedido")


class ItemPedido(Base):
    __tablename__ = "items_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False, default=1)
    precio_unitario = Column(Numeric(12, 2), nullable=False)

    # Relaciones
    pedido = relationship("Pedido", back_populates="items")
    producto = relationship("Producto", back_populates="items")


class SolicitudRevocacion(Base):
    """
    Modelo SolicitudRevocacion (Parte 1 consigna):
    - codigo (único, formato legal ARR-YYYYMMDD-HEX)
    - pedido_id
    - usuario_id
    - creada_en
    """
    __tablename__ = "solicitudes_revocacion"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, index=True, nullable=False)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    creada_en = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones
    pedido = relationship("Pedido", back_populates="solicitudes_revocacion")
    usuario = relationship("Usuario", back_populates="solicitudes_revocacion")


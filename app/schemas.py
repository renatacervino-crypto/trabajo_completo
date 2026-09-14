from pydantic import BaseModel, EmailStr
from typing import List, Optional

# --- Schemas de Usuario ---
class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: str = "cliente"

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        from_attributes = True


# --- Schemas de Producto ---
class ProductoBase(BaseModel):
    nombre: str
    precio_final: float
    cuotas_cantidad: Optional[int] = 1
    cuotas_valor: Optional[float] = 0.0
    garantia_meses: Optional[int] = 0
    stock: int = 0

class ProductoCreate(ProductoBase):
    pass

class ProductoResponse(ProductoBase):
    id: int

    class Config:
        from_attributes = True


# --- Schemas de ItemPedido ---
class ItemPedidoBase(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float

class ItemPedidoCreate(ItemPedidoBase):
    pass

class ItemPedidoResponse(ItemPedidoBase):
    id: int
    pedido_id: int

    class Config:
        from_attributes = True


# --- Schemas de Pedido ---
class PedidoBase(BaseModel):
    usuario_id: int
    estado: str = "pendiente"
    total: float

class PedidoCreate(BaseModel):
    usuario_id: int
    items: List[ItemPedidoCreate]

class PedidoResponse(PedidoBase):
    id: int
    items: List[ItemPedidoResponse] = []

    class Config:
        from_attributes = True

from pydantic import BaseModel, EmailStr
from typing import List, Optional

# --- Schemas de Usuario y Autenticación ---
class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: str = "customer"

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioRegister(BaseModel):
    nombre: str
    email: str
    password: str
    acepto_tratamiento: bool

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

UsuarioOut = UsuarioResponse

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenRefreshRequest(BaseModel):
    refresh_token: str


# --- Schemas de Producto ---
class ProductoCreate(BaseModel):
    nombre: str
    precio_final: float
    cuotas_cantidad: Optional[int] = 1
    cuotas_valor: Optional[float] = 0.0
    garantia_meses: Optional[int] = 0
    stock: int = 0

class ProductoOut(ProductoCreate):
    id: int

    class Config:
        from_attributes = True

# Alias para compatibilidad con código previo
ProductoBase = ProductoCreate
ProductoResponse = ProductoOut


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

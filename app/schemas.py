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
    imagen_url: Optional[str] = None

class ProductoOut(ProductoCreate):
    id: int

    class Config:
        from_attributes = True

# Alias para compatibilidad con código previo
ProductoBase = ProductoCreate
ProductoResponse = ProductoOut


# --- Schemas de ItemPedido ---
class ItemPedidoInput(BaseModel):
    """La regla que no se negocia: solo viajan producto_id y cantidad"""
    producto_id: int
    cantidad: int

class ItemPedidoBase(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float

class ItemPedidoCreate(ItemPedidoBase):
    pass

class ItemPedidoResponse(BaseModel):
    id: int
    producto_id: int
    cantidad: int
    precio_unitario: float
    producto_nombre: Optional[str] = None

    class Config:
        from_attributes = True


# --- Schemas de Pedido ---
class PedidoCreateInput(BaseModel):
    """Entrada del checkout: el cliente solo envía la lista de ítems sin precio"""
    items: List[ItemPedidoInput]

class PedidoBase(BaseModel):
    usuario_id: int
    estado: str = "pendiente"
    total: float

class PedidoCreate(BaseModel):
    usuario_id: int
    items: List[ItemPedidoCreate]

class PedidoResponse(BaseModel):
    id: int
    usuario_id: int
    estado: str
    total: float
    items: List[ItemPedidoResponse] = []

    class Config:
        from_attributes = True


# --- Schemas de Derechos del Consumidor (Clase 9: Disp. 954/2025, Ley 24.240 y Ley 25.326) ---
class ArrepentimientoRequest(BaseModel):
    pedido_id: int
    motivo: Optional[str] = None

class ArrepentimientoResponse(BaseModel):
    codigo_tramite: str
    pedido_id: int
    estado: str
    mensaje: str
    fecha: str

class BajaRequest(BaseModel):
    motivo: Optional[str] = None

class BajaResponse(BaseModel):
    codigo_tramite: str
    estado: str
    mensaje: str
    fecha: str

class TitularDatosResponse(BaseModel):
    id: int
    nombre: str
    email: str
    rol: str
    consentimiento_ley_25326: bool

class DatosPersonalesResponse(BaseModel):
    titular: TitularDatosResponse
    finalidad_tratamiento: str
    seguridad: str
    cantidad_pedidos_registrados: int
    organo_de_control: str



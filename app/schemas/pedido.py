from pydantic import BaseModel, Field
from typing import List

class ItemIn(BaseModel):
    producto_id: int
    cantidad: int = Field(gt=0, description="Cantidad a comprar (debe ser mayor a 0)")

class PedidoCreate(BaseModel):
    items: List[ItemIn] = Field(min_length=1, description="Lista de ítems del pedido (al menos 1)")

class ItemOut(BaseModel):
    id: int
    producto_id: int
    cantidad: int
    precio_unitario: float

    model_config = {"from_attributes": True}

class PedidoOut(BaseModel):
    id: int
    usuario_id: int
    estado: str = "pendiente"
    total: float
    items: List[ItemOut] = []

    model_config = {"from_attributes": True}

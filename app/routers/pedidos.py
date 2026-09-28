from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models
from app.schemas.pedido import PedidoCreate, PedidoOut
from app.services import pedido_service
from app.routers.auth import get_current_user

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

@router.post("", response_model=PedidoOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PedidoOut, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_pedido(
    datos: PedidoCreate,
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo pedido descontando stock de forma atómica y congelando el precio.
    Requiere autenticación mediante token JWT (get_current_user).
    """
    return pedido_service.crear_pedido(db=db, usuario=usuario, datos=datos)

@router.get("/mis-pedidos", response_model=List[PedidoOut])
def mis_pedidos(
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna el historial de compras del usuario autenticado.
    """
    return pedido_service.listar_mis_pedidos(db=db, usuario_id=usuario.id)

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models
from app.schemas.pedido import PedidoCreate, PedidoOut
from app.services import pedido_service, revocacion_service
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

# IMPORTANTE: /mios DEBE estar declarado ANTES que /{pedido_id}
# para que FastAPI no intente parsear la cadena literal "mios" como un número entero ({pedido_id: int}).
@router.get("/mios", response_model=List[PedidoOut])
@router.get("/mis-pedidos", response_model=List[PedidoOut], include_in_schema=False)
def mis_pedidos(
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna el historial de compras del usuario autenticado del más nuevo al más viejo.
    """
    return pedido_service.listar_mis_pedidos(db=db, usuario_id=usuario.id)

@router.post("/{pedido_id}/revocacion", status_code=status.HTTP_201_CREATED)
def revocar_pedido(
    pedido_id: int,
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Botón de Arrepentimiento / Revocación (Art. 34 Ley 24.240 y Disposición 954/2025):
    - Valida que sea del usuario autenticado (404)
    - Valida que no esté cancelado (409)
    - Valida plazo de 10 días corridos (409)
    - Devuelve stock y genera código legal ARR-YYYYMMDD-HEX (201)
    """
    return revocacion_service.revocar(db=db, usuario=usuario, pedido_id=pedido_id)

@router.get("/{pedido_id}", response_model=PedidoOut)
def ver_pedido(
    pedido_id: int,
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna los detalles de un pedido específico.
    Solo accesible para el dueño del pedido o un administrador.
    Si el pedido pertenece a otro usuario, devuelve 404 (evitando enumeración de IDs ajenos).
    """
    return pedido_service.obtener_pedido(db=db, usuario=usuario, pedido_id=pedido_id)

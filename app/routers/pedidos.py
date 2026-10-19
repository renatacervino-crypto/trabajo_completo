from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app import models
from app.schemas.pedido import PedidoCreate, PedidoOut
from app.services import pedido_service, revocacion_service
from app.routers.auth import get_current_user, require_admin

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

ESTADOS_VALIDOS = {"pendiente", "completado", "cancelado"}

class ActualizarEstadoBody(BaseModel):
    estado: str

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

@router.get("/todos", response_model=List[PedidoOut])
def todos_los_pedidos(
    admin: models.Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    [Solo Admin] Retorna todos los pedidos de todos los usuarios, del más reciente al más antiguo.
    """
    return (
        db.query(models.Pedido)
        .order_by(models.Pedido.id.desc())
        .all()
    )

@router.patch("/{pedido_id}/estado", response_model=PedidoOut)
def actualizar_estado_pedido(
    pedido_id: int,
    body: ActualizarEstadoBody,
    admin: models.Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    [Solo Admin] Cambia el estado de un pedido a: pendiente, completado o cancelado.
    El cambio se persiste en la base de datos.
    """
    if body.estado not in ESTADOS_VALIDOS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Estado inválido. Valores permitidos: {', '.join(ESTADOS_VALIDOS)}"
        )
    pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    pedido.estado = body.estado
    db.commit()
    db.refresh(pedido)
    return pedido

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

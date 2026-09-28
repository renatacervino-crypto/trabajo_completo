from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import schemas, models
from app.services import pedidos as pedidos_service
from app.routers.auth import get_current_user

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

@router.post("", response_model=schemas.PedidoResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.PedidoResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_pedido(
    pedido_in: schemas.PedidoCreateInput,
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirma una compra y crea un pedido en la base de datos.
    LA REGLA QUE NO SE NEGOCIA:
    Solo recibe producto_id y cantidad. El total se calcula en el servidor con los precios de la base de datos.
    """
    pedido = pedidos_service.crear_pedido(db=db, usuario_id=usuario.id, pedido_in=pedido_in)

    # Formatear respuesta con nombres de productos
    items_response = []
    for it in pedido.items:
        prod = db.query(models.Producto).filter(models.Producto.id == it.producto_id).first()
        items_response.append(schemas.ItemPedidoResponse(
            id=it.id,
            producto_id=it.producto_id,
            cantidad=it.cantidad,
            precio_unitario=it.precio_unitario,
            producto_nombre=prod.nombre if prod else f"Producto #{it.producto_id}"
        ))

    return schemas.PedidoResponse(
        id=pedido.id,
        usuario_id=pedido.usuario_id,
        estado=pedido.estado,
        total=pedido.total,
        items=items_response
    )

@router.get("/mis-pedidos", response_model=List[schemas.PedidoResponse])
def mis_pedidos(
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna el historial de compras del usuario autenticado actual.
    """
    pedidos = pedidos_service.listar_mis_pedidos(db=db, usuario_id=usuario.id)
    resultado = []
    for p in pedidos:
        items_response = []
        for it in p.items:
            prod = db.query(models.Producto).filter(models.Producto.id == it.producto_id).first()
            items_response.append(schemas.ItemPedidoResponse(
                id=it.id,
                producto_id=it.producto_id,
                cantidad=it.cantidad,
                precio_unitario=it.precio_unitario,
                producto_nombre=prod.nombre if prod else f"Producto #{it.producto_id}"
            ))
        resultado.append(schemas.PedidoResponse(
            id=p.id,
            usuario_id=p.usuario_id,
            estado=p.estado,
            total=p.total,
            items=items_response
        ))
    return resultado

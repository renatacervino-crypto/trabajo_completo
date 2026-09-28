from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from app import models, schemas

def crear_pedido(db: Session, usuario_id: int, pedido_in: schemas.PedidoCreateInput) -> models.Pedido:
    """
    Crea un pedido en la base de datos calculando los totales exclusivamente
    desde los precios oficiales de la base de datos (La regla que no se negocia).
    """
    if not pedido_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La bolsa de compras no contiene ningún ítem para procesar."
        )

    items_db = []
    total_calculado = 0.0

    for item_in in pedido_in.items:
        if item_in.cantidad <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La cantidad para el producto ID {item_in.producto_id} debe ser mayor a 0."
            )

        producto = db.query(models.Producto).filter(models.Producto.id == item_in.producto_id).first()
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El producto con ID {item_in.producto_id} no existe en nuestro catálogo."
            )

        if producto.stock < item_in.cantidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuficiente para '{producto.nombre}'. Disponibles: {producto.stock}."
            )

        # Descontar stock disponible
        producto.stock -= item_in.cantidad

        # El precio unitario proviene directamente de la base de datos
        subtotal = producto.precio_final * item_in.cantidad
        total_calculado += subtotal

        item_db = models.ItemPedido(
            producto_id=producto.id,
            cantidad=item_in.cantidad,
            precio_unitario=producto.precio_final
        )
        items_db.append(item_db)

    nuevo_pedido = models.Pedido(
        usuario_id=usuario_id,
        estado="confirmado",
        total=round(total_calculado, 2),
        items=items_db
    )

    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)
    return nuevo_pedido

def listar_mis_pedidos(db: Session, usuario_id: int) -> List[models.Pedido]:
    """
    Retorna el historial de compras del usuario autenticado actual.
    """
    return (
        db.query(models.Pedido)
        .filter(models.Pedido.usuario_id == usuario_id)
        .order_by(models.Pedido.id.desc())
        .all()
    )

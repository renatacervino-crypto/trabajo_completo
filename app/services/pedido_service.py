from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from decimal import Decimal
from typing import List

from app import models
from app.schemas.pedido import PedidoCreate

def crear_pedido(db: Session, usuario: models.Usuario, datos: PedidoCreate) -> models.Pedido:
    try:
        total_acumulado = Decimal("0.0")
        items_db = []

        for item in datos.items:
            # 1. Buscar producto y validar existencia (404)
            producto = db.query(models.Producto).filter(models.Producto.id == item.producto_id).first()
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"El producto con ID {item.producto_id} no existe en nuestro catálogo."
                )

            # 2. Validar stock suficiente (409 con mensaje detallado)
            if producto.stock < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Stock insuficiente para '{producto.nombre}'. Quedan {producto.stock} unidades disponibles."
                )

            # 3. Descontar stock y acumular total congelando precio en ese momento
            producto.stock -= item.cantidad
            precio_actual = Decimal(str(producto.precio_final))
            subtotal = precio_actual * item.cantidad
            total_acumulado += subtotal

            # 4. Crear ItemPedido
            item_pedido = models.ItemPedido(
                producto_id=producto.id,
                cantidad=item.cantidad,
                precio_unitario=float(precio_actual)
            )
            items_db.append(item_pedido)

        # 5. Crear Pedido y persistir
        nuevo_pedido = models.Pedido(
            usuario_id=usuario.id,
            estado="pendiente",
            total=float(total_acumulado),
            items=items_db
        )
        db.add(nuevo_pedido)
        db.commit()
        db.refresh(nuevo_pedido)
        return nuevo_pedido

    except Exception:
        db.rollback()
        raise

def listar_mis_pedidos(db: Session, usuario_id: int) -> List[models.Pedido]:
    return (
        db.query(models.Pedido)
        .filter(models.Pedido.usuario_id == usuario_id)
        .order_by(models.Pedido.id.desc())
        .all()
    )

import secrets
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app import models

def generar_codigo() -> str:
    """
    El código que la norma obliga a entregarle al consumidor (Parte 1 consigna):
    Devuelve un código legible y único como: ARR-20260914-A3F9C1
    """
    fecha = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"ARR-{fecha}-{secrets.token_hex(3).upper()}"

def revocar(db: Session, usuario: models.Usuario, pedido_id: int) -> dict:
    """
    Servicio de revocación (Parte 2 de la consigna):
    Validaciones en orden estricto:
    1. es tuyo (404)
    2. no está cancelado (409)
    3. estás dentro de los 10 días (409)
    4. transacción atómica: devolver stock, cambiar estado a 'cancelado',
       crear SolicitudRevocacion con try/except y rollback.
    """
    # 1. Validación 1: ¿Es tuyo? (404)
    pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not pedido or pedido.usuario_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado o no pertenece a tu cuenta"
        )

    # 2. Validación 2: ¿No está cancelado? (409)
    if pedido.estado.lower() in ["cancelado", "revocado"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El pedido ya está cancelado o revocado"
        )

    # 3. Validación 3: ¿Estás dentro de los 10 días? (409)
    creado_en = pedido.creado_en
    if creado_en:
        if isinstance(creado_en, str):
            try:
                creado_en = datetime.fromisoformat(creado_en)
            except Exception:
                pass

        # Evita error: can't subtract offset-naive and offset-aware datetimes
        if hasattr(creado_en, "tzinfo") and creado_en.tzinfo is None:
            creado_en = creado_en.replace(tzinfo=timezone.utc)

        ahora = datetime.now(timezone.utc)
        dias_transcurridos = (ahora - creado_en).days
        if dias_transcurridos > 10:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Fuera del plazo de 10 días para revocar el pedido (han transcurrido {dias_transcurridos} días)"
            )

    # 4. Transacción: restituir stock, cambiar estado a 'cancelado', registrar SolicitudRevocacion
    try:
        for item in pedido.items:
            producto = db.query(models.Producto).filter(models.Producto.id == item.producto_id).first()
            if producto:
                producto.stock += item.cantidad

        pedido.estado = "cancelado"
        codigo = generar_codigo()
        ahora_solicitud = datetime.now(timezone.utc)

        solicitud = models.SolicitudRevocacion(
            codigo=codigo,
            pedido_id=pedido.id,
            usuario_id=usuario.id,
            creada_en=ahora_solicitud
        )
        db.add(solicitud)
        db.commit()
        db.refresh(solicitud)

        return {
            "codigo": solicitud.codigo,
            "pedido_id": solicitud.pedido_id,
            "creada_en": solicitud.creada_en.isoformat() if hasattr(solicitud.creada_en, "isoformat") else str(solicitud.creada_en)
        }
    except Exception as e:
        db.rollback()
        raise e

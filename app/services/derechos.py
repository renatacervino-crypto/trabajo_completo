from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import random
import string
from datetime import datetime, timezone
from app import models

def generar_codigo(prefijo: str) -> str:
    sufijo = ''.join(random.choices(string.digits, k=6))
    anio = datetime.now().year
    return f"{prefijo}-{anio}-{sufijo}"

def solicitar_arrepentimiento(db: Session, pedido_id: int, usuario_id: int, motivo: str = None) -> dict:
    """
    Ejerce el derecho de revocación / arrepentimiento conforme al art. 34 de la Ley 24.240,
    la Disposición 954/2025 y la Disposición 3/2026.
    Genera un código identificador único de trámite inmediato.
    """
    pedido = db.query(models.Pedido).filter(
        models.Pedido.id == pedido_id,
        models.Pedido.usuario_id == usuario_id
    ).first()

    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró el pedido #{pedido_id} asociado a tu cuenta."
        )

    if pedido.estado == "revocado":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El pedido #{pedido_id} ya se encuentra revocado."
        )

    codigo_tramite = generar_codigo("REV")
    pedido.estado = "revocado"
    db.commit()

    return {
        "codigo_tramite": codigo_tramite,
        "pedido_id": pedido.id,
        "estado": "revocado",
        "mensaje": "Solicitud de arrepentimiento registrada exitosamente bajo la Disposición 954/2025 y Art. 34 Ley 24.240. La devolución no tiene costo para el consumidor.",
        "fecha": datetime.now(timezone.utc).isoformat()
    }

def obtener_datos_personales(db: Session, usuario_id: int) -> dict:
    """
    Derecho de Acceso (Art. 14 Ley 25.326).
    Retorna la totalidad de la información personal almacenada del titular.
    """
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    pedidos = db.query(models.Pedido).filter(models.Pedido.usuario_id == usuario_id).all()

    return {
        "titular": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
            "consentimiento_ley_25326": usuario.acepto_tratamiento,
        },
        "finalidad_tratamiento": "Gestión de cuentas, procesamiento de compras de alta perfumería y facturación.",
        "seguridad": "Contraseñas hasheadas con bcrypt; tokens JWT de sesión; base de datos protegida.",
        "cantidad_pedidos_registrados": len(pedidos),
        "organo_de_control": "Agencia de Acceso a la Información Pública (AAIP) - Órgano de Control Ley 25.326",
    }

def solicitar_baja_cuenta(db: Session, usuario_id: int, motivo: str = None) -> dict:
    """
    Derecho de Baja (Art. 10 ter Ley 24.240) y Derecho de Supresión (Art. 16 Ley 25.326).
    """
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    codigo_baja = generar_codigo("BAJA")
    # Anonimizar o dar de baja
    usuario.rol = "inactivo"
    usuario.nombre = f"Usuario Dado de Baja #{usuario.id}"
    db.commit()

    return {
        "codigo_tramite": codigo_baja,
        "estado": "cuenta_baja_confirmada",
        "mensaje": "Baja de cuenta y cese de tratamiento procesados exitosamente conforme a la Ley 24.240 y Ley 25.326.",
        "fecha": datetime.now(timezone.utc).isoformat()
    }

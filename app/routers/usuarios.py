import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.routers.auth import get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

def obtener_datos_completos(db: Session, usuario: models.Usuario) -> dict:
    """
    Recopila TODO lo que la base de datos almacena sobre el usuario:
    - Datos personales
    - Consentimiento informado con su fecha
    - Historial completo de pedidos con ítems
    - Solicitudes de revocación / arrepentimiento
    """
    # 1. Pedidos
    pedidos = db.query(models.Pedido).filter(models.Pedido.usuario_id == usuario.id).order_by(models.Pedido.id.desc()).all()
    pedidos_data = []
    for p in pedidos:
        items_data = []
        for item in p.items:
            prod_nombre = item.producto.nombre if item.producto else None
            items_data.append({
                "item_id": item.id,
                "producto_id": item.producto_id,
                "producto_nombre": prod_nombre,
                "cantidad": item.cantidad,
                "precio_unitario": float(item.precio_unitario) if item.precio_unitario is not None else 0.0
            })
        pedidos_data.append({
            "pedido_id": p.id,
            "estado": p.estado,
            "total": float(p.total) if p.total is not None else 0.0,
            "creado_en": p.creado_en.isoformat() if hasattr(p.creado_en, "isoformat") else str(p.creado_en),
            "items": items_data
        })

    # 2. Solicitudes de Revocación
    solicitudes = db.query(models.SolicitudRevocacion).filter(models.SolicitudRevocacion.usuario_id == usuario.id).order_by(models.SolicitudRevocacion.id.desc()).all()
    solicitudes_data = [
        {
            "id": s.id,
            "codigo": s.codigo,
            "pedido_id": s.pedido_id,
            "creada_en": s.creada_en.isoformat() if hasattr(s.creada_en, "isoformat") else str(s.creada_en)
        }
        for s in solicitudes
    ]

    return {
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
            "activo": usuario.activo,
            "fecha_baja": usuario.fecha_baja.isoformat() if usuario.fecha_baja and hasattr(usuario.fecha_baja, "isoformat") else str(usuario.fecha_baja) if usuario.fecha_baja else None
        },
        "consentimiento": {
            "acepto_tratamiento": usuario.acepto_tratamiento,
            "fecha_consentimiento": usuario.fecha_consentimiento.isoformat() if usuario.fecha_consentimiento and hasattr(usuario.fecha_consentimiento, "isoformat") else str(usuario.fecha_consentimiento) if usuario.fecha_consentimiento else None,
            "marco_legal": "Ley 25.326 de Protección de los Datos Personales"
        },
        "pedidos": pedidos_data,
        "solicitudes_revocacion": solicitudes_data
    }

@router.get("/me/datos", status_code=status.HTTP_200_OK)
def ver_mis_datos(
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Derecho de Acceso (Art. 14 Ley 25.326):
    Devuelve TODO lo que la base guarda de la persona autenticada.
    """
    return obtener_datos_completos(db, usuario)

@router.get("/me/exportar")
def exportar_mis_datos(
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Derecho a la Portabilidad y Descarga de Datos (Art. 14 Ley 25.326):
    Devuelve los datos del titular como archivo JSON descargable con header Content-Disposition.
    """
    datos = obtener_datos_completos(db, usuario)
    contenido = json.dumps(datos, default=str, indent=2, ensure_ascii=False)
    filename = f"mis_datos_{usuario.id}.json"

    return Response(
        content=contenido,
        media_type="application/json",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.delete("/me", status_code=status.HTTP_200_OK)
def baja_cuenta(
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Baja de cuenta y anonimización (Art. 10 ter Ley 24.240 y Art. 16 Ley 25.326):
    NO borra la fila: la anonimiza. Reemplaza el nombre, el email (con el id adentro
    para evitar colisión de unicidad) y la contraseña por valores neutros,
    marcando activo en False con su fecha_baja.
    """
    ahora = datetime.now(timezone.utc)
    uid = usuario.id

    usuario.nombre = f"Usuario Anonimizado #{uid}"
    usuario.email = f"anonimo_{uid}@eliminado.local"
    usuario.password_hash = "ANONIMIZADO"
    usuario.activo = False
    usuario.fecha_baja = ahora
    db.commit()

    return {
        "mensaje": "Cuenta anonimizada y dada de baja exitosamente conforme a la Ley 24.240 y Ley 25.326.",
        "usuario_id": uid,
        "activo": False,
        "fecha_baja": ahora.isoformat()
    }

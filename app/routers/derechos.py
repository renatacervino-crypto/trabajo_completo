from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas, models
from app.services import derechos as derechos_service
from app.routers.auth import get_current_user

router = APIRouter(prefix="/derechos", tags=["Derechos del Consumidor"])

@router.post("/arrepentimiento", response_model=schemas.ArrepentimientoResponse, status_code=status.HTTP_200_OK)
def ejercer_arrepentimiento(
    datos: schemas.ArrepentimientoRequest,
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Botón de Arrepentimiento reglamentado por:
    - Art. 34 de la Ley 24.240 (plazo de 10 días corridos sin costo para el consumidor)
    - Disposición 954/2025 (vigente y exigible desde el 4 de noviembre de 2025, derogó Res. 424/2020)
    - Disposición 3/2026

    Genera de inmediato un código de trámite identificador único (ej: REV-2026-XXXXXX).
    """
    return derechos_service.solicitar_arrepentimiento(
        db=db,
        pedido_id=datos.pedido_id,
        usuario_id=usuario.id,
        motivo=datos.motivo
    )

@router.get("/mis-datos", response_model=schemas.DatosPersonalesResponse)
def consultar_datos_personales(
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Derecho de Acceso (Art. 14 Ley 25.326 de Protección de Datos Personales).
    Proporciona al titular acceso integral a los datos personales registrados,
    su finalidad de tratamiento y medidas de seguridad aplicadas.
    """
    return derechos_service.obtener_datos_personales(
        db=db,
        usuario_id=usuario.id
    )

@router.post("/baja", response_model=schemas.BajaResponse, status_code=status.HTTP_200_OK)
def solicitar_baja(
    datos: schemas.BajaRequest,
    usuario: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Botón de Baja de servicio y cuenta:
    - Art. 10 ter de la Ley 24.240 (Baja por el mismo medio de contratación)
    - Art. 16 de la Ley 25.326 (Derecho de Supresión / Cancelación de datos)

    Emite constancia inmediata con código de trámite único (ej: BAJA-2026-XXXXXX).
    """
    return derechos_service.solicitar_baja_cuenta(
        db=db,
        usuario_id=usuario.id,
        motivo=datos.motivo
    )

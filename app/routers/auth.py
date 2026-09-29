from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas, models
from app.services import auth as auth_service
from app.core.security import create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/auth", tags=["Autenticación"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.Usuario:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no contiene credencial de usuario",
            headers={"WWW-Authenticate": "Bearer"},
        )
    usuario = auth_service.obtener_usuario_por_email(db, email=email)
    if not usuario and payload.get("id"):
        usuario = db.query(models.Usuario).filter(models.Usuario.id == payload.get("id")).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario dado de baja o inactivo",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return usuario

def require_admin(usuario: models.Usuario = Depends(get_current_user)) -> models.Usuario:
    # 401 = no sabe quién sos; 403 = sabe quién sos y no te alcanza
    if usuario.rol not in ["admin", "administrador"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permisos insuficientes: se requiere rol de administrador"
        )
    return usuario

@router.post("/register", response_model=schemas.UsuarioResponse, status_code=status.HTTP_201_CREATED)
def register(
    datos: schemas.UsuarioRegister,
    db: Session = Depends(get_db)
):
    """
    Registra un nuevo usuario con contraseña hasheada y consentimiento de Ley 25.326.
    Recibe JSON: { nombre, email, password, acepto_tratamiento }
    """
    usuario = auth_service.registrar_usuario(db=db, datos=datos)
    return usuario

@router.post("/login", response_model=schemas.TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Inicio de sesión estándar OAuth2 (form-urlencoded).
    Espera username (email) y password.
    Retorna: { access_token, refresh_token, token_type: 'bearer' }
    """
    usuario = auth_service.autenticar_usuario(
        db=db,
        email=form_data.username,
        password=form_data.password
    )
    token_data = {"sub": usuario.email, "rol": usuario.rol, "id": usuario.id}
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)

    return schemas.TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/refresh", response_model=schemas.TokenResponse)
def refresh_token(
    datos: schemas.TokenRefreshRequest,
    db: Session = Depends(get_db)
):
    """
    Renueva el access token utilizando el refresh token.
    """
    payload = decode_token(datos.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    usuario = auth_service.obtener_usuario_por_email(db, email=email)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token_data = {"sub": usuario.email, "rol": usuario.rol, "id": usuario.id}
    new_access_token = create_access_token(data=token_data)
    new_refresh_token = create_refresh_token(data=token_data)

    return schemas.TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )

@router.get("/me", response_model=schemas.UsuarioResponse)
def get_me(usuario: models.Usuario = Depends(get_current_user)):
    """
    Obtiene los datos del usuario autenticado actual mediante el token Bearer.
    """
    return usuario

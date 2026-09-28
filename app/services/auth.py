from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app import models, schemas
from app.core.security import hash_password, verify_password

def registrar_usuario(db: Session, datos: schemas.UsuarioRegister) -> models.Usuario:
    # 1. Validación de consentimiento Ley 25.326
    if not datos.acepto_tratamiento:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Debe aceptar el tratamiento de sus datos personales bajo la Ley 25.326."
        )

    # 2. Validación de longitud de contraseña
    if len(datos.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Revisá los datos: la clave va de 8 caracteres para arriba."
        )

    # 3. Validación de email duplicado
    usuario_existente = db.query(models.Usuario).filter(models.Usuario.email == datos.email.lower().strip()).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ese email ya está registrado"
        )

    # 4. Hashing de contraseña (REGLA QUE NO SE NEGOCIA: Nunca texto plano)
    hashed_pw = hash_password(datos.password)

    nuevo_usuario = models.Usuario(
        nombre=datos.nombre.strip(),
        email=datos.email.lower().strip(),
        password_hash=hashed_pw,
        rol="customer",
        acepto_tratamiento=True
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def autenticar_usuario(db: Session, email: str, password: str) -> models.Usuario:
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email.lower().strip()).first()
    if not usuario or not verify_password(password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return usuario

def obtener_usuario_por_email(db: Session, email: str) -> models.Usuario:
    return db.query(models.Usuario).filter(models.Usuario.email == email.lower().strip()).first()

def obtener_usuario_por_id(db: Session, user_id: int) -> models.Usuario:
    return db.query(models.Usuario).filter(models.Usuario.id == user_id).first()

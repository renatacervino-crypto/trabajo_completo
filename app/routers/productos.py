from typing import List, Optional
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app import schemas, models
from app.services import productos as productos_service
from app.routers.auth import require_admin

router = APIRouter(prefix="/productos", tags=["Productos"])

# Configuración de subida de imágenes (Clase 10)
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)
MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024  # 2 Megabytes
ALLOWED_MIME_TYPES = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
}

@router.get("/", response_model=List[schemas.ProductoOut])
@router.get("", response_model=List[schemas.ProductoOut], include_in_schema=False)
def listar_productos(
    skip: int = Query(0, ge=0, description="Cantidad de registros a omitir"),
    page: Optional[int] = Query(None, ge=0, description="Número de página"),
    limit: int = Query(100, ge=1, description="Límite máximo de registros a retornar"),
    nombre: Optional[str] = Query(None, description="Filtro opcional por coincidencia de nombre"),
    precio_max: Optional[float] = Query(None, ge=0, description="Filtro opcional por precio máximo"),
    db: Session = Depends(get_db)
):
    offset = (page * limit) if page is not None else skip
    return productos_service.listar_productos(
        db=db,
        skip=offset,
        limit=limit,
        nombre=nombre,
        precio_max=precio_max
    )

@router.get("/{producto_id}", response_model=schemas.ProductoOut)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    producto = productos_service.obtener_producto(db=db, producto_id=producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto

@router.post("/", response_model=schemas.ProductoOut, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=schemas.ProductoOut, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_producto(
    producto: schemas.ProductoCreate,
    admin: models.Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return productos_service.crear_producto(db=db, producto=producto)

@router.post("/{producto_id}/imagen", response_model=schemas.ProductoOut)
async def subir_imagen_producto(
    producto_id: int,
    file: UploadFile = File(...),
    admin: models.Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Subida de imagen de producto (Clase 10):
    - Valida que sea una imagen (MIME type en JPEG, PNG, WebP o GIF).
    - Valida que el tamaño máximo no supere los 2 MB.
    - Persiste el archivo en el directorio estático /uploads/ y asocia la URL al producto.
    """
    # 1. Verificar existencia del producto
    producto = productos_service.obtener_producto(db=db, producto_id=producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto #{producto_id} no encontrado"
        )

    # 2. Validación de Tipo MIME (Debe ser imagen)
    content_type = file.content_type or ""
    if content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no permitido ('{content_type}'). Solo se aceptan imágenes JPG, PNG, WebP o GIF."
        )

    # 3. Validación de Tamaño (Máximo 2 MB)
    contenido = await file.read()
    tamanio = len(contenido)
    if tamanio > MAX_FILE_SIZE_BYTES:
        tamanio_mb = round(tamanio / (1024 * 1024), 2)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El archivo pesa {tamanio_mb} MB y supera el límite máximo permitido de 2 MB."
        )

    # 4. Guardar archivo en disco con nombre seguro
    extension = ALLOWED_MIME_TYPES[content_type.lower()]
    nombre_archivo = f"producto_{producto_id}_{uuid.uuid4().hex[:8]}.{extension}"
    ruta_destino = os.path.join(UPLOADS_DIR, nombre_archivo)

    with open(ruta_destino, "wb") as f:
        f.write(contenido)

    # 5. Actualizar URL en la base de datos
    producto.imagen_url = f"/uploads/{nombre_archivo}"
    db.commit()
    db.refresh(producto)

    return producto

@router.delete("/{producto_id}", status_code=status.HTTP_200_OK)
def eliminar_producto(
    producto_id: int,
    admin: models.Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Elimina un producto del catálogo (Acceso exclusivo Administrador).
    """
    return productos_service.eliminar_producto(db=db, producto_id=producto_id)



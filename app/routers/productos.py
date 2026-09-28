from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app import schemas
from app.services import productos as productos_service

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=List[schemas.ProductoOut])
@router.get("", response_model=List[schemas.ProductoOut], include_in_schema=False)
def listar_productos(
    skip: int = Query(0, ge=0, description="Cantidad de registros a omitir"),
    limit: int = Query(100, ge=1, description="Límite máximo de registros a retornar"),
    nombre: Optional[str] = Query(None, description="Filtro opcional por coincidencia de nombre"),
    precio_max: Optional[float] = Query(None, ge=0, description="Filtro opcional por precio máximo"),
    db: Session = Depends(get_db)
):
    return productos_service.listar_productos(
        db=db,
        skip=skip,
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
    db: Session = Depends(get_db)
):
    return productos_service.crear_producto(db=db, producto=producto)

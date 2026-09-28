from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.services import productos as productos_service

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("", response_model=List[schemas.ProductoOut])
@router.get("/", response_model=List[schemas.ProductoOut], include_in_schema=False)
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

@router.post("", response_model=schemas.ProductoOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ProductoOut, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_producto(
    producto: schemas.ProductoCreate,
    db: Session = Depends(get_db)
):
    return productos_service.crear_producto(db=db, producto=producto)

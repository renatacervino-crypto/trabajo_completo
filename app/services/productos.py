from typing import List, Optional
from sqlalchemy.orm import Session
from app import models, schemas

def crear_producto(db: Session, producto: schemas.ProductoCreate) -> models.Producto:
    db_producto = models.Producto(
        nombre=producto.nombre,
        precio_final=producto.precio_final,
        cuotas_cantidad=producto.cuotas_cantidad,
        cuotas_valor=producto.cuotas_valor,
        garantia_meses=producto.garantia_meses,
        stock=producto.stock
    )
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def listar_productos(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    nombre: Optional[str] = None,
    precio_max: Optional[float] = None
) -> List[models.Producto]:
    query = db.query(models.Producto)
    
    if nombre:
        query = query.filter(models.Producto.nombre.ilike(f"%{nombre}%"))
    
    if precio_max is not None:
        query = query.filter(models.Producto.precio_final <= precio_max)
        
    return query.offset(skip).limit(limit).all()

def obtener_producto(db: Session, producto_id: int) -> Optional[models.Producto]:
    return db.query(models.Producto).filter(models.Producto.id == producto_id).first()

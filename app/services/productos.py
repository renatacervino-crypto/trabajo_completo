from typing import List, Optional
from sqlalchemy.orm import Session
from app import models, schemas

def crear_producto(db: Session, producto: schemas.ProductoCreate) -> models.Producto:
    cuotas_cant = producto.cuotas_cantidad if producto.cuotas_cantidad and producto.cuotas_cantidad > 0 else 1
    cuotas_val = producto.cuotas_valor if producto.cuotas_valor and producto.cuotas_valor > 0 else round(producto.precio_final / cuotas_cant, 2)

    db_producto = models.Producto(
        nombre=producto.nombre,
        precio_final=producto.precio_final,
        cuotas_cantidad=cuotas_cant,
        cuotas_valor=cuotas_val,
        garantia_meses=producto.garantia_meses or 12,
        stock=producto.stock or 0,
        imagen_url=producto.imagen_url
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

def eliminar_producto(db: Session, producto_id: int) -> dict:
    from fastapi import HTTPException, status
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto #{producto_id} no encontrado"
        )
    nombre = producto.nombre
    db.delete(producto)
    db.commit()
    return {"mensaje": f"El perfume '{nombre}' fue eliminado correctamente del catálogo", "id": producto_id}


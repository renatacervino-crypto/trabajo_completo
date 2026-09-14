from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="L'Élixir - API de Productos",
    description="API REST para la gestión de productos de la tienda de perfumes de autor L'Élixir",
    version="1.0.0"
)

# Paso 1 — El modelo Producto
class Producto(BaseModel):
    id: int
    nombre: str
    precio_final: float
    cuotas_cantidad: int
    cuotas_valor: float
    garantia_meses: int
    stock: int

# Paso 2 — La lista en memoria
productos_db: List[Producto] = [
    Producto(
        id=1,
        nombre="Santal Impérial 50ml",
        precio_final=260000.0,
        cuotas_cantidad=6,
        cuotas_valor=43333.33,
        garantia_meses=12,
        stock=15
    ),
    Producto(
        id=2,
        nombre="Rose Noire Absolue 50ml",
        precio_final=285000.0,
        cuotas_cantidad=6,
        cuotas_valor=47500.0,
        garantia_meses=12,
        stock=8
    ),
    Producto(
        id=3,
        nombre="Iris Nocturne 50ml",
        precio_final=320000.0,
        cuotas_cantidad=6,
        cuotas_valor=53333.33,
        garantia_meses=12,
        stock=5
    ),
]

# Paso 3 — Endpoint GET
@app.get("/productos", response_model=List[Producto], tags=["Productos"])
def obtener_productos():
    return productos_db

# Paso 4 — Endpoint POST
@app.post("/productos", response_model=Producto, status_code=status.HTTP_201_CREATED, tags=["Productos"])
def agregar_producto(producto: Producto):
    for p in productos_db:
        if p.id == producto.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El producto con ID {producto.id} ya existe en la base de datos."
            )
    productos_db.append(producto)
    return producto

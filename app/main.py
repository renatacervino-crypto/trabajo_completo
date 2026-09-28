from fastapi import FastAPI
from app.routers import productos as productos_router

app = FastAPI(
    title="L'Élixir - API de Productos",
    description="API REST para la gestión de productos de la tienda de perfumes de autor L'Élixir",
    version="1.0.0"
)

# Inclusión del router de productos
app.include_router(productos_router.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "API de L'Élixir funcionando correctamente", "docs": "/docs"}

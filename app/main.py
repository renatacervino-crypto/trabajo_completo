from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import productos as productos_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST para la gestión de productos de la tienda de perfumes de autor L'Élixir",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión del router de productos
app.include_router(productos_router.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "API de L'Élixir funcionando correctamente", "docs": "/docs"}

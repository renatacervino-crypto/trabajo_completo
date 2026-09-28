from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app import models
from app.core.security import hash_password
from app.routers import productos as productos_router
from app.routers import auth as auth_router
from app.routers import pedidos as pedidos_router
from app.routers import derechos as derechos_router

# Inicialización y semillero de datos
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas en SQLite/Postgres
    Base.metadata.create_all(bind=engine)
    
    # Sembrar usuarios iniciales y productos si está vacía
    db = SessionLocal()
    try:
        # 1. Semillero de Usuarios (Admin y Customer)
        admin_user = db.query(models.Usuario).filter(models.Usuario.email == "admin@lelixir.com").first()
        if not admin_user:
            admin_user = models.Usuario(
                nombre="Administrador L'Élixir",
                email="admin@lelixir.com",
                password_hash=hash_password("admin1234"),
                rol="admin",
                acepto_tratamiento=True
            )
            db.add(admin_user)

        cliente_user = db.query(models.Usuario).filter(models.Usuario.email == "cliente@lelixir.com").first()
        if not cliente_user:
            cliente_user = models.Usuario(
                nombre="Ana Gómez",
                email="cliente@lelixir.com",
                password_hash=hash_password("cliente1234"),
                rol="customer",
                acepto_tratamiento=True
            )
            db.add(cliente_user)

        # 2. Semillero de Productos (si no hay)
        if db.query(models.Producto).count() == 0:
            productos_iniciales = [
                models.Producto(nombre="Santal Impérial 50ml", precio_final=260000.0, cuotas_cantidad=6, cuotas_valor=43333.33, garantia_meses=12, stock=15, imagen_url="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"),
                models.Producto(nombre="Rose Noire Absolue 50ml", precio_final=285000.0, cuotas_cantidad=6, cuotas_valor=47500.0, garantia_meses=12, stock=8, imagen_url="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"),
                models.Producto(nombre="Iris Nocturne 50ml", precio_final=320000.0, cuotas_cantidad=6, cuotas_valor=53333.33, garantia_meses=12, stock=5, imagen_url="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"),
                models.Producto(nombre="Cuir Majestueux 50ml", precio_final=310000.0, cuotas_cantidad=6, cuotas_valor=51666.67, garantia_meses=12, stock=10, imagen_url="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"),
                models.Producto(nombre="Ambre Précieux 50ml", precio_final=240000.0, cuotas_cantidad=6, cuotas_valor=40000.0, garantia_meses=12, stock=12, imagen_url="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"),
                models.Producto(nombre="Fleur de Soie 50ml", precio_final=275000.0, cuotas_cantidad=6, cuotas_valor=45833.33, garantia_meses=12, stock=7, imagen_url="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80"),
                models.Producto(nombre="Oud Mystique 50ml", precio_final=350000.0, cuotas_cantidad=6, cuotas_valor=58333.33, garantia_meses=12, stock=4, imagen_url="https://images.unsplash.com/photo-1592945403407-98e3b2e59751?auto=format&fit=crop&w=600&q=80"),
            ]
            db.add_all(productos_iniciales)

        db.commit()
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST para la gestión de productos y autenticación de la tienda de perfumes de autor L'Élixir",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Asegurar existencia del directorio de uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Inclusión de routers
app.include_router(auth_router.router)
app.include_router(productos_router.router)
app.include_router(pedidos_router.router)
app.include_router(derechos_router.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "API de L'Élixir funcionando correctamente", "docs": "/docs"}

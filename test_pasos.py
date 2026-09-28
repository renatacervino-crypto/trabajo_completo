import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Cargar al menos 5 productos
perfumes = [
    {
        "nombre": "Santal Impérial 50ml",
        "precio_final": 260000.0,
        "cuotas_cantidad": 6,
        "cuotas_valor": 43333.33,
        "garantia_meses": 12,
        "stock": 15
    },
    {
        "nombre": "Rose Noire Absolue 50ml",
        "precio_final": 285000.0,
        "cuotas_cantidad": 6,
        "cuotas_valor": 47500.0,
        "garantia_meses": 12,
        "stock": 8
    },
    {
        "nombre": "Iris Nocturne 50ml",
        "precio_final": 320000.0,
        "cuotas_cantidad": 6,
        "cuotas_valor": 53333.33,
        "garantia_meses": 12,
        "stock": 5
    },
    {
        "nombre": "Cuir Majestueux 50ml",
        "precio_final": 310000.0,
        "cuotas_cantidad": 6,
        "cuotas_valor": 51666.67,
        "garantia_meses": 12,
        "stock": 10
    },
    {
        "nombre": "Fleur d'Oranger Intense 50ml",
        "precio_final": 240000.0,
        "cuotas_cantidad": 6,
        "cuotas_valor": 40000.0,
        "garantia_meses": 12,
        "stock": 12
    }
]

print("=== CARGA DE PRODUCTOS (POST /productos) ===")
# Ver cuántos hay actualmente
existentes = client.get("/productos").json()
print(f"Productos existentes en base de datos: {len(existentes)}")

if len(existentes) < 5:
    for p in perfumes:
        res = client.post("/productos", json=p)
        print(f"POST {p['nombre']} -> Status: {res.status_code}, ProductoOut ID: {res.json().get('id')}")

# Validar que hay al menos 5
todos = client.get("/productos").json()
print(f"\nTotal de productos en base de datos: {len(todos)}")
assert len(todos) >= 5, "Debe haber al menos 5 productos cargados."

# Paso 5 - Prueba 1: GET /productos?limit=2
print("\n=== PASO 5.1: Probar GET /productos?limit=2 ===")
res_limit = client.get("/productos?limit=2")
datos_limit = res_limit.json()
print(f"Status: {res_limit.status_code}")
print(f"Cantidad devuelta: {len(datos_limit)} (Esperado: 2)")
for item in datos_limit:
    print(f" - ID: {item['id']} | Nombre: {item['nombre']} | Precio: ${item['precio_final']}")
assert len(datos_limit) == 2, f"Error: Se esperaban 2 productos, se recibieron {len(datos_limit)}"

# Paso 5 - Prueba 2: GET /productos?nombre=...
print("\n=== PASO 5.2: Probar GET /productos?nombre=Santal ===")
res_nombre = client.get("/productos?nombre=Santal")
datos_nombre = res_nombre.json()
print(f"Status: {res_nombre.status_code}")
print(f"Resultados encontrados: {len(datos_nombre)}")
for item in datos_nombre:
    print(f" - ID: {item['id']} | Nombre: {item['nombre']} | Precio: ${item['precio_final']}")
assert len(datos_nombre) > 0, "Error: No se encontró ningún producto con 'Santal'"
assert all("santal" in item["nombre"].lower() for item in datos_nombre), "Error: Filtro de nombre no coincide"

# Prueba adicional: Filtro precio_max
print("\n=== PRUEBA ADICIONAL: GET /productos?precio_max=270000 ===")
res_precio = client.get("/productos?precio_max=270000")
datos_precio = res_precio.json()
print(f"Status: {res_precio.status_code}")
print(f"Resultados con precio <= 270000: {len(datos_precio)}")
for item in datos_precio:
    print(f" - ID: {item['id']} | Nombre: {item['nombre']} | Precio: ${item['precio_final']}")
    assert item["precio_final"] <= 270000

print("\n>>> ¡TODOS LOS PASOS Y PRUEBAS COMPLETADOS CON ÉXITO! <<<")

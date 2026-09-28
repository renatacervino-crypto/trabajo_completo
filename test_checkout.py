from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app import models

client = TestClient(app)

print("=== INICIANDO PRUEBAS DE CHECKOUT TRANSACCIONAL ===")

# 1. Login para obtener token
login_res = client.post("/auth/login", data={"username": "cliente@lelixir.com", "password": "cliente1234"})
assert login_res.status_code == 200, f"Error en login: {login_res.text}"
token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Login exitoso como cliente@lelixir.com")

# 2. Consultar stock inicial de producto 1
db = SessionLocal()
producto_1 = db.query(models.Producto).filter(models.Producto.id == 1).first()
stock_inicial = producto_1.stock
pedidos_iniciales = db.query(models.Pedido).count()
print(f"Producto ID 1: '{producto_1.nombre}' | Stock ANTES del pedido: {stock_inicial}")
print(f"Cantidad de pedidos ANTES: {pedidos_iniciales}")
db.close()

# 3. Crear pedido exitoso (compra de 2 unidades)
payload_exitoso = {
    "items": [
        {"producto_id": 1, "cantidad": 2}
    ]
}
res_crear = client.post("/pedidos", json=payload_exitoso, headers=headers)
print(f"\nPOST /pedidos (compra de 2 unidades) -> Status: {res_crear.status_code}")
assert res_crear.status_code == 201, f"Error creando pedido: {res_crear.text}"
pedido_creado = res_crear.json()
print("Pedido creado:", pedido_creado)

# 4. Verificar stock y pedido en DB
db = SessionLocal()
producto_1_despues = db.query(models.Producto).filter(models.Producto.id == 1).first()
stock_despues = producto_1_despues.stock
pedidos_despues = db.query(models.Pedido).count()
print(f"Stock DESPUÉS del pedido exitoso: {stock_despues} (Esperado: {stock_inicial - 2})")
assert stock_despues == stock_inicial - 2, "El stock no se descontó correctamente"
assert pedidos_despues == pedidos_iniciales + 1, "No se registró el nuevo pedido"
db.close()

# 5. Probar pedido con stock excesivo (debe devolver 409 Conflict)
payload_excesivo = {
    "items": [
        {"producto_id": 1, "cantidad": 999}
    ]
}
res_409 = client.post("/pedidos", json=payload_excesivo, headers=headers)
print(f"\nPOST /pedidos con 999 unidades -> Status: {res_409.status_code}")
assert res_409.status_code == 409, f"Se esperaba 409 pero se obtuvo {res_409.status_code}"
error_detalle = res_409.json()["detail"]
print("Mensaje de error 409:", error_detalle)
assert f"Quedan {stock_despues} unidades" in error_detalle, "El mensaje 409 no especifica las unidades disponibles"

# 6. Confirmar que tras el 409 el stock NO cambió y no se creó ningún pedido adicional
db = SessionLocal()
producto_1_final = db.query(models.Producto).filter(models.Producto.id == 1).first()
pedidos_final = db.query(models.Pedido).count()
print(f"Stock tras 409: {producto_1_final.stock} (Confirmado: NO cambió)")
assert producto_1_final.stock == stock_despues, "El rollback falló: el stock cambió en un pedido fallido"
assert pedidos_final == pedidos_despues, "Se creó un pedido erróneo en base de datos"
db.close()

print("\n>>> ¡TODAS LAS PRUEBAS DEL CHECKOUT TRANSACCIONAL PASARON CON ÉXITO! <<<")

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app import models

client = TestClient(app)

print("=== VERIFICACIÓN COMPLETA DEL CHECKLIST DE ENTREGA ===")

# 1. Sin token -> checkout devuelve 401
res_sin_token = client.post("/pedidos", json={"items": [{"producto_id": 1, "cantidad": 1}]})
print(f"1. Sin token -> Status: {res_sin_token.status_code} (Esperado: 401)")
assert res_sin_token.status_code == 401

# Login usuario 1 (cliente@lelixir.com)
res_login1 = client.post("/auth/login", data={"username": "cliente@lelixir.com", "password": "cliente1234"})
assert res_login1.status_code == 200
token1 = res_login1.json()["access_token"]
headers1 = {"Authorization": f"Bearer {token1}"}

# 2. Producto inexistente devuelve 404
res_inexistente = client.post("/pedidos", json={"items": [{"producto_id": 99999, "cantidad": 1}]}, headers=headers1)
print(f"2. Producto inexistente -> Status: {res_inexistente.status_code} (Esperado: 404)")
assert res_inexistente.status_code == 404

# 3. Sin stock devuelve 409 con mensaje claro
res_sin_stock = client.post("/pedidos", json={"items": [{"producto_id": 1, "cantidad": 99999}]}, headers=headers1)
print(f"3. Sin stock -> Status: {res_sin_stock.status_code} (Esperado: 409)")
print("   Mensaje recibido:", res_sin_stock.json()["detail"])
assert res_sin_stock.status_code == 409
assert "unidades disponibles" in res_sin_stock.json()["detail"]

# 4. Crear un pedido exitoso para usuario 1
res_pedido1 = client.post("/pedidos", json={"items": [{"producto_id": 1, "cantidad": 1}]}, headers=headers1)
print(f"4. Crear pedido Usuario 1 -> Status: {res_pedido1.status_code} (Esperado: 201)")
assert res_pedido1.status_code == 201
pedido1_id = res_pedido1.json()["id"]

# 5. GET /pedidos/mios devuelve los pedidos propios
res_mios = client.get("/pedidos/mios", headers=headers1)
print(f"5. GET /pedidos/mios -> Status: {res_mios.status_code} (Esperado: 200)")
assert res_mios.status_code == 200
pedidos_mios = res_mios.json()
assert len(pedidos_mios) > 0
assert pedidos_mios[0]["id"] >= pedidos_mios[-1]["id"], "Deben estar del más nuevo al más viejo"
print(f"   Pedidos encontrados para usuario 1: {len(pedidos_mios)}")

# 6. Registrar / Iniciar sesión con Usuario 2
client.post("/auth/register", json={
    "nombre": "Usuario Dos",
    "email": "usuario2@test.com",
    "password": "password1234",
    "acepto_tratamiento": True
})
res_login2 = client.post("/auth/login", data={"username": "usuario2@test.com", "password": "password1234"})
token2 = res_login2.json()["access_token"]
headers2 = {"Authorization": f"Bearer {token2}"}

# 7. Usuario 2 intenta consultar el pedido de Usuario 1 -> DEBE DEVOLVER 404 (NO 403)
res_ajeno = client.get(f"/pedidos/{pedido1_id}", headers=headers2)
print(f"7. Usuario 2 pide pedido ajeno #{pedido1_id} -> Status: {res_ajeno.status_code} (Esperado: 404)")
assert res_ajeno.status_code == 404, f"Se esperaba 404 para evitar enumeración, se obtuvo {res_ajeno.status_code}"

# 8. Usuario 1 consulta su propio pedido -> 200 OK
res_propio = client.get(f"/pedidos/{pedido1_id}", headers=headers1)
print(f"8. Usuario 1 pide su propio pedido #{pedido1_id} -> Status: {res_propio.status_code} (Esperado: 200)")
assert res_propio.status_code == 200

# 9. Admin consulta el pedido de Usuario 1 -> 200 OK
res_login_admin = client.post("/auth/login", data={"username": "admin@lelixir.com", "password": "admin1234"})
token_admin = res_login_admin.json()["access_token"]
headers_admin = {"Authorization": f"Bearer {token_admin}"}
res_admin_ve_pedido = client.get(f"/pedidos/{pedido1_id}", headers=headers_admin)
print(f"9. Admin consulta pedido #{pedido1_id} de Usuario 1 -> Status: {res_admin_ve_pedido.status_code} (Esperado: 200)")
assert res_admin_ve_pedido.status_code == 200

print("\n>>> ¡TODOS LOS PUNTOS DEL CHECKLIST HAN SIDO VALIDADOS EXITOSAMENTE! <<<")

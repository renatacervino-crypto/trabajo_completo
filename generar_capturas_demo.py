import json
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app import models
from app.core.security import hash_password, create_access_token

client = TestClient(app)

def demo_entregables():
    db = SessionLocal()
    print("=" * 70)
    print("DEMOSTRACIÓN PARA ENTREGABLES Y DEFENSAS DE ACTIVIDAD")
    print("=" * 70)

    # 1. ENTREGABLE 1: REVOCACIÓN Y STOCK RESTITUIDO
    print("\n>>> ENTREGABLE 1: REVOCACIÓN Y RESTITUCIÓN DE STOCK (Art. 34 Ley 24.240)")
    user = models.Usuario(
        nombre="Lucía Pereyra",
        email=f"lucia_{int(datetime.now().timestamp())}@ejemplo.com",
        password_hash=hash_password("Demo1234!"),
        rol="customer",
        acepto_tratamiento=True,
        activo=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "rol": user.rol, "id": user.id})
    headers = {"Authorization": f"Bearer {token}"}

    prod = db.query(models.Producto).first()
    stock_inicial = prod.stock
    print(f"1. Producto: '{prod.nombre}'")
    print(f"   Stock inicial en base de datos: {stock_inicial} unidades")

    # Compra
    res_compra = client.post("/pedidos", json={"items": [{"producto_id": prod.id, "cantidad": 2}]}, headers=headers)
    pedido_id = res_compra.json()["id"]
    db.refresh(prod)
    print(f"2. Compra realizada (Pedido #{pedido_id}, 2 unidades).")
    print(f"   Stock tras la compra (antes de revocar): {prod.stock} unidades")

    # Revocación
    res_rev = client.post(f"/pedidos/{pedido_id}/revocacion", headers=headers)
    db.refresh(prod)
    print(f"\n3. Respuesta POST /pedidos/{pedido_id}/revocacion:")
    print(f"   HTTP Status: {res_rev.status_code} CREATED")
    print(f"   Payload devuelto: {json.dumps(res_rev.json(), indent=2)}")
    print(f"\n4. Stock después de revocar: {prod.stock} unidades")
    print(f"   ¿Stock restituido con éxito? {'SÍ' if prod.stock == stock_inicial else 'NO'}")

    # 2. ENTREGABLE 2: BAJA DE CUENTA Y ANONIMIZACIÓN (Art. 10 ter Ley 24.240 y Ley 25.326)
    print("\n" + "=" * 70)
    print(">>> ENTREGABLE 2: BAJA DE CUENTA Y PRESERVACIÓN DE PEDIDOS")
    print(f"1. Usuario ANTES de la baja:")
    print(f"   ID: {user.id} | Nombre: {user.nombre} | Email: {user.email} | Activo: {user.activo} | Fecha Baja: {user.fecha_baja}")
    pedidos_antes = db.query(models.Pedido).filter(models.Pedido.usuario_id == user.id).count()
    print(f"   Cantidad de pedidos asociados: {pedidos_antes}")

    res_baja = client.delete("/usuarios/me", headers=headers)
    print(f"\n2. Respuesta DELETE /usuarios/me:")
    print(f"   HTTP Status: {res_baja.status_code} OK")
    print(f"   Payload devuelto: {json.dumps(res_baja.json(), indent=2)}")

    db.expire_all()
    user_despues = db.query(models.Usuario).filter(models.Usuario.id == user.id).first()
    print(f"\n3. Fila del Usuario en la BD DESPUÉS de la baja:")
    print(f"   ID: {user_despues.id}")
    print(f"   Nombre: {user_despues.nombre}")
    print(f"   Email: {user_despues.email}")
    print(f"   Contraseña hash: {user_despues.password_hash}")
    print(f"   Activo: {user_despues.activo}")
    print(f"   Fecha Baja: {user_despues.fecha_baja}")

    pedidos_despues = db.query(models.Pedido).filter(models.Pedido.usuario_id == user.id).count()
    print(f"\n4. Cantidad de pedidos asociados tras la baja: {pedidos_despues}")
    print(f"   ¿Pedidos preservados intactos? {'SÍ' if pedidos_despues == pedidos_antes else 'NO'}")

    res_auth_me = client.get("/auth/me", headers=headers)
    print(f"\n5. Intento de acceso a GET /auth/me con el mismo token previo a la baja:")
    print(f"   HTTP Status: {res_auth_me.status_code} (Esperado 401 UNAUTHORIZED)")
    print(f"   Detalle: {res_auth_me.json()}")

    print("=" * 70)
    db.close()

if __name__ == "__main__":
    demo_entregables()

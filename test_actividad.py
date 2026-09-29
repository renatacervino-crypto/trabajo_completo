import json
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.database import SessionLocal, engine
from app import models
from app.core.security import hash_password, create_access_token
from app.services.revocacion_service import generar_codigo

client = TestClient(app)

def test_full_actividad():
    db: Session = SessionLocal()
    print("\n" + "="*60)
    print("INICIANDO PRUEBAS DE LA ACTIVIDAD - DERECHOS DEL CONSUMIDOR")
    print("="*60)

    # -------------------------------------------------------------
    # PARTE 1: Modelos y generar_codigo()
    # -------------------------------------------------------------
    print("\n--- PARTE 1: Modelos y Código ---")
    codigo = generar_codigo()
    print(f"[OK] Código legal generado: {codigo}")
    assert codigo.startswith("ARR-"), "El código debe iniciar con ARR-"
    partes = codigo.split("-")
    assert len(partes) == 3, "El código debe tener formato ARR-YYYYMMDD-HEX"
    assert len(partes[1]) == 8, "La fecha debe tener 8 dígitos YYYYMMDD"
    assert len(partes[2]) == 6, "El sufijo aleatorio debe tener 6 caracteres hex"

    # -------------------------------------------------------------
    # Crear usuario de prueba
    # -------------------------------------------------------------
    email_test = f"consumidor_test_{int(datetime.now().timestamp())}@lelixir.com"
    user = models.Usuario(
        nombre="Consumidor Prueba",
        email=email_test,
        password_hash=hash_password("Pass1234!"),
        rol="customer",
        acepto_tratamiento=True,
        fecha_consentimiento=datetime.now(timezone.utc),
        activo=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Obtener token JWT
    token_data = {"sub": user.email, "rol": user.rol, "id": user.id}
    token = create_access_token(data=token_data)
    headers = {"Authorization": f"Bearer {token}"}

    # Obtener un producto
    producto = db.query(models.Producto).first()
    assert producto is not None, "Debe existir al menos un producto"
    stock_original = producto.stock
    print(f"Producto: {producto.nombre} | Stock inicial: {stock_original}")

    # -------------------------------------------------------------
    # PARTE 2: La Revocación (POST /pedidos/{id}/revocacion)
    # -------------------------------------------------------------
    print("\n--- PARTE 2: Creación de pedido y Revocación ---")
    # 1. Crear un pedido con 2 unidades
    res_pedido = client.post(
        "/pedidos",
        json={"items": [{"producto_id": producto.id, "cantidad": 2}]},
        headers=headers
    )
    assert res_pedido.status_code == 201, f"Error creando pedido: {res_pedido.text}"
    pedido_id = res_pedido.json()["id"]

    db.refresh(producto)
    stock_tras_compra = producto.stock
    print(f"Pedido #{pedido_id} creado con 2 unidades.")
    print(f"Stock antes de revocar: {stock_tras_compra} (debe ser {stock_original - 2})")
    assert stock_tras_compra == stock_original - 2, "El stock no se descontó correctamente"

    # 2. Revocar el pedido: POST /pedidos/{pedido_id}/revocacion
    res_revocacion = client.post(f"/pedidos/{pedido_id}/revocacion", headers=headers)
    print(f"Status revocación: {res_revocacion.status_code}")
    print(f"Respuesta revocación: {res_revocacion.json()}")
    assert res_revocacion.status_code == 201, f"Debe devolver 201: {res_revocacion.text}"
    rev_data = res_revocacion.json()
    assert "codigo" in rev_data and rev_data["codigo"].startswith("ARR-")
    assert rev_data["pedido_id"] == pedido_id

    # 3. Comprobar que el stock volvió a subir exactamente 2 unidades
    db.refresh(producto)
    stock_tras_revocacion = producto.stock
    print(f"Stock después de revocar: {stock_tras_revocacion} (debe ser {stock_original})")
    assert stock_tras_revocacion == stock_original, "El stock debe restituirse al valor previo a la compra"

    # 4. Intentar revocar el MISMO pedido por segunda vez -> Debe devolver 409
    res_segunda_rev = client.post(f"/pedidos/{pedido_id}/revocacion", headers=headers)
    print(f"Segunda revocación status: {res_segunda_rev.status_code} - {res_segunda_rev.json()}")
    assert res_segunda_rev.status_code == 409, "La segunda revocación debe devolver 409"
    db.refresh(producto)
    assert producto.stock == stock_tras_revocacion, "El stock NO puede volver a subir en una segunda revocación"

    # 5. Probar con un pedido de hace 15 días -> Debe devolver 409 fuera de plazo
    pedido_viejo = models.Pedido(
        usuario_id=user.id,
        estado="completado",
        total=100000.0,
        creado_en=datetime.now(timezone.utc) - timedelta(days=15)
    )
    db.add(pedido_viejo)
    db.commit()
    db.refresh(pedido_viejo)

    res_viejo = client.post(f"/pedidos/{pedido_viejo.id}/revocacion", headers=headers)
    print(f"Revocación pedido de hace 15 días status: {res_viejo.status_code} - {res_viejo.json()}")
    assert res_viejo.status_code == 409, "Revocación fuera de 10 días debe devolver 409"
    assert "10" in res_viejo.json()["detail"], "El mensaje de error debe indicar el plazo de 10 días"

    # 6. Probar revocación de pedido inexistente o ajeno -> Debe devolver 404
    res_ajeno = client.post("/pedidos/999999/revocacion", headers=headers)
    assert res_ajeno.status_code == 404, "Pedido no encontrado o ajeno debe devolver 404"

    # -------------------------------------------------------------
    # PARTE 3: Acceso y portabilidad (GET /usuarios/me/datos y /usuarios/me/exportar)
    # -------------------------------------------------------------
    print("\n--- PARTE 3: Acceso y Portabilidad ---")
    # 1. GET /usuarios/me/datos
    res_datos = client.get("/usuarios/me/datos", headers=headers)
    assert res_datos.status_code == 200, f"Error obteniendo datos: {res_datos.text}"
    datos_user = res_datos.json()
    print(f"Claves devueltas en /usuarios/me/datos: {list(datos_user.keys())}")
    assert "usuario" in datos_user
    assert "consentimiento" in datos_user
    assert "pedidos" in datos_user
    assert "solicitudes_revocacion" in datos_user
    assert len(datos_user["pedidos"]) >= 2
    assert len(datos_user["solicitudes_revocacion"]) >= 1
    print(f"[OK] Solicitudes de revocación registradas: {len(datos_user['solicitudes_revocacion'])}")

    # 2. GET /usuarios/me/exportar
    res_export = client.get("/usuarios/me/exportar", headers=headers)
    assert res_export.status_code == 200
    assert "content-disposition" in res_export.headers
    assert "attachment;" in res_export.headers["content-disposition"]
    print(f"[OK] Header Content-Disposition: {res_export.headers['content-disposition']}")
    datos_exportados = res_export.json()
    assert datos_exportados["usuario"]["email"] == email_test

    # -------------------------------------------------------------
    # PARTE 4: La baja de cuenta (DELETE /usuarios/me)
    # -------------------------------------------------------------
    print("\n--- PARTE 4: La Baja de Cuenta y Anonimización ---")
    # 1. DELETE /usuarios/me
    res_baja = client.delete("/usuarios/me", headers=headers)
    assert res_baja.status_code == 200, f"Error en baja: {res_baja.text}"
    print(f"Respuesta baja: {res_baja.json()}")

    # 2. Con el MISMO token intentar entrar a /auth/me -> Debe devolver 401
    res_me_bloqueado = client.get("/auth/me", headers=headers)
    print(f"Intento de acceso a /auth/me con mismo token status: {res_me_bloqueado.status_code}")
    assert res_me_bloqueado.status_code == 401, "Usuario dado de baja debe recibir 401"

    # 3. Verificar en la base de datos: fila anonimizada, activo=False, pedidos preservados
    db.expire_all()
    user_db = db.query(models.Usuario).filter(models.Usuario.id == user.id).first()
    assert user_db is not None, "La fila del usuario NO debe borrarse de la base de datos"
    assert user_db.activo is False, "El campo activo debe ser False"
    assert user_db.fecha_baja is not None, "Debe tener fecha_baja asignada"
    assert str(user.id) in user_db.email, "El email anonimizado debe incluir el id"
    assert user_db.password_hash == "ANONIMIZADO"
    print(f"[OK] Fila en BD: id={user_db.id}, nombre='{user_db.nombre}', email='{user_db.email}', activo={user_db.activo}, fecha_baja={user_db.fecha_baja}")

    # Verificar que los pedidos siguen existiendo con su relación al usuario
    pedidos_persistidos = db.query(models.Pedido).filter(models.Pedido.usuario_id == user.id).all()
    assert len(pedidos_persistidos) >= 2, "Los pedidos deben seguir existiendo intactos"
    print(f"[OK] Pedidos preservados en base de datos: {len(pedidos_persistidos)} pedidos intactos.")

    db.close()
    print("\n" + "="*60)
    print("¡TODAS LAS PRUEBAS DE LA ACTIVIDAD PASARON CON ÉXITO!")
    print("="*60 + "\n")

if __name__ == "__main__":
    test_full_actividad()

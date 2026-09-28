# 📋 Entrega de la Actividad — Clase 10: Subida de Imágenes con FormData y Validación
**Materia:** Aplicaciones Informáticas & DSI2 (2026)  
**Estudiante:** Renata Cervino  
**Repositorio GitHub:** [https://github.com/renatacervino-crypto/trabajo_completo](https://github.com/renatacervino-crypto/trabajo_completo)

---

## 🔗 1. Enlace para el Comentario Privado de Google Classroom
```text
https://github.com/renatacervino-crypto/trabajo_completo
```

---

## 💬 2. Respuesta a la Pregunta de Reflexión del Final (Copiar y pegar en Classroom)

### Pregunta: ¿Por qué cuando mandás un FormData NO tenés que ponerle el Content-Type al fetch?

> Cuando enviamos un `FormData`, el navegador utiliza el formato `multipart/form-data`. Para que el servidor pueda interpretar este tipo de petición, la cabecera `Content-Type` debe contener obligatoriamente un parámetro llamado **`boundary`** (un separador único alfanumérico generado en el instante por el navegador, por ejemplo: `multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`).
>
> Este `boundary` actúa como el delimitador que le indica al backend dónde comienza y termina cada archivo binario o dato enviado.
>
> Si nosotros escribimos manualmente `'Content-Type': 'multipart/form-data'`, omitimos el valor del `boundary`. Al llegar al servidor (FastAPI), este intenta decodificar la carga útil pero no encuentra los separadores de los campos, provocando que la subida falle con un error que no especifica la causa real. Al no colocarle cabecera `Content-Type`, el navegador se encarga automáticamente de calcular y adjuntar el `boundary` correspondiente.

---

## 📁 3. Archivos de Prueba Requeridos
En la raíz del proyecto se creó la carpeta **[`archivos_de_prueba/`](./archivos_de_prueba/)** con los elementos solicitados para testear:
1. `perfume_ambar_150kb.jpg`: Imagen válida de producto (< 2 MB).
2. `perfume_rosas_250kb.png`: Imagen válida de producto (< 2 MB).
3. `imagen_alta_resolucion_3mb.jpg`: Imagen grande (> 2 MB) para validar el rechazo por tamaño.
4. `documento_no_imagen.txt`: Archivo de texto plano para validar el rechazo de tipo MIME.
5. `especificacion.pdf`: Archivo PDF para validar el rechazo de tipo MIME.

---

## 📸 4. Cómo sacar las dos capturas para Classroom

Con la aplicación abierta (`http://localhost:5173/`):

### 🔹 Captura 1 — Vista Previa antes de subir y Validaciones (Panel Admin)
1. Entrá a: **`http://localhost:5173/admin`** (o iniciá sesión con `admin@lelixir.com` / clave: `admin1234`).
2. En la sección **"Subida de Imágenes de Producto (Clase 10)"**, seleccioná un archivo de prueba (por ejemplo `perfume_ambar_150kb.jpg`).
3. Sacá una captura de la pantalla mostrando la **Vista Previa interactiva** con el nombre del archivo, tipo MIME, peso formateado y el botón para subir.
   *(Opcional: Si seleccionás `imagen_alta_resolucion_3mb.jpg`, se verá la alerta en rojo del límite de 2 MB).*

### 🔹 Captura 2 — La imagen apareciendo en el catálogo de la tienda
1. Subí la imagen para cualquier producto desde el panel de administración.
2. Entrá a la tienda en: **`http://localhost:5173/`**.
3. Sacá una captura mostrando cómo el perfume ahora luce su fotografía real en la tarjeta del catálogo o en su ficha de detalle (`/producto`).

---

## 🚀 5. Checklist de Entrega Final
- [x] Código desarrollado, probado con cero errores y subido a GitHub (`origin/main`).
- [ ] Adjuntar las dos capturas en la tarea de Classroom (`Botón "Agregar o crear" -> "Archivo"`).
- [ ] Pegar el link del repositorio en el comentario privado de la tarea.
- [ ] Pegar la respuesta de reflexión sobre el `boundary` y `FormData` en el comentario privado.
- [ ] Tocar **"Entregar"**.

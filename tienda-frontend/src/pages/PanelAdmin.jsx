import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getProductos, subirImagenProducto, crearProducto } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PanelAdmin() {
  const { usuario } = useAuth();

  // Estados de catálogo y selección
  const [productos, setProductos] = useState([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');

  // Estados de selección de archivo e imagen
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [archivoInfo, setArchivoInfo] = useState(null);

  // Estados de validación y respuesta
  const [errorValidacion, setErrorValidacion] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar productos para el selector
  const cargarProductos = () => {
    setIsLoadingProductos(true);
    getProductos({ limit: 100 })
      .then((data) => {
        setProductos(Array.isArray(data) ? data : []);
        if (data && data.length > 0 && !productoSeleccionado) {
          setProductoSeleccionado(data[0].id.toString());
        }
      })
      .catch((err) => console.error('Error al cargar productos:', err))
      .finally(() => setIsLoadingProductos(false));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Manejo de selección de archivo con validación de tipo y tamaño (Clase 10)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setErrorValidacion(null);
    setMensajeExito(null);

    if (!file) {
      setArchivoSeleccionado(null);
      setVistaPrevia(null);
      setArchivoInfo(null);
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    const tamanioMB = (file.size / (1024 * 1024)).toFixed(2);
    const tamanioKB = (file.size / 1024).toFixed(1);

    setArchivoInfo({
      nombre: file.name,
      tipo: file.type || 'Desconocido',
      tamanioStr: file.size >= 1024 * 1024 ? `${tamanioMB} MB` : `${tamanioKB} KB`,
      bytes: file.size,
    });

    // 1. Validación de Tipo: Debe ser imagen
    if (!file.type.startsWith('image/')) {
      setErrorValidacion(
        `El archivo "${file.name}" no es una imagen válida (tipo detectado: ${file.type || 'no-imagen'}). Solo se permiten archivos JPEG, PNG, WebP o GIF.`
      );
      setArchivoSeleccionado(null);
      setVistaPrevia(null);
      return;
    }

    // 2. Validación de Tamaño: Máximo 2 MB
    if (file.size > MAX_SIZE) {
      setErrorValidacion(
        `El archivo "${file.name}" supera el límite de 2 MB (tamaño recibido: ${tamanioMB} MB). Por favor seleccioná una imagen optimizada de menor peso.`
      );
      setArchivoSeleccionado(null);
      setVistaPrevia(null);
      return;
    }

    // Archivo válido: Generar vista previa
    setArchivoSeleccionado(file);
    const previewUrl = URL.createObjectURL(file);
    setVistaPrevia(previewUrl);
  };

  // Envío del FormData (LA REGLA QUE MÁS SE OLVIDA: NO poner Content-Type manual)
  const handleSubirImagen = async (e) => {
    e.preventDefault();
    if (!productoSeleccionado) {
      setErrorValidacion('Por favor seleccioná el producto al que deseas asociar la imagen.');
      return;
    }

    if (!archivoSeleccionado) {
      setErrorValidacion('Por favor elegí una imagen válida de hasta 2 MB antes de subir.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorValidacion(null);
      setMensajeExito(null);

      // Llamada al backend pasando FormData SIN header Content-Type
      const productoActualizado = await subirImagenProducto(productoSeleccionado, archivoSeleccionado);

      setMensajeExito(
        `✓ ¡Imagen subida exitosamente! El producto "${productoActualizado.nombre}" ahora tiene su imagen asignada y visible en el catálogo.`
      );

      // Limpiar input y vista previa
      setArchivoSeleccionado(null);
      setVistaPrevia(null);
      setArchivoInfo(null);

      // Recargar catálogo para ver cambios
      cargarProductos();
    } catch (err) {
      setErrorValidacion(err.message || 'Error al subir la imagen al servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Encabezado */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-amber-800/40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-amber-400 font-semibold uppercase">
                Área Restringida · Rol: {usuario?.rol}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif mt-1">
                Panel de Administración & Catálogo Visual
              </h1>
              <p className="text-xs text-stone-300 mt-1 font-light">
                Gestión de productos, subida de imágenes con FormData (Clase 10) y seguridad del sistema.
              </p>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-white transition-colors"
            >
              ← Volver a la Tienda
            </Link>
          </div>
        </div>

        {/* Sección Principal: Subida de Imágenes con Vista Previa (Clase 10) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded bg-amber-100 text-amber-900 text-sm">📸</span>
            <h2 className="text-lg font-serif text-stone-900">
              Subida de Imágenes de Producto (Clase 10)
            </h2>
          </div>
          <p className="text-xs text-stone-600 mb-6 font-light leading-relaxed">
            Elegí una imagen de producto, comprobalo en la <strong>vista previa interactiva</strong> y subila mediante <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded text-xs">FormData</code>.  
            <strong> La regla que más se olvida:</strong> Al mandar el archivo, no se le especifica <code className="bg-amber-50 text-amber-900 px-1 py-0.5 rounded text-xs font-mono font-bold">Content-Type</code> al fetch; el navegador lo arma automáticamente junto con el boundary.
          </p>

          {/* Avisos y Notificaciones */}
          {errorValidacion && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <span className="font-bold text-sm">⚠️</span>
              <div>
                <p className="font-semibold">Error de validación:</p>
                <p className="mt-0.5">{errorValidacion}</p>
              </div>
            </div>
          )}

          {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <span className="font-bold text-sm">✓</span>
              <div>
                <p className="font-semibold">Operación exitosa:</p>
                <p className="mt-0.5">{mensajeExito}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubirImagen} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selector de Producto */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  1. Seleccionar Producto del Catálogo *
                </label>
                {isLoadingProductos ? (
                  <div className="text-xs text-stone-400 py-2">Cargando productos...</div>
                ) : (
                  <select
                    value={productoSeleccionado}
                    onChange={(e) => setProductoSeleccionado(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    required
                  >
                    <option value="" disabled>Elegí un perfume...</option>
                    {productos.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        #{prod.id} · {prod.nombre} (${prod.precio_final?.toLocaleString('es-AR')}) {prod.imagen_url ? '· [Ya tiene imagen]' : '· [Sin imagen]'}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-[11px] text-stone-500 mt-1.5">
                  La imagen subida reemplazará la fotografía actual en el catálogo público y en la ficha del perfume.
                </p>
              </div>

              {/* Selector de Archivo con Validaciones */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  2. Elegir Archivo de Imagen (Máximo 2 MB) *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="w-full text-xs text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 file:cursor-pointer cursor-pointer border border-stone-300 rounded-xl p-1 bg-stone-50"
                />
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5">
                  <span>Formatos: JPEG, PNG, WebP o GIF</span>
                  <span className="font-semibold text-stone-700">Límite: 2 MB</span>
                </div>
              </div>
            </div>

            {/* Vista Previa Interactiva (Clase 10) */}
            {vistaPrevia && archivoInfo && (
              <div className="border border-stone-200 rounded-xl p-5 bg-stone-50">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                  <span>👁️</span> Vista Previa Antes de Subir
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-36 h-36 rounded-lg bg-white border border-stone-300 overflow-hidden shadow-xs flex items-center justify-center">
                    <img
                      src={vistaPrevia}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-1.5 text-stone-700">
                    <p><strong>Archivo:</strong> <span className="font-mono text-stone-900">{archivoInfo.nombre}</span></p>
                    <p><strong>Tipo MIME:</strong> <span className="font-mono text-stone-900">{archivoInfo.tipo}</span></p>
                    <p>
                      <strong>Tamaño:</strong>{' '}
                      <span className={`font-semibold ${archivoInfo.bytes > 2 * 1024 * 1024 ? 'text-red-700' : 'text-emerald-700'}`}>
                        {archivoInfo.tamanioStr} (Válido: &lt; 2 MB)
                      </span>
                    </p>
                    <p className="text-[11px] text-stone-500 pt-1">
                      Todo listo para transferir con FormData al endpoint <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">POST /productos/{productoSeleccionado}/imagen</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Subida */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !archivoSeleccionado}
                className="w-full sm:w-auto px-8 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
              >
                {isSubmitting ? 'Subiendo imagen con FormData...' : 'Subir Imagen y Actualizar Tienda'}
              </button>
            </div>
          </form>
        </div>

        {/* Galería Visual de Productos con sus Imágenes Reales */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-serif text-stone-900">
                Imágenes Actuales en la Base de Datos
              </h2>
              <p className="text-xs text-stone-500 font-light">
                Visualización de las fotografías de autor asociadas a cada registro.
              </p>
            </div>
            <button
              onClick={cargarProductos}
              className="text-xs text-amber-800 hover:underline cursor-pointer"
            >
              Actualizar Galería
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos.map((prod) => (
              <div key={prod.id} className="border border-stone-200 rounded-xl p-3 bg-stone-50 flex flex-col justify-between">
                <div className="aspect-square bg-white rounded-lg overflow-hidden border border-stone-200 mb-2 flex items-center justify-center">
                  {prod.imagen_url ? (
                    <img
                      src={getFullImageUrl(prod.imagen_url)}
                      alt={prod.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-stone-400 text-center px-2">Sin imagen subida</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-serif font-medium text-stone-900 line-clamp-1">{prod.nombre}</h4>
                  <p className="text-[11px] font-mono text-stone-600 mt-0.5">${prod.precio_final?.toLocaleString('es-AR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

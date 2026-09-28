import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getProductos, subirImagenProducto, crearProducto } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PanelAdmin() {
  const { usuario } = useAuth();

  // Estados de catálogo
  const [productos, setProductos] = useState([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(false);

  // Estados para Cambiar Imagen a Producto Existente
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [archivoExistente, setArchivoExistente] = useState(null);
  const [vistaPreviaExistente, setVistaPreviaExistente] = useState(null);
  const [archivoInfoExistente, setArchivoInfoExistente] = useState(null);
  const [isSubmittingExistente, setIsSubmittingExistente] = useState(false);

  // Estados para Crear Nuevo Producto
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevasCuotas, setNuevasCuotas] = useState(6);
  const [nuevaGarantia, setNuevaGarantia] = useState(12);
  const [nuevoStock, setNuevoStock] = useState(10);
  const [archivoNuevo, setArchivoNuevo] = useState(null);
  const [vistaPreviaNuevo, setVistaPreviaNuevo] = useState(null);
  const [archivoInfoNuevo, setArchivoInfoNuevo] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Notificaciones y Errores
  const [errorValidacion, setErrorValidacion] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Cargar productos
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

  // Función reutilizable para validar archivo de imagen (< 2MB y tipo imagen)
  const validarArchivo = (file) => {
    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    const tamanioMB = (file.size / (1024 * 1024)).toFixed(2);
    const tamanioKB = (file.size / 1024).toFixed(1);

    const info = {
      nombre: file.name,
      tipo: file.type || 'Desconocido',
      tamanioStr: file.size >= 1024 * 1024 ? `${tamanioMB} MB` : `${tamanioKB} KB`,
      bytes: file.size,
    };

    if (!file.type.startsWith('image/')) {
      return {
        valido: false,
        error: `El archivo "${file.name}" no es una imagen válida (debe ser JPG, PNG, WebP o GIF).`,
        info,
      };
    }

    if (file.size > MAX_SIZE) {
      return {
        valido: false,
        error: `El archivo "${file.name}" supera el límite de 2 MB (pesa ${tamanioMB} MB).`,
        info,
      };
    }

    return { valido: true, error: null, info };
  };

  // Manejador archivo para producto existente
  const handleFileChangeExistente = (e) => {
    const file = e.target.files?.[0];
    setErrorValidacion(null);
    setMensajeExito(null);

    if (!file) {
      setArchivoExistente(null);
      setVistaPreviaExistente(null);
      setArchivoInfoExistente(null);
      return;
    }

    const { valido, error, info } = validarArchivo(file);
    setArchivoInfoExistente(info);

    if (!valido) {
      setErrorValidacion(error);
      setArchivoExistente(null);
      setVistaPreviaExistente(null);
      return;
    }

    setArchivoExistente(file);
    setVistaPreviaExistente(URL.createObjectURL(file));
  };

  // Manejador archivo para NUEVO producto
  const handleFileChangeNuevo = (e) => {
    const file = e.target.files?.[0];
    setErrorValidacion(null);
    setMensajeExito(null);

    if (!file) {
      setArchivoNuevo(null);
      setVistaPreviaNuevo(null);
      setArchivoInfoNuevo(null);
      return;
    }

    const { valido, error, info } = validarArchivo(file);
    setArchivoInfoNuevo(info);

    if (!valido) {
      setErrorValidacion(error);
      setArchivoNuevo(null);
      setVistaPreviaNuevo(null);
      return;
    }

    setArchivoNuevo(file);
    setVistaPreviaNuevo(URL.createObjectURL(file));
  };

  // Subir imagen a producto existente
  const handleSubirImagenExistente = async (e) => {
    e.preventDefault();
    if (!productoSeleccionado) {
      setErrorValidacion('Seleccioná el perfume al que deseas cambiar la imagen.');
      return;
    }
    if (!archivoExistente) {
      setErrorValidacion('Por favor elegí una imagen válida antes de subir.');
      return;
    }

    try {
      setIsSubmittingExistente(true);
      setErrorValidacion(null);
      setMensajeExito(null);

      const prodActualizado = await subirImagenProducto(productoSeleccionado, archivoExistente);
      setMensajeExito(`✓ ¡Imagen actualizada para "${prodActualizado.nombre}"! Ya está visible en la tienda.`);
      setArchivoExistente(null);
      setVistaPreviaExistente(null);
      setArchivoInfoExistente(null);
      cargarProductos();
    } catch (err) {
      setErrorValidacion(err.message || 'Error al subir la imagen.');
    } finally {
      setIsSubmittingExistente(false);
    }
  };

  // Crear NUEVO producto en el catálogo
  const handleCrearNuevoProducto = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      setErrorValidacion('El nombre del perfume es obligatorio.');
      return;
    }
    const precioNum = parseFloat(nuevoPrecio);
    if (!precioNum || precioNum <= 0) {
      setErrorValidacion('Ingresá un precio válido mayor a 0.');
      return;
    }

    try {
      setIsCreating(true);
      setErrorValidacion(null);
      setMensajeExito(null);

      // 1. Crear el producto en la base de datos
      const payload = {
        nombre: nuevoNombre.trim(),
        precio_final: precioNum,
        cuotas_cantidad: Number(nuevasCuotas) || 1,
        cuotas_valor: Math.round(precioNum / (Number(nuevasCuotas) || 1)),
        garantia_meses: Number(nuevaGarantia) || 12,
        stock: Number(nuevoStock) || 0,
        // Si no subió foto local, usamos una imagen de perfume de autor elegante por defecto
        imagen_url: archivoNuevo ? null : 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
      };

      const productoCreado = await crearProducto(payload);

      // 2. Si seleccionó un archivo local, subirlo con FormData
      if (archivoNuevo) {
        await subirImagenProducto(productoCreado.id, archivoNuevo);
      }

      setMensajeExito(`✓ ¡Perfume "${productoCreado.nombre}" creado exitosamente con su fotografía y publicado en el catálogo!`);

      // Limpiar formulario de nuevo producto
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevasCuotas(6);
      setNuevaGarantia(12);
      setNuevoStock(10);
      setArchivoNuevo(null);
      setVistaPreviaNuevo(null);
      setArchivoInfoNuevo(null);

      // Recargar catálogo
      cargarProductos();
    } catch (err) {
      setErrorValidacion(err.message || 'No se pudo crear el perfume.');
    } finally {
      setIsCreating(false);
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
                Panel de Administración & Catálogo
              </h1>
              <p className="text-xs text-stone-300 mt-1 font-light">
                Agregá nuevos perfumes, gestioná inventario y subí imágenes reales con FormData (Clase 10).
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

        {/* Notificaciones Globales */}
        {errorValidacion && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <span className="font-bold text-sm">⚠️</span>
            <div>
              <p className="font-semibold">Error:</p>
              <p className="mt-0.5">{errorValidacion}</p>
            </div>
          </div>
        )}

        {mensajeExito && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <span className="font-bold text-sm">✓</span>
            <div>
              <p className="font-semibold">¡Operación exitosa!</p>
              <p className="mt-0.5">{mensajeExito}</p>
            </div>
          </div>
        )}

        {/* SECCIÓN 1: AGREGAR NUEVO PERFUME AL CATÁLOGO */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-stone-900 text-amber-400 text-sm">✨</span>
            <h2 className="text-lg font-serif text-stone-900">
              Agregar Nuevo Perfume al Catálogo
            </h2>
          </div>
          <p className="text-xs text-stone-500 mb-6 font-light">
            Completá los datos técnicos de la fragancia y seleccioná su fotografía. Al guardar, aparecerá inmediatamente en la tienda pública.
          </p>

          <form onSubmit={handleCrearNuevoProducto} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Nombre de la Fragancia *
                </label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej: Bois de Santal Extrait 50ml"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Precio Final ($ ARS) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1000"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(e.target.value)}
                  placeholder="Ej: 295000"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Cuotas sin Interés
                </label>
                <select
                  value={nuevasCuotas}
                  onChange={(e) => setNuevasCuotas(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="1">1 pago</option>
                  <option value="3">3 cuotas sin interés</option>
                  <option value="6">6 cuotas sin interés</option>
                  <option value="12">12 cuotas sin interés</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Garantía (meses)
                </label>
                <input
                  type="number"
                  min="0"
                  value={nuevaGarantia}
                  onChange={(e) => setNuevaGarantia(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Stock Inicial (unidades)
                </label>
                <input
                  type="number"
                  min="0"
                  value={nuevoStock}
                  onChange={(e) => setNuevoStock(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 font-mono"
                />
              </div>
            </div>

            {/* Selector de Fotografía para el nuevo perfume */}
            <div className="border-t border-stone-100 pt-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Fotografía del Perfume (Máximo 2 MB - JPEG, PNG o WebP)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChangeNuevo}
                className="w-full text-xs text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 file:cursor-pointer cursor-pointer border border-stone-300 rounded-xl p-1 bg-stone-50"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Opcional: Si no seleccionás archivo, se le asignará una imagen editorial automática que podés cambiar luego.
              </p>
            </div>

            {/* Vista Previa del nuevo perfume */}
            {vistaPreviaNuevo && archivoInfoNuevo && (
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-white border border-stone-300 overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                  <img src={vistaPreviaNuevo} alt="Preview nuevo" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs space-y-1 text-stone-700">
                  <p className="font-semibold text-stone-900">Vista Previa de la Fotografía</p>
                  <p><strong>Archivo:</strong> {archivoInfoNuevo.nombre}</p>
                  <p><strong>Tamaño:</strong> <span className="text-emerald-700 font-semibold">{archivoInfoNuevo.tamanioStr} (&lt; 2 MB)</span></p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className="px-8 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
            >
              {isCreating ? 'Guardando y publicando...' : '➕ Guardar y Publicar Perfume'}
            </button>
          </form>
        </div>

        {/* SECCIÓN 2: CAMBIAR IMAGEN A PERFUME EXISTENTE (Clase 10) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded bg-amber-100 text-amber-900 text-sm">📸</span>
            <h2 className="text-lg font-serif text-stone-900">
              Cambiar Imagen a un Perfume Existente (Clase 10)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mb-6 font-light">
            Elegí un perfume del catálogo, visualizá la foto en la vista previa interactiva y subila mediante <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded text-xs">FormData</code> sin cabecera Content-Type manual.
          </p>

          <form onSubmit={handleSubirImagenExistente} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Seleccionar Perfume *
                </label>
                <select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                  required
                >
                  <option value="" disabled>Elegí un perfume...</option>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      #{prod.id} · {prod.nombre} (${prod.precio_final?.toLocaleString('es-AR')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Elegir Nueva Fotografía (Máximo 2 MB) *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChangeExistente}
                  className="w-full text-xs text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 file:cursor-pointer cursor-pointer border border-stone-300 rounded-xl p-1 bg-stone-50"
                />
              </div>
            </div>

            {vistaPreviaExistente && archivoInfoExistente && (
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-white border border-stone-300 overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                  <img src={vistaPreviaExistente} alt="Preview existente" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs space-y-1 text-stone-700">
                  <p className="font-semibold text-stone-900">Vista Previa de la Imagen</p>
                  <p><strong>Archivo:</strong> {archivoInfoExistente.nombre}</p>
                  <p><strong>Tipo MIME:</strong> {archivoInfoExistente.tipo}</p>
                  <p><strong>Tamaño:</strong> <span className="text-emerald-700 font-semibold">{archivoInfoExistente.tamanioStr} (&lt; 2 MB)</span></p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingExistente || !archivoExistente}
              className="px-8 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
            >
              {isSubmittingExistente ? 'Subiendo imagen...' : 'Subir y Actualizar Imagen'}
            </button>
          </form>
        </div>

        {/* SECCIÓN 3: GALERÍA DE PERFUMES EN LA BASE DE DATOS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-serif text-stone-900">
                Perfumes en el Catálogo ({productos.length} items)
              </h2>
              <p className="text-xs text-stone-500 font-light">
                Visualización en tiempo real de todos los productos almacenados en la base de datos.
              </p>
            </div>
            <button
              onClick={cargarProductos}
              className="text-xs text-amber-800 hover:underline cursor-pointer"
            >
              Actualizar Lista
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
                    <span className="text-[11px] text-stone-400 text-center px-2">Sin imagen</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-400">ID #{prod.id}</span>
                  <h4 className="text-xs font-serif font-medium text-stone-900 line-clamp-1">{prod.nombre}</h4>
                  <p className="text-xs font-mono font-bold text-amber-900 mt-0.5">${prod.precio_final?.toLocaleString('es-AR')}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Stock: {prod.stock ?? 0} u. · {prod.cuotas_cantidad} cuotas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDatosPersonales } from '../services/api';

export default function MisDatosPage() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuario) {
      setLoading(true);
      getDatosPersonales()
        .then((res) => setDatos(res))
        .catch((err) => setError(err.message || 'No se pudieron recuperar los datos.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [usuario]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      {/* Encabezado y Marco Legal */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 text-emerald-800 text-xs font-semibold tracking-wider uppercase mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          Ley N° 25.326 · Protección de los Datos Personales
        </div>

        <h1 className="text-3xl font-serif text-stone-900 mb-3">
          Derecho de Acceso a tus Datos Personales
        </h1>

        <p className="text-stone-600 leading-relaxed text-sm mb-4">
          Conforme al <strong>artículo 14 de la Ley N° 25.326 (Habeas Data)</strong>, el titular de los datos
          tiene la facultad de ejercer el derecho de acceso en forma gratuita a intervalos no inferiores a seis meses,
          salvo que se acredite un interés legítimo al efecto. En L'Élixir garantizamos la transparencia total e inmediata
          sobre toda la información almacenada en nuestros servidores.
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 flex flex-col gap-1.5">
          <p className="font-semibold text-stone-800">
            🏛️ Autoridad de Aplicación y Órgano de Control:
          </p>
          <p className="text-stone-600">
            La <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>, en su carácter de Órgano de Control
            de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación
            al incumplimiento de las normas sobre protección de datos personales.
          </p>
        </div>
      </div>

      {/* Contenido de la Ficha de Datos */}
      {!usuario ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
          <p className="text-stone-700 text-base mb-4">
            Para consultar la totalidad de los datos personales almacenados bajo tu titularidad, por favor iniciá sesión.
          </p>
          <Link
            to="/login"
            className="inline-block bg-stone-900 hover:bg-stone-800 text-amber-50 font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center text-stone-500">
          Cargando informe de titularidad de datos...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Ficha del Titular */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
            <h2 className="text-lg font-serif text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>Ficha Registral del Titular</span>
              <span className="text-xs font-sans font-normal bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                ID #{datos.titular.id}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="block text-xs uppercase text-stone-400 font-semibold mb-1">Nombre Completo</span>
                <span className="font-medium text-stone-800">{datos.titular.nombre}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="block text-xs uppercase text-stone-400 font-semibold mb-1">Correo Electrónico</span>
                <span className="font-medium text-stone-800">{datos.titular.email}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="block text-xs uppercase text-stone-400 font-semibold mb-1">Rol en Plataforma</span>
                <span className="font-medium text-stone-800 capitalize">{datos.titular.rol}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="block text-xs uppercase text-stone-400 font-semibold mb-1">Consentimiento Previo (Art. 5 Ley 25.326)</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Otorgado libre y expresamente al registrarse
                </span>
              </div>
            </div>
          </div>

          {/* Finalidad del Tratamiento y Seguridad */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
            <h2 className="text-lg font-serif text-stone-900 mb-4 pb-2 border-b border-stone-100">
              Finalidad y Medidas de Seguridad Aplicadas
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-stone-800 mb-1">Finalidad del Tratamiento de Datos:</h3>
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl">
                  {datos.finalidad_tratamiento}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-stone-800 mb-1">Medidas de Criptografía y Seguridad Técnica:</h3>
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl">
                  {datos.seguridad}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-stone-800 mb-1">Historial Transaccional:</h3>
                <p className="text-stone-600 bg-stone-50 p-3 rounded-xl">
                  Registros de pedidos asociados: <strong>{datos.cantidad_pedidos_registrados} orden(es)</strong>.
                </p>
              </div>
            </div>

            {/* Acciones de Habeas Data */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Descargar / Imprimir Informe
              </button>
              <Link
                to="/baja"
                className="px-5 py-2.5 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 rounded-xl text-sm font-medium transition-colors"
              >
                Ejercer Derecho de Supresión (Baja de cuenta)
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

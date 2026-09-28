import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { solicitarBaja } from '../services/api';

export default function BajaPage() {
  const { usuario, logout } = useAuth();
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmado) {
      setError('Por favor tildá la casilla confirmando que deseás la baja de tu cuenta.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await solicitarBaja({ motivo });
      setResultado(res);
      // Al tramitar la baja, cerramos la sesión del usuario
      setTimeout(() => {
        logout();
      }, 4000);
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud de baja.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      {/* Encabezado y Marco Legal */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 text-red-800 text-xs font-semibold tracking-wider uppercase mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          Derecho del Consumidor & Habeas Data
        </div>

        <h1 className="text-3xl font-serif text-stone-900 mb-3">
          Botón de Baja de Servicio y Cuenta
        </h1>

        <p className="text-stone-600 leading-relaxed text-sm mb-4">
          Conforme al <strong>artículo 10 ter de la Ley N° 24.240</strong> de Defensa del Consumidor,
          cuando un servicio o cuenta ha sido contratada o dada de alta por medios electrónicos, el consumidor
          tiene derecho a rescindirla o darse de baja exactamente por el mismo medio, con la misma facilidad
          y sin trabas burocráticas. Asimismo, el <strong>artículo 16 de la Ley N° 25.326</strong> ampara tu
          derecho a la supresión y cese del tratamiento de tus datos personales.
        </p>

        <div className="bg-red-50 border border-red-200/80 rounded-xl p-4 text-xs text-red-900 flex flex-col gap-1.5">
          <p className="font-semibold">
            📋 Constancia inmediata y sin costos:
          </p>
          <p>
            Al solicitar la rescisión, se te emitirá una <strong>constancia fehaciente con código de trámite</strong> de baja
            en cumplimiento del deber legal de información.
          </p>
        </div>
      </div>

      {/* Contenido: Si no está logueado / Comprobante / Formulario */}
      {!usuario && !resultado ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
          <p className="text-stone-700 text-base mb-4">
            Para solicitar la baja de tu cuenta o servicios activos, por favor iniciá sesión.
          </p>
          <Link
            to="/login"
            className="inline-block bg-stone-900 hover:bg-stone-800 text-amber-50 font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      ) : resultado ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-stone-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 text-emerald-700 font-semibold mb-3">
            <span className="text-2xl">✓</span>
            <span className="text-lg">Baja de Cuenta y Servicios Procesada Exitosamente</span>
          </div>

          <p className="text-stone-700 text-sm mb-6">
            Tu solicitud fue asentada conforme a las disposiciones del <strong>Art. 10 ter Ley 24.240</strong> y <strong>Art. 16 Ley 25.326</strong>.
            A continuación se detalla tu comprobante identificador:
          </p>

          <div className="bg-white border border-emerald-100 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-xs uppercase text-stone-500 font-medium">Código de Trámite de Baja:</span>
              <span className="font-mono text-base font-bold text-red-800 bg-red-100 px-3 py-1 rounded-md">
                {resultado.codigo_tramite}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-sm">
              <span className="text-stone-500">Estado de la Operación:</span>
              <span className="font-semibold text-stone-800">Cuenta dada de baja / Cese de tratamiento</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-sm">
              <span className="text-stone-500">Fecha y Hora:</span>
              <span className="text-stone-800">{new Date(resultado.fecha).toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500">Costo del trámite:</span>
              <span className="font-semibold text-emerald-700">Gratuito</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Imprimir / Guardar Constancia de Baja
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 text-stone-600 hover:text-stone-900 text-sm font-medium"
            >
              Ir a la Página Principal
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
          <h2 className="text-lg font-serif text-stone-900 mb-4 pb-2 border-b border-stone-100">
            Confirmación de Rescisión y Supresión de Cuenta
          </h2>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6 p-4 bg-stone-50 rounded-xl text-stone-700 text-sm space-y-1">
            <p><strong>Titular:</strong> {usuario.nombre}</p>
            <p><strong>Email registrado:</strong> {usuario.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-2">
                Motivo de la rescisión (Opcional)
              </label>
              <textarea
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Podés dejarnos tus comentarios para mejorar el servicio (no obligatorio)."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="check-baja"
                checked={confirmado}
                onChange={(e) => setConfirmado(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-700 rounded border-stone-300 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="check-baja" className="text-sm text-stone-700 leading-snug cursor-pointer select-none">
                Confirmo que deseo ejercer el derecho de baja de mi cuenta y rescisión de los servicios, solicitando la supresión de mis datos conforme a la <strong>Ley 24.240 (Art. 10 ter)</strong> y la <strong>Ley 25.326 (Art. 16)</strong>.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !confirmado}
                className="w-full sm:w-auto px-8 py-3 bg-red-700 hover:bg-red-800 disabled:bg-stone-300 text-white rounded-xl font-medium transition-colors shadow-sm text-sm"
              >
                {loading ? 'Procesando baja...' : 'Confirmar Baja Definitiva de Cuenta'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

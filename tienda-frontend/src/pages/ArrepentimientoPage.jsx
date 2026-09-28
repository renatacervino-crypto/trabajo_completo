import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMisPedidos, solicitarArrepentimiento } from '../services/api';

export default function ArrepentimientoPage() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuario) {
      setCargandoPedidos(true);
      getMisPedidos()
        .then((data) => {
          setPedidos(data || []);
          if (data && data.length > 0) {
            // Seleccionar el primer pedido que no esté revocado por defecto
            const activo = data.find((p) => p.estado !== 'revocado');
            if (activo) setPedidoSeleccionado(activo.id.toString());
            else setPedidoSeleccionado(data[0].id.toString());
          }
        })
        .catch(() => {})
        .finally(() => setCargandoPedidos(false));
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pedidoSeleccionado) {
      setError('Por favor seleccioná o indicá el número de pedido a revocar.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await solicitarArrepentimiento({
        pedidoId: pedidoSeleccionado,
        motivo,
      });
      setResultado(res);
      // Actualizar estado del pedido en la lista local
      setPedidos((prev) =>
        prev.map((p) => (p.id === Number(pedidoSeleccionado) ? { ...p, estado: 'revocado' } : p))
      );
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la revocación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      {/* Encabezado y Marco Legal Vigente */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 text-amber-800 text-xs font-semibold tracking-wider uppercase mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse"></span>
          Derecho del Consumidor · Marco Regulatorio Vigente
        </div>

        <h1 className="text-3xl font-serif text-stone-900 mb-3">
          Botón de Arrepentimiento
        </h1>

        <p className="text-stone-600 leading-relaxed text-sm mb-4">
          Conforme al <strong>artículo 34 de la Ley N° 24.240</strong> de Defensa del Consumidor,
          la <strong>Disposición 954/2025</strong> (exigible desde el 4 de noviembre de 2025, la cual
          derogó la Resolución 424/2020) y la complementaria <strong>Disposición 3/2026</strong>,
          tenés derecho a revocar la aceptación del producto contratado o adquirido dentro del plazo
          de <strong>diez (10) días corridos</strong> contados a partir de la fecha de entrega o
          celebración del contrato.
        </p>

        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex flex-col gap-1.5">
          <p className="font-semibold flex items-center gap-2">
            <span>⚖️</span> Garantías legales obligatorias del trámite:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-amber-800">
            <li>La revocación <strong>no genera costo alguno</strong> para el consumidor ni penalidad.</li>
            <li>Los gastos de devolución o retiro del producto corren por cuenta de la empresa.</li>
            <li>Al confirmar la solicitud, el sistema emite de manera inmediata un <strong>código identificador único de trámite</strong>.</li>
          </ul>
        </div>
      </div>

      {/* Contenido principal: Formulario o Comprobante */}
      {!usuario ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
          <p className="text-stone-700 text-base mb-4">
            Para gestionar la revocación directa de tus compras asociadas, por favor iniciá sesión en tu cuenta.
          </p>
          <Link
            to="/login"
            className="inline-block bg-stone-900 hover:bg-stone-800 text-amber-50 font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      ) : resultado ? (
        /* Constancia de Revocación Emitida */
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-stone-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 text-emerald-700 font-semibold mb-3">
            <span className="text-2xl">✓</span>
            <span className="text-lg">Solicitud de Arrepentimiento Registrada Exitosamente</span>
          </div>

          <p className="text-stone-700 text-sm mb-6">
            Tu revocación fue asentada de acuerdo con la <strong>Disposición 954/2025</strong> y el <strong>Art. 34 de la Ley 24.240</strong>.
            Guardá tu comprobante para cualquier seguimiento.
          </p>

          <div className="bg-white border border-emerald-100 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-xs uppercase text-stone-500 font-medium">Código de Trámite:</span>
              <span className="font-mono text-base font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                {resultado.codigo_tramite}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-sm">
              <span className="text-stone-500">N° de Pedido Revocado:</span>
              <span className="font-semibold text-stone-800">#{resultado.pedido_id}</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-sm">
              <span className="text-stone-500">Fecha y Hora de Emisión:</span>
              <span className="text-stone-800">{new Date(resultado.fecha).toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500">Costo de Logística Inversa:</span>
              <span className="font-semibold text-emerald-700">$0.00 (Sin cargo conforme a la ley)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Imprimir / Guardar Constancia
            </button>
            <button
              onClick={() => {
                setResultado(null);
                setMotivo('');
              }}
              className="px-5 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-sm font-medium transition-colors"
            >
              Gestionar otra revocación
            </button>
            <Link
              to="/mi-cuenta"
              className="px-5 py-2.5 text-stone-600 hover:text-stone-900 text-sm font-medium"
            >
              Volver a Mi Cuenta
            </Link>
          </div>
        </div>
      ) : (
        /* Formulario Reglamentario de Revocación */
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
          <h2 className="text-lg font-serif text-stone-900 mb-4 pb-2 border-b border-stone-100">
            Formulario de Revocación de Compra
          </h2>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-2">
                Seleccioná el Pedido a Revocar *
              </label>
              {cargandoPedidos ? (
                <div className="text-stone-400 text-sm py-2">Cargando tus pedidos...</div>
              ) : pedidos.length === 0 ? (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-sm">
                  No tenés compras registradas en esta cuenta para revocar.
                </div>
              ) : (
                <select
                  value={pedidoSeleccionado}
                  onChange={(e) => setPedidoSeleccionado(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
                  required
                >
                  <option value="" disabled>Selecciona un pedido...</option>
                  {pedidos.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={p.estado === 'revocado'}
                    >
                      Pedido #{p.id} · Total: ${p.total.toLocaleString('es-AR')} · Estado: {p.estado} {p.estado === 'revocado' ? '(Ya Revocado)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-2">
                Motivo del arrepentimiento (Opcional - La ley no exige justificar)
              </label>
              <textarea
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Podés indicarnos el motivo si lo deseás para ayudarnos a mejorar, pero no es obligatorio según el Art. 34 de la Ley 24.240."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || pedidos.length === 0}
                className="w-full sm:w-auto px-8 py-3 bg-red-700 hover:bg-red-800 disabled:bg-stone-300 text-white rounded-xl font-medium transition-colors shadow-sm text-sm"
              >
                {loading ? 'Procesando revocación...' : 'Confirmar Arrepentimiento de Compra'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

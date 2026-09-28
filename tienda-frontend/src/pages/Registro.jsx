import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar, login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    acepto_tratamiento: false,
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  // El botón está deshabilitado hasta que se marque el consentimiento explícito y se completen los campos
  const isSubmitDisabled =
    !form.acepto_tratamiento ||
    !form.nombre.trim() ||
    !form.email.trim() ||
    form.password.length < 8 ||
    isLoading;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await registrar(form);
      // Tras registrarse, se inicia sesión automáticamente con las credenciales
      const tokens = await login(form.email, form.password);
      iniciarSesion(tokens);
      navigate('/');
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-700 font-semibold">
          L'Élixir · Haute Parfumerie
        </span>
        <h2 className="mt-2 text-3xl font-serif text-stone-900">
          Crear una cuenta
        </h2>
        <p className="mt-2 text-xs text-stone-600 font-light">
          Registrate para gestionar tus pedidos y acceder a lanzamientos exclusivos.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-stone-200 rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <span className="font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                required
                value={form.nombre}
                onChange={cambiar}
                placeholder="Ej: Ana Gómez"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-amber-700 bg-stone-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={cambiar}
                placeholder="ana@ejemplo.com"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-amber-700 bg-stone-50"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Contraseña (mínimo 8 caracteres)
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={form.password}
                onChange={cambiar}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-amber-700 bg-stone-50"
              />
              <p className="mt-1 text-[11px] text-stone-500">
                La contraseña se almacenará cifrada con bcrypt según las mejores prácticas de seguridad.
              </p>
            </div>

            {/* Consentimiento Ley 25.326 */}
            <div className="pt-2 border-t border-stone-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acepto_tratamiento"
                  checked={form.acepto_tratamiento}
                  onChange={cambiar}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-700 cursor-pointer"
                />
                <span className="text-xs text-stone-700 leading-relaxed font-light">
                  Acepto que se guarden mi nombre y mi correo para gestionar mi cuenta y mis pedidos.
                  Puedo verlos o pedir que los borren (<strong className="font-semibold text-stone-800">Ley 25.326</strong>).
                </span>
              </label>
            </div>

            {/* Botón de Enviar */}
            <div>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full py-2.5 px-4 rounded text-xs uppercase tracking-widest font-semibold transition-all ${
                  isSubmitDisabled
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200'
                    : 'bg-stone-900 text-white hover:bg-amber-800 cursor-pointer shadow-sm'
                }`}
              >
                {isLoading ? 'Creando cuenta…' : 'Registrarme'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500">
            ¿Ya tenés una cuenta?{' '}
            <Link to="/login" className="text-amber-800 font-semibold hover:underline">
              Iniciá sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

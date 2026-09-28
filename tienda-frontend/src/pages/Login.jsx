import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function cambiar(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // El login envía form-urlencoded con username=email y password
      const tokens = await login(form.email, form.password);
      iniciarSesion(tokens);
      navigate('/');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
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
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-xs text-stone-600 font-light">
          Ingresá a tu cuenta para consultar tus pedidos y fragancias guardadas.
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
                placeholder="tu@email.com"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-amber-700 bg-stone-50"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={cambiar}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-amber-700 bg-stone-50"
              />
            </div>

            {/* Botón de Enviar */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !form.email || !form.password}
                className="w-full py-2.5 px-4 rounded text-xs uppercase tracking-widest font-semibold bg-stone-900 text-white hover:bg-amber-800 disabled:bg-stone-300 transition-all cursor-pointer shadow-sm"
              >
                {isLoading ? 'Iniciando sesión…' : 'Ingresar'}
              </button>
            </div>
          </form>

          {/* Accesos rápidos de prueba para la corrección */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">Usuarios de demostración disponibles:</p>
            <p>• <strong>Cliente:</strong> cliente@lelixir.com / cliente1234</p>
            <p>• <strong>Admin:</strong> admin@lelixir.com / admin1234</p>
          </div>

          <div className="mt-6 text-center text-xs text-stone-500">
            ¿No tenés cuenta aún?{' '}
            <Link to="/registro" className="text-amber-800 font-semibold hover:underline">
              Crear una cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

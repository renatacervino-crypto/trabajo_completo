import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      {/* Barra Reglamentaria Destacada de Defensa de las y los Consumidores */}
      <div className="bg-stone-950 border-b border-stone-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-stone-300 text-center md:text-left">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-sm">⚖️</span>
            <div>
              <p className="font-semibold text-stone-100 text-xs tracking-wide">
                Defensa de las y los Consumidores · Marco Legal Vigente
              </p>
              <p className="text-[11px] text-stone-400">
                Disposición 954/2025 y Disp. 3/2026 (Derogatoria de Res. 424/2020) · Ley 24.240 · Ley 25.326
              </p>
            </div>
          </div>

          {/* Enlaces Reglamentarios Obligatorios */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/arrepentimiento"
              id="boton-arrepentimiento-footer"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-sm flex items-center gap-1.5 text-xs hover:scale-105"
            >
              <span>↩️</span>
              <span>Botón de arrepentimiento</span>
            </Link>

            <Link
              to="/baja"
              id="boton-baja-footer"
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors border border-stone-700 flex items-center gap-1.5 text-xs"
            >
              <span>🚫</span>
              <span>Botón de baja</span>
            </Link>

            <Link
              to="/mis-datos"
              id="boton-mis-datos-footer"
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors border border-stone-700 flex items-center gap-1.5 text-xs"
            >
              <span>🛡️</span>
              <span>Protección de datos (Ley 25.326)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pie de página institucional */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="font-serif tracking-widest text-stone-100 font-semibold uppercase text-sm">
            L'Élixir · Paris
          </span>
          <p className="text-[11px] text-stone-400 mt-1">
            Haute Parfumerie · Aplicaciones Informáticas & DSI2 · Proyecto Integrador 2026
          </p>
        </div>

        <div className="text-[11px] text-stone-400 text-center sm:text-right space-y-1">
          <p>Órgano de Control Ley 25.326: Agencia de Acceso a la Información Pública (AAIP)</p>
          <p className="text-stone-500">Autenticación OAuth2 + JWT · Contraseñas Hasheadas con Bcrypt</p>
        </div>
      </div>
    </footer>
  );
}

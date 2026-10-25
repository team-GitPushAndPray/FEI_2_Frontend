// Semáforo climático de una máquina: indica si se puede operar con el clima
// actual en su ubicación. La regla (viento > 40 km/h o clima severo) está en
// services/clima.js; acá solo se muestra el resultado.

// Íconos de Heroicons (outline), para que el estado no dependa solo del color.
const ESTADOS = {
  VERDE: {
    texto: 'Clima óptimo',
    clases: 'bg-green-700 text-white',
    icono: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  ROJO: {
    texto: 'Alerta climática',
    clases: 'bg-red-600 text-white',
    icono:
      'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  },
  SIN_DATOS: {
    texto: 'Clima no disponible',
    clases: 'border border-tinta/15 bg-tinta/5 text-tinta/70',
    icono:
      'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z',
  },
}

// Placeholder con la forma del badge, para que la tarjeta no salte al cargar.
export function SemaforoEsqueleto() {
  return <div className="mt-2 h-5 w-28 rounded-full bg-tinta/15" />
}

// Lo que se muestra al lado del badge: el motivo de la alerta ("Viento de
// 52 km/h", "tormenta eléctrica") o, si está todo bien, el viento actual.
function detalle({ estado, motivo, vientoKmh }) {
  if (estado === 'ROJO') return motivo
  if (estado === 'VERDE' && vientoKmh != null) return `Viento ${vientoKmh} km/h`
  return null
}

export default function SemaforoClima({ clima, cargando }) {
  if (cargando) {
    return (
      <div className="animate-pulse" aria-hidden="true">
        <SemaforoEsqueleto />
      </div>
    )
  }

  const { texto, clases, icono } = ESTADOS[clima.estado]
  const textoDetalle = detalle(clima)

  return (
    <div
      className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1"
      // Sin datos, el motivo explica por qué (ej. falta la API key).
      title={clima.estado === 'SIN_DATOS' ? clima.motivo : clima.descripcion}
    >
      <span
        className={`font-display inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase ${clases}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icono} />
        </svg>
        {texto}
      </span>

      {textoDetalle && (
        <span className="text-xs text-tinta/70 first-letter:uppercase">
          {textoDetalle}
        </span>
      )}
    </div>
  )
}

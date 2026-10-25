// Envuelve una grilla de contenido traído de la API y muestra, según el caso,
// esqueletos mientras carga, un panel de error con reintento, un panel de
// lista vacía o el contenido. `className` son las clases de la grilla y
// `textoVacio` explica por qué no hay nada (ej. un filtro sin resultados).
import { SemaforoEsqueleto } from './SemaforoClima'

// Tarjeta con la misma forma que MaquinaCard, para que no salte el layout.
export function TarjetaEsqueleto() {
  return (
    <div className="vidrio flex animate-pulse flex-col overflow-hidden rounded-xl">
      <div className="aspect-3/2 w-full bg-tinta/10" />
      <div className="px-4 py-3">
        <div className="my-1 h-5 w-3/4 rounded bg-tinta/15" />
        <SemaforoEsqueleto />
      </div>
    </div>
  )
}

function mensajeError(error) {
  if (error?.status === 0) return error.message
  if (error?.status === 403) {
    return 'El servidor no permite consultar las máquinas en este momento.'
  }
  if (error?.status >= 500) {
    return 'El servidor tuvo un problema. Probá de nuevo en unos minutos.'
  }
  return 'Ocurrió un error inesperado al consultar las máquinas.'
}

function Panel({ icono, titulo, children, ...props }) {
  return (
    <div
      className="vidrio mx-auto flex max-w-xl flex-col items-center rounded-xl px-6 py-10 text-center"
      {...props}
    >
      <div className="vidrio-rojo esquina-cortada mb-4 p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icono} />
        </svg>
      </div>
      <h3 className="text-xl font-bold">{titulo}</h3>
      {children}
    </div>
  )
}

export default function EstadoCarga({
  cargando,
  error,
  vacio,
  onReintentar,
  className,
  textoVacio = 'Todavía no hay máquinas publicadas en el catálogo.',
  cantidadEsqueletos = 6,
  Esqueleto = TarjetaEsqueleto,
  children,
}) {
  if (cargando) {
    return (
      <section className={className} aria-busy="true">
        <span className="sr-only" role="status">
          Cargando máquinas…
        </span>
        {Array.from({ length: cantidadEsqueletos }, (_, i) => (
          <Esqueleto key={i} />
        ))}
      </section>
    )
  }

  if (error) {
    return (
      <div className="px-5 pb-10">
        <Panel
          role="alert"
          titulo="No pudimos cargar las máquinas"
          icono="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        >
          <p className="pt-2 text-sm text-tinta/70">{mensajeError(error)}</p>
          {onReintentar && (
            <button
              type="button"
              onClick={onReintentar}
              className="boton-primario mt-6 px-8 py-2.5"
            >
              Reintentar
            </button>
          )}
        </Panel>
      </div>
    )
  }

  if (vacio) {
    return (
      <div className="px-5 pb-10">
        <Panel
          titulo="No hay máquinas para mostrar"
          icono="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        >
          <p className="pt-2 text-sm text-tinta/70">{textoVacio}</p>
        </Panel>
      </div>
    )
  }

  return <section className={className}>{children}</section>
}

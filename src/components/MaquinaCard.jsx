// Markup adaptado de tailwind-ecommerce (MIT, Bogdan Bulakh):
// https://github.com/bbulakh/tailwind-ecommerce
import BotonFavorito from './BotonFavorito'

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export default function MaquinaCard({ maquina }) {
  const { tipo, nombre, imagenes, precioAlquiler, precioEnLetras } = maquina
  const portada = imagenes[0]

  return (
    <article className="vidrio flex flex-col overflow-hidden rounded-xl transition duration-300 hover:-translate-y-1 hover:border-acento/50">
      <div className="relative flex">
        {portada ? (
          <img
            className="aspect-3/2 w-full object-cover"
            src={portada.src}
            alt={portada.alt}
            loading="lazy"
          />
        ) : (
          <div className="aspect-3/2 w-full bg-tinta/5" />
        )}

        <div className="vidrio-rojo esquina-cortada absolute top-2 left-2 flex items-center justify-center">
          <p className="font-display px-3 py-1 text-xs font-semibold tracking-wider uppercase">
            {tipo}
          </p>
        </div>

        <BotonFavorito maquina={maquina} className="absolute top-2 right-2" />
      </div>

      <div className="px-4 py-3">
        <p className="font-display text-lg font-semibold tracking-wide uppercase">
          {nombre}
        </p>

        {precioAlquiler != null && (
          <p className="mt-1 font-semibold text-acento">
            {formatoPrecio.format(precioAlquiler)}
            <span className="text-sm font-normal text-tinta/60"> / día</span>
          </p>
        )}

        {/* Precio en letras (para contratos), generado por el SOAP del backend */}
        {precioEnLetras && (
          <p className="mt-0.5 text-xs text-tinta/60 italic first-letter:uppercase">
            {precioEnLetras}
          </p>
        )}
      </div>
    </article>
  )
}

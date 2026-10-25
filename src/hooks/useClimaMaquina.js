import { useEffect, useState } from 'react'
import { getClimaMaquina } from '../services/clima'

// OpenWeatherMap actualiza sus datos cada ~10 minutos: antes de eso una
// consulta nueva devolvería lo mismo.
const VIGENCIA_MS = 10 * 60 * 1000

// Consultas por coordenadas, compartidas entre tarjetas y páginas: al pasar de
// Home al Catálogo, o con dos máquinas en el mismo lugar, no se repite la
// petición. Se guarda la promesa para compartir también las que siguen en curso.
const cache = new Map()

function consultarClima(latitud, longitud) {
  const clave = `${latitud},${longitud}`
  const guardada = cache.get(clave)
  if (guardada && Date.now() - guardada.hora < VIGENCIA_MS) {
    return guardada.promesa
  }

  const promesa = getClimaMaquina(latitud, longitud).then((clima) => {
    // Un fallo (red caída, timeout) no se guarda, para reintentar en la
    // próxima carga.
    if (clima.estado === 'SIN_DATOS' && cache.get(clave)?.promesa === promesa) {
      cache.delete(clave)
    }
    return clima
  })
  cache.set(clave, { promesa, hora: Date.now() })
  return promesa
}

// Clima actual en las coordenadas de una máquina (ver services/clima.js).
// `clima` es null mientras se consulta; el servicio nunca lanza, así que no
// hay estado de error: si falla, `clima.estado` es 'SIN_DATOS'.
export default function useClimaMaquina(latitud, longitud) {
  const clave = `${latitud},${longitud}`
  // Se guarda junto con las coordenadas que lo originaron: si cambian, el
  // clima anterior deja de valer y se vuelve a mostrar cargando.
  const [resultado, setResultado] = useState({ clave: null, clima: null })

  useEffect(() => {
    let ignorar = false

    consultarClima(latitud, longitud).then((clima) => {
      if (!ignorar) setResultado({ clave: `${latitud},${longitud}`, clima })
    })

    return () => {
      ignorar = true
    }
  }, [latitud, longitud])

  const cargando = resultado.clave !== clave
  return { clima: cargando ? null : resultado.clima, cargando }
}

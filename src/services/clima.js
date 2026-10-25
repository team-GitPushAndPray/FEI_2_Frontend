// Semáforo climático: consulta el clima actual de OpenWeatherMap en las
// coordenadas de una máquina y decide si se puede operar.
// No pasa por `api()`: ese cliente es solo para Strapi y le agregaría a la
// petición la cookie y el jwt del usuario, que no tienen que salir del backend.
const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
// Como toda variable VITE_, la key queda visible en el bundle del navegador.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// Si la API no responde en este tiempo se da por caída.
const TIMEOUT_MS = 8000

// Por encima de esta velocidad de viento se suspende la operación.
const VIENTO_MAXIMO_KMH = 40

// Códigos de `weather[].id` que suspenden la operación aunque no haya viento:
// https://openweathermap.org/weather-conditions
function esClimaSevero(id) {
  return (
    (id >= 200 && id < 300) || // tormenta eléctrica
    [502, 503, 504, 511].includes(id) || // lluvia muy fuerte, extrema o helada
    [602, 622].includes(id) || // nieve intensa
    [771, 781].includes(id) // turbonada, tornado
  )
}

const sinDatos = (motivo) => ({
  estado: 'SIN_DATOS',
  motivo,
  vientoKmh: null,
  descripcion: null,
})

// Devuelve `{ estado, motivo, vientoKmh, descripcion }`, con `estado`:
// - 'ROJO': operación suspendida (viento mayor a 40 km/h o clima severo).
// - 'VERDE': operable.
// - 'SIN_DATOS': no se pudo consultar el clima.
// Nunca lanza: si la API del clima falla, la app sigue funcionando y la UI
// muestra el estado neutral.
export async function getClimaMaquina(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return sinDatos('La máquina no tiene coordenadas')
  }
  if (!API_KEY) {
    return sinDatos('Falta configurar VITE_OPENWEATHER_API_KEY en el archivo .env')
  }

  const query = new URLSearchParams({
    lat,
    lon,
    appid: API_KEY,
    units: 'metric',
    lang: 'es',
  })

  let data
  try {
    const res = await fetch(`${API_URL}?${query}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) return sinDatos(`El servicio del clima respondió ${res.status}`)
    data = await res.json()
  } catch {
    // Sin respuesta: red caída, timeout, o la respuesta no era JSON.
    return sinDatos('No se pudo conectar con el servicio del clima')
  }

  // Con units=metric el viento viene en m/s. Se compara sin redondear y se
  // redondea solo para mostrar.
  const viento = (data.wind?.speed ?? 0) * 3.6
  const vientoKmh = Math.round(viento)
  const severo = (data.weather ?? []).find((w) => esClimaSevero(w.id))
  const descripcion = data.weather?.[0]?.description ?? null

  if (viento > VIENTO_MAXIMO_KMH) {
    return {
      estado: 'ROJO',
      motivo: `Viento de ${vientoKmh} km/h`,
      vientoKmh,
      descripcion,
    }
  }
  if (severo) {
    return {
      estado: 'ROJO',
      motivo: severo.description,
      vientoKmh,
      descripcion: severo.description,
    }
  }
  return { estado: 'VERDE', motivo: 'Clima apto', vientoKmh, descripcion }
}

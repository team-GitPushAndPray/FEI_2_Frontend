// Acceso a /api/maquinas. Las páginas no reciben la respuesta cruda de Strapi
// sino máquinas ya mapeadas a lo que necesita la UI.
import { api, urlMedia } from './api'

// Pasa una máquina de Strapi 5 (campos planos, sin `attributes`) al formato de
// la UI. `id` e `interno` son de uso interno: se descartan acá para que no
// lleguen a ningún componente.
function mapearMaquina({
  documentId,
  tipo,
  marca,
  modelo,
  imagen,
  precio_alquiler,
  precio_en_letras,
  latitud,
  longitud,
}) {
  const nombre = `${marca} ${modelo}`

  return {
    documentId,
    tipo,
    marca,
    modelo,
    nombre,
    // `precio_en_letras` lo genera el backend vía el servicio SOAP de
    // DataAccess (sin precio manda "Monto no especificado"). Los campos que
    // falten quedan en null y la UI no los muestra.
    precioAlquiler: precio_alquiler ?? null,
    precioEnLetras: precio_en_letras || null,
    latitud: latitud ?? null,
    longitud: longitud ?? null,
    // Para listados alcanza con el formato `small`; no siempre existe (depende
    // del tamaño original), así que si falta se usa la imagen original.
    imagenes: (imagen ?? []).map((img) => ({
      src: urlMedia(img.formats?.small?.url ?? img.url),
      alt: img.alternativeText || `${tipo} ${nombre}`,
    })),
  }
}

export async function getMaquinas({ sort = 'marca:asc' } = {}) {
  const query = new URLSearchParams({ populate: 'imagen', sort })
  const { data, meta } = await api(`/maquinas?${query}`)
  return { data: data.map(mapearMaquina), meta }
}

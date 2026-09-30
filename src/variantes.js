// Variantes de Terrane: una descripción común que usan svgDe (string) y los componentes de React.
export const VARIANTES = ['relleno', 'relieve', 'contorno', 'duotono', 'insignia', 'trama', 'isometrica']

export const VERSION = '__VERSION__'

export function relieveUrlDe(entrada) {
  return `https://cdn.jsdelivr.net/npm/terrane@${VERSION}/relieve/${entrada.categoria}/${entrada.slug}.webp`
}

const ESPACIO = 0.8
const LINEA = 0.18
const CIRCULO = 'M0.5 12A11.5 11.5 0 1 0 23.5 12A11.5 11.5 0 1 0 0.5 12Z'

function hash(texto) {
  let h = 5381
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export function limpiarId(id) {
  return String(id).replace(/[^A-Za-z0-9_-]/g, '')
}

function escalar(d, k) {
  return d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (_, x, y) => {
    const f = (v) => Math.round((12 + (Number(v) - 12) * k) * 100) / 100
    return `${f(x)} ${f(y)}`
  })
}

const ISO_ALTO = 0.9
const ISO_VISTA = 0.75
const ISO_GIRO = (6 * Math.PI) / 180
const ISO_COS = Math.cos(ISO_GIRO)
const ISO_SIN = Math.sin(ISO_GIRO)
const ISO_TIERRA = '#6b5843'
const ISO_SOMBRA = 0.3
const isometrias = new Map()

function anillos(d) {
  const lista = []
  let actual = null
  for (const trozo of d.match(/[MLZ][^MLZ]*/gi) ?? []) {
    const c = trozo[0].toUpperCase()
    const n = (trozo.slice(1).match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number)
    if (c === 'Z') {
      actual = null
      continue
    }
    if (c === 'M' || !actual) lista.push((actual = []))
    for (let i = 0; i + 1 < n.length; i += 2) actual.push([n[i], n[i + 1]])
  }
  return lista.filter((a) => a.length > 2)
}

function adentro([x, y], anillo) {
  let dentro = false
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
    const [xi, yi] = anillo[i]
    const [xj, yj] = anillo[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro
  }
  return dentro
}

function area(anillo) {
  let a = 0
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) a += anillo[j][0] * anillo[i][1] - anillo[i][0] * anillo[j][1]
  return a
}

function isometria(d) {
  if (isometrias.has(d)) return isometrias.get(d)
  const planos = anillos(d).map((a) => a.map(([x, y]) => [x * ISO_COS - y * ISO_SIN, (x * ISO_SIN + y * ISO_COS) * ISO_VISTA]))
  const tiras = []
  planos.forEach((anillo, i) => {
    const hueco = planos.reduce((n, otro, j) => n + (j !== i && adentro(anillo[0], otro) ? 1 : 0), 0) % 2
    const signo = (area(anillo) > 0 ? 1 : -1) * (hueco ? -1 : 1)
    const n = anillo.length
    const frente = anillo.map((a, k) => signo * (anillo[(k + 1) % n][0] - a[0]) < 0)
    const inicio = frente.findIndex((f, k) => f && !frente[(k + n - 1) % n])
    if (inicio < 0) {
      if (frente[0]) tiras.push([...anillo, anillo[0]])
      return
    }
    let tira = null
    for (let paso = 0; paso <= n; paso++) {
      const k = (inicio + paso) % n
      if (frente[k] && paso < n) {
        if (!tira) tiras.push((tira = [anillo[k]]))
        tira.push(anillo[(k + 1) % n])
      } else tira = null
    }
  })
  const todos = planos.flat()
  const xs = todos.map((p) => p[0])
  const ys = todos.map((p) => p[1])
  const x0 = Math.min(...xs)
  const y0 = Math.min(...ys)
  const ancho = Math.max(...xs) - x0
  const alto = Math.max(...ys) - y0
  const k = Math.min(22 / ancho, (22 - ISO_ALTO) / alto)
  const dx = 12 - (ancho * k) / 2
  const dy = 12 - (alto * k + ISO_ALTO) / 2
  const r = (v) => Math.round(v * 100) / 100
  const f4 = (v) => Math.round(v * 10000) / 10000
  const punto = ([x, y], h = 0) => `${r(dx + (x - x0) * k)} ${r(dy + (y - y0) * k + h)}`
  const trazo = (puntos) => 'M' + puntos.map((p) => punto(p)).join('L') + 'Z'
  const resultado = {
    cara: planos.map(trazo).join(''),
    matriz: `matrix(${f4(k * ISO_COS)} ${f4(k * ISO_VISTA * ISO_SIN)} ${f4(-k * ISO_SIN)} ${f4(k * ISO_VISTA * ISO_COS)} ${f4(dx - x0 * k)} ${f4(dy - y0 * k)})`,
    canto: tiras
      .map((t) => (t[0][0] > t[t.length - 1][0] ? [...t].reverse() : t))
      .map((t) => 'M' + [...t.map((p) => punto(p)), ...[...t].reverse().map((p) => punto(p, ISO_ALTO))].join('L') + 'Z')
      .join(''),
  }
  if (isometrias.size > 600) isometrias.clear()
  isometrias.set(d, resultado)
  return resultado
}

// Por debajo de este tamaño se dibuja d16, la versión simplificada del ícono.
export const TAMANO_OPTICO = 20

export function formaPara(entrada, size) {
  return typeof size === 'number' && size < TAMANO_OPTICO && entrada.d16 ? { ...entrada, d: entrada.d16 } : entrada
}

// Los símbolos no tienen terreno: relieve e isométrica caen a relleno.
const SIN_TERRENO = new Set(['simbolos'])

export function partes(entrada, opciones = {}) {
  const { color = 'currentColor' } = opciones
  const pedida = opciones.variante ?? 'relleno'
  const variante = SIN_TERRENO.has(entrada.categoria) && (pedida === 'relieve' || pedida === 'isometrica') ? 'relleno' : pedida
  const grosor = Math.min(3, Math.max(0.5, opciones.grosor ?? 1.5))
  const d = entrada.d
  const id = 't' + limpiarId(opciones.id ?? hash(d + variante))
  const lleno = { d, fill: color, fillRule: 'evenodd' }
  const recorte = ['clipPath', { id: id + 'c' }, [['path', { d, clipRule: 'evenodd' }]]]
  const borde = (px) => ['path', {
    d, fill: 'none', stroke: color, strokeWidth: px * 2, strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke', clipPath: `url(#${id}c)`,
  }]
  switch (variante) {
    case 'contorno':
      return [recorte, borde(grosor)]
    case 'duotono':
      return [recorte, ['path', { ...lleno, fillOpacity: 0.22 }], borde(grosor)]
    case 'relieve':
      return [['image', { href: opciones.relieveUrl ?? relieveUrlDe(entrada), width: 24, height: 24, preserveAspectRatio: 'none' }]]
    case 'insignia':
      return [['path', { d: CIRCULO + escalar(d, 0.72), fill: color, fillRule: 'evenodd' }]]
    case 'trama':
      return [
        recorte,
        ['pattern', { id: id + 'p', width: ESPACIO, height: ESPACIO, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, [
          ['rect', { width: LINEA, height: ESPACIO, fill: color }],
        ]],
        ['rect', { width: 24, height: 24, fill: `url(#${id}p)`, clipPath: `url(#${id}c)` }],
        borde(1),
      ]
    case 'isometrica': {
      const { cara, canto, matriz } = isometria(d)
      return [
        ['path', { d: canto, fill: ISO_TIERRA }],
        ['clipPath', { id: id + 'k' }, [['path', { d: canto }]]],
        ['g', { clipPath: `url(#${id}k)` }, [['path', { d: canto, fill: '#000', fillOpacity: ISO_SOMBRA, transform: `translate(0 ${ISO_ALTO / 2})` }]]],
        ['path', { d: cara, fill: ISO_TIERRA, fillRule: 'evenodd' }],
        ['image', { href: opciones.relieveUrl ?? relieveUrlDe(entrada), width: 24, height: 24, preserveAspectRatio: 'none', transform: matriz }],
      ]
    }
    default:
      return [['path', lleno]]
  }
}

const CAMEL = new Set(['viewBox', 'preserveAspectRatio', 'patternUnits', 'patternTransform'])
const kebab = (k) => (CAMEL.has(k) ? k : k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()))
const escapar = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const atributos = (a) => Object.entries(a).map(([k, v]) => ` ${kebab(k)}="${escapar(v)}"`).join('')

function aTexto([tag, a, hijos]) {
  return hijos ? `<${tag}${atributos(a)}>${hijos.map(aTexto).join('')}</${tag}>` : `<${tag}${atributos(a)}/>`
}

export function svgDe(entrada, { variante = 'relleno', color = 'currentColor', size = 24, grosor = 1.5, id, relieveUrl } = {}) {
  const interior = partes(formaPara(entrada, typeof size === 'string' && /^\d+(\.\d+)?$/.test(size) ? Number(size) : size), { variante, color, grosor, id, relieveUrl }).map(aTexto).join('')
  const medida = size == null ? '' : ` width="${escapar(size)}" height="${escapar(size)}"`
  return `<svg xmlns="http://www.w3.org/2000/svg"${medida} viewBox="0 0 24 24" fill="none">${interior}</svg>`
}

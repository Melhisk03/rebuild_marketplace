/**
 * Wikimedia Commons'tan aday görsel arar ve inceleme için kontak baskısı üretir.
 *
 * Build adımı DEĞİL — görseller bir kez seçilip `tools/sources/` altına
 * indirildikten sonra bu script'e gerek kalmaz. Yeni bir slot eklenecekse
 * `SLOTS` içine sorgusunu yaz, çalıştır, çıkan sayfadan beğendiğini
 * `tools/selection.json` içine geç.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const UA = 'rebuild-marketplace-demo/1.0 (webkivanc@gmail.com)'
const OUT = 'tools/candidates'

/** Her slot için birkaç alternatif sorgu; ilk sorgu az sonuç verirse diğerleri
 *  havuzu besliyor. Commons araması kelimeleri VE'liyor, uzun cümleler boş
 *  dönüyor — sorgular bu yüzden iki-üç kelime. */
const SLOTS = {
  hero: ['construction site crane', 'steel structure building construction'],
  sustainability: ['scrap metal yard', 'construction demolition recycling'],
  cimento: ['cement bags', 'cement sacks pallet'],
  demir: ['rebar', 'reinforcing steel bars'],
  blok: ['concrete blocks', 'concrete masonry units'],
  seramik: ['ceramic tiles stack', 'floor tiles pallet'],
  yalitim: ['insulation panels', 'polystyrene insulation boards'],
  profil: ['steel profiles', 'square steel tubes'],
  pencere: ['window frames stacked', 'pvc windows construction'],
  kereste: ['lumber stack', 'timber planks stacked'],
  boru: ['plastic pipes stacked', 'polypropylene pipes'],
  kablo: ['electric cable drum', 'power cable coil'],
  kapi: ['wooden doors stacked', 'door leaves warehouse'],
  sac: ['steel sheets stacked', 'steel coil warehouse'],
}

async function search(query, limit = 24) {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${query}`,
      gsrlimit: String(limit),
      gsrnamespace: '6',
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '480',
      format: 'json',
    })
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  const data = await res.json()
  const pages = Object.values(data?.query?.pages ?? {})
  return pages
    .map((p) => {
      const info = p.imageinfo?.[0]
      if (!info) return null
      return {
        title: p.title.replace(/^File:/, ''),
        width: info.width,
        height: info.height,
        thumb: info.thumburl,
        full: info.url,
        licence: info.extmetadata?.LicenseShortName?.value ?? '?',
        artist: (info.extmetadata?.Artist?.value ?? '').replace(/<[^>]+>/g, '').trim(),
      }
    })
    .filter(Boolean)
    // Yatay ve yeterince büyük olanlar; portre kadrajlar bu tasarıma girmiyor.
    .filter((c) => c.width >= 1000 && c.width / c.height >= 1.1)
}

const results = {}
for (const [slot, queries] of Object.entries(SLOTS)) {
  const seen = new Set()
  const pool = []
  for (const q of queries) {
    for (const c of await search(q)) {
      if (seen.has(c.title)) continue
      seen.add(c.title)
      pool.push(c)
    }
  }
  results[slot] = pool
  console.log(`${slot.padEnd(16)} ${pool.length} aday`)
}

await mkdir(OUT, { recursive: true })
await writeFile(join(OUT, 'candidates.json'), JSON.stringify(results, null, 2))
console.log(`\n-> ${OUT}/candidates.json`)

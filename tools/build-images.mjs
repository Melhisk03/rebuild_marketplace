/**
 * Fotoğraf hattı — `npm run images`.
 *
 * Build adımı DEĞİL, elle çalıştırılır. Çıktılar `public/images/` altında
 * repoda durur; Vercel derlemesi sırasında ağdan görsel indirmek hem
 * yavaş hem kırılgan olurdu.
 *
 * NEDEN GRADASYON: kaynaklar farklı fotoğrafçılardan, farklı ışıkta ve
 * farklı doygunlukta geliyor. Hepsi AYNI eğriden geçince tek bir çekimden
 * çıkmış gibi duruyor — hibrit görsel dilde fotoğrafları üretilmiş
 * plakalarla aynı ailede tutan şey bu. Değerler ölçülerek ayarlandı:
 * hedef ortalama parlaklık ~52-64/255, doygunluk düşük ama sıfır değil.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const UA = 'rebuild-marketplace-demo/1.0 (webkivanc@gmail.com)'
const SRC = 'tools/sources'
const OUT = 'public/images'

/**
 * Seçilen kaynaklar. `credit` alanı lisans gereği; çıktı olarak
 * `public/images/CREDITS.md` üretiliyor.
 */
/**
 * Ortak duotone rengi. Soğuk çelik grisi: paletin nötrleri (#7d848c,
 * #22262d) bu tarafta duruyor ve fotoğraflar soğuyunca amber vurgu
 * daha da öne çıkıyor. `duotone` payı 0-1 arası; 1 tam monotone olur.
 */
const TINT = '#8f99a5'

const SOURCES = [
  {
    key: 'hero',
    file: 'hero.tif',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/STACKED_LUMBER_-_NARA_-_542866.tif',
    credit: {
      title: 'Stacked Lumber',
      author: 'Tomas Sennett — U.S. National Archives (NARA)',
      licence: 'Kamu malı (public domain)',
      source: 'https://commons.wikimedia.org/wiki/File:STACKED_LUMBER_-_NARA_-_542866.tif',
    },
    // Kaynak bir slayt taraması: dört kenarda ince siyah çerçeve var.
    // %3 içeri alınca çerçeve tamamen çıkıyor, kadraj neredeyse hiç
    // kaybetmiyor.
    inset: 0.03,
    // Hero en koyu olan; üzerine mega tipografi biniyor. Kaynak ağır
    // macenta/sepya kaymış (Kodachrome), duotone payı bu yüzden yüksek.
    grade: { saturation: 0.26, brightness: 1.02, contrast: 1.12, lift: -8, duotone: 0.62 },
    variants: [
      { name: 'hero.webp', width: 1920, height: 1080 },
      { name: 'hero-1280.webp', width: 1280, height: 720 },
    ],
  },
  {
    key: 'sustainability',
    file: 'sustainability.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Steel_frame_structure.jpg',
    credit: {
      title: 'Steel frame structure',
      author: 'Wikideas1',
      licence: 'CC0',
      source: 'https://commons.wikimedia.org/wiki/File:Steel_frame_structure.jpg',
    },
    grade: { saturation: 0.3, brightness: 0.42, contrast: 1.14, lift: -8, duotone: 0.55 },
    variants: [
      { name: 'sustainability.webp', width: 1920, height: 1080 },
      { name: 'sustainability-1280.webp', width: 1280, height: 720 },
    ],
  },
  {
    key: 'featured',
    file: 'featured.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/A_bunch_of_rebar_up_close.jpg',
    credit: {
      title: 'A bunch of rebar up close',
      author: 'W.carter',
      licence: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:A_bunch_of_rebar_up_close.jpg',
    },
    // Öne çıkan ürün görseli: malzemenin kendisi okunmalı, o yüzden
    // hem bir tık aydınlık hem de duotone payı en düşük olan.
    grade: { saturation: 0.4, brightness: 0.74, contrast: 1.1, lift: -5, duotone: 0.34 },
    variants: [
      { name: 'featured.webp', width: 1200, height: 900 },
      { name: 'featured-800.webp', width: 800, height: 600 },
    ],
  },
]

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function download(source) {
  const path = join(SRC, source.file)
  if (await exists(path)) {
    console.log(`  önbellek  ${source.file}`)
    return path
  }
  console.log(`  indiriliyor  ${source.file}`)
  const res = await fetch(source.url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${source.url} -> HTTP ${res.status}`)
  await writeFile(path, Buffer.from(await res.arrayBuffer()))
  return path
}

async function process(source, path) {
  const { saturation, brightness, contrast, lift, duotone } = source.grade

  // Tarama çerçevesi gibi kenar artıklarını kırp.
  const meta = await sharp(path, { limitInputPixels: false }).metadata()
  const inset = source.inset ?? 0
  const extract = inset
    ? {
        left: Math.round(meta.width * inset),
        top: Math.round(meta.height * inset),
        width: Math.round(meta.width * (1 - inset * 2)),
        height: Math.round(meta.height * (1 - inset * 2)),
      }
    : null

  for (const variant of source.variants) {
    let pipeline = sharp(path, { limitInputPixels: false })
    if (extract) pipeline = pipeline.extract(extract)

    const graded = await pipeline
      // `position: 'centre'` bilinçli: sharp'ın 'attention' kırpması
      // kontrastı en yüksek bölgeye kilitleniyor ve kompozisyonu
      // (ufuk çizgisi, koyu ön plan) bozuyor.
      .resize(variant.width, variant.height, { fit: 'cover', position: 'centre' })
      .modulate({ saturation, brightness })
      // Kontrast modulate'ten SONRA, yoksa parlaklık düşüşü onu da eziyor.
      .linear(contrast, lift)
      .toBuffer()

    // Kısmi duotone: tam monotone versiyonu, alfası kısılmış hâlde
    // aslın üzerine biniyor. Farklı fotoğrafçılardan gelen üç görsel
    // böylece tek bir paletin içine çekiliyor ama malzemenin kendi
    // rengi tamamen kaybolmuyor.
    const veil = await sharp(graded).removeAlpha().tint(TINT).ensureAlpha(duotone).png().toBuffer()

    const buffer = await sharp(graded)
      .composite([{ input: veil, blend: 'over' }])
      .webp({ quality: 82, effort: 5 })
      .toBuffer()

    await writeFile(join(OUT, variant.name), buffer)

    const { channels } = await sharp(buffer).stats()
    const luma = (channels[0].mean * 0.299 + channels[1].mean * 0.587 + channels[2].mean * 0.114).toFixed(1)
    console.log(`  ${variant.name.padEnd(26)} ${(buffer.length / 1024).toFixed(0).padStart(4)} KB   ort. parlaklık ${luma}`)
  }
}

await mkdir(SRC, { recursive: true })
await mkdir(OUT, { recursive: true })

for (const source of SOURCES) {
  console.log(`\n[${source.key}]`)
  await process(source, await download(source))
}

const credits = [
  '# Görsel Kaynakları',
  '',
  'Sitedeki fotoğraflar Wikimedia Commons kaynaklıdır ve tasarıma uyum için',
  'renk gradasyonundan geçirilmiştir. Lisans gereği atıf zorunludur.',
  '',
  ...SOURCES.flatMap((s) => [
    `## ${s.variants[0].name}`,
    `- **Eser:** ${s.credit.title}`,
    `- **Yapan:** ${s.credit.author}`,
    `- **Lisans:** ${s.credit.licence}`,
    `- **Kaynak:** ${s.credit.source}`,
    '',
  ]),
  'Ürün kartlarındaki malzeme plakaları fotoğraf değildir; `components/MaterialPlate.vue`',
  'içinde üretilen vektör grafiklerdir ve telif kısıtı taşımaz.',
  '',
].join('\n')

await writeFile(join(OUT, 'CREDITS.md'), credits)
console.log('\n-> public/images/CREDITS.md')

/**
 * Demo verisinin iç tutarlılığını denetler — `node tools/check-data.mjs`.
 *
 * İnşaat sektöründen bir müşteri demoyu incelerken ilk olarak birim fiyat
 * ile toplamı çarpar. Tutmayan tek bir satır bütün demonun güvenilirliğini
 * bozuyor, o yüzden bu kontrol elle göz gezdirmeye bırakılmadı.
 */
import { readFile } from 'node:fs/promises'

const source = await readFile('data/products.ts', 'utf8')

/** Basit ayrıştırma: TS'i çalıştırmadan alan alan okur. */
function fields(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*('([^']*)'|"([^"]*)"|([-\\d.]+))`))
  if (!match) return undefined
  return match[2] ?? match[3] ?? Number(match[4])
}

const blocks = source.split(/\n  \{\n/).slice(1)
const problems = []
const ids = new Set()
const plates = new Set()

for (const block of blocks) {
  const id = fields(block, 'id')
  if (!id) continue

  const quantity = fields(block, 'quantity')
  const unitPrice = fields(block, 'unitPrice')
  const price = fields(block, 'price')
  const plate = fields(block, 'plate')

  if (ids.has(id)) problems.push(`${id}: kimlik tekrar ediyor`)
  ids.add(id)
  plates.add(plate)

  const expected = Math.round(quantity * unitPrice)
  if (Math.abs(expected - price) > 1) {
    problems.push(`${id}: ${quantity} × ${unitPrice} = ${expected}, ama price ${price}`)
  }

  const specCount = (block.match(/\{ label:/g) ?? []).length
  if (specCount < 6) problems.push(`${id}: yalnızca ${specCount} teknik özellik (en az 6 olmalı)`)
}

// Her plaka anahtarının MaterialPlate içinde karşılığı var mı?
const plateComponent = await readFile('components/MaterialPlate.vue', 'utf8')
for (const plate of plates) {
  if (!plateComponent.includes(`'${plate}'`)) {
    problems.push(`plaka "${plate}" MaterialPlate.vue içinde tanımlı değil — varsayılan desen çizilir`)
  }
}

console.log(`${ids.size} ürün, ${plates.size} plaka türü denetlendi.`)
if (problems.length) {
  console.error('\nSORUN:')
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log('Tutarsızlık yok.')

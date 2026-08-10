/**
 * Biçimlendirme yardımcıları. Nuxt `utils/` altını otomatik import eder.
 *
 * Intl nesneleri modül düzeyinde bir kez kuruluyor: `toLocaleString`'i
 * döngü içinde çağırmak her seferinde yeni bir formatter yaratıyor ve
 * on dört kartlık bir grid'de ölçülebilir maliyet çıkarıyor.
 */
const tryFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

const decimalFormatter = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 })

export function formatPrice(value: number): string {
  return tryFormatter.format(value)
}

/** Miktar: 2.5 -> "2,5", 1850 -> "1.850" */
export function formatQuantity(value: number): string {
  return decimalFormatter.format(value)
}

/**
 * İlan tarihini "x gün önce" biçimine çevirir.
 *
 * Referans tarih dışarıdan verilebiliyor — demoda mock veri sabit
 * tarihler taşıdığı için testlerde ve SSR/istemci karşılaştırmasında
 * `new Date()` kullanmak hydration uyuşmazlığı üretiyordu.
 */
export function relativeDay(iso: string, now: Date = new Date()): string {
  const then = new Date(`${iso}T00:00:00`)
  const days = Math.max(0, Math.round((now.getTime() - then.getTime()) / 86_400_000))
  if (days === 0) return 'Bugün'
  if (days === 1) return 'Dün'
  if (days < 30) return `${days} gün önce`
  const months = Math.round(days / 30)
  return `${months} ay önce`
}

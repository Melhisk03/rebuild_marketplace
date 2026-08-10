import { PRODUCTS, type Product, type ProductCondition } from '~/data/products'
import type { CategoryId } from '~/data/categories'

export type SortKey = 'yeni' | 'fiyat-artan' | 'fiyat-azalan' | 'miktar'

export interface PriceBand {
  id: string
  label: string
  min: number
  max: number
}

export const PRICE_BANDS: PriceBand[] = [
  { id: 'all', label: 'Tüm fiyatlar', min: 0, max: Infinity },
  { id: 'a', label: '0 – 30.000 ₺', min: 0, max: 30_000 },
  { id: 'b', label: '30.000 – 75.000 ₺', min: 30_000, max: 75_000 },
  { id: 'c', label: '75.000 ₺ ve üzeri', min: 75_000, max: Infinity },
]

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'yeni', label: 'En yeni ilanlar' },
  { id: 'fiyat-artan', label: 'Fiyat: düşükten yükseğe' },
  { id: 'fiyat-azalan', label: 'Fiyat: yüksekten düşüğe' },
  { id: 'miktar', label: 'Miktarı en yüksek' },
]

/**
 * Türkçe arama için katlama.
 *
 * `toLowerCase('tr')` tek başına yetmiyor: kullanıcı "cimento" yazdığında
 * "çimento" bulunmalı, "profil" ararken "PROFİL" eşleşmeli. Aksanlar
 * ASCII karşılığına indiriliyor, böylece arama bağışlayıcı oluyor.
 */
const FOLD: Record<string, string> = {
  ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o',
  ş: 's', Ş: 's', ü: 'u', Ü: 'u', â: 'a', î: 'i', û: 'u',
}

export function fold(input: string): string {
  return input.replace(/[çÇğĞıİöÖşŞüÜâîû]/g, (c) => FOLD[c] ?? c).toLowerCase()
}

/**
 * Filtre durumu PAYLAŞIMLI.
 *
 * `ref` yerine `useState`: kategori kartlarına tıklandığında grid'in
 * filtresi değişmeli, ama iki bileşen kardeş. Modül düzeyinde bir
 * singleton SSR'da istekler arasında sızacağı için kullanılamaz —
 * `useState` Nuxt'ın istek başına yalıtılmış deposu.
 */
export function useProductFilters() {
  const query = useState('filter:query', () => '')
  const category = useState<CategoryId | 'all'>('filter:category', () => 'all')
  const city = useState<string>('filter:city', () => 'all')
  const condition = useState<ProductCondition | 'all'>('filter:condition', () => 'all')
  const band = useState<string>('filter:band', () => 'all')
  const sort = useState<SortKey>('filter:sort', () => 'yeni')

  /**
   * Aranabilir metin ürün başına bir kez kuruluyor. Her tuş vuruşunda
   * on dört ürünün teknik özelliklerini yeniden birleştirmek gereksiz.
   */
  const haystacks = new WeakMap<Product, string>()
  function haystack(product: Product): string {
    let value = haystacks.get(product)
    if (value === undefined) {
      value = fold(
        [
          product.name,
          product.headline,
          product.city,
          product.district,
          product.unit,
          product.seller.name,
          ...product.specs.map((s) => `${s.label} ${s.value}`),
        ].join(' '),
      )
      haystacks.set(product, value)
    }
    return value
  }

  const results = computed<Product[]>(() => {
    const needle = fold(query.value.trim())
    const range = PRICE_BANDS.find((b) => b.id === band.value) ?? PRICE_BANDS[0]!

    const filtered = PRODUCTS.filter((product) => {
      if (category.value !== 'all' && product.categoryId !== category.value) return false
      if (city.value !== 'all' && product.city !== city.value) return false
      if (condition.value !== 'all' && product.condition !== condition.value) return false
      if (product.price < range.min || product.price > range.max) return false
      if (needle && !haystack(product).includes(needle)) return false
      return true
    })

    // Sıralama kopya üzerinde: `PRODUCTS` sabit veri, yerinde sıralamak
    // kaynağı kalıcı olarak bozar ve sonraki filtrede sıra karışır.
    return [...filtered].sort((a, b) => {
      switch (sort.value) {
        case 'fiyat-artan':
          return a.price - b.price
        case 'fiyat-azalan':
          return b.price - a.price
        case 'miktar':
          return b.quantity - a.quantity
        default:
          return b.listedAt.localeCompare(a.listedAt)
      }
    })
  })

  const activeCount = computed(
    () =>
      (query.value.trim() ? 1 : 0) +
      (category.value !== 'all' ? 1 : 0) +
      (city.value !== 'all' ? 1 : 0) +
      (condition.value !== 'all' ? 1 : 0) +
      (band.value !== 'all' ? 1 : 0),
  )

  function reset() {
    query.value = ''
    category.value = 'all'
    city.value = 'all'
    condition.value = 'all'
    band.value = 'all'
    sort.value = 'yeni'
  }

  return { query, category, city, condition, band, sort, results, activeCount, reset }
}

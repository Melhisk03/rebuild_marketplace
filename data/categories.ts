/**
 * Kategori tanımları.
 *
 * `icon` alanı Lucide bileşen adıdır ve `CategoryCard` içinde statik bir
 * eşlemeden çözülür — dinamik `import()` ile çözmek tüm ikon paketini
 * bundle'a sokuyor.
 *
 * `plate`, kategorinin ürün kartlarında kullanacağı üretilmiş malzeme
 * plakasının anahtarı (bkz. `components/MaterialPlate.vue`).
 */
export type CategoryId =
  | 'cimento'
  | 'demir'
  | 'tugla'
  | 'ahsap'
  | 'seramik'
  | 'izolasyon'
  | 'elektrik'
  | 'tesisat'
  | 'dograma'
  | 'diger'

export interface Category {
  id: CategoryId
  name: string
  /** Kategori kartındaki kısa tanım */
  blurb: string
  icon: string
}

export const CATEGORIES: Category[] = [
  { id: 'cimento', name: 'Çimento', blurb: 'Portland, katkılı ve harç grubu', icon: 'Package' },
  { id: 'demir', name: 'Demir & Çelik', blurb: 'Nervürlü demir, profil, sac', icon: 'Bolt' },
  { id: 'tugla', name: 'Tuğla & Blok', blurb: 'Bims, gazbeton, delikli tuğla', icon: 'BrickWall' },
  { id: 'ahsap', name: 'Ahşap', blurb: 'Kereste, kontrplak, kalıp malzemesi', icon: 'TreePine' },
  { id: 'seramik', name: 'Seramik', blurb: 'Yer, duvar ve granit seramik', icon: 'Grid3x3' },
  { id: 'izolasyon', name: 'İzolasyon', blurb: 'Isı, su ve ses yalıtımı', icon: 'Layers' },
  { id: 'elektrik', name: 'Elektrik', blurb: 'Kablo, pano, tesisat gereçleri', icon: 'Zap' },
  { id: 'tesisat', name: 'Tesisat', blurb: 'Temiz su, atık su, ısıtma', icon: 'Droplets' },
  { id: 'dograma', name: 'Kapı & Pencere', blurb: 'PVC, alüminyum ve ahşap doğrama', icon: 'DoorOpen' },
  { id: 'diger', name: 'Diğer', blurb: 'Kalıp, iskele ve şantiye gereçleri', icon: 'Boxes' },
]

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>

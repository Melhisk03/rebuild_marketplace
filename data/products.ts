import type { CategoryId } from './categories'

/**
 * Demo ürün verisi.
 *
 * Fiyatlar 2026 Türkiye piyasasına yakın tutuldu ve `price === quantity *
 * unitPrice` her satırda tutuyor — inşaat sektöründen bir müşteri demoda
 * ilk olarak birim fiyata bakar, tutmayan bir çarpım güveni anında bozar.
 * Değerler `tools/check-data.mjs` ile doğrulanıyor.
 */
export type ProductCondition = 'sifir' | 'ambalajli' | 'kullanilmamis' | 'az-kullanilmis'

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  categoryId: CategoryId
  /** Kart üzerinde kategorinin üstünde görünen kısa tanım */
  headline: string
  quantity: number
  unit: string
  unitPrice: number
  price: number
  condition: ProductCondition
  city: string
  district: string
  /** ISO tarih; kart üzerinde "x gün önce" olarak gösteriliyor */
  listedAt: string
  plate: string
  description: string
  specs: ProductSpec[]
  seller: { name: string; verified: boolean; completed: number }
  featured?: boolean
}

export const CONDITION_LABEL: Record<ProductCondition, string> = {
  sifir: 'Sıfır',
  ambalajli: 'Ambalajında',
  kullanilmamis: 'Kullanılmamış',
  'az-kullanilmis': 'Az Kullanılmış',
}

export const PRODUCTS: Product[] = [
  {
    id: 'demir-o16-b420c',
    name: 'Ø16 Nervürlü İnşaat Demiri',
    categoryId: 'demir',
    headline: 'B420C — TS 708 / TS EN 10080',
    quantity: 2.5,
    unit: 'TON',
    unitPrice: 24600,
    price: 61500,
    condition: 'kullanilmamis',
    city: 'İzmir',
    district: 'Kemalpaşa',
    listedAt: '2026-08-04',
    plate: 'rebar',
    description:
      'Konut projesinin perde betonarme imalatından artan, hiç kullanılmamış nervürlü ' +
      'inşaat demiri. Bağ demiriyle demetlenmiş hâlde, kapalı saha içinde stoklanmıştır. ' +
      'Yüzeyde işlevi etkileyen korozyon bulunmamaktadır.',
    specs: [
      { label: 'Malzeme Türü', value: 'Betonarme Çeliği' },
      { label: 'Standart', value: 'TS 708 / TS EN 10080' },
      { label: 'Çap', value: 'Ø16 mm' },
      { label: 'Sınıf', value: 'B420C' },
      { label: 'Akma Dayanımı', value: '≥ 420 MPa' },
      { label: 'Boy', value: '12 m' },
      { label: 'Yüzey', value: 'Nervürlü' },
      { label: 'Stoklama', value: 'Kapalı saha' },
    ],
    seller: { name: 'Ege Yapı Endüstri', verified: true, completed: 34 },
    featured: true,
  },
  {
    id: 'cimento-cem1-425r',
    name: 'CEM I 42.5 R Portland Çimento',
    categoryId: 'cimento',
    headline: 'Erken yüksek dayanım — TS EN 197-1',
    quantity: 5,
    unit: 'TON',
    unitPrice: 3850,
    price: 19250,
    condition: 'ambalajli',
    city: 'Manisa',
    district: 'Turgutlu',
    listedAt: '2026-08-06',
    plate: 'cement',
    description:
      'Prekast imalat için alınmış, planlanan döküm iptal olduğu için elde kalan ' +
      'çimento. 50 kg kraft torbalarda, paletli ve streçli. Nem almaması için ' +
      'kapalı depoda ahşap palet üzerinde bekletilmektedir.',
    specs: [
      { label: 'Malzeme Türü', value: 'Portland Çimentosu' },
      { label: 'Standart', value: 'TS EN 197-1' },
      { label: 'Sınıf', value: 'CEM I 42.5 R' },
      { label: 'Ambalaj', value: '50 kg kraft torba' },
      { label: 'Palet Adedi', value: '100 torba / palet' },
      { label: 'Üretim Tarihi', value: '2026-06' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 6 ay' },
      { label: 'Stoklama', value: 'Kapalı depo, paletli' },
    ],
    seller: { name: 'Turgutlu Prefabrik', verified: true, completed: 12 },
  },
  {
    id: 'seramik-granit-60x60',
    name: '60x60 Sırlı Granit Seramik',
    categoryId: 'seramik',
    headline: 'Rektifiyeli — 1. kalite',
    quantity: 240,
    unit: 'M²',
    unitPrice: 265,
    price: 63600,
    condition: 'ambalajli',
    city: 'Bursa',
    district: 'Nilüfer',
    listedAt: '2026-08-02',
    plate: 'tile',
    description:
      'Ofis katı yenileme projesinde metraj fazlası çıkan, açılmamış kolilerde ' +
      'granit seramik. Tamamı aynı üretim partisinden, ton farkı yoktur. ' +
      'Koli üzerinde parti numaraları okunabilir durumdadır.',
    specs: [
      { label: 'Malzeme Türü', value: 'Sırlı Granit Seramik' },
      { label: 'Standart', value: 'TS EN 14411' },
      { label: 'Ebat', value: '600 x 600 mm' },
      { label: 'Kalınlık', value: '9,5 mm' },
      { label: 'Yüzey', value: 'Mat, rektifiyeli' },
      { label: 'Su Emme', value: '≤ %0,5' },
      { label: 'Koli İçeriği', value: '4 adet / 1,44 m²' },
      { label: 'Parti', value: 'Tek parti' },
    ],
    seller: { name: 'Nilüfer İç Yapı', verified: true, completed: 21 },
  },
  {
    id: 'blok-bims-20x20x40',
    name: '20x20x40 Bims Betonarme Blok',
    categoryId: 'tugla',
    headline: 'Hafif beton dolgu bloğu',
    quantity: 1850,
    unit: 'ADET',
    unitPrice: 15,
    price: 27750,
    condition: 'sifir',
    city: 'Balıkesir',
    district: 'Altıeylül',
    listedAt: '2026-07-29',
    plate: 'block',
    description:
      'Duvar imalatı metrajı revize edildiği için artan bims blok. Şantiye ' +
      'sahasında paletli ve streçli hâlde beklemektedir. Nakliye alıcıya aittir, ' +
      'forklift yükleme sahada mevcuttur.',
    specs: [
      { label: 'Malzeme Türü', value: 'Bims (Ponza) Blok' },
      { label: 'Standart', value: 'TS EN 771-3' },
      { label: 'Ebat', value: '200 x 200 x 400 mm' },
      { label: 'Birim Hacim Ağırlık', value: '≈ 700 kg/m³' },
      { label: 'Basınç Dayanımı', value: '≥ 2,5 N/mm²' },
      { label: 'Isı İletkenlik', value: '0,22 W/mK' },
      { label: 'Palet', value: '60 adet / palet' },
      { label: 'Stoklama', value: 'Açık saha, streçli' },
    ],
    seller: { name: 'Altıeylül Yapı Koop.', verified: false, completed: 5 },
  },
  {
    id: 'yalitim-xps-5cm',
    name: 'XPS 5 cm Isı Yalıtım Levhası',
    categoryId: 'izolasyon',
    headline: 'Ekstrüde polistiren — pürüzlü yüzey',
    quantity: 180,
    unit: 'M²',
    unitPrice: 118,
    price: 21240,
    condition: 'sifir',
    city: 'İzmir',
    district: 'Bornova',
    listedAt: '2026-08-07',
    plate: 'insulation',
    description:
      'Cephe mantolama işinde artan XPS levha. Orijinal paketlerinde, kapalı ' +
      'alanda güneş görmeyecek şekilde stoklanmıştır. Kenar geçmeli (lambalı) tiptir.',
    specs: [
      { label: 'Malzeme Türü', value: 'Ekstrüde Polistiren (XPS)' },
      { label: 'Standart', value: 'TS EN 13164' },
      { label: 'Kalınlık', value: '50 mm' },
      { label: 'Ebat', value: '600 x 1250 mm' },
      { label: 'Isı İletkenlik', value: '0,033 W/mK' },
      { label: 'Basınç Dayanımı', value: '300 kPa' },
      { label: 'Kenar', value: 'Lambalı geçme' },
      { label: 'Yangın Sınıfı', value: 'E' },
    ],
    seller: { name: 'Ege Yapı Endüstri', verified: true, completed: 34 },
  },
  {
    id: 'profil-galvaniz-100x100',
    name: '100x100x3 Galvaniz Kutu Profil',
    categoryId: 'demir',
    headline: 'Sıcak daldırma galvanizli',
    quantity: 1.2,
    unit: 'TON',
    unitPrice: 31500,
    price: 37800,
    condition: 'kullanilmamis',
    city: 'Kocaeli',
    district: 'Gebze',
    listedAt: '2026-08-01',
    plate: 'profile',
    description:
      'Çelik konstrüksiyon imalatından artan galvaniz kutu profil. Kesim ' +
      'yapılmamış, tam boy hâlde. Galvaniz kaplamada soyulma veya beyaz pas ' +
      'bulunmamaktadır.',
    specs: [
      { label: 'Malzeme Türü', value: 'Yapısal Çelik Profil' },
      { label: 'Standart', value: 'TS EN 10219' },
      { label: 'Kesit', value: '100 x 100 mm' },
      { label: 'Et Kalınlığı', value: '3 mm' },
      { label: 'Kalite', value: 'S235JRH' },
      { label: 'Boy', value: '6 m' },
      { label: 'Kaplama', value: 'Sıcak daldırma galvaniz' },
      { label: 'Metre Ağırlığı', value: '9,01 kg/m' },
    ],
    seller: { name: 'Marmara Çelik Yapı', verified: true, completed: 48 },
  },
  {
    id: 'pencere-pvc-70mm',
    name: 'PVC Pencere Sistemi 70 mm',
    categoryId: 'dograma',
    headline: '5 odacıklı — çift cam üniteli',
    quantity: 15,
    unit: 'ADET',
    unitPrice: 4850,
    price: 72750,
    condition: 'sifir',
    city: 'Ankara',
    district: 'Etimesgut',
    listedAt: '2026-07-26',
    plate: 'window',
    description:
      'Konut projesinde ölçü revizyonu nedeniyle takılmayan PVC pencereler. ' +
      'Camları takılı, koruyucu filmleri sökülmemiş durumda. Kol ve menteşe ' +
      'donanımları eksiksizdir.',
    specs: [
      { label: 'Malzeme Türü', value: 'PVC Doğrama' },
      { label: 'Standart', value: 'TS EN 12608' },
      { label: 'Profil Genişliği', value: '70 mm' },
      { label: 'Odacık', value: '5 odacık' },
      { label: 'Cam Ünitesi', value: '4+16+4 Low-E' },
      { label: 'Ebat', value: '1200 x 1400 mm' },
      { label: 'Açılım', value: 'Çift kanat, çift açılım' },
      { label: 'Donanım', value: 'Eksiksiz' },
    ],
    seller: { name: 'Başkent Yapı Grup', verified: true, completed: 17 },
  },
  {
    id: 'kereste-cam-5x10',
    name: '5x10 Çam Kereste',
    categoryId: 'ahsap',
    headline: 'Kalıp ve iskele keresteliği',
    quantity: 12,
    unit: 'M³',
    unitPrice: 9400,
    price: 112800,
    condition: 'az-kullanilmis',
    city: 'Düzce',
    district: 'Merkez',
    listedAt: '2026-07-22',
    plate: 'timber',
    description:
      'Betonarme kalıp işlerinde iki kez kullanılmış çam kereste. Çivi ve beton ' +
      'artıkları temizlenmiş, boyları düzeltilmiştir. Tekrar kalıp veya iskele ' +
      'işinde kullanıma uygundur.',
    specs: [
      { label: 'Malzeme Türü', value: 'Çam Kereste' },
      { label: 'Kesit', value: '50 x 100 mm' },
      { label: 'Boy', value: '3 – 4 m karışık' },
      { label: 'Sınıf', value: '2. sınıf' },
      { label: 'Nem', value: '≈ %18' },
      { label: 'Kullanım', value: '2 sezon kalıp' },
      { label: 'Hazırlık', value: 'Çivi temizliği yapılmış' },
      { label: 'Stoklama', value: 'Üstü örtülü açık saha' },
    ],
    seller: { name: 'Batı Karadeniz İnşaat', verified: false, completed: 8 },
  },
  {
    id: 'boru-pprc-32-pn20',
    name: 'PPRC Ø32 PN20 Temiz Su Borusu',
    categoryId: 'tesisat',
    headline: 'Sıcak ve soğuk su tesisatı',
    quantity: 640,
    unit: 'MTÜL',
    unitPrice: 46,
    price: 29440,
    condition: 'sifir',
    city: 'İstanbul',
    district: 'Tuzla',
    listedAt: '2026-08-05',
    plate: 'pipe',
    description:
      'Mekanik tesisat imalatından artan PPRC boru. Orijinal demetlerinde, ' +
      'uçları kapaklı. Depo içinde doğrudan güneş almayacak şekilde saklanmıştır.',
    specs: [
      { label: 'Malzeme Türü', value: 'Polipropilen Random (PP-R)' },
      { label: 'Standart', value: 'TS EN ISO 15874' },
      { label: 'Çap', value: 'Ø32 mm' },
      { label: 'Basınç Sınıfı', value: 'PN20' },
      { label: 'Et Kalınlığı', value: '5,4 mm' },
      { label: 'Boy', value: '4 m' },
      { label: 'Çalışma Sıcaklığı', value: '70 °C sürekli' },
      { label: 'Renk', value: 'Beyaz' },
    ],
    seller: { name: 'Tuzla Mekanik Tesisat', verified: true, completed: 26 },
  },
  {
    id: 'kablo-nyy-4x16',
    name: 'NYY 4x16 mm² Enerji Kablosu',
    categoryId: 'elektrik',
    headline: 'Yeraltı ve bina içi dağıtım',
    quantity: 320,
    unit: 'MTÜL',
    unitPrice: 412,
    price: 131840,
    condition: 'ambalajli',
    city: 'İstanbul',
    district: 'Başakşehir',
    listedAt: '2026-08-08',
    plate: 'cable',
    description:
      'Trafo bağlantı hattı için alınmış, güzergâh değişikliği sonrası artan ' +
      'NYY kablo. Orijinal ahşap makarasında, kesilmemiş tek parça hâlde. ' +
      'Makara etiketi ve parti bilgisi mevcuttur.',
    specs: [
      { label: 'Malzeme Türü', value: 'Bakır İletkenli Enerji Kablosu' },
      { label: 'Standart', value: 'TS IEC 60502-1' },
      { label: 'Kesit', value: '4 x 16 mm²' },
      { label: 'İletken', value: 'Bakır, çok telli' },
      { label: 'Yalıtım', value: 'XLPE' },
      { label: 'Dış Kılıf', value: 'PVC, siyah' },
      { label: 'Anma Gerilimi', value: '0,6 / 1 kV' },
      { label: 'Ambalaj', value: 'Ahşap makara, tek parça' },
    ],
    seller: { name: 'Marmara Elektrik Taahhüt', verified: true, completed: 41 },
  },
  {
    id: 'kapi-amerikan-panel',
    name: 'Amerikan Panel Kapı (İç Mekân)',
    categoryId: 'dograma',
    headline: 'Kasa ve pervaz dahil',
    quantity: 30,
    unit: 'ADET',
    unitPrice: 2750,
    price: 82500,
    condition: 'sifir',
    city: 'Kayseri',
    district: 'Melikgazi',
    listedAt: '2026-07-19',
    plate: 'door',
    description:
      'Otel projesi iptal edildiği için hiç montajlanmamış iç mekân kapıları. ' +
      'Kasa, pervaz ve kilit göbeği dahildir. Kolileri açılmamış, kapalı ' +
      'depoda dik konumda stoklanmıştır.',
    specs: [
      { label: 'Malzeme Türü', value: 'MDF Lam / Amerikan Panel' },
      { label: 'Kanat Ebadı', value: '90 x 210 cm' },
      { label: 'Kanat Kalınlığı', value: '40 mm' },
      { label: 'Dolgu', value: 'Bal peteği kraft' },
      { label: 'Kasa', value: 'Ayarlanabilir, 10–14 cm' },
      { label: 'Yüzey', value: 'Melamin kaplama' },
      { label: 'Donanım', value: 'Kilit + menteşe dahil' },
      { label: 'Renk', value: 'Beyaz' },
    ],
    seller: { name: 'Kapadokya Yapı Market', verified: false, completed: 9 },
  },
  {
    id: 'sac-dkp-2mm',
    name: 'DKP Sac Levha 2 mm',
    categoryId: 'demir',
    headline: 'Soğuk haddelenmiş — 1000 x 2000 mm',
    quantity: 0.9,
    unit: 'TON',
    unitPrice: 29800,
    price: 26820,
    condition: 'kullanilmamis',
    city: 'Konya',
    district: 'Selçuklu',
    listedAt: '2026-07-31',
    plate: 'sheet',
    description:
      'Metal imalat atölyesinde proje sonunda artan DKP sac levha. Kesim ' +
      'yapılmamış tam levha hâlde, aralarında kâğıt ayraçla istiflenmiştir. ' +
      'Yüzeyde çizik ve pas yoktur.',
    specs: [
      { label: 'Malzeme Türü', value: 'Soğuk Çekilmiş Sac (DKP)' },
      { label: 'Standart', value: 'TS EN 10130' },
      { label: 'Kalite', value: 'DC01' },
      { label: 'Kalınlık', value: '2 mm' },
      { label: 'Ebat', value: '1000 x 2000 mm' },
      { label: 'Levha Ağırlığı', value: '31,4 kg' },
      { label: 'Yüzey', value: 'Yağlı, pas yok' },
      { label: 'Levha Adedi', value: '≈ 29 adet' },
    ],
    seller: { name: 'Selçuklu Metal İşleri', verified: true, completed: 15 },
  },
  {
    id: 'kalip-pano-100x50',
    name: 'Çelik Beton Kalıp Panosu 100x50',
    categoryId: 'diger',
    headline: 'Perde ve kolon kalıbı',
    quantity: 220,
    unit: 'ADET',
    unitPrice: 680,
    price: 149600,
    condition: 'az-kullanilmis',
    city: 'İzmir',
    district: 'Menemen',
    listedAt: '2026-07-15',
    plate: 'formwork',
    description:
      'Üç projede kullanılmış çelik kalıp panosu. Yüzeyleri temizlenmiş ve ' +
      'kalıp yağı çekilmiştir. Kilit ve pim setleri panolarla birlikte verilir. ' +
      'Deformasyon kontrolü yapılmış, eğilmiş panolar ayıklanmıştır.',
    specs: [
      { label: 'Malzeme Türü', value: 'Çelik Kalıp Panosu' },
      { label: 'Ebat', value: '1000 x 500 mm' },
      { label: 'Profil', value: 'Kutu kenarlı, sac yüzey' },
      { label: 'Sac Kalınlığı', value: '3 mm' },
      { label: 'Pano Ağırlığı', value: '≈ 26 kg' },
      { label: 'Kullanım', value: '3 proje' },
      { label: 'Aksesuar', value: 'Kilit + pim dahil' },
      { label: 'Durum', value: 'Deformasyon kontrolü yapıldı' },
    ],
    seller: { name: 'Ege Kalıp İskele', verified: true, completed: 63 },
  },
  {
    id: 'yalitim-camyunu-8cm',
    name: 'Cam Yünü Şilte 8 cm',
    categoryId: 'izolasyon',
    headline: 'Alüminyum folyo kaplı',
    quantity: 400,
    unit: 'M²',
    unitPrice: 72,
    price: 28800,
    condition: 'sifir',
    city: 'Manisa',
    district: 'Yunusemre',
    listedAt: '2026-08-03',
    plate: 'wool',
    description:
      'Çatı arası yalıtımı için alınmış, metraj fazlası cam yünü şilte. ' +
      'Rulolar açılmamış, streç ambalajında. Kapalı depoda kuru ortamda ' +
      'saklanmaktadır.',
    specs: [
      { label: 'Malzeme Türü', value: 'Cam Yünü Şilte' },
      { label: 'Standart', value: 'TS EN 13162' },
      { label: 'Kalınlık', value: '80 mm' },
      { label: 'Rulo Genişliği', value: '1200 mm' },
      { label: 'Isı İletkenlik', value: '0,040 W/mK' },
      { label: 'Kaplama', value: 'Alüminyum folyo' },
      { label: 'Yangın Sınıfı', value: 'A1 (yanmaz)' },
      { label: 'Ambalaj', value: 'Streçli rulo' },
    ],
    seller: { name: 'Turgutlu Prefabrik', verified: true, completed: 12 },
  },
]

/** Filtre açılırlarını veriden türet — elle yazılan liste veriyle ayrışıyor. */
export const CITIES = [...new Set(PRODUCTS.map((p) => p.city))].sort((a, b) => a.localeCompare(b, 'tr'))

export const FEATURED_PRODUCT = PRODUCTS.find((p) => p.featured) ?? PRODUCTS[0]!

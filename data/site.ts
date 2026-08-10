/**
 * Sayfa içeriğinin veri tarafı: gezinme, istatistik, değer önerileri,
 * adımlar ve footer. Bileşenlerin içine gömülmüyor ki sıralama ve metin
 * tek yerden düzenlenebilsin.
 */

export const BRAND = {
  name: 'Döngüsel Yapı',
  /** Logotipte iki parça ayrı ağırlıkta diziliyor */
  wordmark: { lead: 'DÖNGÜSEL', tail: 'YAPI' },
  tagline: 'İnşaat Malzemeleri Pazaryeri',
}

export const NAV_LINKS = [
  { id: 'malzemeler', label: 'Ürünler' },
  { id: 'kategoriler', label: 'Kategoriler' },
  { id: 'nasil-calisir', label: 'Nasıl Çalışır?' },
  { id: 'hakkimizda', label: 'Hakkımızda' },
]

export const STATS = [
  { value: 1250, suffix: '+', label: 'Listelenen Malzeme', note: 'Aktif ilan' },
  { value: 340, suffix: '+', label: 'Tamamlanan Satış', note: 'Son 12 ay' },
  { value: 18, suffix: '', label: 'Aktif Kategori', note: 'Ana ve alt grup' },
  { value: 12500, suffix: '+', label: 'Değerlendirilen Malzeme', note: 'Ton eşdeğeri' },
]

export const VALUES = [
  {
    icon: 'ShieldCheck',
    title: 'Güvenilir Malzeme',
    body: 'Malzemeler doğrudan profesyonel projelerden gelir. Satıcı firmanın geçmiş işlem sayısı ve doğrulama durumu her ilanda açıkça görünür.',
  },
  {
    icon: 'TrendingDown',
    title: 'Avantajlı Fiyat',
    body: 'Kullanılmayan stoklar piyasa fiyatının altında değerlendirilir. Birim fiyat her ilanda ayrı gösterilir, toplam tutar üzerinden pazarlık yapılabilir.',
  },
  {
    icon: 'Recycle',
    title: 'Sürdürülebilir',
    body: 'Mevcut kaynakların yeniden kullanılması, yeni üretim ve bertaraf yükünü birlikte azaltır. Her işlem karbon karşılığıyla raporlanır.',
  },
  {
    icon: 'FileText',
    title: 'Şeffaf Bilgi',
    body: 'Miktar, standart, teknik özellik ve ürün durumu eksiksiz belirtilir. Belgesi olan malzemelerde parti ve üretim bilgisi paylaşılır.',
  },
]

export const STEPS = [
  {
    no: '01',
    title: 'Keşfet',
    body: 'İhtiyacınız olan malzemeyi kategori, lokasyon ve durum filtreleriyle bulun.',
  },
  {
    no: '02',
    title: 'İncele',
    body: 'Teknik özellikleri, standardı ve stok miktarını ilan detayında kontrol edin.',
  },
  {
    no: '03',
    title: 'Teklif Al',
    body: 'Satıcıyla doğrudan iletişime geçin, teklifinizi iletin ve süreci başlatın.',
  },
]

export const FOOTER_GROUPS = [
  {
    title: 'Platform',
    links: [
      { label: 'Malzemeler', href: '#malzemeler' },
      { label: 'Kategoriler', href: '#kategoriler' },
      { label: 'Nasıl Çalışır?', href: '#nasil-calisir' },
      { label: 'İlan Ver', href: '#ilan-ver' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '#hakkimizda' },
      { label: 'İletişim', href: '#ilan-ver' },
      { label: 'Sürdürülebilirlik', href: '#surdurulebilirlik' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { label: 'Gizlilik Politikası', href: '#' },
      { label: 'Kullanım Koşulları', href: '#' },
      { label: 'KVKK Aydınlatma Metni', href: '#' },
    ],
  },
]

/**
 * Sürdürülebilirlik bölümündeki sayısal kanıt. Demo verisi ama
 * hesaplanabilir görünmesi için birbirleriyle tutarlı seçildi.
 */
export const IMPACT = [
  { value: '12.500', unit: 'ton', label: 'Yeniden değerlendirilen malzeme' },
  { value: '8.400', unit: 'ton CO₂e', label: 'Önlenen karbon salımı' },
  { value: '%38', unit: '', label: 'Ortalama maliyet avantajı' },
]

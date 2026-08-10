# Döngüsel Yapı — İnşaat Malzemeleri Pazaryeri

Kurumsal inşaat projelerinden artan malzemeleri, ihtiyacı olan projelerle
buluşturan B2B pazaryeri. **Müşteriye sunulmak üzere hazırlanmış tek sayfalık
demo**; backend yoktur, veri `data/` altında statiktir.

---

## 1. Teknoloji ve Kütüphaneler

| Katman | Seçim | Not |
|---|---|---|
| Çatı | **Nuxt 3.21** (Vue 3.5, TypeScript) | SSR açık, tek sayfa |
| Stil | **Tailwind CSS v4** (`@tailwindcss/vite`) | `tailwind.config.js` **yok**, yapılandırma `assets/css/main.css` içindeki `@theme` bloğunda |
| İkon | **lucide-vue-next** | Statik eşlemeyle import; 5591 export'un tamamı bundle'a girmiyor |
| Font | **@nuxt/fonts** | Space Grotesk + Inter, derlemede indirilip kendi kaynağımızdan servis ediliyor |
| Görsel işleme | **sharp** (yalnız `devDependency`) | Build adımı değil, elle çalıştırılan hat |

**Bilinçli olarak eklenMEyenler:** Nuxt UI (kendi tasarım dili özgün kimlikle
çakışıyordu), GSAP / Framer / AOS (scroll reveal tek bir paylaşımlı
`IntersectionObserver` ile yapılıyor), herhangi bir sayaç veya carousel paketi.
Toplam çalışma zamanı bağımlılığı: Nuxt, Vue, vue-router, lucide.

### Animasyon yaklaşımı

Tüm hareket CSS geçişleri + iki küçük composable ile:

- `plugins/reveal.ts` — `v-reveal` direktifi, **tek** paylaşımlı observer.
  SSR'da no-op kaydediliyor (yalnız `.client` eklentisinde tanımlanan direktif
  sunucu render'ında `getSSRProps` hatası verir).
- `composables/useCountUp.ts` — rAF ile, geçen süreye bağlı sayaç.
- `prefers-reduced-motion` tek yerden, `main.css` temel katmanında
  `!important` ile kapatılıyor; yeni animasyon eklerken ayrıca kontrol
  yazmaya gerek yok.

---

## 2. Klasör Yapısı

```
assets/css/main.css      TÜM token'lar, temel katman, @utility, reveal geçişleri
components/
  AppNavbar.vue          sticky başlık, scroll'da blur, mobil menü
  AppFooter.vue
  BrandMark.vue          logo işareti + logotip
  HeroSection.vue        arama merkezli pazaryeri girişi + kategori çipleri + ilan şeridi
  SectionHeading.vue     etiket + başlık + açıklama kalıbı
  MarketplaceSection.vue arama + filtre + grid + iskelet + boş durum
  SearchFilterBar.vue    masaüstü şerit / mobil alt sayfa
  FilterSelect.vue       biçimlendirilmiş native <select>
  ProductCard.vue
  ProductModal.vue       detay + satın alma + teklif, tek panelde üç görünüm
  DealPanel.vue          Satın Al / Teklif Ver akışı: miktar, KDV'li özet, doğrulama
  MaterialPlate.vue      ★ üretilmiş vektör malzeme plakaları (14 tür)
  ConditionBadge.vue
  SkeletonCard.vue
  CategorySection.vue    kategori ızgarası
  FeaturedMaterial.vue   öne çıkan ilan: fotoğraf + teknik künye + doğrudan satın alma
  ValueSection.vue       "Artan malzeme, azalan maliyet"
  StatsSection.vue / StatCounter.vue
  SustainabilitySection.vue
  HowItWorks.vue
  CtaSection.vue
composables/
  useProductFilters.ts   paylaşımlı filtre durumu (useState), Türkçe arama katlaması
  useFavourites.ts       favori ilanlar
  useCountUp.ts
  useFocusTrap.ts        modal: odak tuzağı + gövde kilidi + Esc
data/
  products.ts            14 ürün, teknik özellikleriyle
  categories.ts          10 kategori
  site.ts                marka, gezinme, istatistik, değerler, adımlar, footer
utils/format.ts          fiyat / miktar / göreli tarih biçimlendirme
pages/index.vue          bölümlerin sırası + modal durumu
plugins/reveal.ts
public/images/           işlenmiş WebP'ler + CREDITS.md
tools/                   build adımı DEĞİL, elle çalıştırılan yardımcılar
  build-images.mjs       indir → kırp → gradasyon → duotone → WebP
  check-data.mjs         fiyat/miktar tutarlılığı ve plaka eşleşmesi denetimi
  find-images.mjs        Wikimedia Commons aday araması
  contact-sheet.py       aday görsellerden kontak baskısı
  shoot.mjs              CDP tabanlı tam sayfa / viewport ekran görüntüsü
```

---

## 3. Çalıştırma

```bash
npm install
npm run dev          # http://localhost:3000
```

Diğer komutlar:

```bash
npm run build        # üretim derlemesi
npm run preview      # derlemeyi yerelde çalıştır
npm run typecheck    # vue-tsc
npm run check:data   # birim fiyat × miktar = toplam, plaka eşleşmesi
npm run images       # görsel hattını yeniden çalıştır (ham dosyaları indirir)
```

`npm run images` yalnızca kaynak fotoğrafları değiştirirken gerekir.
İşlenmiş çıktılar `public/images/` altında repoda durur; ham indirmeler
(30 MB) `.gitignore`'dadır.

---

## 4. Vercel'e Dağıtım

Proje ek yapılandırma gerektirmez; `vercel.json` yoktur ve gerekmez.

**Git üzerinden:**

1. Repoyu GitHub/GitLab'e gönderin.
2. Vercel → **Add New → Project** → repoyu seçin.
3. Vercel Nuxt'ı otomatik algılar. Doğrulayın:
   - Framework Preset: **Nuxt.js**
   - Build Command: `npm run build`
   - Output Directory: *(boş bırakın — Nitro `.output` üretir)*
   - Install Command: `npm install`
4. **Deploy.**

**CLI ile:**

```bash
npm i -g vercel
vercel          # önizleme
vercel --prod   # üretim
```

Dikkat edilecekler:

- Ortam değişkeni **yok**; backend, veritabanı veya API anahtarı gerekmiyor.
- `sharp` yalnızca `devDependency` ve çalışma zamanında kullanılmıyor;
  görseller derlemeden önce hazırlanmış hâlde repoda.
- Node 20+ (Vercel varsayılanı yeterli).
- Sayfa SSR ile çalışıyor. Tamamen statik istenirse `npm run generate`
  ve Output Directory `.output/public`.

---

## 5. Demo Sırasında Dikkat Edilecek UX Noktaları

Sunumda göstermeye değer, kolayca gözden kaçan yerler:

1. **Hero arama kutusu gerçekten çalışıyor.** Sayfanın en büyük öğesi manşet
   değil arama. Yazdığınız terim, seçtiğiniz kategori ve lokasyon doğrudan
   aşağıdaki listeyi filtreliyor — ayrı bir "arama sonuçları sayfası" yok.

2. **Türkçe aramayı biliyor.** Aksansız **"cimento"** yazın, "Çimento"yu
   bulur. Teknik özellikler de aranıyor: **"B420C"** veya **"TS EN 10080"**.

3. **Satın Al ve Teklif Ver eşit ağırlıkta.** Pazaryerinin iki yolu bu:
   fiyat uygunsa doğrudan alım, değilse pazarlık. Kartta ikisi de birincil
   düğme; birini bağlantıya indirmek diğerini tek yol gibi gösteriyordu.

4. **Satın Al akışı hesap yapıyor.** Miktarı azaltıp artırın — ara toplam,
   %20 KDV ve genel toplam anında güncelleniyor. Kısmi alım destekleniyor
   (2,5 tonun 1,2 tonunu alabilirsiniz).

5. **Teklif Ver'de pazarlık var.** Birim fiyat alanı liste fiyatının %10
   altıyla açılıyor ve altında canlı bir fark göstergesi duruyor:
   *"Liste fiyatı ₺265 — teklifiniz %10 altında."* Fiyatı değiştirin, oran
   ve toplam birlikte değişiyor.

6. **Formu boş gönderin.** Doğrulama gerçek: dört alan da hata veriyor ve
   odak ilk hatalı alana gidiyor. Sonra doldurup gönderin — sipariş/teklif
   numarasıyla özet ekranı geliyor.

7. **Scroll'da başlığa arama beliriyor.** 220px aşağı inince navbar'a küçük
   bir arama alanı giriyor. Pazaryerinde arama her an erişilebilir olmalı.

8. **Favoriler çalışıyor.** Karttaki kalbe basın; navbar'daki sayaç artıyor.

9. **Kategori kartları listeyi filtreliyor.** Kategoriler bölümünde bir karta
   tıklayın: filtre kurulur ve sayfa listeye kayar.

10. **Ürün görselleri fotoğraf değil.** 14 kartın görseli `MaterialPlate.vue`
    içinde üretilen vektör malzeme dokularıdır (nervür deseni, tuğla örgüsü,
    boru kesiti, oluklu sac…). Grid'deki tutarlılığın sebebi bu; dağınık stok
    fotoğrafla bu görüntü elde edilemiyor. Toplam ağırlıkları birkaç KB.

11. **Mobilde filtre alt sayfası.** 390px'te "Filtrele" butonu alttan açılan
    bir sayfa getiriyor; alttaki buton canlı sonuç sayısını gösteriyor.

12. **Erişilebilirlik.** Sekmeyle gezin: odak halkaları amber, modal içinde
    odak hapsoluyor, `Esc` kapatıyor ve odak tıkladığınız karta dönüyor.
    "Hareketi azalt" açıksa tüm animasyonlar kapanıyor.

### Tasarım kararları

- **Açık tema.** İlk sürüm koyu zeminliydi ve ilan platformundan çok ajans
  sitesi gibi okunuyordu. Artık beyaz/kırık beyaz zemin, beyaz kart, yumuşak
  gölge; koyu yalnızca iki yerde: alt CTA şeridi ve footer.
- **Manşet küçüldü, arama büyüdü.** Pazaryerinde en büyük öğe arama kutusudur.
- **Fiyat en büyük tipografi.** Önceki sürümde miktar öndeydi; ilan
  platformunda kullanıcı önce fiyata bakıyor. Miktar hemen yanında, birim
  fiyat da gösterildiği için ikisi birlikte okunuyor.
- **Amber yalnızca eylemde.** Fiyat, birincil buton, aktif filtre. Dekorasyon
  olarak kullanılmıyor.

### Bilinçli sınırlar

- Backend yok: sipariş ve teklif gönderimi taklit ediliyor, form altında
  bunu söyleyen bir not var.
- Ürün detayları modalde açılıyor; ayrı URL'si yok (tek sayfa demo).
- İstatistikler ve etki rakamları temsilîdir.
- Fiyatlar 2026 Türkiye piyasasına yakın seçildi ve
  `birim fiyat × miktar = toplam` her satırda tutuyor (`npm run check:data`).
- KDV %20 sabit; gerçek üründe malzeme grubuna göre değişebilir.

### Görsel lisansları

`public/images/CREDITS.md` — üç fotoğrafın kaynağı, sahibi ve lisansı
listelidir. İkisi kamu malı / CC0, biri CC BY-SA 4.0 (atıf zorunlu).
Müşteri kendi şantiye fotoğraflarını kullanmak isterse
`tools/build-images.mjs` içindeki `SOURCES` dizisine yerel dosya yolu verip
`npm run images` çalıştırmak yeterli; gradasyon aynı kalır.

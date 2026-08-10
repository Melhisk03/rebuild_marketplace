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
  HeroSection.vue        parallax, toz zerrecikleri, tarama çizgisi
  SectionHeading.vue     etiket + başlık + açıklama kalıbı
  MarketplaceSection.vue arama + filtre + grid + iskelet + boş durum
  SearchFilterBar.vue    masaüstü şerit / mobil alt sayfa
  FilterSelect.vue       biçimlendirilmiş native <select>
  ProductCard.vue
  ProductModal.vue       detay + teklif formu, tek panelde iki görünüm
  QuoteForm.vue          gerçek doğrulama + sahte gönderim + başarı durumu
  MaterialPlate.vue      ★ üretilmiş vektör malzeme plakaları (14 tür)
  ConditionBadge.vue
  SkeletonCard.vue
  CategorySection.vue    açık zeminli kategori ızgarası
  FeaturedMaterial.vue   editoryal öne çıkan ürün düzeni
  ValueSection.vue       "Artan malzeme, azalan maliyet"
  StatsSection.vue / StatCounter.vue
  SustainabilitySection.vue
  HowItWorks.vue
  CtaSection.vue
composables/
  useProductFilters.ts   paylaşımlı filtre durumu (useState), Türkçe arama katlaması
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

1. **Hero'da kaydırma.** Fotoğraf içerikten yavaş kayıyor (parallax 0.18) ve
   metin kaydırdıkça soluyor — sayfa "canlı" hissini ilk buradan veriyor.

2. **Başlığın dönüşümü.** Sayfa başında başlık şeffaf; 24px kaydırınca zemin
   bulanıklaşıp kenarlık beliriyor. Aşağı-yukarı bir tur atarak gösterin.

3. **Arama gerçekten çalışıyor ve Türkçe'yi biliyor.** Arama kutusuna
   aksansız **"cimento"** yazın — "Çimento" ürününü bulur. Teknik özellikler
   de aranıyor: **"B420C"** veya **"TS EN 10080"** deneyin.

4. **Filtre değişince iskelet.** Kategoriyi değiştirin; 260 ms'lik yükleme
   iskeleti gerçek bir istek hissi veriyor. Veri yerel, teknik gereklilik
   değil — bilinçli bir UX tercihi.

5. **Kategori kartları grid'i filtreliyor.** Kategoriler bölümünde bir karta
   tıklayın: filtre kurulur ve sayfa listeye kayar. İki ayrı bölüm aynı
   duruma dokunuyor.

6. **Ürün kartında hiyerarşi.** Fiyat değil **MİKTAR** en büyük tipografi.
   İnşaat alıcısı önce "2,5 ton var mı?" diye bakar; miktar tutmuyorsa fiyatın
   önemi yok. Müşteriye bunu söyleyin, fark edilir bir detay.

7. **Modal → teklif formu → başarı.** Bir karta tıklayın, **Teklif İste**'ye
   basın, formu **boş gönderin** — doğrulama gerçek. Sonra doldurup gönderin;
   talep numarasıyla başarı ekranı gelir. `Esc` ile kapanır, odak tıkladığınız
   karta geri döner.

8. **Ürün görselleri fotoğraf değil.** 14 kartın görseli
   `MaterialPlate.vue` içinde üretilen vektör malzeme dokularıdır (nervür
   deseni, tuğla örgüsü, boru kesiti, oluklu sac…). Grid'deki tutarlılığın
   sebebi bu — dağınık stok fotoğrafla bu görüntü elde edilemiyor. Toplam
   ağırlıkları birkaç KB ve her ölçekte keskin.

9. **Fotoğraflar tek gradasyondan geçti.** Hero, sürdürülebilirlik ve öne
   çıkan ürün gerçek fotoğraf; üçü de aynı soğuk duotone eğrisinden geçirildi
   (`tools/build-images.mjs`). Farklı fotoğrafçılardan gelmelerine rağmen tek
   çekim gibi duruyorlar.

10. **Mobilde filtre alt sayfası.** 390px'te "Filtrele" butonu alttan açılan
    bir sayfa getiriyor; alttaki buton canlı sonuç sayısını gösteriyor
    (*"2 sonucu gör"*). Masaüstündeki yatay şeritten farklı bir düzen.

11. **Erişilebilirlik.** Sekme tuşuyla gezin: odak halkaları amber, modal
    içinde odak hapsoluyor, `Esc` kapatıyor. İşletim sisteminde "hareketi
    azalt" açıksa tüm animasyonlar kapanıyor ve sayaçlar son değeri basıyor.

### Bilinçli sınırlar

- Backend yok: teklif formu veri göndermiyor, form altında bunu söyleyen bir
  not var.
- Ürün detayları modalde açılıyor; ayrı URL'si yok (tek sayfa demo).
- İstatistikler ve etki rakamları temsilîdir.
- Fiyatlar 2026 Türkiye piyasasına yakın seçildi ve
  `birim fiyat × miktar = toplam` her satırda tutuyor (`npm run check:data`).

### Görsel lisansları

`public/images/CREDITS.md` — üç fotoğrafın da kaynağı, sahibi ve lisansı
listelidir. İkisi kamu malı / CC0, biri CC BY-SA 4.0 (atıf zorunlu).
Müşteri kendi şantiye fotoğraflarını kullanmak isterse `tools/build-images.mjs`
içindeki `SOURCES` dizisine yerel dosya yolu verip `npm run images`
çalıştırmak yeterli; gradasyon aynı kalır.

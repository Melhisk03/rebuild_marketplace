<script setup lang="ts">
import { Search, MapPin, ChevronDown, ShieldCheck, Truck, Tag, BadgeCheck } from 'lucide-vue-next'
import { CATEGORIES, CATEGORY_BY_ID } from '~/data/categories'
import { CITIES, PRODUCTS } from '~/data/products'
import { STATS } from '~/data/site'

/**
 * Hero — pazaryeri girişi.
 *
 * Buradaki en büyük öğe manşet DEĞİL, arama kutusu. Önceki sürümde ekranı
 * kaplayan bir manşet ve koyu fotoğraf vardı; site ilan platformu değil
 * ajans sitesi gibi okunuyordu. Sahibinden/Letgo mantığı: kullanıcı zaten
 * ne aradığını biliyor, ilk ekranda ona arama ve kategori verilir.
 *
 * Arama alanları doğrudan paylaşımlı filtre durumuna yazıyor — hero'da
 * yazılan şey aşağıdaki grid'i anında filtreliyor, ayrı bir "arama sayfası"
 * yok.
 */
const filters = useProductFilters()
const { query, category, city } = filters

/** Çiplerde gösterilecek ilk altı kategori; gerisi kategori bölümünde. */
const quickCategories = CATEGORIES.slice(0, 6)

/** Kategori başına ilan sayısı — çiplerde ve açılırda gösteriliyor. */
const counts = computed(() => {
  const map: Record<string, number> = {}
  for (const p of PRODUCTS) map[p.categoryId] = (map[p.categoryId] ?? 0) + 1
  return map
})

/** Öne çıkan ürün (featured) — sağ tarafta vitrin olarak gösteriliyor. */
const featured = computed(() => PRODUCTS.find(p => p.featured) || PRODUCTS[0])
const featuredCategory = computed(() => CATEGORY_BY_ID[featured.value.categoryId])

function goToResults() {
  document.getElementById('malzemeler')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function pickChip(id: string) {
  category.value = category.value === id ? 'all' : (id as typeof category.value)
  goToResults()
}

const emit = defineEmits<{
  'featured-click': [typeof featured]
  'featured-buy': [typeof featured]
  'featured-offer': [typeof featured]
}>()

/** Son eklenen ilanlar şeridi; iki kez basılıyor ki kaydırma kesintisiz olsun. */
const recent = computed(() =>
  [...PRODUCTS].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 7),
)

const promises = [
  { icon: ShieldCheck, text: 'Doğrulanmış kurumsal satıcı' },
  { icon: Tag, text: 'Piyasa altı stok fiyatı' },
]
</script>

<template>
  <section id="top" class="relative isolate overflow-hidden bg-canvas pt-28 pb-16 sm:pb-24 border-b-4 border-line">
    <!-- Zemin: ölçüm ızgarası + amber blob. Temiz ve minimal. -->
    <div class="gridlines pointer-events-none absolute inset-0 -z-10 opacity-[0.4]" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -top-40 -right-24 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,var(--color-amber-wash),transparent_68%)]"
      aria-hidden="true"
    />

    <div class="shell">
      <!-- Grid layout: sol taraf (7), sağ taraf (5) — reference design -->
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- SOL TARAF: Başlık bloğu ve arama (8 cols) -->
        <div class="lg:col-span-8">
          <!-- Başlık bloğu: kısa ve iddiasız, yeri aramaya bırakıyor -->
          <div class="max-w-3xl">
        <p v-reveal="{ as: 'fade' }" class="pill border border-amber-edge bg-amber-wash text-amber-ink">
          <span class="size-1.5 rounded-full bg-amber" />
          İnşaat malzemeleri pazaryeri
        </p>

        <h1 v-reveal="{ delay: 60 }" class="mt-4 font-semibold text-ink leading-[1.12]" style="font-size: clamp(1.75rem, 1.5rem + 2.2vw, 3.2rem);">
          Proje fazlası malzeme,<br class="hidden sm:block" />
          <span class="text-amber-ink">satın alınmaya hazır.</span>
        </h1>

        <p v-reveal="{ delay: 120 }" class="text-slate mt-2 max-w-[58ch] text-fluid-sm">
          Kurumsal projelerden artan kaliteli malzemeleri keşfedin. Fiyatı uygunsa hemen satın alın,
          değilse kendi teklifinizi verin.
        </p>
      </div>

      <!-- ---------- ARAMA ---------- -->
      <div v-reveal="{ as: 'up', delay: 180 }" class="mt-3">
        <div
          class="card flex flex-col gap-1.5 p-1.5 shadow-lift lg:flex-row lg:items-center lg:gap-0 lg:rounded-full lg:p-1"
        >
          <!-- Metin -->
          <div class="relative flex-1">
            <Search
              :size="19"
              :stroke-width="2"
              class="text-mute pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <input
              v-model="query"
              type="search"
              aria-label="Malzeme ara"
              placeholder="Malzeme, marka veya standart ara — örn. nervürlü demir"
              class="text-ink placeholder:text-mute h-10 w-full rounded-lg bg-transparent pr-3 pl-10 text-fluid-sm focus:outline-none"
              @keydown.enter="goToResults"
            />
          </div>

          <span class="bg-line hidden h-7 w-px lg:block" aria-hidden="true" />

          <!-- Kategori -->
          <div class="relative lg:w-52">
            <select
              v-model="category"
              aria-label="Kategori"
              class="text-ink h-10 w-full cursor-pointer appearance-none rounded-lg bg-transparent pr-9 pl-4 text-fluid-xs focus:outline-none"
            >
              <option value="all">Tüm kategoriler</option>
              <option v-for="c in CATEGORIES" :key="c.id" :value="c.id">
                {{ c.name }} ({{ counts[c.id] ?? 0 }})
              </option>
            </select>
            <ChevronDown
              :size="16"
              :stroke-width="2"
              class="text-mute pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
            />
          </div>

          <span class="bg-line hidden h-7 w-px lg:block" aria-hidden="true" />

          <!-- Lokasyon -->
          <div class="relative lg:w-48">
            <MapPin
              :size="17"
              :stroke-width="2"
              class="text-mute pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <select
              v-model="city"
              aria-label="Lokasyon"
              class="text-ink h-10 w-full cursor-pointer appearance-none rounded-lg bg-transparent pr-9 pl-10 text-fluid-xs focus:outline-none"
            >
              <option value="all">Tüm Türkiye</option>
              <option v-for="c in CITIES" :key="c" :value="c">{{ c }}</option>
            </select>
            <ChevronDown
              :size="16"
              :stroke-width="2"
              class="text-mute pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
            />
          </div>

          <button type="button" class="btn-base btn-buy h-10 lg:px-6 rounded-full font-bold text-fluid-xs" @click="goToResults">
            <Search :size="17" :stroke-width="2.2" class="lg:hidden" />
            Ara
          </button>
        </div>

        <!-- Hızlı kategori çipleri -->
        <div class="mt-2 flex flex-wrap gap-1.5">
          <button
            v-for="c in quickCategories"
            :key="c.id"
            type="button"
            class="chip"
            :class="category === c.id && 'chip-active'"
            @click="pickChip(c.id)"
          >
            {{ c.name }}
          </button>
        </div>
      </div>

      <!-- ---------- GÜVEN ŞERİDİ ---------- -->
      <div
        v-reveal="{ as: 'fade', delay: 260 }"
        class="border-line mt-4 flex flex-col gap-4 border-t pt-4 lg:flex-row lg:justify-between lg:items-start"
      >
        <!-- Promises (Sol) -->
        <ul class="flex flex-col gap-2">
          <li v-for="p in promises" :key="p.text" class="inline-flex items-center gap-2">
            <div class="size-7 rounded-lg bg-amber-wash flex items-center justify-center shrink-0">
              <component :is="p.icon" :size="16" :stroke-width="2" class="text-amber-ink" />
            </div>
            <span class="text-slate font-medium text-fluid-xs">{{ p.text }}</span>
          </li>
        </ul>

        <!-- Stats (Sağ) - Yan Yana -->
        <dl class="flex flex-wrap gap-6 lg:gap-8">
          <div v-for="s in STATS.slice(0, 2)" :key="s.label" class="flex flex-col gap-0.5">
            <dt class="sr-only">{{ s.label }}</dt>
            <dd class="font-display text-ink tnum font-black" style="font-size: clamp(1.25rem, 1rem + 0.6vw, 1.625rem);">
              {{ s.value.toLocaleString('tr-TR') }}<span class="text-amber-ink">{{ s.suffix }}</span>
            </dd>
            <span class="text-mute text-fluid-xs font-medium">{{ s.label }}</span>
          </div>
        </dl>
      </div>
        </div>

        <!-- SAĞ TARAF: Öne çıkan ürün kartı (4 cols) -->
        <div v-reveal="{ as: 'up', delay: 120 }" class="hidden lg:block lg:col-span-4 relative">
          <article class="bg-paper rounded-3xl p-4 border border-line shadow-lift overflow-hidden flex flex-col">

            <!-- Ürün Görsel -->
            <button
              type="button"
              class="relative block w-full overflow-hidden text-left rounded-2xl mb-4"
              style="aspect-ratio: 4/3"
              :aria-label="`${featured.name} detayını aç`"
              @click="$emit('featured-click', featured)"
            >
              <MaterialPlate :plate="featured.plate" />

              <!-- Üst Rozetler -->
              <div class="absolute top-3 left-3 flex gap-2">
                <span class="pill bg-ok text-white text-fluid-xs font-bold px-3 py-1 flex items-center gap-1 shadow-sm">
                  <ShieldCheck :size="13" :stroke-width="2" />
                  Escrow Korumalı
                </span>
              </div>

              <span class="absolute top-3 right-3 pill bg-ink text-amber text-fluid-xs font-bold px-3 py-1 shadow">
                {{ formatQuantity(featured.quantity) }} {{ featured.unit }} Stok
              </span>

              <!-- Konum Pill (Alt) -->
              <div class="absolute bottom-3 left-3 pill bg-paper/95 text-ink text-fluid-xs font-bold px-3 py-1.5 border border-line shadow-sm flex items-center gap-1.5">
                <MapPin :size="14" :stroke-width="2" class="shrink-0 text-amber-ink" />
                <span>{{ featured.city }} (24 km uzaklıkta)</span>
              </div>
            </button>

            <!-- Kart Gövdesi -->
            <div class="flex flex-1 flex-col px-2">

              <div class="mb-2">
                <h3 class="font-display text-fluid-base leading-snug font-semibold text-ink">
                  {{ featured.name }}
                </h3>
                <p class="text-mute mt-1 text-fluid-xs">{{ featured.seller.name }}<span v-if="featured.seller.verified" class="flex items-center gap-0.5 inline-flex ml-1">
                  <BadgeCheck :size="12" :stroke-width="2" class="text-info" /> (VKN Onaylı)
                </span></p>
              </div>

              <!-- Lojistik Widget -->
              <div class="bg-brand-50 border border-brand-100 rounded-2xl p-3 my-3">
                <div class="flex items-center justify-between text-fluid-xs font-bold text-brand-700 mb-0.5">
                  <span class="flex items-center gap-1.5">
                    <Truck :size="15" :stroke-width="2" />
                    Entegre Navlun & Vinç
                  </span>
                  <span class="text-amber-ink">+3.200 TL</span>
                </div>
                <div class="text-[10px] text-slate flex justify-between items-center font-medium">
                  <span>Vinçli Tır ile Şantiyeye Teslim</span>
                  <span class="text-ok font-bold">Bugün Sevkiyat</span>
                </div>
              </div>

              <!-- Fiyat -->
              <div class="flex items-center justify-between pt-2">
                <div>
                  <p class="text-mute text-fluid-xs line-through tnum">{{ formatPrice(featured.price * 1.12) }}</p>
                  <p class="font-display text-amber-ink tnum text-fluid-xl leading-none font-bold">
                    {{ formatPrice(featured.price) }} <span class="text-fluid-xs font-normal text-mute">/ {{ featured.unit }}</span>
                  </p>
                </div>
                <button type="button" class="btn-base btn-buy px-5 py-3 flex items-center gap-1.5" @click="$emit('featured-buy', featured)">
                  <ShieldCheck :size="16" :stroke-width="2" />
                  <span>Güvenli Al</span>
                </button>
              </div>
            </div>

          </article>

          <!-- Yüzen ESG Rozeti -->
          <div class="hidden sm:flex absolute -bottom-6 -left-6 bg-paper p-3.5 rounded-2xl border border-line shadow-lift items-center gap-3">
            <div class="size-10 bg-ok-wash border border-ok rounded-xl flex items-center justify-center text-ok shrink-0">
              🌿
            </div>
            <div>
              <p class="text-fluid-xs font-bold text-ink">1.85 Ton CO₂ Engellendi</p>
              <p class="text-[10px] text-mute font-medium">Döngüsel Ekonomi ESG Skoru</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ---------- SON EKLENENLER ŞERİDİ ----------
         Platformun canlı olduğunu ilk ekranda gösteren detay. `aria-hidden`
         çünkü aynı ilanlar hemen altındaki grid'de erişilebilir hâlde. -->
    <div class="border-line mt-10 overflow-hidden border-y bg-paper py-2.5" aria-hidden="true">
      <div class="animate-ticker flex w-max gap-3">
        <template v-for="pass in 2" :key="pass">
          <span
            v-for="p in recent"
            :key="`${pass}-${p.id}`"
            class="text-slate inline-flex shrink-0 items-center gap-2 text-fluid-xs"
          >
            <span class="bg-ok size-1.5 rounded-full" />
            <span class="text-ink font-medium">{{ p.name }}</span>
            <span class="text-mute">{{ p.city }}</span>
            <span class="text-amber-ink font-display font-semibold tnum">{{ formatPrice(p.price) }}</span>
            <span class="text-line-strong px-3">/</span>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Search, MapPin, ChevronDown, ShieldCheck, Truck, Tag } from 'lucide-vue-next'
import { CATEGORIES } from '~/data/categories'
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

function goToResults() {
  document.getElementById('malzemeler')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function pickChip(id: string) {
  category.value = category.value === id ? 'all' : (id as typeof category.value)
  goToResults()
}

/** Son eklenen ilanlar şeridi; iki kez basılıyor ki kaydırma kesintisiz olsun. */
const recent = computed(() =>
  [...PRODUCTS].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 7),
)

const promises = [
  { icon: ShieldCheck, text: 'Doğrulanmış kurumsal satıcı' },
  { icon: Tag, text: 'Piyasa altı stok fiyatı' },
  { icon: Truck, text: 'Tek partide teslim' },
]
</script>

<template>
  <section id="top" class="relative isolate overflow-hidden bg-canvas pt-28 pb-10 sm:pb-14">
    <!-- Zemin: ölçüm ızgarası + iki yumuşak amber leke. Fotoğraf yok;
         ürünler zaten hemen altta, hero'nun işi onlara yol açmak. -->
    <div class="gridlines pointer-events-none absolute inset-0 -z-10 opacity-[0.45]" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -top-40 -right-24 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--color-amber-wash),transparent_68%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-56 -left-32 -z-10 size-[30rem] rounded-full bg-[radial-gradient(circle,#eaf0fe,transparent_70%)]"
      aria-hidden="true"
    />

    <div class="shell">
      <!-- Başlık bloğu: kısa ve iddiasız, yeri aramaya bırakıyor -->
      <div class="max-w-3xl">
        <p v-reveal="{ as: 'fade' }" class="pill border border-amber-edge bg-amber-wash text-amber-ink">
          <span class="size-1.5 rounded-full bg-amber" />
          İnşaat malzemeleri pazaryeri
        </p>

        <h1 v-reveal="{ delay: 60 }" class="text-fluid-hero mt-4 font-semibold text-ink">
          Proje fazlası malzeme,<br class="hidden sm:block" />
          <span class="text-amber-ink">satın alınmaya hazır.</span>
        </h1>

        <p v-reveal="{ delay: 120 }" class="text-slate mt-4 max-w-[58ch] text-fluid-lg">
          Kurumsal projelerden artan kaliteli malzemeleri keşfedin. Fiyatı uygunsa hemen satın alın,
          değilse kendi teklifinizi verin.
        </p>
      </div>

      <!-- ---------- ARAMA ---------- -->
      <div v-reveal="{ as: 'up', delay: 180 }" class="mt-8">
        <div
          class="card flex flex-col gap-2 p-2 shadow-lift lg:flex-row lg:items-center lg:gap-0 lg:rounded-full lg:p-1.5"
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
              class="text-ink placeholder:text-mute h-12 w-full rounded-lg bg-transparent pr-3 pl-11 text-fluid-base focus:outline-none"
              @keydown.enter="goToResults"
            />
          </div>

          <span class="bg-line hidden h-7 w-px lg:block" aria-hidden="true" />

          <!-- Kategori -->
          <div class="relative lg:w-52">
            <select
              v-model="category"
              aria-label="Kategori"
              class="text-ink h-12 w-full cursor-pointer appearance-none rounded-lg bg-transparent pr-9 pl-4 text-fluid-sm focus:outline-none"
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
              class="text-ink h-12 w-full cursor-pointer appearance-none rounded-lg bg-transparent pr-9 pl-11 text-fluid-sm focus:outline-none"
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

          <button type="button" class="btn-base btn-buy h-12 lg:px-7" @click="goToResults">
            <Search :size="17" :stroke-width="2.2" class="lg:hidden" />
            Ara
          </button>
        </div>

        <!-- Hızlı kategori çipleri -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="c in quickCategories"
            :key="c.id"
            type="button"
            class="chip"
            :class="category === c.id && 'chip-active'"
            @click="pickChip(c.id)"
          >
            {{ c.name }}
            <span class="text-mute text-fluid-xs">{{ counts[c.id] ?? 0 }}</span>
          </button>
        </div>
      </div>

      <!-- ---------- GÜVEN ŞERİDİ ---------- -->
      <div
        v-reveal="{ as: 'fade', delay: 260 }"
        class="border-line mt-10 flex flex-col gap-6 border-t pt-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <ul class="flex flex-wrap gap-x-7 gap-y-3">
          <li v-for="p in promises" :key="p.text" class="text-slate inline-flex items-center gap-2 text-fluid-sm">
            <component :is="p.icon" :size="17" :stroke-width="1.75" class="text-amber-ink shrink-0" />
            {{ p.text }}
          </li>
        </ul>

        <dl class="flex flex-wrap gap-x-8 gap-y-3">
          <div v-for="s in STATS.slice(0, 3)" :key="s.label" class="flex items-baseline gap-2">
            <dt class="sr-only">{{ s.label }}</dt>
            <dd class="font-display text-ink tnum text-fluid-lg font-semibold">
              {{ s.value.toLocaleString('tr-TR') }}{{ s.suffix }}
            </dd>
            <span class="text-mute text-fluid-xs">{{ s.label }}</span>
          </div>
        </dl>
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

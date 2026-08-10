<script setup lang="ts">
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { CATEGORIES } from '~/data/categories'
import { CITIES, CONDITION_LABEL, type ProductCondition } from '~/data/products'
import { PRICE_BANDS, SORT_OPTIONS } from '~/composables/useProductFilters'

/**
 * Arama ve filtre şeridi.
 *
 * Masaüstünde yatay şerit, mobilde alttan açılan sayfa (bottom sheet).
 * Aynı kontrolleri iki kez yazmamak için filtre alanları tek bir
 * `<template>` parçasında değil, iki farklı kapsayıcıda AYNI bileşenlerle
 * kuruluyor — düzenleri gerçekten farklı olduğu için ortak bir sarmalayıcı
 * ikisini de bozuyordu.
 */
const query = defineModel<string>('query', { required: true })
const category = defineModel<string>('category', { required: true })
const city = defineModel<string>('city', { required: true })
const condition = defineModel<string>('condition', { required: true })
const band = defineModel<string>('band', { required: true })
const sort = defineModel<string>('sort', { required: true })

const props = defineProps<{ resultCount: number; activeCount: number }>()
const emit = defineEmits<{ reset: [] }>()

const sheetOpen = ref(false)

const categoryOptions = [
  { value: 'all', label: 'Tüm kategoriler' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
]
const cityOptions = [
  { value: 'all', label: 'Tüm lokasyonlar' },
  ...CITIES.map((c) => ({ value: c, label: c })),
]
const conditionOptions = [
  { value: 'all', label: 'Tüm durumlar' },
  ...(Object.keys(CONDITION_LABEL) as ProductCondition[]).map((k) => ({
    value: k,
    label: CONDITION_LABEL[k],
  })),
]
const bandOptions = PRICE_BANDS.map((b) => ({ value: b.id, label: b.label }))
const sortOptions = SORT_OPTIONS.map((s) => ({ value: s.id, label: s.label }))

watch(sheetOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <div>
    <!-- ---------- Arama ---------- -->
    <div class="flex gap-2.5">
      <div class="relative flex-1">
        <Search
          :size="18"
          :stroke-width="1.75"
          class="text-concrete pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        />
        <input
          v-model="query"
          type="search"
          :placeholder="'Malzeme, kategori veya ürün ara…'"
          aria-label="Malzeme ara"
          class="font-display text-bone placeholder:text-concrete border-steel focus:border-amber/60 h-14 w-full border bg-carbon pr-4 pl-12 text-fluid-base transition-colors duration-300 focus:outline-none"
        />
      </div>

      <!-- Mobilde filtreleri açan buton -->
      <button
        type="button"
        class="btn-ghost h-14 shrink-0 px-4 lg:hidden"
        :aria-expanded="sheetOpen"
        @click="sheetOpen = true"
      >
        <SlidersHorizontal :size="17" :stroke-width="1.75" />
        <span class="sr-only sm:not-sr-only">Filtrele</span>
        <span
          v-if="props.activeCount"
          class="bg-amber font-display ml-0.5 inline-flex size-5 items-center justify-center text-[0.6875rem] font-semibold text-void"
        >
          {{ props.activeCount }}
        </span>
      </button>
    </div>

    <!-- ---------- Masaüstü filtre şeridi ---------- -->
    <div class="mt-3 hidden grid-cols-5 gap-2.5 lg:grid">
      <FilterSelect v-model="category" label="Kategori" :options="categoryOptions" :active="category !== 'all'" />
      <FilterSelect v-model="city" label="Lokasyon" :options="cityOptions" :active="city !== 'all'" />
      <FilterSelect v-model="band" label="Fiyat" :options="bandOptions" :active="band !== 'all'" />
      <FilterSelect v-model="condition" label="Durum" :options="conditionOptions" :active="condition !== 'all'" />
      <FilterSelect v-model="sort" label="Sıralama" :options="sortOptions" />
    </div>

    <!-- ---------- Sonuç özeti ---------- -->
    <div class="border-steel/70 mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
      <p class="text-concrete text-fluid-sm">
        <span class="text-bone font-display tnum font-semibold">{{ props.resultCount }}</span>
        malzeme listeleniyor
      </p>
      <button
        v-if="props.activeCount"
        type="button"
        class="font-display text-ash hover:text-amber inline-flex items-center gap-1.5 text-fluid-sm transition-colors"
        @click="emit('reset')"
      >
        <X :size="14" :stroke-width="2" />
        Filtreleri temizle
      </button>
    </div>

    <!-- ---------- Mobil filtre sayfası ---------- -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div v-if="sheetOpen" class="fixed inset-0 z-[60] bg-void/70 backdrop-blur-sm lg:hidden" @click="sheetOpen = false" />
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-400 ease-(--ease-out-expo)"
        enter-from-class="translate-y-full"
        leave-active-class="transition-transform duration-300 ease-(--ease-out-expo)"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="sheetOpen"
          role="dialog"
          aria-modal="true"
          aria-label="Filtreler"
          class="border-steel bg-carbon fixed inset-x-0 bottom-0 z-[61] max-h-[86svh] overflow-y-auto border-t lg:hidden"
        >
          <div class="border-steel/70 sticky top-0 flex items-center justify-between border-b bg-carbon px-5 py-4">
            <h3 class="font-display text-bone text-fluid-lg font-semibold">Filtreler</h3>
            <button
              type="button"
              class="text-concrete hover:text-bone inline-flex size-9 items-center justify-center transition-colors"
              aria-label="Filtreleri kapat"
              @click="sheetOpen = false"
            >
              <X :size="20" :stroke-width="1.75" />
            </button>
          </div>

          <div class="grid gap-4 px-5 py-6">
            <FilterSelect v-model="category" label="Kategori" :options="categoryOptions" :active="category !== 'all'" />
            <FilterSelect v-model="city" label="Lokasyon" :options="cityOptions" :active="city !== 'all'" />
            <FilterSelect v-model="band" label="Fiyat" :options="bandOptions" :active="band !== 'all'" />
            <FilterSelect v-model="condition" label="Durum" :options="conditionOptions" :active="condition !== 'all'" />
            <FilterSelect v-model="sort" label="Sıralama" :options="sortOptions" />
          </div>

          <div class="border-steel/70 sticky bottom-0 flex gap-2.5 border-t bg-carbon px-5 py-4">
            <button type="button" class="btn-ghost flex-1" @click="emit('reset')">Temizle</button>
            <button type="button" class="btn-primary flex-1" @click="sheetOpen = false">
              {{ props.resultCount }} sonucu gör
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Search, SlidersHorizontal, X, LayoutGrid } from 'lucide-vue-next'
import { CATEGORIES } from '~/data/categories'
import { CITIES, CONDITION_LABEL, type ProductCondition } from '~/data/products'
import { PRICE_BANDS, SORT_OPTIONS } from '~/composables/useProductFilters'

/**
 * Liste üstü arama ve filtre şeridi.
 *
 * Hero'da zaten bir arama var; buradaki onun tekrarı DEĞİL, listeyi
 * daraltan ikinci kademe. İkisi aynı paylaşımlı duruma yazıyor, yani
 * hero'da yazılan terim burada da görünüyor.
 *
 * Masaüstünde yatay şerit, mobilde alttan açılan sayfa.
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
const cityOptions = [{ value: 'all', label: 'Tüm lokasyonlar' }, ...CITIES.map((c) => ({ value: c, label: c }))]
const conditionOptions = [
  { value: 'all', label: 'Tüm durumlar' },
  ...(Object.keys(CONDITION_LABEL) as ProductCondition[]).map((k) => ({ value: k, label: CONDITION_LABEL[k] })),
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
  <div class="card p-3 sm:p-4">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <Search
          :size="18"
          :stroke-width="2"
          class="text-mute pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <input
          v-model="query"
          type="search"
          placeholder="Listede ara…"
          aria-label="Listede ara"
          class="field h-11 pl-10"
        />
      </div>

      <button
        type="button"
        class="btn-base btn-quiet h-11 shrink-0 lg:hidden"
        :aria-expanded="sheetOpen"
        @click="sheetOpen = true"
      >
        <SlidersHorizontal :size="17" :stroke-width="1.9" />
        <span class="hidden sm:inline">Filtrele</span>
        <span
          v-if="props.activeCount"
          class="bg-amber inline-flex size-5 items-center justify-center rounded-full text-[0.6875rem] font-bold text-white"
        >
          {{ props.activeCount }}
        </span>
      </button>
    </div>

    <!-- Masaüstü filtreler -->
    <div class="mt-3 hidden grid-cols-5 gap-2.5 lg:grid">
      <FilterSelect v-model="category" label="Kategori" :options="categoryOptions" :active="category !== 'all'" />
      <FilterSelect v-model="city" label="Lokasyon" :options="cityOptions" :active="city !== 'all'" />
      <FilterSelect v-model="band" label="Fiyat" :options="bandOptions" :active="band !== 'all'" />
      <FilterSelect v-model="condition" label="Durum" :options="conditionOptions" :active="condition !== 'all'" />
      <FilterSelect v-model="sort" label="Sıralama" :options="sortOptions" />
    </div>

    <!-- Sonuç özeti -->
    <div class="border-line mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
      <p class="text-slate inline-flex items-center gap-2 text-fluid-sm">
        <LayoutGrid :size="15" :stroke-width="1.9" class="text-mute" />
        <span class="text-ink font-display tnum font-semibold">{{ props.resultCount }}</span>
        ilan listeleniyor
      </p>
      <button
        v-if="props.activeCount"
        type="button"
        class="font-display text-slate hover:text-amber-ink inline-flex items-center gap-1.5 text-fluid-sm transition-colors"
        @click="emit('reset')"
      >
        <X :size="14" :stroke-width="2.2" />
        Filtreleri temizle ({{ props.activeCount }})
      </button>
    </div>

    <!-- Mobil filtre sayfası -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-250"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="sheetOpen"
          class="bg-ink/45 fixed inset-0 z-[60] backdrop-blur-[2px] lg:hidden"
          @click="sheetOpen = false"
        />
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-350 ease-(--ease-out-expo)"
        enter-from-class="translate-y-full"
        leave-active-class="transition-transform duration-250 ease-(--ease-out-expo)"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="sheetOpen"
          role="dialog"
          aria-modal="true"
          aria-label="Filtreler"
          class="bg-paper fixed inset-x-0 bottom-0 z-[61] max-h-[86svh] overflow-y-auto rounded-t-2xl shadow-pop lg:hidden"
        >
          <div class="border-line bg-paper sticky top-0 flex items-center justify-between border-b px-5 py-4">
            <h3 class="font-display text-ink text-fluid-lg font-semibold">Filtreler</h3>
            <button
              type="button"
              class="text-mute hover:text-ink inline-flex size-9 items-center justify-center transition-colors"
              aria-label="Filtreleri kapat"
              @click="sheetOpen = false"
            >
              <X :size="20" :stroke-width="2" />
            </button>
          </div>

          <div class="grid gap-4 px-5 py-5">
            <FilterSelect v-model="category" label="Kategori" :options="categoryOptions" :active="category !== 'all'" />
            <FilterSelect v-model="city" label="Lokasyon" :options="cityOptions" :active="city !== 'all'" />
            <FilterSelect v-model="band" label="Fiyat" :options="bandOptions" :active="band !== 'all'" />
            <FilterSelect v-model="condition" label="Durum" :options="conditionOptions" :active="condition !== 'all'" />
            <FilterSelect v-model="sort" label="Sıralama" :options="sortOptions" />
          </div>

          <div class="border-line bg-paper sticky bottom-0 flex gap-2.5 border-t px-5 py-4">
            <button type="button" class="btn-base btn-quiet flex-1" @click="emit('reset')">Temizle</button>
            <button type="button" class="btn-base btn-buy flex-1" @click="sheetOpen = false">
              {{ props.resultCount }} ilanı gör
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

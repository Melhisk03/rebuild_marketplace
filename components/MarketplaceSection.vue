<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
import type { Product } from '~/data/products'

/**
 * Pazaryeri bölümü — sayfanın ana gövdesi.
 *
 * Filtre değiştiğinde kısa bir iskelet gösteriliyor. Veri yerel olduğu için
 * teknik gereklilik değil; ama sonuçların anında "zıplaması" demoyu statik
 * bir mockup gibi gösteriyordu. 240 ms, gerçek istek hissi verecek kadar
 * uzun, bekletme hissi vermeyecek kadar kısa.
 */
const emit = defineEmits<{ open: [Product]; buy: [Product]; offer: [Product] }>()

const filters = useProductFilters()
const { query, category, city, condition, band, sort, results, activeCount } = filters

const loading = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

watch([query, category, city, condition, band, sort], () => {
  loading.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (loading.value = false), 240)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section id="malzemeler" class="bg-canvas py-(--spacing-section)">
    <div class="shell">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Mevcut ilanlar"
          title="Sahada bekleyen malzemeler"
          description="Projelerden kalan, yeniden değerlendirilmeye hazır stoklar. Fiyatı uygunsa hemen satın alın, değilse teklifinizi iletin."
        />
      </div>

      <div v-reveal="{ as: 'fade', delay: 100 }" class="mt-7">
        <SearchFilterBar
          v-model:query="query"
          v-model:category="category"
          v-model:city="city"
          v-model:condition="condition"
          v-model:band="band"
          v-model:sort="sort"
          :result-count="results.length"
          :active-count="activeCount"
          @reset="filters.reset()"
        />
      </div>

      <div class="mt-6">
        <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SkeletonCard v-for="n in 8" :key="n" />
        </div>

        <div v-else-if="results.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProductCard
            v-for="product in results"
            :key="product.id"
            v-reveal="{ as: 'up' }"
            :product="product"
            @open="emit('open', $event)"
            @buy="emit('buy', $event)"
            @offer="emit('offer', $event)"
          />
        </div>

        <div v-else class="card flex flex-col items-center px-6 py-16 text-center">
          <SearchX :size="32" :stroke-width="1.4" class="text-mute" />
          <p class="font-display text-ink mt-4 text-fluid-lg font-semibold">Eşleşen ilan bulunamadı</p>
          <p class="text-slate mt-2 max-w-sm text-fluid-sm">
            Arama teriminizi kısaltmayı veya filtrelerden birini kaldırmayı deneyin.
          </p>
          <button type="button" class="btn-base btn-quiet mt-6" @click="filters.reset()">
            Filtreleri temizle
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

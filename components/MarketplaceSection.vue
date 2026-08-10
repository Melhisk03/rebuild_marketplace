<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
import type { Product } from '~/data/products'

/**
 * Pazaryeri bölümü: başlık + arama/filtre + sonuç grid'i.
 *
 * Filtre değiştiğinde kısa bir iskelet gösteriliyor. Veri yerel olduğu
 * için teknik bir gereklilik değil; ama sonuçların anında "zıplaması"
 * demoyu statik bir mockup gibi gösteriyordu. 260 ms, gerçek bir istek
 * hissi verecek kadar uzun, bekletme hissi vermeyecek kadar kısa.
 */
const emit = defineEmits<{ open: [Product] }>()

const filters = useProductFilters()
const { query, category, city, condition, band, sort, results, activeCount } = filters

const loading = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

watch([query, category, city, condition, band, sort], () => {
  loading.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (loading.value = false), 260)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section id="malzemeler" class="bg-void py-(--spacing-section)">
    <div class="shell">
      <SectionHeading
        eyebrow="Mevcut Malzemeler"
        title="Sahada bekleyen, projede karşılığı olan malzemeler."
        description="Projelerden kalan, yeniden değerlendirilmeye hazır malzemeleri keşfedin. Her ilanda miktar, teknik özellik ve ürün durumu eksiksiz belirtilir."
      />

      <div v-reveal="{ as: 'fade', delay: 120 }" class="mt-11">
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

      <!-- Sonuçlar -->
      <div class="mt-8">
        <div v-if="loading" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>

        <div v-else-if="results.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <!-- `key` ürün kimliği: filtre değişince Vue kartları yeniden
               kullanmak yerine doğru olanı eşleştiriyor, hover durumu
               yanlış karta taşınmıyor. -->
          <ProductCard
            v-for="product in results"
            :key="product.id"
            v-reveal="{ as: 'up' }"
            :product="product"
            @open="emit('open', $event)"
          />
        </div>

        <!-- Boş durum -->
        <div v-else class="surface flex flex-col items-center px-6 py-20 text-center">
          <SearchX :size="34" :stroke-width="1.25" class="text-concrete" />
          <p class="font-display text-bone mt-5 text-fluid-lg font-semibold">Eşleşen malzeme bulunamadı</p>
          <p class="text-concrete mt-2 max-w-sm text-fluid-sm">
            Arama teriminizi kısaltmayı veya filtrelerden birini kaldırmayı deneyin.
          </p>
          <button type="button" class="btn-ghost mt-7" @click="filters.reset()">Filtreleri temizle</button>
        </div>
      </div>
    </div>
  </section>
</template>

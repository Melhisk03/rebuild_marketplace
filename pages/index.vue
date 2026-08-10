<script setup lang="ts">
import type { Product } from '~/data/products'
import type { CategoryId } from '~/data/categories'

/**
 * Tek sayfa akışı.
 *
 * Sıra ilan platformu mantığına göre: arama -> liste -> kategoriler ->
 * öne çıkan -> süreç -> güven -> hikâye -> satıcı çağrısı. Ürün listesi
 * ilk ekrandan hemen sonra geliyor; anlatı bölümleri onun ardında.
 *
 * Modal durumu burada, çünkü üç ayrı bölüm (grid, öne çıkan, kategori)
 * aynı modala dokunuyor. `intent` hangi düğmeye basıldığını taşıyor:
 * "Satın Al" doğrudan satın alma adımını açıyor, önce detayı göstermiyor.
 */
const selected = ref<Product | null>(null)
const intent = ref<'detail' | 'buy' | 'offer'>('detail')

const filters = useProductFilters()

function open(product: Product, mode: 'detail' | 'buy' | 'offer' = 'detail') {
  intent.value = mode
  selected.value = product
}

function pickCategory(id: CategoryId) {
  filters.category.value = id
  document.getElementById('malzemeler')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div>
    <AppNavbar />

    <main>
      <HeroSection />
      <MarketplaceSection
        @open="open($event)"
        @buy="open($event, 'buy')"
        @offer="open($event, 'offer')"
      />
      <StatsSection />
      <CategorySection @pick="pickCategory" />
      <FeaturedMaterial
        @open="open($event)"
        @buy="open($event, 'buy')"
        @offer="open($event, 'offer')"
      />
      <HowItWorks />
      <ValueSection />
      <SustainabilitySection />
      <CtaSection />
    </main>

    <AppFooter />

    <ProductModal :product="selected" :intent="intent" @close="selected = null" />
  </div>
</template>

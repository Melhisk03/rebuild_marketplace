<script setup lang="ts">
import type { Product } from '~/data/products'
import type { CategoryId } from '~/data/categories'

/**
 * Tek sayfa akışı.
 *
 * Bölümlerin sırası koyu/açık ritmine göre kuruldu: iki koyu bölümden
 * sonra mutlaka bir açık blok geliyor. Sırayı değiştirirken bu ritmi
 * koru, yoksa sayfa tek bir uzun karanlık şerit gibi okunuyor.
 *
 * Modal ve kategori seçimi burada; iki farklı bölüm aynı duruma
 * dokunduğu için en yakın ortak ata bu sayfa.
 */
const selected = ref<Product | null>(null)
const filters = useProductFilters()

function openProduct(product: Product) {
  selected.value = product
}

/** Kategori kartı: filtreyi kur ve listeye götür. */
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
      <MarketplaceSection @open="openProduct" />
      <CategorySection @pick="pickCategory" />
      <FeaturedMaterial @open="openProduct" />
      <ValueSection />
      <StatsSection />
      <SustainabilitySection />
      <HowItWorks />
      <CtaSection />
    </main>

    <AppFooter />

    <ProductModal :product="selected" @close="selected = null" />
  </div>
</template>

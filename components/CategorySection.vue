<script setup lang="ts">
import {
  Package, Bolt, BrickWall, TreePine, Grid3x3, Layers, Zap, Droplets, DoorOpen, Boxes,
  ArrowUpRight,
} from 'lucide-vue-next'
import { CATEGORIES, type CategoryId } from '~/data/categories'
import { PRODUCTS } from '~/data/products'

/**
 * Kategori bölümü — sayfanın ilk açık zeminli bloğu.
 *
 * Koyu bölümlerin arasına giren bu nefes alanı olmadan sayfa tek bir uzun
 * karanlık şerit gibi okunuyor ve "premium" değil "ağır" hissettiriyor.
 *
 * İkonlar STATİK eşlemeden çözülüyor: `resolveComponent` veya dinamik
 * import Lucide'ın tamamını bundle'a sokuyor (5591 export).
 */
const ICONS = { Package, Bolt, BrickWall, TreePine, Grid3x3, Layers, Zap, Droplets, DoorOpen, Boxes }

const emit = defineEmits<{ pick: [CategoryId] }>()

/** İlan sayısı veriden sayılıyor; elle yazılan rakam veriyle ayrışır. */
const counts = computed(() => {
  const map = {} as Record<string, number>
  for (const product of PRODUCTS) map[product.categoryId] = (map[product.categoryId] ?? 0) + 1
  return map
})
</script>

<template>
  <section id="kategoriler" class="bg-chalk py-(--spacing-section)">
    <div class="shell">
      <SectionHeading
        eyebrow="Kategoriler"
        title="Aradığınız malzeme, ait olduğu grupta."
        description="Ana yapı malzemelerinden tesisat ve şantiye gereçlerine kadar on ana grup. Bir gruba tıklayarak listeyi doğrudan filtreleyebilirsiniz."
        tone="light"
      />

      <ul
        v-reveal="{ stagger: 55, children: 'li' }"
        class="border-chalk-edge mt-12 grid grid-cols-2 gap-px border-t border-l bg-chalk-edge sm:grid-cols-3 lg:grid-cols-5"
      >
        <li v-for="category in CATEGORIES" :key="category.id">
          <button
            type="button"
            class="group relative flex h-full w-full flex-col items-start bg-chalk p-5 text-left transition-colors duration-500 ease-(--ease-out-expo) hover:bg-paper"
            @click="emit('pick', category.id)"
          >
            <!-- Üstte büyüyen amber çizgi: hover'ın imza hareketi -->
            <span
              class="bg-amber absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-x-100"
            />

            <span class="flex w-full items-start justify-between">
              <component
                :is="ICONS[category.icon as keyof typeof ICONS]"
                :size="26"
                :stroke-width="1.25"
                class="text-slate group-hover:text-amber transition-colors duration-400"
              />
              <ArrowUpRight
                :size="16"
                :stroke-width="1.75"
                class="text-chalk-edge group-hover:text-ink -translate-x-1 translate-y-1 opacity-0 transition-all duration-500 ease-(--ease-out-expo) group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </span>

            <span class="font-display text-ink mt-8 text-fluid-base font-semibold">{{ category.name }}</span>
            <span class="text-slate mt-1 text-fluid-xs leading-snug">{{ category.blurb }}</span>
            <span class="label-tech mt-4 text-[0.625rem]">{{ counts[category.id] ?? 0 }} ilan</span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

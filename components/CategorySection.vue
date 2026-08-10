<script setup lang="ts">
import {
  Package, Bolt, BrickWall, TreePine, Grid3x3, Layers, Zap, Droplets, DoorOpen, Boxes,
  ArrowRight,
} from 'lucide-vue-next'
import { CATEGORIES, type CategoryId } from '~/data/categories'
import { PRODUCTS } from '~/data/products'

/**
 * Kategori ızgarası.
 *
 * İkonlar STATİK eşlemeden çözülüyor: `resolveComponent` veya dinamik
 * import Lucide'ın tamamını (5591 export) bundle'a sokuyor.
 */
const ICONS = { Package, Bolt, BrickWall, TreePine, Grid3x3, Layers, Zap, Droplets, DoorOpen, Boxes }

const emit = defineEmits<{ pick: [CategoryId] }>()

/** İlan sayısı veriden sayılıyor; elle yazılan rakam veriyle ayrışır. */
const counts = computed(() => {
  const map: Record<string, number> = {}
  for (const p of PRODUCTS) map[p.categoryId] = (map[p.categoryId] ?? 0) + 1
  return map
})
</script>

<template>
  <section id="kategoriler" class="bg-chalk py-(--spacing-section)">
    <div class="shell">
      <SectionHeading
        eyebrow="Kategoriler"
        title="Aradığınız malzeme, ait olduğu grupta"
        description="Ana yapı malzemelerinden tesisat ve şantiye gereçlerine kadar on grup. Bir gruba tıklayarak listeyi doğrudan filtreleyin."
      />

      <ul
        v-reveal="{ stagger: 45, children: 'li' }"
        class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        <li v-for="category in CATEGORIES" :key="category.id">
          <button
            type="button"
            class="card group flex h-full w-full flex-col items-start p-4 text-left transition-[box-shadow,transform,border-color] duration-300 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-amber hover:shadow-lift"
            @click="emit('pick', category.id)"
          >
            <span
              class="bg-amber-wash text-amber-ink inline-flex size-11 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-amber group-hover:text-white"
            >
              <component :is="ICONS[category.icon as keyof typeof ICONS]" :size="21" :stroke-width="1.75" />
            </span>

            <span class="font-display text-ink mt-4 text-fluid-base font-semibold">{{ category.name }}</span>
            <span class="text-mute mt-1 line-clamp-2 text-fluid-xs leading-snug">{{ category.blurb }}</span>

            <span class="mt-4 flex w-full items-center justify-between">
              <span class="pill bg-canvas text-slate">{{ counts[category.id] ?? 0 }} ilan</span>
              <ArrowRight
                :size="16"
                :stroke-width="2"
                class="text-mute group-hover:text-amber-ink transition-all duration-300 group-hover:translate-x-1"
              />
            </span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Tek bir sayaç.
 *
 * Ayrı bileşen olmasının sebebi teknik: `useCountUp`'ı bir `.map()` içinde
 * çağırıp sonucu diziye koyduğunda şablondaki ref AÇILMIYOR — otomatik
 * açılım yalnızca setup'tan dönen üst seviye ref'lerde çalışıyor.
 */
const props = defineProps<{ value: number; suffix: string; label: string; note: string }>()

const root = useTemplateRef<HTMLElement>('root')
const current = useCountUp(root, props.value, { duration: 1700 })
</script>

<template>
  <div ref="root" class="px-4 py-5 text-center sm:px-6">
    <p class="font-display text-ink tnum text-fluid-2xl leading-none font-bold">
      {{ Math.round(current).toLocaleString('tr-TR') }}<span class="text-amber-ink">{{ suffix }}</span>
    </p>
    <p class="font-display text-ink mt-2.5 text-fluid-sm font-medium">{{ label }}</p>
    <p class="text-mute mt-0.5 text-fluid-xs">{{ note }}</p>
  </div>
</template>

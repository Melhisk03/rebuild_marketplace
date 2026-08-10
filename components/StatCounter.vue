<script setup lang="ts">
/**
 * Tek bir sayaç.
 *
 * Ayrı bileşen olmasının sebebi teknik: `useCountUp`'ı bir `.map()` içinde
 * çağırıp sonucu diziye koyduğunda şablondaki `counter.current` ref'i
 * AÇMIYOR — otomatik açılım yalnızca setup'tan dönen üst seviye ref'lerde
 * çalışıyor. Her sayaç kendi bileşeninde olunca sorun ortadan kalkıyor.
 */
const props = defineProps<{ value: number; suffix: string; label: string; note: string }>()

const root = useTemplateRef<HTMLElement>('root')
const current = useCountUp(root, props.value, { duration: 1700 })
</script>

<template>
  <div ref="root" class="bg-paper px-5 py-8 sm:px-7">
    <p class="font-display text-ink tnum text-fluid-3xl leading-none font-semibold">
      {{ Math.round(current).toLocaleString('tr-TR') }}<span class="text-amber">{{ suffix }}</span>
    </p>
    <p class="font-display text-ink mt-4 text-fluid-sm font-medium">{{ label }}</p>
    <p class="text-slate mt-1 text-fluid-xs">{{ note }}</p>
  </div>
</template>

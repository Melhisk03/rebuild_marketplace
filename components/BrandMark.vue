<script setup lang="ts">
import { BRAND } from '~/data/site'

/**
 * Marka işareti + logotip.
 *
 * İşaret: kare çerçeve içinde uçları oklu iki yay. Kare yapıyı, yaylar
 * döngüyü anlatıyor — ismin iki parçası. Amber yalnızca yaylarda; çerçeve
 * nötr kalınca işaret açık ve koyu zeminde aynı ağırlıkta duruyor.
 */
withDefaults(defineProps<{ compact?: boolean; tone?: 'light' | 'dark' }>(), {
  compact: false,
  tone: 'light',
})
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <svg viewBox="0 0 32 32" class="size-8 shrink-0" role="img" :aria-label="BRAND.name">
      <rect
        x="1.25"
        y="1.25"
        width="29.5"
        height="29.5"
        rx="7"
        fill="none"
        :stroke="tone === 'light' ? '#cdc9c1' : '#2e323a'"
        stroke-width="1.5"
      />
      <g fill="none" stroke="#f97316" stroke-width="2.4" stroke-linecap="round">
        <path d="M7.5 13.4a9 9 0 0 1 15.1-3.3" />
        <path d="M22.9 5.6v4.9h-4.9" />
        <path d="M24.5 18.6a9 9 0 0 1-15.1 3.3" />
        <path d="M9.1 26.4v-4.9h4.9" />
      </g>
    </svg>

    <span v-if="!compact" class="font-display text-[0.9375rem] leading-none tracking-[0.1em]">
      <span :class="tone === 'light' ? 'text-ink' : 'text-bone'" class="font-bold">
        {{ BRAND.wordmark.lead }}
      </span>
      <span :class="tone === 'light' ? 'text-mute' : 'text-ash'" class="ml-1.5 font-normal">
        {{ BRAND.wordmark.tail }}
      </span>
    </span>
  </span>
</template>

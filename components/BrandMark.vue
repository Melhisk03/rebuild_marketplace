<script setup lang="ts">
import { BRAND } from '~/data/site'

/**
 * Marka işareti + logotip.
 *
 * İşaret: çelik bir kare çerçeve içinde, uçları oklu iki yay. Kare yapıyı,
 * yaylar döngüyü anlatıyor — ismin iki parçası. Amber yalnızca yaylarda;
 * çerçeve nötr kalınca işaret koyu ve açık zeminde aynı ağırlıkta duruyor.
 *
 * `compact` yalnızca işareti basar (mobil başlık, favicon benzeri yerler).
 */
withDefaults(defineProps<{ compact?: boolean; tone?: 'dark' | 'light' }>(), {
  compact: false,
  tone: 'dark',
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
        fill="none"
        :stroke="tone === 'dark' ? '#4a535f' : '#c9c5bc'"
        stroke-width="1.5"
      />
      <!-- Üst yay: saat yönünde, sağ uçta ok -->
      <path
        d="M7.5 13.4a9 9 0 0 1 15.1-3.3"
        fill="none"
        stroke="#ff7a1a"
        stroke-width="2.4"
        stroke-linecap="square"
      />
      <path d="M22.9 5.6v4.9h-4.9" fill="none" stroke="#ff7a1a" stroke-width="2.4" stroke-linecap="square" />
      <!-- Alt yay: aynanın tersi, döngüyü kapatıyor -->
      <path
        d="M24.5 18.6a9 9 0 0 1-15.1 3.3"
        fill="none"
        stroke="#ff7a1a"
        stroke-width="2.4"
        stroke-linecap="square"
      />
      <path d="M9.1 26.4v-4.9h4.9" fill="none" stroke="#ff7a1a" stroke-width="2.4" stroke-linecap="square" />
    </svg>

    <span v-if="!compact" class="font-display text-[0.9375rem] leading-none tracking-[0.14em]">
      <span :class="tone === 'dark' ? 'text-bone' : 'text-ink'" class="font-bold">
        {{ BRAND.wordmark.lead }}
      </span>
      <span :class="tone === 'dark' ? 'text-concrete' : 'text-slate'" class="ml-1.5 font-normal">
        {{ BRAND.wordmark.tail }}
      </span>
    </span>
  </span>
</template>

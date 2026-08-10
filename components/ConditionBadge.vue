<script setup lang="ts">
import { CONDITION_LABEL, type ProductCondition } from '~/data/products'

/**
 * Ürün durumu rozeti.
 *
 * Renk yalnızca noktada; zemin ve metin her durumda nötr. Dört farklı
 * renkli rozet yan yana geldiğinde grid alacalanıyor ve premium hissi
 * ilk kaybeden şey bu oluyor.
 */
const props = defineProps<{ condition: ProductCondition; size?: 'sm' | 'md' }>()

const DOT: Record<ProductCondition, string> = {
  sifir: 'bg-state-new',
  ambalajli: 'bg-state-open',
  kullanilmamis: 'bg-state-new',
  'az-kullanilmis': 'bg-state-used',
}

const label = computed(() => CONDITION_LABEL[props.condition])
</script>

<template>
  <span
    class="border-steel bg-void/70 text-bone font-display inline-flex items-center gap-1.5 border backdrop-blur-sm"
    :class="size === 'md' ? 'px-2.5 py-1.5 text-fluid-xs' : 'px-2 py-1 text-[0.6875rem]'"
  >
    <span class="size-1.5 rounded-full" :class="DOT[condition]" />
    {{ label }}
  </span>
</template>

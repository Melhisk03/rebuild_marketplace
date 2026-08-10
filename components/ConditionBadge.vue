<script setup lang="ts">
import { CONDITION_LABEL, type ProductCondition } from '~/data/products'

/**
 * Ürün durumu rozeti.
 *
 * Renk bilgi taşıyor: yeşil kullanılmamış, mavi ambalajında, sarı az
 * kullanılmış. Tonlar bilinçli olarak soluk — dört doygun rozet yan yana
 * gelince grid alacalanıyor ve ilk kaybedilen şey premium hissi oluyor.
 */
defineProps<{ condition: ProductCondition }>()

const TONE: Record<ProductCondition, string> = {
  sifir: 'bg-ok-wash text-ok',
  ambalajli: 'bg-info-wash text-info',
  kullanilmamis: 'bg-ok-wash text-ok',
  'az-kullanilmis': 'bg-warn-wash text-warn',
}
</script>

<template>
  <span class="pill" :class="TONE[condition]">{{ CONDITION_LABEL[condition] }}</span>
</template>

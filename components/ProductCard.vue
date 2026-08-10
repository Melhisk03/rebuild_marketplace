<script setup lang="ts">
import { MapPin, ArrowRight } from 'lucide-vue-next'
import type { Product } from '~/data/products'
import { CATEGORY_BY_ID } from '~/data/categories'

/**
 * Ürün kartı — sitenin en çok tekrar eden ve en çok incelenen bileşeni.
 *
 * Bilgi hiyerarşisi bilinçli: önce MİKTAR, sonra fiyat. İnşaat alıcısı
 * "bana 2,5 ton lazım" diye arıyor; miktar tutmuyorsa fiyatın önemi yok.
 * Bu yüzden miktar en büyük tipografi, fiyat onun altında.
 *
 * Tüm kart tıklanabilir ama sarmalayıcı `<button>` DEĞİL: içeride başka
 * odaklanabilir öğe olmasa da, kart içi metin seçilebilir kalsın diye
 * `<article>` üzerine tıklama + ayrı bir gerçek buton kullanılıyor.
 */
const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ open: [Product] }>()

const hovered = ref(false)
const category = computed(() => CATEGORY_BY_ID[props.product.categoryId])
</script>

<template>
  <article
    class="group surface hover:border-amber/45 relative flex cursor-pointer flex-col transition-colors duration-500 ease-(--ease-out-expo)"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="emit('open', product)"
  >
    <!-- Görsel alanı -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <MaterialPlate :plate="product.plate" :zoom="hovered" />

      <span class="label-tech bg-void/75 text-ash absolute top-3 left-3 px-2 py-1 backdrop-blur-sm">
        {{ category.name }}
      </span>
      <ConditionBadge :condition="product.condition" class="absolute top-3 right-3" />
    </div>

    <!-- Gövde -->
    <div class="flex flex-1 flex-col p-5">
      <h3 class="font-display text-bone text-fluid-lg leading-tight font-semibold">
        {{ product.name }}
      </h3>
      <p class="text-concrete mt-1.5 text-fluid-xs leading-snug">{{ product.headline }}</p>

      <!-- Miktar + fiyat: kartın karar verdiren kısmı -->
      <div class="border-steel/80 mt-5 flex items-end justify-between gap-4 border-t pt-4">
        <div>
          <p class="label-tech text-[0.625rem]">Miktar</p>
          <p class="font-display text-bone tnum mt-1 text-fluid-xl leading-none font-semibold">
            {{ formatQuantity(product.quantity) }}
            <span class="text-concrete text-fluid-sm font-medium">{{ product.unit }}</span>
          </p>
        </div>
        <div class="text-right">
          <p class="label-tech text-[0.625rem]">Toplam</p>
          <p class="font-display text-amber tnum mt-1 text-fluid-lg leading-none font-semibold">
            {{ formatPrice(product.price) }}
          </p>
        </div>
      </div>

      <!-- Alt satır -->
      <div class="text-concrete mt-4 flex items-center justify-between gap-3 text-fluid-xs">
        <span class="inline-flex min-w-0 items-center gap-1.5">
          <MapPin :size="13" :stroke-width="1.75" class="shrink-0" />
          <span class="truncate">{{ product.city }} · {{ product.district }}</span>
        </span>
        <time :datetime="product.listedAt" class="shrink-0">{{ relativeDay(product.listedAt) }}</time>
      </div>

      <button
        type="button"
        class="font-display text-bone group-hover:text-amber mt-5 inline-flex items-center gap-2 self-start text-fluid-sm font-medium transition-colors duration-300"
        @click.stop="emit('open', product)"
      >
        Detayları Gör
        <ArrowRight
          :size="15"
          :stroke-width="2"
          class="transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1"
        />
      </button>
    </div>
  </article>
</template>

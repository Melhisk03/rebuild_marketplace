<script setup lang="ts">
import { MapPin, Heart, BadgeCheck } from 'lucide-vue-next'
import type { Product } from '~/data/products'
import { CATEGORY_BY_ID } from '~/data/categories'

/**
 * Ürün kartı — sitenin en çok tekrar eden ve en çok incelenen bileşeni.
 *
 * İki eylem AYNI ağırlıkta: "Satın Al" listelenen fiyattan alır, "Teklif
 * Ver" kendi fiyatını önerir. Pazaryerinin çalışma biçimi bu; birini
 * ikincil bir bağlantıya indirmek diğerini tek yol gibi gösteriyordu.
 *
 * Fiyat en büyük tipografi. Önceki sürümde miktar öndeydi; ilan platformunda
 * kullanıcı önce fiyata bakıyor, miktar hemen yanında ikinci bilgi olarak
 * duruyor (birim fiyat da gösterildiği için ikisi birlikte okunuyor).
 */
const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ open: [Product]; buy: [Product]; offer: [Product] }>()

const hovered = ref(false)
const category = computed(() => CATEGORY_BY_ID[props.product.categoryId])
const favourites = useFavourites()
</script>

<template>
  <article
    class="card group relative flex flex-col overflow-hidden transition-[box-shadow,transform,border-color] duration-300 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Görsel. Tüm kart değil yalnızca bu alan ve başlık detayı açıyor;
         kartın tamamı tıklanabilir olsaydı "Satın Al" ile yanlışlıkla
         detay açma çakışırdı. -->
    <button
      type="button"
      class="relative block aspect-[4/3] w-full overflow-hidden text-left"
      :aria-label="`${product.name} detayını aç`"
      @click="emit('open', product)"
    >
      <MaterialPlate :plate="product.plate" :zoom="hovered" />

      <span class="pill absolute top-3 left-3 bg-paper/90 text-slate backdrop-blur-sm">
        {{ category.name }}
      </span>
      <ConditionBadge :condition="product.condition" class="absolute bottom-3 left-3" />
    </button>

    <!-- Favori -->
    <button
      type="button"
      class="border-line bg-paper/90 absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors duration-200 hover:border-line-strong"
      :aria-pressed="favourites.has(product.id)"
      :aria-label="favourites.has(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'"
      @click.stop="favourites.toggle(product.id)"
    >
      <Heart
        :size="17"
        :stroke-width="1.9"
        :class="favourites.has(product.id) ? 'fill-amber text-amber' : 'text-slate'"
      />
    </button>

    <!-- Gövde -->
    <div class="flex flex-1 flex-col p-4">
      <h3 class="font-display text-fluid-base leading-snug font-semibold text-ink">
        <button type="button" class="text-left hover:text-amber-ink" @click="emit('open', product)">
          {{ product.name }}
        </button>
      </h3>
      <p class="text-mute mt-1 line-clamp-1 text-fluid-xs">{{ product.headline }}</p>

      <!-- Fiyat -->
      <div class="mt-3 flex items-end justify-between gap-3">
        <div>
          <p class="font-display text-amber-ink tnum text-fluid-xl leading-none font-bold">
            {{ formatPrice(product.price) }}
          </p>
          <p class="text-mute mt-1 text-fluid-xs tnum">
            {{ formatPrice(product.unitPrice) }} / {{ product.unit }}
          </p>
        </div>
        <div class="text-right">
          <p class="label-tech text-[0.625rem]">Stok</p>
          <p class="font-display text-ink tnum text-fluid-sm font-semibold">
            {{ formatQuantity(product.quantity) }} {{ product.unit }}
          </p>
        </div>
      </div>

      <!-- Satıcı ve konum -->
      <div class="text-mute mt-3 flex items-center justify-between gap-2 text-fluid-xs">
        <span class="inline-flex min-w-0 items-center gap-1">
          <MapPin :size="12" :stroke-width="2" class="shrink-0" />
          <span class="truncate">{{ product.city }}</span>
        </span>
        <span class="inline-flex min-w-0 items-center gap-1">
          <BadgeCheck v-if="product.seller.verified" :size="13" :stroke-width="2" class="text-info shrink-0" />
          <span class="truncate">{{ product.seller.name }}</span>
        </span>
      </div>

      <!-- Eylemler -->
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button type="button" class="btn-base btn-buy w-full px-2" @click="emit('buy', product)">
          Satın Al
        </button>
        <button type="button" class="btn-base btn-offer w-full px-2" @click="emit('offer', product)">
          Teklif Ver
        </button>
      </div>
    </div>
  </article>
</template>

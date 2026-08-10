<script setup lang="ts">
import { ShoppingCart, HandCoins, BadgeCheck, MapPin, Clock } from 'lucide-vue-next'
import { FEATURED_PRODUCT, type Product } from '~/data/products'

/**
 * Öne çıkan ilan — editoryal değil, "günün fırsatı" düzeni.
 *
 * Grid'deki karttan farkı: gerçek fotoğraf, tam teknik künye ve doğrudan
 * satın alma. Aynı kartı büyütmek "öne çıkarma" olmaz, sadece zoom olur.
 */
const emit = defineEmits<{ open: [Product]; buy: [Product]; offer: [Product] }>()

const product = FEATURED_PRODUCT
const keySpecs = product.specs.slice(0, 6)
</script>

<template>
  <section class="bg-canvas py-(--spacing-section)">
    <div class="shell">
      <SectionHeading
        eyebrow="Öne çıkan ilan"
        title="Bu haftanın stoğu"
        description="Miktarı, belgesi ve durumu doğrulanmış; tek partide teslim edilebilecek malzeme."
      />

      <div v-reveal="{ as: 'up', delay: 100 }" class="card mt-7 overflow-hidden lg:grid lg:grid-cols-[1.05fr_1fr]">
        <!-- Görsel -->
        <div class="relative aspect-[4/3] lg:aspect-auto lg:min-h-[30rem]">
          <img
            src="/images/featured.webp"
            srcset="/images/featured-800.webp 800w, /images/featured.webp 1200w"
            sizes="(min-width: 1024px) 52vw, 100vw"
            :alt="`${product.name} — yakın çekim`"
            width="1200"
            height="900"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <span class="pill bg-amber absolute top-4 left-4 text-white">Öne çıkan</span>
          <ConditionBadge :condition="product.condition" class="absolute top-4 right-4" />
        </div>

        <!-- Künye -->
        <div class="border-line flex flex-col p-5 sm:p-7 lg:border-l">
          <h3 class="font-display text-ink text-fluid-2xl leading-tight font-semibold">{{ product.name }}</h3>
          <p class="text-amber-ink font-display mt-1.5 text-fluid-sm">{{ product.headline }}</p>

          <div class="text-slate mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-fluid-sm">
            <span class="inline-flex items-center gap-1.5">
              <MapPin :size="14" :stroke-width="1.9" class="text-mute" />
              {{ product.city }} · {{ product.district }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Clock :size="14" :stroke-width="1.9" class="text-mute" />
              {{ relativeDay(product.listedAt) }}
            </span>
          </div>

          <!-- Teknik künye -->
          <dl class="border-line mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 border-t pt-5">
            <div v-for="spec in keySpecs" :key="spec.label">
              <dt class="label-tech text-[0.625rem]">{{ spec.label }}</dt>
              <dd class="text-ink mt-0.5 text-fluid-sm font-medium">{{ spec.value }}</dd>
            </div>
          </dl>

          <!-- Fiyat -->
          <div class="border-line bg-canvas mt-6 flex items-end justify-between gap-4 rounded-xl border p-4">
            <div>
              <p class="label-tech text-[0.625rem]">Toplam ({{ formatQuantity(product.quantity) }} {{ product.unit }})</p>
              <p class="font-display text-amber-ink tnum mt-1 text-fluid-2xl leading-none font-bold">
                {{ formatPrice(product.price) }}
              </p>
            </div>
            <div class="text-right">
              <p class="label-tech text-[0.625rem]">Birim</p>
              <p class="font-display text-ink tnum mt-1 text-fluid-base font-semibold">
                {{ formatPrice(product.unitPrice) }}
              </p>
            </div>
          </div>

          <p class="text-mute mt-3 inline-flex items-center gap-1.5 text-fluid-xs">
            <BadgeCheck :size="14" :stroke-width="2" class="text-info" />
            {{ product.seller.name }} · {{ product.seller.completed }} tamamlanmış işlem
          </p>

          <div class="mt-5 grid grid-cols-2 gap-2">
            <button type="button" class="btn-base btn-buy" @click="emit('buy', product)">
              <ShoppingCart :size="16" :stroke-width="2" />
              Satın Al
            </button>
            <button type="button" class="btn-base btn-offer" @click="emit('offer', product)">
              <HandCoins :size="16" :stroke-width="2" />
              Teklif Ver
            </button>
          </div>
          <button
            type="button"
            class="font-display text-slate hover:text-ink mt-3 text-fluid-sm underline underline-offset-4 transition-colors"
            @click="emit('open', product)"
          >
            Tüm teknik özellikleri gör
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

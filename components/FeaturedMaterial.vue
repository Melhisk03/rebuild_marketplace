<script setup lang="ts">
import { Send, ArrowRight, BadgeCheck } from 'lucide-vue-next'
import { FEATURED_PRODUCT, type Product } from '~/data/products'

/**
 * Öne çıkan malzeme — editoryal düzen.
 *
 * Grid'deki karttan farklı olması şart: aynı bilgiyi büyütmek "öne
 * çıkarma" değil, sadece zoom olur. Burada fotoğraf tam yüksekliğe
 * çıkıyor, teknik özellikler iki sütunlu bir künyeye dönüşüyor ve
 * miktar sayfadaki en büyük rakam oluyor.
 */
const emit = defineEmits<{ open: [Product] }>()

const product = FEATURED_PRODUCT
/** Künyede yalnızca ilk altı özellik; tamamı modalde. */
const keySpecs = product.specs.slice(0, 6)
</script>

<template>
  <section class="bg-carbon relative overflow-hidden py-(--spacing-section)">
    <div class="blueprint absolute inset-0 opacity-40" aria-hidden="true" />

    <div class="shell relative">
      <SectionHeading
        eyebrow="Öne Çıkan Malzeme"
        title="Bu hafta öne çıkan stok."
        description="Miktarı, belgesi ve durumu doğrulanmış; tek partide teslim edilebilecek malzeme."
      />

      <div class="border-steel mt-12 grid border lg:grid-cols-[1.15fr_1fr]">
        <!-- Görsel -->
        <div v-reveal="{ as: 'left' }" class="relative min-h-[20rem] lg:min-h-[34rem]">
          <img
            src="/images/featured.webp"
            srcset="/images/featured-800.webp 800w, /images/featured.webp 1200w"
            sizes="(min-width: 1024px) 55vw, 100vw"
            :alt="`${product.name} — yakın çekim`"
            width="1200"
            height="900"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div class="grain absolute inset-0" aria-hidden="true" />
          <div
            class="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--color-carbon)_92%,transparent),transparent_58%)]"
            aria-hidden="true"
          />
          <ConditionBadge :condition="product.condition" size="md" class="absolute top-5 left-5" />

          <!-- Görselin üstündeki miktar: sayfadaki en büyük rakam -->
          <div class="absolute bottom-0 left-0 p-6 sm:p-8">
            <p class="label-tech">Mevcut Miktar</p>
            <p class="font-display text-bone tnum mt-1 text-fluid-4xl leading-none font-semibold">
              {{ formatQuantity(product.quantity) }}
              <span class="text-amber text-fluid-xl">{{ product.unit }}</span>
            </p>
          </div>
        </div>

        <!-- Künye -->
        <div v-reveal="{ as: 'right', delay: 120 }" class="border-steel flex flex-col p-6 sm:p-9 lg:border-l">
          <h3 class="font-display text-bone text-fluid-2xl leading-tight font-semibold">
            {{ product.name }}
          </h3>
          <p class="text-amber font-display mt-2 text-fluid-sm tracking-wide">{{ product.headline }}</p>

          <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
            <div v-for="spec in keySpecs" :key="spec.label">
              <dt class="label-tech text-[0.625rem]">{{ spec.label }}</dt>
              <dd class="text-bone mt-1 text-fluid-sm font-medium">{{ spec.value }}</dd>
            </div>
          </dl>

          <div class="border-steel mt-8 flex items-end justify-between gap-6 border-t pt-6">
            <div>
              <p class="label-tech text-[0.625rem]">Birim Fiyat</p>
              <p class="font-display text-bone tnum mt-1 text-fluid-xl font-semibold">
                {{ formatPrice(product.unitPrice) }}
                <span class="text-concrete text-fluid-sm">/ {{ product.unit }}</span>
              </p>
            </div>
            <div class="text-right">
              <p class="label-tech text-[0.625rem]">Toplam</p>
              <p class="font-display text-amber tnum mt-1 text-fluid-xl font-semibold">
                {{ formatPrice(product.price) }}
              </p>
            </div>
          </div>

          <p class="text-concrete mt-5 inline-flex items-center gap-1.5 text-fluid-xs">
            <BadgeCheck :size="14" :stroke-width="2" class="text-state-open" />
            {{ product.seller.name }} · {{ product.seller.completed }} tamamlanmış işlem
          </p>

          <div class="mt-7 flex flex-wrap gap-2.5">
            <button type="button" class="btn-primary" @click="emit('open', product)">
              <Send :size="16" :stroke-width="2" />
              Teklif İste
            </button>
            <button type="button" class="btn-ghost" @click="emit('open', product)">
              Tüm Özellikler
              <ArrowRight :size="15" :stroke-width="2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

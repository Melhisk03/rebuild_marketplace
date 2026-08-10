<script setup lang="ts">
import { X, MapPin, BadgeCheck, Calendar, Send, Phone } from 'lucide-vue-next'
import type { Product } from '~/data/products'
import { CATEGORY_BY_ID } from '~/data/categories'

/**
 * Ürün detay modalı.
 *
 * İki görünüm taşıyor: detay ve teklif formu. Ayrı modal açmak yerine
 * aynı panelin içinde geçiş yapıyor — üst üste iki katman kullanıcıyı
 * kaybettiriyor ve mobilde geri dönüş yolu belirsizleşiyor.
 */
const props = defineProps<{ product: Product | null }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const view = ref<'detail' | 'quote'>('detail')

/**
 * `open`, üst bileşendeki `product`'a yazan bir ara katman: odak tuzağı
 * boolean bir ref üzerinde çalışıyor, Esc'e basıldığında bunu false'a
 * çekiyor ve buradaki izleyici kapanışı yukarı bildiriyor.
 */
const open = computed({
  get: () => props.product !== null,
  set: (value) => {
    if (!value) emit('close')
  },
})

useFocusTrap(open, panel)

// Yeni ürün açıldığında her zaman detaydan başla; önceki üründe form
// açık bırakılmışsa o durum sonrakine sızmamalı.
watch(
  () => props.product?.id,
  (id) => {
    if (id) view.value = 'detail'
  },
)

const category = computed(() => (props.product ? CATEGORY_BY_ID[props.product.categoryId] : null))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div v-if="product" class="fixed inset-0 z-[70] bg-void/80 backdrop-blur-sm" @click="emit('close')" />
    </Transition>

    <Transition
      enter-active-class="transition-[opacity,transform] duration-400 ease-(--ease-out-expo)"
      enter-from-class="opacity-0 translate-y-6 sm:scale-[0.98] sm:translate-y-0"
      leave-active-class="transition-[opacity,transform] duration-250 ease-(--ease-out-expo)"
      leave-to-class="opacity-0 translate-y-4 sm:scale-[0.98] sm:translate-y-0"
    >
      <div
        v-if="product"
        class="pointer-events-none fixed inset-0 z-[71] flex items-end justify-center sm:items-center sm:p-6"
      >
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-label="product.name"
          tabindex="-1"
          class="border-steel bg-graphite pointer-events-auto max-h-[92svh] w-full max-w-5xl overflow-y-auto border focus:outline-none"
        >
          <!-- Kapat: panelin içinde ve sabit, uzun içerikte kaybolmasın -->
          <button
            type="button"
            class="border-steel bg-void/80 text-ash hover:text-bone sticky top-0 left-full z-10 -mb-11 inline-flex size-11 shrink-0 items-center justify-center border backdrop-blur transition-colors"
            aria-label="Kapat"
            @click="emit('close')"
          >
            <X :size="19" :stroke-width="1.75" />
          </button>

          <!-- ---------- DETAY ---------- -->
          <div v-if="view === 'detail'">
            <div class="grid lg:grid-cols-[1.05fr_1fr]">
              <!-- Görsel -->
              <div class="relative aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]">
                <MaterialPlate :plate="product.plate" />
                <span class="label-tech bg-void/75 text-ash absolute top-4 left-4 px-2.5 py-1.5 backdrop-blur-sm">
                  {{ category?.name }}
                </span>
                <ConditionBadge :condition="product.condition" size="md" class="absolute bottom-4 left-4" />
              </div>

              <!-- Künye -->
              <div class="flex flex-col p-6 sm:p-8">
                <h2 class="font-display text-bone text-fluid-2xl leading-tight font-semibold">
                  {{ product.name }}
                </h2>
                <p class="text-concrete mt-2 text-fluid-sm">{{ product.headline }}</p>

                <div class="border-steel mt-6 grid grid-cols-2 border-t border-l">
                  <div class="border-steel border-r border-b px-4 py-3.5">
                    <p class="label-tech text-[0.625rem]">Miktar</p>
                    <p class="font-display text-bone tnum mt-1 text-fluid-xl font-semibold">
                      {{ formatQuantity(product.quantity) }}
                      <span class="text-concrete text-fluid-sm">{{ product.unit }}</span>
                    </p>
                  </div>
                  <div class="border-steel border-r border-b px-4 py-3.5">
                    <p class="label-tech text-[0.625rem]">Birim Fiyat</p>
                    <p class="font-display text-bone tnum mt-1 text-fluid-lg font-semibold">
                      {{ formatPrice(product.unitPrice) }}
                    </p>
                  </div>
                  <div class="border-steel col-span-2 border-r border-b bg-carbon px-4 py-4">
                    <p class="label-tech text-[0.625rem]">Toplam Tutar</p>
                    <p class="font-display text-amber tnum mt-1 text-fluid-2xl font-semibold">
                      {{ formatPrice(product.price) }}
                    </p>
                  </div>
                </div>

                <div class="text-ash mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-fluid-sm">
                  <span class="inline-flex items-center gap-1.5">
                    <MapPin :size="14" :stroke-width="1.75" class="text-concrete" />
                    {{ product.city }} · {{ product.district }}
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <Calendar :size="14" :stroke-width="1.75" class="text-concrete" />
                    {{ relativeDay(product.listedAt) }}
                  </span>
                </div>

                <!-- Satıcı -->
                <div class="border-steel mt-5 flex items-center justify-between gap-4 border bg-carbon px-4 py-3.5">
                  <div class="min-w-0">
                    <p class="label-tech text-[0.625rem]">Satıcı</p>
                    <p class="text-bone mt-1 inline-flex items-center gap-1.5 truncate text-fluid-sm font-medium">
                      {{ product.seller.name }}
                      <BadgeCheck
                        v-if="product.seller.verified"
                        :size="15"
                        :stroke-width="2"
                        class="text-state-open shrink-0"
                      />
                    </p>
                  </div>
                  <p class="text-concrete tnum shrink-0 text-right text-fluid-xs">
                    {{ product.seller.completed }} işlem
                  </p>
                </div>

                <div class="mt-6 flex flex-wrap gap-2.5">
                  <button type="button" class="btn-primary flex-1" @click="view = 'quote'">
                    <Send :size="16" :stroke-width="2" />
                    Teklif İste
                  </button>
                  <a :href="`tel:+902324620099`" class="btn-ghost flex-1">
                    <Phone :size="16" :stroke-width="1.75" />
                    İletişime Geç
                  </a>
                </div>
              </div>
            </div>

            <!-- Açıklama + teknik özellikler -->
            <div class="border-steel grid border-t lg:grid-cols-[1.05fr_1fr]">
              <div class="border-steel p-6 sm:p-8 lg:border-r">
                <h3 class="label-tech">Açıklama</h3>
                <p class="text-ash mt-4 text-fluid-sm leading-relaxed">{{ product.description }}</p>
              </div>

              <div class="p-6 sm:p-8">
                <h3 class="label-tech">Teknik Özellikler</h3>
                <dl class="mt-4">
                  <div
                    v-for="spec in product.specs"
                    :key="spec.label"
                    class="border-steel/70 flex items-baseline justify-between gap-6 border-b py-2.5 last:border-0"
                  >
                    <dt class="text-concrete shrink-0 text-fluid-sm">{{ spec.label }}</dt>
                    <dd class="text-bone text-right text-fluid-sm font-medium">{{ spec.value }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- ---------- TEKLİF FORMU ---------- -->
          <QuoteForm v-else :product="product" @back="view = 'detail'" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, MapPin, BadgeCheck, Calendar, ShoppingCart, HandCoins, Heart, Package } from 'lucide-vue-next'
import type { Product } from '~/data/products'
import { CATEGORY_BY_ID } from '~/data/categories'

/**
 * Ürün detay modalı — üç görünüm tek panelde: detay, satın alma, teklif.
 *
 * Üst üste modal açmak yerine aynı panelin içinde geçiş yapıyor; iki
 * katman kullanıcıyı kaybettiriyor ve mobilde geri dönüş yolu belirsizleşiyor.
 */
const props = defineProps<{ product: Product | null; intent?: 'detail' | 'buy' | 'offer' }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const view = ref<'detail' | 'buy' | 'offer'>('detail')

const open = computed({
  get: () => props.product !== null,
  set: (value) => {
    if (!value) emit('close')
  },
})

useFocusTrap(open, panel)

// Kart hangi düğmeyle açtıysa o görünümle başla; ürün değişince sıfırla.
watch(
  () => [props.product?.id, props.intent] as const,
  ([id, intent]) => {
    if (id) view.value = intent ?? 'detail'
  },
  { immediate: true },
)

const category = computed(() => (props.product ? CATEGORY_BY_ID[props.product.categoryId] : null))
const favourites = useFavourites()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-250"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div v-if="product" class="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-[2px]" @click="emit('close')" />
    </Transition>

    <Transition
      enter-active-class="transition-[opacity,transform] duration-350 ease-(--ease-out-expo)"
      enter-from-class="opacity-0 translate-y-6 sm:scale-[0.98] sm:translate-y-0"
      leave-active-class="transition-[opacity,transform] duration-200 ease-(--ease-out-expo)"
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
          class="bg-paper pointer-events-auto max-h-[94svh] w-full max-w-5xl overflow-y-auto rounded-t-2xl shadow-pop focus:outline-none sm:rounded-2xl"
        >
          <!-- Kapat -->
          <button
            type="button"
            class="border-line bg-paper/90 text-slate hover:text-ink sticky top-3 left-full z-10 mr-3 -mb-11 inline-flex size-10 shrink-0 items-center justify-center rounded-full border backdrop-blur transition-colors"
            aria-label="Kapat"
            @click="emit('close')"
          >
            <X :size="18" :stroke-width="2" />
          </button>

          <!-- ---------- DETAY ---------- -->
          <div v-if="view === 'detail'">
            <div class="grid lg:grid-cols-[1.05fr_1fr]">
              <!-- Görsel -->
              <div class="relative aspect-[4/3] overflow-hidden rounded-t-2xl sm:rounded-tl-2xl sm:rounded-tr-none lg:aspect-auto lg:min-h-[24rem]">
                <MaterialPlate :plate="product.plate" />
                <span class="pill bg-paper/90 text-slate absolute top-4 left-4 backdrop-blur-sm">
                  {{ category?.name }}
                </span>
                <ConditionBadge :condition="product.condition" class="absolute bottom-4 left-4" />
              </div>

              <!-- Künye -->
              <div class="flex flex-col p-5 sm:p-7">
                <h2 class="font-display text-ink text-fluid-2xl leading-tight font-semibold">
                  {{ product.name }}
                </h2>
                <p class="text-slate mt-1.5 text-fluid-sm">{{ product.headline }}</p>

                <!-- Fiyat bloğu -->
                <div class="border-line bg-canvas mt-5 rounded-xl border p-4">
                  <div class="flex items-end justify-between gap-4">
                    <div>
                      <p class="label-tech text-[0.625rem]">Toplam tutar</p>
                      <p class="font-display text-amber-ink tnum mt-1 text-fluid-2xl leading-none font-bold">
                        {{ formatPrice(product.price) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="label-tech text-[0.625rem]">Birim</p>
                      <p class="font-display text-ink tnum mt-1 text-fluid-base font-semibold">
                        {{ formatPrice(product.unitPrice) }}
                        <span class="text-mute text-fluid-xs">/ {{ product.unit }}</span>
                      </p>
                    </div>
                  </div>
                  <p class="text-slate mt-3 inline-flex items-center gap-1.5 text-fluid-sm">
                    <Package :size="15" :stroke-width="1.75" class="text-mute" />
                    Stokta
                    <span class="text-ink font-semibold tnum">
                      {{ formatQuantity(product.quantity) }} {{ product.unit }}
                    </span>
                    · kısmi alım yapılabilir
                  </p>
                </div>

                <div class="text-slate mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-fluid-sm">
                  <span class="inline-flex items-center gap-1.5">
                    <MapPin :size="14" :stroke-width="1.75" class="text-mute" />
                    {{ product.city }} · {{ product.district }}
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <Calendar :size="14" :stroke-width="1.75" class="text-mute" />
                    {{ relativeDay(product.listedAt) }}
                  </span>
                </div>

                <!-- Satıcı -->
                <div class="border-line mt-4 flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
                  <div class="min-w-0">
                    <p class="label-tech text-[0.625rem]">Satıcı</p>
                    <p class="text-ink mt-0.5 inline-flex items-center gap-1.5 truncate text-fluid-sm font-medium">
                      {{ product.seller.name }}
                      <BadgeCheck
                        v-if="product.seller.verified"
                        :size="15"
                        :stroke-width="2"
                        class="text-info shrink-0"
                      />
                    </p>
                  </div>
                  <p class="text-mute tnum shrink-0 text-right text-fluid-xs">
                    {{ product.seller.completed }} işlem
                  </p>
                </div>

                <!-- Eylemler -->
                <div class="mt-5 flex flex-wrap items-center gap-2">
                  <button type="button" class="btn-base btn-buy flex-1" @click="view = 'buy'">
                    <ShoppingCart :size="16" :stroke-width="2" />
                    Satın Al
                  </button>
                  <button type="button" class="btn-base btn-offer flex-1" @click="view = 'offer'">
                    <HandCoins :size="16" :stroke-width="2" />
                    Teklif Ver
                  </button>
                  <button
                    type="button"
                    class="border-line hover:border-line-strong inline-flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors"
                    :aria-pressed="favourites.has(product.id)"
                    :aria-label="favourites.has(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'"
                    @click="favourites.toggle(product.id)"
                  >
                    <Heart
                      :size="17"
                      :stroke-width="1.9"
                      :class="favourites.has(product.id) ? 'fill-amber text-amber' : 'text-slate'"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- Açıklama + teknik özellikler -->
            <div class="border-line grid border-t lg:grid-cols-[1.05fr_1fr]">
              <div class="border-line p-5 sm:p-7 lg:border-r">
                <h3 class="label-tech">Açıklama</h3>
                <p class="text-slate mt-3 text-fluid-sm leading-relaxed">{{ product.description }}</p>
              </div>

              <div class="p-5 sm:p-7">
                <h3 class="label-tech">Teknik Özellikler</h3>
                <dl class="mt-3">
                  <div
                    v-for="spec in product.specs"
                    :key="spec.label"
                    class="border-line flex items-baseline justify-between gap-6 border-b py-2.5 last:border-0"
                  >
                    <dt class="text-mute shrink-0 text-fluid-sm">{{ spec.label }}</dt>
                    <dd class="text-ink text-right text-fluid-sm font-medium">{{ spec.value }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- ---------- SATIN AL / TEKLİF VER ---------- -->
          <DealPanel v-else :product="product" :mode="view" @back="view = 'detail'" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

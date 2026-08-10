<script setup lang="ts">
import { ArrowLeft, Minus, Plus, ShoppingCart, HandCoins, Loader2, CircleCheck, Info } from 'lucide-vue-next'
import type { Product } from '~/data/products'

/**
 * Satın alma ve teklif verme akışı — tek bileşen, iki kip.
 *
 * İkisi de aynı iskeleti paylaşıyor: miktar seç -> tutarı gör -> iletişim
 * bilgisi -> gönder -> özet. Ayrı iki bileşen yazmak iletişim alanlarını,
 * doğrulamayı ve başarı ekranını üç kez kopyalamak demekti.
 *
 * Fark tek yerde: `buy` kipinde birim fiyat SABİT (ilandaki fiyat),
 * `offer` kipinde alıcı kendi birim fiyatını yazıyor.
 *
 * Backend yok, gönderim taklit ediliyor — ama doğrulama ve hesaplar
 * gerçek. Müşteri demoda önce boş gönderip ne olduğuna bakıyor.
 */
const props = defineProps<{ product: Product; mode: 'buy' | 'offer' }>()
const emit = defineEmits<{ back: [] }>()

const KDV = 0.2

/** Miktar adımı birime göre: tonda ondalık, adette tam sayı. */
const step = computed(() => {
  const q = props.product.quantity
  if (!Number.isInteger(q)) return 0.1
  if (q >= 500) return 50
  if (q >= 100) return 10
  return 1
})

const amount = ref(props.product.quantity)
/** Teklif kipinde başlangıç: liste fiyatının %10 altı — pazarlığın başlangıcı. */
const offerUnit = ref(Math.round(props.product.unitPrice * 0.9))

const unitPrice = computed(() => (props.mode === 'buy' ? props.product.unitPrice : Math.max(0, offerUnit.value)))
const subtotal = computed(() => Math.round(unitPrice.value * amount.value))
const vat = computed(() => Math.round(subtotal.value * KDV))
const total = computed(() => subtotal.value + vat.value)

/** Liste fiyatına göre fark — teklifin ne kadar altta olduğunu gösteriyor. */
const delta = computed(() => {
  if (props.mode !== 'offer') return 0
  return Math.round(((unitPrice.value - props.product.unitPrice) / props.product.unitPrice) * 100)
})

function clamp(value: number) {
  const max = props.product.quantity
  const min = step.value
  return Math.min(max, Math.max(min, Number(value.toFixed(2))))
}

function bump(direction: 1 | -1) {
  amount.value = clamp(amount.value + direction * step.value)
}

// --- Form -------------------------------------------------------------
type Field = 'name' | 'company' | 'email' | 'phone'

const form = reactive<Record<Field, string> & { note: string }>({
  name: '',
  company: '',
  email: '',
  phone: '',
  note: '',
})
const errors = reactive<Partial<Record<Field | 'offerUnit', string>>>({})
const state = ref<'idle' | 'sending' | 'done'>('idle')

const FIELDS: { key: Field; label: string; type: string; autocomplete: string }[] = [
  { key: 'name', label: 'Ad Soyad', type: 'text', autocomplete: 'name' },
  { key: 'company', label: 'Firma', type: 'text', autocomplete: 'organization' },
  { key: 'email', label: 'E-posta', type: 'email', autocomplete: 'email' },
  { key: 'phone', label: 'Telefon', type: 'tel', autocomplete: 'tel' },
]

function validate() {
  for (const key of Object.keys(errors) as (Field | 'offerUnit')[]) delete errors[key]

  if (form.name.trim().length < 3) errors.name = 'Ad ve soyadınızı girin.'
  if (!form.company.trim()) errors.company = 'Firma adı gerekli.'
  // Kasten gevşek desen: RFC uyumlu doğrulama gerçek adresleri eliyor.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Geçerli bir e-posta girin.'
  if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Telefon numarası eksik görünüyor.'
  if (props.mode === 'offer' && unitPrice.value <= 0) errors.offerUnit = 'Birim fiyat girin.'

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) {
    document.querySelector<HTMLElement>('[data-invalid="true"]')?.focus()
    return
  }
  state.value = 'sending'
  await new Promise((r) => setTimeout(r, 900))
  state.value = 'done'
}

const isBuy = computed(() => props.mode === 'buy')
const reference = computed(() => (isBuy.value ? 'SP-2026-10428' : 'TK-2026-04871'))
</script>

<template>
  <!-- ---------- BAŞARI ---------- -->
  <div v-if="state === 'done'" class="flex flex-col items-center px-6 py-14 text-center sm:py-20">
    <span class="bg-ok-wash inline-flex size-14 items-center justify-center rounded-full">
      <CircleCheck :size="28" :stroke-width="1.6" class="text-ok" />
    </span>

    <h3 class="font-display text-ink mt-6 text-fluid-2xl font-semibold">
      {{ isBuy ? 'Siparişiniz oluşturuldu' : 'Teklifiniz iletildi' }}
    </h3>
    <p class="text-slate mt-3 max-w-md text-fluid-base">
      <span class="text-ink font-medium">{{ product.seller.name }}</span>
      {{
        isBuy
          ? ' siparişinizi onayladıktan sonra ödeme ve sevkiyat bilgileri e-postanıza gelecek.'
          : ' teklifinizi değerlendirip genellikle 1 iş günü içinde dönüş yapıyor.'
      }}
    </p>

    <dl class="border-line mt-8 w-full max-w-sm divide-y divide-line rounded-xl border text-left">
      <div class="flex items-center justify-between px-4 py-3">
        <dt class="label-tech">{{ isBuy ? 'Sipariş No' : 'Teklif No' }}</dt>
        <dd class="font-mono text-ink text-fluid-sm">{{ reference }}</dd>
      </div>
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <dt class="label-tech">Malzeme</dt>
        <dd class="text-ink text-right text-fluid-sm">{{ product.name }}</dd>
      </div>
      <div class="flex items-center justify-between px-4 py-3">
        <dt class="label-tech">Miktar</dt>
        <dd class="text-ink tnum text-fluid-sm">{{ formatQuantity(amount) }} {{ product.unit }}</dd>
      </div>
      <div class="bg-canvas flex items-center justify-between rounded-b-xl px-4 py-3">
        <dt class="label-tech">{{ isBuy ? 'Toplam (KDV dahil)' : 'Teklif tutarı' }}</dt>
        <dd class="font-display text-amber-ink tnum text-fluid-lg font-bold">{{ formatPrice(total) }}</dd>
      </div>
    </dl>

    <button type="button" class="btn-base btn-quiet mt-8" @click="emit('back')">Ürün detayına dön</button>
  </div>

  <!-- ---------- FORM ---------- -->
  <form v-else class="px-5 py-6 sm:px-8" novalidate @submit.prevent="submit">
    <button
      type="button"
      class="font-display text-mute hover:text-ink inline-flex items-center gap-1.5 text-fluid-sm transition-colors"
      @click="emit('back')"
    >
      <ArrowLeft :size="15" :stroke-width="2" />
      Ürün detayı
    </button>

    <h3 class="font-display text-ink mt-4 text-fluid-xl font-semibold">
      {{ isBuy ? 'Satın Al' : 'Teklif Ver' }}
    </h3>
    <p class="text-slate mt-1.5 text-fluid-sm">{{ product.name }}</p>

    <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
      <!-- Sol: miktar, fiyat, iletişim -->
      <div>
        <!-- Miktar -->
        <label class="label-tech mb-2 block">Miktar ({{ product.unit }})</label>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="border-line hover:border-line-strong inline-flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:opacity-40"
            :disabled="amount <= step"
            aria-label="Azalt"
            @click="bump(-1)"
          >
            <Minus :size="16" :stroke-width="2" />
          </button>
          <input
            :value="formatQuantity(amount)"
            inputmode="decimal"
            aria-label="Miktar"
            class="field tnum text-center font-display text-fluid-lg font-semibold"
            @change="amount = clamp(Number(($event.target as HTMLInputElement).value.replace(',', '.')) || step)"
          />
          <button
            type="button"
            class="border-line hover:border-line-strong inline-flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:opacity-40"
            :disabled="amount >= product.quantity"
            aria-label="Artır"
            @click="bump(1)"
          >
            <Plus :size="16" :stroke-width="2" />
          </button>
        </div>
        <p class="text-mute mt-2 text-fluid-xs">
          Stokta {{ formatQuantity(product.quantity) }} {{ product.unit }} var. Kısmi alım yapılabilir.
        </p>

        <!-- Teklif kipinde birim fiyat -->
        <div v-if="!isBuy" class="mt-5">
          <label for="offer-unit" class="label-tech mb-2 block">
            Teklif ettiğiniz birim fiyat (₺ / {{ product.unit }})
          </label>
          <input
            id="offer-unit"
            v-model.number="offerUnit"
            type="number"
            min="1"
            :data-invalid="Boolean(errors.offerUnit)"
            class="field tnum font-display text-fluid-lg font-semibold"
            :class="errors.offerUnit && 'border-amber'"
          />
          <p class="mt-2 text-fluid-xs" :class="delta < 0 ? 'text-ok' : 'text-mute'">
            Liste fiyatı {{ formatPrice(product.unitPrice) }} —
            <span v-if="delta < 0">teklifiniz %{{ Math.abs(delta) }} altında.</span>
            <span v-else-if="delta > 0">teklifiniz %{{ delta }} üstünde.</span>
            <span v-else>teklifiniz liste fiyatıyla aynı.</span>
          </p>
          <p v-if="errors.offerUnit" class="text-amber-ink mt-1.5 text-fluid-xs">{{ errors.offerUnit }}</p>
        </div>

        <!-- İletişim -->
        <div class="mt-7 grid gap-4 sm:grid-cols-2">
          <div v-for="f in FIELDS" :key="f.key">
            <label :for="`d-${f.key}`" class="label-tech mb-1.5 block">
              {{ f.label }} <span class="text-amber-ink">*</span>
            </label>
            <input
              :id="`d-${f.key}`"
              v-model="form[f.key]"
              :type="f.type"
              :autocomplete="f.autocomplete"
              :data-invalid="Boolean(errors[f.key])"
              :aria-invalid="Boolean(errors[f.key])"
              :aria-describedby="errors[f.key] ? `e-${f.key}` : undefined"
              class="field"
              :class="errors[f.key] && 'border-amber'"
            />
            <p v-if="errors[f.key]" :id="`e-${f.key}`" class="text-amber-ink mt-1.5 text-fluid-xs">
              {{ errors[f.key] }}
            </p>
          </div>

          <div class="sm:col-span-2">
            <label for="d-note" class="label-tech mb-1.5 block">Not (isteğe bağlı)</label>
            <textarea
              id="d-note"
              v-model="form.note"
              rows="3"
              class="field resize-y"
              :placeholder="isBuy ? 'Sevkiyat veya teslim tercihiniz…' : 'Teklifinizle ilgili not…'"
            />
          </div>
        </div>
      </div>

      <!-- Sağ: özet -->
      <aside class="lg:sticky lg:top-4 lg:self-start">
        <div class="border-line bg-canvas rounded-xl border p-5">
          <h4 class="font-display text-ink text-fluid-base font-semibold">Özet</h4>

          <dl class="mt-4 space-y-2.5 text-fluid-sm">
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-slate">Birim fiyat</dt>
              <dd class="text-ink tnum font-medium">{{ formatPrice(unitPrice) }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-slate">Miktar</dt>
              <dd class="text-ink tnum font-medium">{{ formatQuantity(amount) }} {{ product.unit }}</dd>
            </div>
            <div class="border-line flex items-baseline justify-between gap-3 border-t pt-2.5">
              <dt class="text-slate">Ara toplam</dt>
              <dd class="text-ink tnum font-medium">{{ formatPrice(subtotal) }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-slate">KDV (%20)</dt>
              <dd class="text-ink tnum font-medium">{{ formatPrice(vat) }}</dd>
            </div>
            <div class="border-line flex items-baseline justify-between gap-3 border-t pt-3">
              <dt class="font-display text-ink font-semibold">
                {{ isBuy ? 'Toplam' : 'Teklif tutarı' }}
              </dt>
              <dd class="font-display text-amber-ink tnum text-fluid-lg font-bold">{{ formatPrice(total) }}</dd>
            </div>
          </dl>

          <p class="text-mute mt-4 flex gap-2 text-fluid-xs">
            <Info :size="14" :stroke-width="1.75" class="mt-0.5 shrink-0" />
            {{
              isBuy
                ? 'Nakliye tutara dahil değildir; satıcı onayından sonra ayrıca bildirilir.'
                : 'Teklifiniz satıcıya iletilir. Kabul, red veya karşı teklif ile yanıtlanabilir.'
            }}
          </p>

          <button type="submit" class="btn-base btn-buy mt-5 w-full" :disabled="state === 'sending'">
            <Loader2 v-if="state === 'sending'" :size="16" :stroke-width="2" class="animate-spin" />
            <component :is="isBuy ? ShoppingCart : HandCoins" v-else :size="16" :stroke-width="2" />
            {{ state === 'sending' ? 'Gönderiliyor…' : isBuy ? 'Siparişi Oluştur' : 'Teklifi Gönder' }}
          </button>

          <p class="text-mute mt-3 text-center text-fluid-xs">Bu bir demodur, veri kaydedilmez.</p>
        </div>
      </aside>
    </div>
  </form>
</template>

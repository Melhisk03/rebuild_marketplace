<script setup lang="ts">
import { Send, Loader2, CircleCheck, ArrowLeft } from 'lucide-vue-next'
import type { Product } from '~/data/products'

/**
 * Teklif formu.
 *
 * Backend yok — demoda gönderim taklit ediliyor. Ama doğrulama GERÇEK:
 * boş alan, geçersiz e-posta ve kısa telefon gerçekten yakalanıyor.
 * Müşteri demoda ilk olarak formu boş gönderip ne olduğuna bakıyor;
 * hiçbir şey olmaması "yarım iş" izlenimi bırakıyor.
 */
const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ back: [] }>()

type Field = 'name' | 'company' | 'email' | 'phone' | 'message'

const form = reactive<Record<Field, string>>({
  name: '',
  company: '',
  email: '',
  phone: '',
  message: `${props.product.name} (${formatQuantity(props.product.quantity)} ${props.product.unit}) için teklif almak istiyorum.`,
})

const errors = reactive<Partial<Record<Field, string>>>({})
const state = ref<'idle' | 'sending' | 'done'>('idle')

function validate(): boolean {
  for (const key of Object.keys(errors) as Field[]) delete errors[key]

  if (form.name.trim().length < 3) errors.name = 'Ad ve soyadınızı girin.'
  if (!form.company.trim()) errors.company = 'Firma adı gerekli.'
  // Kasten gevşek desen: RFC uyumlu doğrulama gerçek adresleri eliyor.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Geçerli bir e-posta girin.'
  if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Telefon numarası eksik görünüyor.'

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) {
    // İlk hatalı alana odaklan: uzun formda hatanın nerede olduğunu
    // aramak zorunda kalmasın.
    const first = document.querySelector<HTMLElement>('[data-invalid="true"]')
    first?.focus()
    return
  }

  state.value = 'sending'
  await new Promise((resolve) => setTimeout(resolve, 900))
  state.value = 'done'
}

const fields: { key: Field; label: string; type: string; autocomplete: string; span?: boolean }[] = [
  { key: 'name', label: 'Ad Soyad', type: 'text', autocomplete: 'name' },
  { key: 'company', label: 'Firma', type: 'text', autocomplete: 'organization' },
  { key: 'email', label: 'E-posta', type: 'email', autocomplete: 'email' },
  { key: 'phone', label: 'Telefon', type: 'tel', autocomplete: 'tel' },
]
</script>

<template>
  <!-- ---------- Başarı durumu ---------- -->
  <div v-if="state === 'done'" class="flex flex-col items-center px-6 py-16 text-center sm:py-24">
    <span class="border-state-new/40 bg-state-new/10 inline-flex size-16 items-center justify-center border">
      <CircleCheck :size="30" :stroke-width="1.4" class="text-state-new" />
    </span>
    <h3 class="font-display text-bone mt-7 text-fluid-2xl font-semibold">Teklif talebiniz iletildi</h3>
    <p class="text-ash mt-3 max-w-md text-fluid-base leading-relaxed">
      <span class="text-bone font-medium">{{ product.seller.name }}</span> firmasına talebiniz ulaştı.
      Satıcı genellikle <span class="text-bone">1 iş günü</span> içinde dönüş yapıyor.
    </p>

    <dl class="border-steel mt-9 w-full max-w-sm border">
      <div class="border-steel/70 flex items-center justify-between border-b px-4 py-3">
        <dt class="label-tech">Talep No</dt>
        <dd class="font-mono text-bone text-fluid-sm">DY-2026-04871</dd>
      </div>
      <div class="flex items-center justify-between px-4 py-3">
        <dt class="label-tech">Malzeme</dt>
        <dd class="text-bone text-fluid-sm">{{ product.name }}</dd>
      </div>
    </dl>

    <button type="button" class="btn-ghost mt-9" @click="emit('back')">Ürün detayına dön</button>
  </div>

  <!-- ---------- Form ---------- -->
  <form v-else class="px-6 py-7 sm:px-8" novalidate @submit.prevent="submit">
    <button
      type="button"
      class="font-display text-concrete hover:text-bone inline-flex items-center gap-1.5 text-fluid-sm transition-colors"
      @click="emit('back')"
    >
      <ArrowLeft :size="15" :stroke-width="2" />
      Ürün detayı
    </button>

    <h3 class="font-display text-bone mt-5 text-fluid-xl font-semibold">Teklif İste</h3>
    <p class="text-concrete mt-2 text-fluid-sm">
      Talebiniz doğrudan satıcıya iletilir. İletişim bilgileriniz yalnızca bu talep için kullanılır.
    </p>

    <div class="mt-7 grid gap-5 sm:grid-cols-2">
      <div v-for="field in fields" :key="field.key">
        <label :for="`q-${field.key}`" class="label-tech mb-1.5 block text-[0.625rem]">
          {{ field.label }} <span class="text-amber">*</span>
        </label>
        <input
          :id="`q-${field.key}`"
          v-model="form[field.key]"
          :type="field.type"
          :autocomplete="field.autocomplete"
          :data-invalid="Boolean(errors[field.key])"
          :aria-invalid="Boolean(errors[field.key])"
          :aria-describedby="errors[field.key] ? `err-${field.key}` : undefined"
          class="text-bone placeholder:text-concrete w-full border bg-carbon px-3.5 py-3 text-fluid-sm transition-colors duration-300 focus:outline-none"
          :class="errors[field.key] ? 'border-amber' : 'border-steel focus:border-concrete'"
        />
        <p v-if="errors[field.key]" :id="`err-${field.key}`" class="text-amber mt-1.5 text-fluid-xs">
          {{ errors[field.key] }}
        </p>
      </div>

      <div class="sm:col-span-2">
        <label for="q-message" class="label-tech mb-1.5 block text-[0.625rem]">Mesaj</label>
        <textarea
          id="q-message"
          v-model="form.message"
          rows="4"
          class="text-bone border-steel focus:border-concrete w-full resize-y border bg-carbon px-3.5 py-3 text-fluid-sm transition-colors duration-300 focus:outline-none"
        />
      </div>
    </div>

    <div class="mt-7 flex flex-wrap items-center gap-3">
      <button type="submit" class="btn-primary" :disabled="state === 'sending'">
        <Loader2 v-if="state === 'sending'" :size="16" :stroke-width="2" class="animate-spin" />
        <Send v-else :size="16" :stroke-width="2" />
        {{ state === 'sending' ? 'Gönderiliyor…' : 'Teklif Talebini Gönder' }}
      </button>
      <p class="text-concrete text-fluid-xs">Bu bir demo formudur, veri kaydedilmez.</p>
    </div>
  </form>
</template>

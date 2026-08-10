<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

/**
 * Filtre açılırı — biçimlendirilmiş NATIVE `<select>`.
 *
 * Özel dropdown değil: mobilde işletim sisteminin kendi seçicisi her özel
 * çözümden iyi, klavye ve ekran okuyucu davranışı bedavaya geliyor, sıfır JS.
 */
defineProps<{
  label: string
  options: { value: string; label: string }[]
  active?: boolean
}>()

const model = defineModel<string>({ required: true })
const id = useId()
</script>

<template>
  <div class="relative min-w-0">
    <label :for="id" class="label-tech mb-1.5 block text-[0.625rem]">{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        class="field cursor-pointer appearance-none pr-9 font-display"
        :class="active && 'border-amber bg-amber-wash text-amber-ink'"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown
        :size="15"
        :stroke-width="2"
        class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        :class="active ? 'text-amber-ink' : 'text-mute'"
      />
    </div>
  </div>
</template>

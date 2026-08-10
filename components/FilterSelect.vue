<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

/**
 * Filtre açılırı.
 *
 * Özel bir dropdown değil, biçimlendirilmiş NATIVE `<select>`. Gerekçe:
 * mobilde işletim sisteminin kendi seçicisi her özel çözümden iyi,
 * klavye ve ekran okuyucu davranışı bedavaya geliyor ve sıfır JS.
 * Görsel bütünlük `appearance: none` + kendi okumuzla sağlanıyor.
 */
defineProps<{
  label: string
  options: { value: string; label: string }[]
  /** Filtre aktifken kenarlık amber'a dönüyor */
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
        class="font-display text-bone w-full cursor-pointer appearance-none border bg-carbon py-2.5 pr-9 pl-3 text-fluid-sm transition-colors duration-300 hover:border-concrete focus:outline-none"
        :class="active ? 'border-amber/60' : 'border-steel'"
      >
        <option v-for="option in options" :key="option.value" :value="option.value" class="bg-carbon">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown
        :size="15"
        :stroke-width="1.75"
        class="text-concrete pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Bölüm başlığı kalıbı: etiket + başlık + isteğe bağlı açıklama.
 *
 * Sayfadaki her bölüm bunu kullanıyor; ritmi tek yerden değiştirebilmek
 * için ayrı bileşen. `tone` açık zeminli bölümlerde metin rengini çeviriyor.
 */
withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    description?: string
    tone?: 'dark' | 'light'
    align?: 'start' | 'center'
  }>(),
  { tone: 'dark', align: 'start' },
)
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'">
    <p v-reveal="{ as: 'fade' }" class="eyebrow" :class="align === 'start' && 'eyebrow-rule'">
      {{ eyebrow }}
    </p>
    <h2
      v-reveal="{ delay: 80 }"
      class="text-fluid-3xl mt-5 font-semibold"
      :class="tone === 'dark' ? 'text-bone' : 'text-ink'"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      v-reveal="{ delay: 150 }"
      class="text-fluid-base mt-4 max-w-[62ch] leading-relaxed"
      :class="tone === 'dark' ? 'text-ash' : 'text-slate'"
    >
      {{ description }}
    </p>
  </div>
</template>

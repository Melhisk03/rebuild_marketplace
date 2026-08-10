<script setup lang="ts">
/**
 * Bölüm başlığı kalıbı: etiket + başlık + isteğe bağlı açıklama.
 * `tone` yalnızca koyu CTA/footer şeritlerinde çevriliyor.
 */
withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    description?: string
    tone?: 'light' | 'dark'
  }>(),
  { tone: 'light' },
)
</script>

<template>
  <div class="max-w-3xl">
    <p v-reveal="{ as: 'fade' }" class="eyebrow" :class="tone === 'dark' && 'text-amber'">
      {{ eyebrow }}
    </p>
    <h2
      v-reveal="{ delay: 70 }"
      class="text-fluid-3xl mt-3 font-semibold"
      :class="tone === 'light' ? 'text-ink' : 'text-bone'"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      v-reveal="{ delay: 130 }"
      class="text-fluid-base mt-3 max-w-[62ch]"
      :class="tone === 'light' ? 'text-slate' : 'text-ash'"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Search, FileSearch, Handshake } from 'lucide-vue-next'

/**
 * Nasıl çalışır — üç adım.
 *
 * Metinler `data/site.ts` yerine burada: adımlar ikonlarıyla birlikte tek
 * bir anlatı ve ikisini ayrı dosyalarda tutmak düzenlemeyi zorlaştırıyordu.
 */
const STEPS = [
  {
    no: '01',
    icon: Search,
    title: 'Keşfet',
    body: 'İhtiyacınız olan malzemeyi kategori, lokasyon ve durum filtreleriyle bulun.',
  },
  {
    no: '02',
    icon: FileSearch,
    title: 'İncele',
    body: 'Teknik özellikleri, standardı ve stok miktarını ilan detayında kontrol edin.',
  },
  {
    no: '03',
    icon: Handshake,
    title: 'Satın al ya da teklif ver',
    body: 'Fiyat uygunsa doğrudan satın alın; değilse kendi birim fiyatınızı teklif edin.',
  },
]
</script>

<template>
  <section id="nasil-calisir" class="bg-paper py-(--spacing-section)">
    <div class="shell">
      <SectionHeading
        eyebrow="Nasıl çalışır?"
        title="Üç adımda malzemeden teslimata"
        description="Platform aracı değil, buluşturucu. Fiyat ve teslim koşulları alıcı ile satıcı arasında belirlenir."
      />

      <ol v-reveal="{ stagger: 110, children: 'li' }" class="mt-8 grid gap-4 md:grid-cols-3">
        <li v-for="step in STEPS" :key="step.no" class="border-line relative rounded-xl border bg-canvas p-6">
          <span
            class="bg-paper border-line text-amber-ink inline-flex size-11 items-center justify-center rounded-xl border"
          >
            <component :is="step.icon" :size="20" :stroke-width="1.75" />
          </span>
          <span class="font-display text-line-strong absolute top-5 right-5 text-fluid-2xl font-bold tnum">
            {{ step.no }}
          </span>

          <h3 class="font-display text-ink mt-5 text-fluid-lg font-semibold">{{ step.title }}</h3>
          <p class="text-slate mt-2 text-fluid-sm leading-relaxed">{{ step.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

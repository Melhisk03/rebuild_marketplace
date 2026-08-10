<script setup lang="ts">
import { ShieldCheck, TrendingDown, Recycle, FileText } from 'lucide-vue-next'
import { VALUES } from '~/data/site'

const ICONS = { ShieldCheck, TrendingDown, Recycle, FileText }
</script>

<template>
  <section id="hakkimizda" class="bg-chalk py-(--spacing-section)">
    <div class="shell">
      <SectionHeading
        eyebrow="Neden Döngüsel Yapı"
        title="Artan malzeme, azalan maliyet"
        description="Platform, kurumsal inşaat firmalarının stok fazlasını yine kurumsal alıcılarla buluşturmak için kuruldu. İlanlar bireysel değil, proje kaynaklıdır."
      />

      <ul v-reveal="{ stagger: 80, children: 'li' }" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="value in VALUES" :key="value.title" class="card p-5">
          <component
            :is="ICONS[value.icon as keyof typeof ICONS]"
            :size="24"
            :stroke-width="1.6"
            class="text-amber-ink"
          />
          <h3 class="font-display text-ink mt-4 text-fluid-base font-semibold">{{ value.title }}</h3>
          <p class="text-slate mt-2 text-fluid-sm leading-relaxed">{{ value.body }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

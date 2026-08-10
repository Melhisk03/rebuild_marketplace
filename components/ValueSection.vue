<script setup lang="ts">
import { ShieldCheck, TrendingDown, Recycle, FileText } from 'lucide-vue-next'
import { VALUES } from '~/data/site'

const ICONS = { ShieldCheck, TrendingDown, Recycle, FileText }
</script>

<template>
  <section id="hakkimizda" class="bg-chalk py-(--spacing-section)">
    <div class="shell">
      <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <!-- Sol: iddia -->
        <div class="lg:sticky lg:top-28 lg:self-start">
          <p v-reveal="{ as: 'fade' }" class="eyebrow eyebrow-rule">Neden Döngüsel Yapı</p>
          <h2 v-reveal="{ delay: 80 }" class="text-ink text-fluid-3xl mt-5 font-semibold">
            Artan malzeme,<br />
            <span class="text-amber-deep">azalan</span> maliyet.
          </h2>
          <p v-reveal="{ delay: 150 }" class="text-slate mt-5 max-w-[46ch] text-fluid-base leading-relaxed">
            Platform, kurumsal inşaat firmalarının stok fazlasını yine kurumsal alıcılarla
            buluşturmak için kuruldu. İlanlar bireysel değil, proje kaynaklıdır.
          </p>
        </div>

        <!-- Sağ: değerler -->
        <ul v-reveal="{ stagger: 90, children: 'li' }" class="grid gap-px bg-chalk-edge sm:grid-cols-2">
          <li v-for="value in VALUES" :key="value.title" class="bg-chalk p-7">
            <component
              :is="ICONS[value.icon as keyof typeof ICONS]"
              :size="26"
              :stroke-width="1.25"
              class="text-amber-deep"
            />
            <h3 class="font-display text-ink mt-6 text-fluid-lg font-semibold">{{ value.title }}</h3>
            <p class="text-slate mt-2.5 text-fluid-sm leading-relaxed">{{ value.body }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

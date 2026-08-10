<script setup lang="ts">
import { STEPS } from '~/data/site'
</script>

<template>
  <section id="nasil-calisir" class="bg-carbon py-(--spacing-section)">
    <div class="shell">
      <SectionHeading
        eyebrow="Nasıl Çalışır?"
        title="Üç adımda malzemeden teklife."
        description="Platform aracı değil, buluşturucu. Fiyat ve teslim koşulları alıcı ile satıcı arasında belirlenir."
      />

      <!-- Adımlar. Aralarındaki çizgi `lg`de yatay, altında dikey; adımların
           bir SÜREÇ olduğunu anlatan şey bu bağ. `aria-hidden` çünkü sırayı
           zaten numaralar taşıyor. -->
      <ol v-reveal="{ stagger: 130, children: 'li' }" class="relative mt-14 grid gap-px bg-steel lg:grid-cols-3">
        <li v-for="(step, index) in STEPS" :key="step.no" class="group relative bg-carbon p-7 sm:p-9">
          <div class="flex items-baseline gap-4">
            <span class="font-display text-iron text-fluid-3xl leading-none font-semibold tnum">
              {{ step.no }}
            </span>
            <span
              class="bg-steel group-hover:bg-amber h-px flex-1 origin-left transition-colors duration-500"
              aria-hidden="true"
            />
          </div>

          <h3 class="font-display text-bone mt-7 text-fluid-xl font-semibold">{{ step.title }}</h3>
          <p class="text-ash mt-3 max-w-[38ch] text-fluid-sm leading-relaxed">{{ step.body }}</p>

          <span
            v-if="index < STEPS.length - 1"
            class="border-steel bg-carbon text-concrete absolute top-1/2 -right-3.5 z-10 hidden size-7 -translate-y-1/2 place-items-center border text-fluid-xs lg:grid"
            aria-hidden="true"
          >
            →
          </span>
        </li>
      </ol>
    </div>
  </section>
</template>

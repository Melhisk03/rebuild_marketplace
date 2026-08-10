<script setup lang="ts">
import { ArrowUpRight, Mail } from 'lucide-vue-next'
</script>

<template>
  <section id="ilan-ver" class="relative isolate overflow-hidden bg-void">
    <!-- Amber, kenardan sızan tek bir ışık olarak: dolu turuncu bir blok
         bütün sayfanın tonunu bozuyordu. -->
    <div
      class="pointer-events-none absolute -top-1/2 left-1/2 -z-10 h-[36rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-amber)_16%,transparent),transparent_68%)] blur-2xl"
      aria-hidden="true"
    />
    <div class="blueprint absolute inset-0 -z-10 opacity-50" aria-hidden="true" />

    <div class="shell relative py-(--spacing-section)">
      <div class="border-steel bg-graphite/60 border px-6 py-14 backdrop-blur-sm sm:px-12 sm:py-20">
        <div class="mx-auto max-w-3xl text-center">
          <p v-reveal="{ as: 'fade' }" class="eyebrow justify-center">Satıcı Olun</p>

          <h2 v-reveal="{ delay: 80 }" class="text-fluid-3xl mt-6 font-semibold text-balance">
            Elinizde fazla malzeme mi var?
          </h2>

          <p v-reveal="{ delay: 150 }" class="text-ash mx-auto mt-5 max-w-[52ch] text-fluid-lg leading-relaxed">
            Projelerinizden kalan malzemeleri yeni sahipleriyle buluşturun. İlan vermek
            ücretsiz, komisyon yalnızca satış gerçekleştiğinde alınır.
          </p>

          <div v-reveal="{ stagger: 90, delay: 240 }" class="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#malzemeler" class="btn-primary">
              Malzeme Listele
              <ArrowUpRight :size="16" :stroke-width="2" />
            </a>
            <a href="mailto:info@donguselyapi.com" class="btn-ghost">
              <Mail :size="16" :stroke-width="1.75" />
              Bizimle İletişime Geç
            </a>
          </div>

          <p v-reveal="{ as: 'fade', delay: 320 }" class="text-concrete mt-8 text-fluid-xs">
            Kurumsal firmalar için toplu stok aktarımı ve API entegrasyonu mevcuttur.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

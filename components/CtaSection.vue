<script setup lang="ts">
import { Plus, Mail, ArrowRight } from 'lucide-vue-next'

/**
 * Satıcı çağrısı.
 *
 * Sayfanın tek koyu şeridi. Bilinçli: baştan sona açık bir sayfada tek bir
 * koyu blok "burada karar ver" diyor; her yeri koyu yapmak bu vurguyu
 * tamamen yok ediyordu.
 */
const points = [
  'İlan vermek ücretsiz',
  'Komisyon yalnızca satışta',
  'Kurumsal toplu stok aktarımı',
]
</script>

<template>
  <section id="ilan-ver" class="relative isolate overflow-hidden bg-carbon">
    <div class="gridlines-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
    <!-- Hero'dan artan fotoğraf burada doku olarak: koyu şeridi düz bir
         renk bloğu olmaktan çıkarıyor. -->
    <img
      src="/images/hero-1280.webp"
      alt=""
      aria-hidden="true"
      width="1280"
      height="720"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 h-full w-full object-cover opacity-[0.16]"
    />
    <div
      class="absolute inset-0 bg-[linear-gradient(100deg,var(--color-carbon)_28%,transparent_120%)]"
      aria-hidden="true"
    />

    <div class="shell relative py-(--spacing-section)">
      <div class="grid items-center gap-9 lg:grid-cols-[1.1fr_auto]">
        <div>
          <p v-reveal="{ as: 'fade' }" class="eyebrow text-amber">Satıcı olun</p>
          <h2 v-reveal="{ delay: 70 }" class="text-fluid-3xl text-bone mt-3 font-semibold">
            Elinizde fazla malzeme mi var?
          </h2>
          <p v-reveal="{ delay: 130 }" class="text-ash mt-4 max-w-[52ch] text-fluid-lg">
            Projelerinizden kalan malzemeleri yeni sahipleriyle buluşturun. Stok fazlanız
            maliyet olmaktan çıkıp gelire dönüşsün.
          </p>

          <ul v-reveal="{ as: 'fade', delay: 180 }" class="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <li v-for="p in points" :key="p" class="text-ash inline-flex items-center gap-2 text-fluid-sm">
              <span class="bg-amber size-1.5 rounded-full" />
              {{ p }}
            </li>
          </ul>
        </div>

        <div v-reveal="{ as: 'up', delay: 220 }" class="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
          <a href="#malzemeler" class="btn-base btn-buy">
            <Plus :size="16" :stroke-width="2.4" />
            Malzeme Listele
            <ArrowRight :size="15" :stroke-width="2" />
          </a>
          <a href="mailto:info@donguselyapi.com" class="btn-base btn-on-dark">
            <Mail :size="16" :stroke-width="1.9" />
            Bizimle İletişime Geç
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

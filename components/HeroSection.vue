<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { STATS } from '~/data/site'

/**
 * Hero.
 *
 * Görsel üç katmanla tasarıma bağlanıyor: aşağıdan yukarı koyulaşan
 * degrade, blueprint ızgarası ve film graini. Fotoğraf tek başına
 * kullanıldığında "stok görsel yapıştırılmış" duruyordu; bu üç katman
 * onu sitenin dokusuna oturtuyor.
 */
const scrollY = ref(0)
const reduced = ref(false)

function onScroll() {
  // Parallax yalnızca hero ekrandayken hesaplanıyor; aşağıda boşuna
  // stil yazmak uzun sayfada kaydırmayı ağırlaştırıyor.
  scrollY.value = window.scrollY < window.innerHeight ? window.scrollY : window.innerHeight
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) return
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

/** Görsel içerikten yavaş kayıyor: klasik derinlik hilesi, oran 0.18. */
const imageShift = computed(() => (reduced.value ? 0 : scrollY.value * 0.18))
const copyFade = computed(() => (reduced.value ? 1 : Math.max(0, 1 - scrollY.value / 620)))

/** Havada süzülen toz zerrecikleri — konumlar sabit, rastgele değil. */
const motes = [
  { x: 12, y: 68, s: 3, d: 0, t: 19 },
  { x: 23, y: 88, s: 2, d: 3, t: 24 },
  { x: 37, y: 76, s: 4, d: 7, t: 21 },
  { x: 51, y: 92, s: 2, d: 1, t: 27 },
  { x: 64, y: 71, s: 3, d: 5, t: 18 },
  { x: 73, y: 85, s: 2, d: 9, t: 25 },
  { x: 84, y: 79, s: 4, d: 2, t: 22 },
  { x: 92, y: 90, s: 2, d: 6, t: 20 },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section id="top" class="relative isolate flex min-h-[92svh] items-end overflow-hidden pt-28 pb-14">
    <!-- ---------- Görsel katmanı ---------- -->
    <div class="absolute inset-0 -z-20 overflow-hidden">
      <!-- `srcset`: dar ekranda 1920'lik dosyayı indirmenin anlamı yok.
           `sizes="100vw"` çünkü görsel her zaman tam genişlikte. -->
      <img
        src="/images/hero.webp"
        srcset="/images/hero-1280.webp 1280w, /images/hero.webp 1920w"
        sizes="100vw"
        alt="Gün batımında, istiflenmiş kereste sahası"
        width="1920"
        height="1080"
        fetchpriority="high"
        decoding="async"
        class="h-[118%] w-full object-cover object-center will-change-transform"
        :style="{ transform: `translate3d(0, ${imageShift}px, 0)` }"
      />
    </div>

    <!-- Degrade: en güçlü karartma altta, çünkü metin orada duruyor -->
    <div
      class="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-void)_4%,color-mix(in_oklab,var(--color-void)_88%,transparent)_34%,color-mix(in_oklab,var(--color-void)_58%,transparent)_66%,color-mix(in_oklab,var(--color-void)_72%,transparent)_100%)]"
    />
    <div class="blueprint absolute inset-0 -z-10 opacity-[0.55]" />
    <div class="grain absolute inset-0 -z-10" />

    <!-- Ölçüm hissi veren dikey tarama çizgisi -->
    <div
      class="animate-scan pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-px bg-[linear-gradient(to_bottom,transparent,var(--color-amber),transparent)] opacity-25 lg:left-[58%] lg:block"
      aria-hidden="true"
    />

    <!-- Toz zerrecikleri -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <span
        v-for="(m, i) in motes"
        :key="i"
        class="animate-drift bg-amber/45 absolute block"
        :style="{
          left: `${m.x}%`,
          top: `${m.y}%`,
          width: `${m.s}px`,
          height: `${m.s}px`,
          animationDelay: `-${m.d}s`,
          animationDuration: `${m.t}s`,
        }"
      />
    </div>

    <!-- ---------- İçerik ---------- -->
    <div class="shell relative w-full" :style="{ opacity: copyFade }">
      <!-- `lang="en"` şart: sayfa `lang="tr"` ve `text-transform: uppercase`
           Türkçe döküm kuralını uyguluyor — "Construction" versale çevrilince
           "CONSTRUCTİON" oluyor. Metin İngilizce olduğunu söyleyince tarayıcı
           doğru kuralı seçiyor. -->
      <p
        v-reveal="{ as: 'fade' }"
        lang="en"
        class="eyebrow eyebrow-rule border-amber/25 bg-amber/[0.07] border px-3 py-1.5 backdrop-blur-sm"
      >
        Construction Material Marketplace
      </p>

      <h1
        v-reveal="{ delay: 90 }"
        class="text-fluid-mega mt-7 max-w-[19ch] font-semibold text-balance"
      >
        Bir projenin fazlası,<br />
        <span class="text-amber">diğerinin</span> tam ihtiyacı.
      </h1>

      <p v-reveal="{ delay: 200 }" class="text-ash text-fluid-lg mt-7 max-w-[54ch] leading-relaxed">
        Projelerden arta kalan kaliteli inşaat malzemelerini keşfedin, ihtiyaçlarınıza uygun
        ürünleri avantajlı fiyatlarla değerlendirin.
      </p>

      <div v-reveal="{ stagger: 90, delay: 300 }" class="mt-10 flex flex-wrap items-center gap-3">
        <button type="button" class="btn-primary" @click="scrollTo('malzemeler')">
          Malzemeleri Keşfet
          <ArrowRight :size="17" :stroke-width="2" />
        </button>
        <button type="button" class="btn-ghost backdrop-blur-sm" @click="scrollTo('nasil-calisir')">
          Nasıl Çalışır?
        </button>
      </div>

      <!-- Alt şerit: hero'yu sayfaya bağlayan ve platformun ölçeğini
           ilk ekranda gösteren sayısal kanıt -->
      <dl
        v-reveal="{ as: 'fade', delay: 460 }"
        class="border-steel/70 mt-14 grid grid-cols-2 gap-x-6 gap-y-7 border-t pt-8 sm:grid-cols-4"
      >
        <div v-for="stat in STATS" :key="stat.label">
          <dt class="label-tech">{{ stat.label }}</dt>
          <dd class="font-display text-bone mt-1.5 text-fluid-xl font-semibold tnum">
            {{ stat.value.toLocaleString('tr-TR') }}{{ stat.suffix }}
          </dd>
        </div>
      </dl>
    </div>

  </section>
</template>

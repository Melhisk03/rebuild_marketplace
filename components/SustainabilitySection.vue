<script setup lang="ts">
import { IMPACT } from '~/data/site'

/**
 * Sürdürülebilirlik — sayfanın hikâye bölümü.
 *
 * Buradaki tipografi sayfadaki en büyük ikinci ölçek. Bilinçli: bu bölüm
 * ürün satmıyor, platformun VARLIK SEBEBİNİ anlatıyor ve müşteri sunumunda
 * en çok konuşulan yer burası oluyor. Fotoğraf tam genişlikte arka planda,
 * metin onun üstünde.
 */
</script>

<template>
  <section id="surdurulebilirlik" class="relative isolate overflow-hidden bg-void">
    <!-- Arka plan görseli -->
    <div class="absolute inset-0 -z-20">
      <img
        src="/images/sustainability.webp"
        srcset="/images/sustainability-1280.webp 1280w, /images/sustainability.webp 1920w"
        sizes="100vw"
        alt="Kurulumu süren çelik taşıyıcı sistem, havadan görünüm"
        width="1920"
        height="1080"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover"
      />
    </div>
    <div
      class="absolute inset-0 -z-10 bg-[linear-gradient(105deg,var(--color-void)_18%,color-mix(in_oklab,var(--color-void)_86%,transparent)_52%,color-mix(in_oklab,var(--color-void)_58%,transparent)_100%)]"
      aria-hidden="true"
    />
    <div class="grain absolute inset-0 -z-10" aria-hidden="true" />

    <div class="shell relative py-(--spacing-section)">
      <p v-reveal="{ as: 'fade' }" class="eyebrow eyebrow-rule">Sürdürülebilirlik</p>

      <h2 v-reveal="{ delay: 80 }" class="text-fluid-4xl mt-6 max-w-[16ch] font-semibold">
        Atık değil.<br />
        <span class="text-amber">Yeniden</span> değer.
      </h2>

      <p v-reveal="{ delay: 160 }" class="text-ash mt-7 max-w-[56ch] text-fluid-lg leading-relaxed">
        İnşaat projelerinde kullanılmadan kalan malzemeleri yeni projelerle buluşturarak
        kaynakların daha verimli kullanılmasına katkı sağlıyoruz.
      </p>

      <p v-reveal="{ delay: 220 }" class="text-concrete mt-5 max-w-[60ch] text-fluid-sm leading-relaxed">
        Bir ton çimentonun üretimi yaklaşık 0,6 ton karbon salımı anlamına geliyor. Sahada
        bekleyen malzemenin yeniden kullanılması, hem o salımı hem de bertaraf maliyetini
        aynı anda ortadan kaldırıyor.
      </p>

      <!-- Etki tablosu -->
      <dl
        v-reveal="{ stagger: 110, children: 'div', delay: 260 }"
        class="border-steel/80 mt-14 grid gap-px border-t bg-steel/60 sm:grid-cols-3"
      >
        <div v-for="item in IMPACT" :key="item.label" class="bg-void/70 px-6 py-8 backdrop-blur-sm">
          <dd class="font-display text-bone tnum text-fluid-3xl leading-none font-semibold">
            {{ item.value }}
            <span v-if="item.unit" class="text-amber text-fluid-base font-medium">{{ item.unit }}</span>
          </dd>
          <dt class="text-ash mt-3.5 text-fluid-sm">{{ item.label }}</dt>
        </div>
      </dl>
    </div>
  </section>
</template>

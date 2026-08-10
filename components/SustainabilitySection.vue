<script setup lang="ts">
import { IMPACT } from '~/data/site'

/**
 * Sürdürülebilirlik.
 *
 * Önceki sürümde bu bölüm tam ekran koyu bir fotoğraf ve dev tipografiydi;
 * sayfayı ilan platformundan çıkarıp kurumsal tanıtım sitesine çeviren
 * yerlerden biri buydu. Artık iki sütun: metin ve sayısal kanıt solda,
 * fotoğraf sağda, ölçü normal.
 */
</script>

<template>
  <section id="surdurulebilirlik" class="bg-canvas py-(--spacing-section)">
    <div class="shell">
      <div class="card overflow-hidden lg:grid lg:grid-cols-[1fr_0.85fr]">
        <div class="p-6 sm:p-9">
          <p v-reveal="{ as: 'fade' }" class="eyebrow">Sürdürülebilirlik</p>
          <h2 v-reveal="{ delay: 70 }" class="text-fluid-3xl text-ink mt-3 font-semibold">
            Atık değil. <span class="text-amber-ink">Yeniden değer.</span>
          </h2>

          <p v-reveal="{ delay: 130 }" class="text-slate mt-4 max-w-[54ch] text-fluid-base leading-relaxed">
            İnşaat projelerinde kullanılmadan kalan malzemeleri yeni projelerle buluşturarak
            kaynakların daha verimli kullanılmasına katkı sağlıyoruz.
          </p>
          <p v-reveal="{ delay: 180 }" class="text-mute mt-3 max-w-[58ch] text-fluid-sm leading-relaxed">
            Bir ton çimentonun üretimi yaklaşık 0,6 ton karbon salımı anlamına geliyor. Sahada
            bekleyen malzemenin yeniden kullanılması, hem o salımı hem de bertaraf maliyetini
            aynı anda ortadan kaldırıyor.
          </p>

          <dl
            v-reveal="{ stagger: 90, children: 'div', delay: 220 }"
            class="border-line mt-7 grid gap-5 border-t pt-6 sm:grid-cols-3"
          >
            <div v-for="item in IMPACT" :key="item.label">
              <dd class="font-display text-ink tnum text-fluid-xl leading-none font-bold">
                {{ item.value }}
                <span v-if="item.unit" class="text-amber-ink text-fluid-sm font-semibold">{{ item.unit }}</span>
              </dd>
              <dt class="text-slate mt-2 text-fluid-xs leading-snug">{{ item.label }}</dt>
            </div>
          </dl>
        </div>

        <div class="relative min-h-[16rem] lg:min-h-full">
          <img
            src="/images/sustainability.webp"
            srcset="/images/sustainability-1280.webp 1280w, /images/sustainability.webp 1920w"
            sizes="(min-width: 1024px) 42vw, 100vw"
            alt="Kurulumu süren çelik taşıyıcı sistem, havadan görünüm"
            width="1920"
            height="1080"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>

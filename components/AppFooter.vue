<script setup lang="ts">
import { Linkedin, Instagram, Twitter, MapPin, Mail } from 'lucide-vue-next'
import { BRAND, FOOTER_GROUPS } from '~/data/site'

const SOCIAL = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'X', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
]

const year = 2026
</script>

<template>
  <footer class="border-steel bg-void border-t">
    <div class="shell py-16 sm:py-20">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <!-- Marka -->
        <div>
          <BrandMark />
          <p class="text-concrete mt-6 max-w-[42ch] text-fluid-sm leading-relaxed">
            Kurumsal inşaat projelerinden artan malzemeleri, ihtiyacı olan projelerle
            buluşturan B2B pazaryeri.
          </p>

          <ul class="text-concrete mt-7 space-y-2.5 text-fluid-sm">
            <li class="inline-flex items-center gap-2">
              <MapPin :size="15" :stroke-width="1.75" />
              Kazım Dirik Mah. Bornova / İzmir
            </li>
            <li>
              <a
                href="mailto:info@donguselyapi.com"
                class="hover:text-bone inline-flex items-center gap-2 transition-colors"
              >
                <Mail :size="15" :stroke-width="1.75" />
                info@donguselyapi.com
              </a>
            </li>
          </ul>
        </div>

        <!-- Bağlantılar -->
        <nav aria-label="Alt menü" class="grid gap-10 sm:grid-cols-3">
          <div v-for="group in FOOTER_GROUPS" :key="group.title">
            <h2 class="label-tech">{{ group.title }}</h2>
            <ul class="mt-5 space-y-3">
              <li v-for="link in group.links" :key="link.label">
                <a
                  :href="link.href"
                  class="text-ash hover:text-amber text-fluid-sm transition-colors duration-300"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Alt şerit -->
      <div
        class="border-steel mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t pt-7 sm:flex-row sm:items-center"
      >
        <p class="text-concrete text-fluid-xs">
          © {{ year }} {{ BRAND.name }}. {{ BRAND.tagline }}.
          <span class="text-iron">Demo amaçlı hazırlanmıştır.</span>
        </p>

        <ul class="flex items-center gap-2">
          <li v-for="item in SOCIAL" :key="item.label">
            <a
              :href="item.href"
              :aria-label="item.label"
              class="border-steel text-concrete hover:border-concrete hover:text-bone inline-flex size-10 items-center justify-center border transition-colors duration-300"
            >
              <component :is="item.icon" :size="17" :stroke-width="1.6" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

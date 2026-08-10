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
  <footer class="border-carbon-line bg-carbon-soft border-t">
    <div class="shell py-12 sm:py-16">
      <div class="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandMark tone="dark" />
          <p class="text-ash mt-5 max-w-[40ch] text-fluid-sm leading-relaxed">
            Kurumsal inşaat projelerinden artan malzemeleri, ihtiyacı olan projelerle
            buluşturan B2B pazaryeri.
          </p>

          <ul class="text-ash mt-6 space-y-2.5 text-fluid-sm">
            <li class="inline-flex items-center gap-2">
              <MapPin :size="15" :stroke-width="1.75" class="text-mute" />
              Kazım Dirik Mah. Bornova / İzmir
            </li>
            <li>
              <a
                href="mailto:info@donguselyapi.com"
                class="hover:text-bone inline-flex items-center gap-2 transition-colors"
              >
                <Mail :size="15" :stroke-width="1.75" class="text-mute" />
                info@donguselyapi.com
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Alt menü" class="grid gap-8 sm:grid-cols-3">
          <div v-for="group in FOOTER_GROUPS" :key="group.title">
            <h2 class="label-tech">{{ group.title }}</h2>
            <ul class="mt-4 space-y-2.5">
              <li v-for="link in group.links" :key="link.label">
                <a :href="link.href" class="text-ash hover:text-amber text-fluid-sm transition-colors duration-200">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div
        class="border-carbon-line mt-10 flex flex-col-reverse items-start justify-between gap-5 border-t pt-6 sm:flex-row sm:items-center"
      >
        <p class="text-mute text-fluid-xs">
          © {{ year }} {{ BRAND.name }}. {{ BRAND.tagline }}.
          <span class="opacity-70">Demo amaçlı hazırlanmıştır.</span>
        </p>

        <ul class="flex items-center gap-2">
          <li v-for="item in SOCIAL" :key="item.label">
            <a
              :href="item.href"
              :aria-label="item.label"
              class="border-carbon-line text-ash hover:text-bone inline-flex size-9 items-center justify-center rounded-lg border transition-colors duration-200 hover:border-ash"
            >
              <component :is="item.icon" :size="16" :stroke-width="1.7" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

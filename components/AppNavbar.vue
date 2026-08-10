<script setup lang="ts">
import { Menu, X, Search, Heart, Plus } from 'lucide-vue-next'
import { NAV_LINKS } from '~/data/site'

/**
 * Sticky başlık.
 *
 * Scroll'da iki şey oluyor: zemin beyazlaşıp gölge kazanıyor VE hero'daki
 * arama kutusu ekrandan çıkınca başlığa küçük bir arama alanı beliriyor.
 * Pazaryerinde arama her an erişilebilir olmalı; kullanıcıyı yukarı
 * kaydırmaya zorlamak en sık yapılan hata.
 */
const scrolled = ref(false)
const menuOpen = ref(false)

const filters = useProductFilters()
const favourites = useFavourites()

function onScroll() {
  scrolled.value = window.scrollY > 220
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

watch(menuOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

function go(id: string) {
  menuOpen.value = false
  nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-(--ease-out-expo)"
    :class="
      scrolled || menuOpen
        ? 'border-line border-b bg-paper/90 shadow-card backdrop-blur-xl'
        : 'border-b border-transparent bg-canvas/70 backdrop-blur-sm'
    "
  >
    <div class="shell flex h-[4.25rem] items-center gap-4">
      <a href="#top" class="shrink-0" aria-label="Ana sayfa" @click.prevent="go('top')">
        <BrandMark />
      </a>

      <!-- Scroll'da beliren arama -->
      <Transition
        enter-active-class="transition-[opacity,transform] duration-300 ease-(--ease-out-expo)"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div v-if="scrolled" class="relative mx-2 hidden min-w-0 flex-1 lg:block">
          <Search
            :size="16"
            :stroke-width="2"
            class="text-mute pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
          />
          <input
            v-model="filters.query.value"
            type="search"
            aria-label="Malzeme ara"
            placeholder="Malzeme ara…"
            class="border-line bg-canvas text-ink placeholder:text-mute focus:border-amber h-10 w-full max-w-md rounded-full border pr-4 pl-10 text-fluid-sm transition-colors focus:outline-none"
            @keydown.enter="go('malzemeler')"
          />
        </div>
      </Transition>

      <nav aria-label="Ana menü" class="ml-auto hidden lg:block">
        <ul class="flex items-center gap-0.5">
          <li v-for="link in NAV_LINKS" :key="link.id">
            <a
              :href="`#${link.id}`"
              class="font-display text-slate hover:text-ink hover:bg-chalk block rounded-lg px-3 py-2 text-fluid-sm transition-colors duration-200"
              @click.prevent="go(link.id)"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-2 lg:ml-0">
        <!-- Favoriler -->
        <button
          type="button"
          class="border-line hover:border-line-strong relative hidden size-10 items-center justify-center rounded-lg border transition-colors sm:inline-flex"
          :aria-label="`Favoriler (${favourites.count.value})`"
          @click="go('malzemeler')"
        >
          <Heart :size="17" :stroke-width="1.9" class="text-slate" />
          <span
            v-if="favourites.count.value"
            class="bg-amber font-display absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full text-[0.625rem] font-bold text-white"
          >
            {{ favourites.count.value }}
          </span>
        </button>

        <a href="#ilan-ver" class="btn-base btn-buy hidden sm:inline-flex" @click.prevent="go('ilan-ver')">
          <Plus :size="16" :stroke-width="2.4" />
          İlan Ver
        </a>

        <button
          type="button"
          class="border-line text-ink hover:border-line-strong inline-flex size-10 items-center justify-center rounded-lg border transition-colors lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobil-menu"
          :aria-label="menuOpen ? 'Menüyü kapat' : 'Menüyü aç'"
          @click="menuOpen = !menuOpen"
        >
          <component :is="menuOpen ? X : Menu" :size="19" :stroke-width="1.9" />
        </button>
      </div>
    </div>

    <!-- Mobil menü -->
    <Transition
      enter-active-class="transition-[opacity,transform] duration-250 ease-(--ease-out-expo)"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="menuOpen" id="mobil-menu" class="border-line bg-paper border-t lg:hidden">
        <nav aria-label="Mobil menü" class="shell py-4">
          <ul class="flex flex-col">
            <li v-for="link in NAV_LINKS" :key="link.id" class="border-line border-b last:border-0">
              <a
                :href="`#${link.id}`"
                class="font-display text-ink block py-3.5 text-fluid-base"
                @click.prevent="go(link.id)"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
          <a href="#ilan-ver" class="btn-base btn-buy mt-4 w-full sm:hidden" @click.prevent="go('ilan-ver')">
            <Plus :size="16" :stroke-width="2.4" />
            İlan Ver
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

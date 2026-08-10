<script setup lang="ts">
import { Menu, X, ArrowUpRight } from 'lucide-vue-next'
import { NAV_LINKS } from '~/data/site'

/**
 * Sticky başlık.
 *
 * Scroll'da zemin şeffaftan bulanık koyuya geçiyor. Eşik 24px: daha
 * düşüğünde başlık en ufak dokunuşta titriyor, daha yükseğinde hero'nun
 * üstünden geçerken okunaksız kalıyor.
 */
const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

/**
 * Mobil menü açıkken arka planın kaymasını engelle. `overflow: hidden`
 * yerine `position: fixed` kullanılmıyor — o, kaydırma konumunu sıfırlayıp
 * menü kapanınca kullanıcıyı sayfanın başına atıyor.
 */
watch(menuOpen, (open) => {
  if (import.meta.server) return
  document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

function go(id: string) {
  menuOpen.value = false
  // Menünün kapanma geçişi bitmeden kaydırmak sıçrama yaratıyor.
  nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-(--ease-out-expo)"
    :class="
      scrolled || menuOpen
        ? 'border-b border-steel bg-void/80 backdrop-blur-xl'
        : 'border-b border-transparent bg-transparent'
    "
  >
    <div class="shell flex h-[4.5rem] items-center justify-between gap-6">
      <a
        href="#top"
        class="shrink-0"
        aria-label="Ana sayfa"
        @click.prevent="go('top')"
      >
        <BrandMark />
      </a>

      <!-- Masaüstü gezinme -->
      <nav aria-label="Ana menü" class="hidden lg:block">
        <ul class="flex items-center gap-1">
          <li v-for="link in NAV_LINKS" :key="link.id">
            <a
              :href="`#${link.id}`"
              class="font-display text-ash hover:text-bone relative block px-4 py-2 text-fluid-sm transition-colors duration-300"
              @click.prevent="go(link.id)"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <a href="#ilan-ver" class="btn-primary hidden sm:inline-flex" @click.prevent="go('ilan-ver')">
          İlan Ver
          <ArrowUpRight :size="16" :stroke-width="2" />
        </a>

        <button
          type="button"
          class="border-iron text-bone hover:border-concrete inline-flex size-11 items-center justify-center border transition-colors lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobil-menu"
          :aria-label="menuOpen ? 'Menüyü kapat' : 'Menüyü aç'"
          @click="menuOpen = !menuOpen"
        >
          <component :is="menuOpen ? X : Menu" :size="20" :stroke-width="1.75" />
        </button>
      </div>
    </div>

    <!-- Mobil menü -->
    <Transition
      enter-active-class="transition-[opacity,transform] duration-300 ease-(--ease-out-expo)"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-[opacity,transform] duration-200 ease-(--ease-out-expo)"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" id="mobil-menu" class="border-steel bg-void/95 border-t backdrop-blur-xl lg:hidden">
        <nav aria-label="Mobil menü" class="shell py-6">
          <ul class="flex flex-col">
            <li v-for="link in NAV_LINKS" :key="link.id" class="border-steel/60 border-b last:border-0">
              <a
                :href="`#${link.id}`"
                class="font-display text-bone block py-4 text-fluid-lg"
                @click.prevent="go(link.id)"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
          <a href="#ilan-ver" class="btn-primary mt-6 w-full sm:hidden" @click.prevent="go('ilan-ver')">
            İlan Ver
            <ArrowUpRight :size="16" :stroke-width="2" />
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

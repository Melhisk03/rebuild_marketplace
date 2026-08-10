/**
 * `v-reveal` — kaydırınca ortaya çıkma direktifi.
 *
 * Ayrı bir animasyon kütüphanesi yok: tek bir paylaşılan IntersectionObserver
 * yeterli. Her öğe için yeni observer kurmak yüzlerce kart olduğunda
 * gözle görülür maliyet çıkarıyor.
 *
 * Direktif EVRENSEL kayıtlı, yalnızca `.client` değil. Sadece istemcide
 * tanımlanan bir direktif sunucu render'ında `getSSRProps` hatası verip
 * sayfayı 500'e düşürüyor.
 *
 * Kullanım:
 *   <div v-reveal />                          -> yukarı kayarak
 *   <div v-reveal="'fade'" />                 -> yalnızca solarak
 *   <div v-reveal="{ as: 'scale', delay: 120 }" />
 *   <ul v-reveal="{ stagger: 70, children: 'li' }" />
 */
type RevealAs = 'up' | 'fade' | 'scale' | 'left' | 'right'

interface RevealOptions {
  as?: RevealAs
  /** ms cinsinden gecikme */
  delay?: number
  /** Alt öğeleri sırayla açar; `children` verilmezse doğrudan çocuklar */
  stagger?: number
  children?: string
}

type RevealValue = RevealAs | RevealOptions | undefined

function normalise(value: RevealValue): Required<Omit<RevealOptions, 'children'>> & { children?: string } {
  const options = typeof value === 'string' ? { as: value } : (value ?? {})
  return {
    as: options.as ?? 'up',
    delay: options.delay ?? 0,
    stagger: options.stagger ?? 0,
    children: options.children,
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    // Sunucuda hiçbir öznitelik basılmıyor: içerik ilk boyada görünür
    // durumda geliyor, JS yüklenene kadar boş ekran kalmıyor ve tarama
    // botları metni olduğu gibi görüyor.
    nuxtApp.vueApp.directive('reveal', { getSSRProps: () => ({}) })
    return
  }

  let observer: IntersectionObserver | null = null

  function getObserver() {
    if (observer) return observer
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          // Tek seferlik: geri kaydırınca tekrar oynamıyor. Sürekli
          // tekrarlayan giriş animasyonu uzun sayfada yorucu.
          observer?.unobserve(entry.target)
        }
      },
      // Öğe tam kenardan girerken değil, biraz içeri girince açılıyor.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    return observer
  }

  nuxtApp.vueApp.directive<HTMLElement, RevealValue>('reveal', {
    mounted(el, binding) {
      const { as, delay, stagger, children } = normalise(binding.value)

      const targets: HTMLElement[] = stagger
        ? Array.from(children ? el.querySelectorAll<HTMLElement>(children) : (el.children as unknown as HTMLElement[]))
        : [el]

      targets.forEach((target, index) => {
        target.dataset.reveal = as
        const total = delay + index * stagger
        if (total) target.style.setProperty('--reveal-delay', `${total}ms`)
        getObserver().observe(target)
      })
    },

    unmounted(el) {
      // Modal kapanışı gibi durumlarda observer'da ölü referans kalmasın.
      observer?.unobserve(el)
      el.querySelectorAll('[data-reveal]').forEach((child) => observer?.unobserve(child))
    },
  })
})

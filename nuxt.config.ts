import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  devtools: { enabled: false },

  // Tailwind v4 CSS-first yapılandırılıyor: `tailwind.config.js` yok, tüm
  // token'lar `assets/css/main.css` içindeki `@theme` bloğunda.
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  // Fontlar derleme sırasında indirilip kendi kaynağımızdan servis ediliyor;
  // çalışma anında Google'a istek gitmiyor (gizlilik + ilk boya süresi).
  modules: ['@nuxt/fonts'],
  fonts: {
    families: [
      { name: 'Space Grotesk', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  typescript: { strict: true, typeCheck: false },

  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      title: 'Döngüsel Yapı — İnşaat Malzemeleri Pazaryeri',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Projelerden arta kalan kaliteli inşaat malzemelerini keşfedin, ' +
            'ihtiyaçlarınıza uygun ürünleri avantajlı fiyatlarla değerlendirin.',
        },
        { name: 'theme-color', content: '#f7f6f3' },
      ],
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    },
  },

  // Nitro dağıtım hedefini kendisi algılıyor (Vercel'de `vercel` preset'ine
  // düşüyor); elle preset yazmak yalnızca yerel derlemeyi bozuyor.
})

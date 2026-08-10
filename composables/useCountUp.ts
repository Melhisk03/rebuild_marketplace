/**
 * Görünür olunca hedefe kadar sayan sayaç.
 *
 * Hedef öğe DIŞARIDAN veriliyor, composable kendi ref'ini döndürmüyor.
 * Gerekçe: `const { element } = useCountUp()` ile dönen ref'i şablonda
 * `ref="element"` diye bağlamak `<script setup>` içinde sessizce
 * çalışmıyordu — sayaçlar sıfırda kalıyordu. `useTemplateRef` ile bağ
 * açık ve doğrulanabilir.
 *
 * Sayma `requestAnimationFrame` ile ve GEÇEN SÜREYE bağlı, kare sayısına
 * değil: 120 Hz ekranda iki kat hızlı bitmiyor, düşük FPS'te de süre
 * korunuyor.
 */
export function useCountUp(
  target: Ref<HTMLElement | null>,
  value: number,
  options: { duration?: number; decimals?: number } = {},
) {
  const { duration = 1600, decimals = 0 } = options

  const current = ref(0)
  let frame = 0
  let observer: IntersectionObserver | null = null

  /** Sona doğru yavaşlar; doğrusal sayma mekanik duruyor. */
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

  function run() {
    const started = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1)
      current.value = Number((value * easeOut(progress)).toFixed(decimals))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  onMounted(() => {
    const node = target.value
    if (!node) return

    // Hareket tercihi kapalıysa sayma hiç başlamıyor, son değer basılıyor.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.value = value
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer?.disconnect()
        run()
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    cancelAnimationFrame(frame)
  })

  return current
}

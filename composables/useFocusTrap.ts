/**
 * Modal için odak tuzağı, gövde kilidi ve Esc davranışı.
 *
 * Hazır bir kütüphane yerine bu: tek bir modalımız var ve ihtiyaç
 * duyduğumuz davranış kırk satır. Erişilebilirlik açısından üçü de
 * pazarlık konusu değil — klavyeyle gezen kullanıcı modal açıkken
 * arkadaki bağlantılara sekemez ve kapanınca geldiği yere döner.
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useFocusTrap(active: Ref<boolean>, container: Ref<HTMLElement | null>) {
  let restoreTo: HTMLElement | null = null

  function items(): HTMLElement[] {
    if (!container.value) return []
    return Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )
  }

  function onKeydown(event: KeyboardEvent) {
    if (!active.value) return

    if (event.key === 'Escape') {
      active.value = false
      return
    }

    if (event.key !== 'Tab') return
    const focusable = items()
    if (!focusable.length) return

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    const current = document.activeElement

    // Uçlarda döngüye sok; aradaki sekmeler tarayıcıya bırakılıyor.
    if (event.shiftKey && (current === first || !container.value?.contains(current))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && current === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(active, async (open) => {
    if (import.meta.server) return

    if (open) {
      restoreTo = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      await nextTick()
      // Panelin ilk odaklanabilir öğesi yerine panelin kendisi: modal
      // açılır açılmaz "Kapat" butonu odaklanınca ekran okuyucu başlığı
      // atlayıp doğrudan butonu okuyor.
      container.value?.focus()
    } else {
      document.body.style.overflow = ''
      restoreTo?.focus?.()
      restoreTo = null
    }
  })

  onMounted(() => document.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    if (import.meta.client) document.body.style.overflow = ''
  })
}

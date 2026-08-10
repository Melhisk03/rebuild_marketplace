/**
 * Favori ilanlar.
 *
 * `Set` yerine dizi: `useState` SSR'da durumu JSON'a çeviriyor ve `Set`
 * serileştirilemiyor — sunucudan gelen değer boş nesneye dönüşüyordu.
 * Liste on dört elemanlı, `includes` maliyeti önemsiz.
 */
export function useFavourites() {
  const ids = useState<string[]>('favourites', () => [])

  function toggle(id: string) {
    const index = ids.value.indexOf(id)
    if (index === -1) ids.value = [...ids.value, id]
    else ids.value = ids.value.filter((x) => x !== id)
  }

  const has = (id: string) => ids.value.includes(id)

  return { ids, toggle, has, count: computed(() => ids.value.length) }
}

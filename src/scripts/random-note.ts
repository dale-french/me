const VISIBLE = "is-visible";

/**
 * Picks one note from `list` to show initially, then swaps to a different
 * random note each time `bookend` leaves the viewport. Visibility is
 * driven by the `is-visible` class; the host owns the show/hide CSS.
 */
export function mountRandomNote(
  bookend: HTMLElement,
  list: HTMLUListElement,
): void {
  const items = Array.from(list.children) as HTMLElement[];
  if (items.length === 0) return;

  function pickOther(current: HTMLElement | null): HTMLElement {
    if (items.length === 1) return items[0];
    let pick: HTMLElement;
    do {
      pick = items[Math.floor(Math.random() * items.length)];
    } while (pick === current);
    return pick;
  }

  let current = pickOther(null);
  current.classList.add(VISIBLE);

  const observer = new IntersectionObserver((entries) => {
    // Entries batch oldest → newest; only the last reflects the current state.
    if (entries[entries.length - 1].isIntersecting) return;
    const next = pickOther(current);
    current.classList.remove(VISIBLE);
    next.classList.add(VISIBLE);
    current = next;
  });
  observer.observe(bookend);
}

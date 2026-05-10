/**
 * Wires a click/Enter/Space handler that copies `data-copy` (or the element's
 * text content) to the clipboard. Replaces inline onclick attributes.
 */
export function mountClipboardCopy(el: HTMLElement): void {
  const text = el.dataset.copy ?? el.textContent?.trim() ?? "";
  if (!text) return;

  const copy = () => {
    void navigator.clipboard.writeText(text);
  };

  el.addEventListener("click", copy);
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copy();
    }
  });
}

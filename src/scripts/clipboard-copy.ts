const COPIED_LABEL = "Copied";
const FEEDBACK_DURATION_MS = 1500;

/**
 * Wires a click handler that copies `data-copy` (or text content) to the
 * clipboard, then briefly swaps the visible label to "Copied" and announces
 * the result via a shared aria-live region.
 */
export function mountClipboardCopy(button: HTMLButtonElement): void {
  const text = button.dataset.copy ?? button.textContent?.trim() ?? "";
  if (!text) return;

  const labelEl =
    button.querySelector<HTMLElement>("[data-copy-label]") ?? button;
  const originalLabel = labelEl.textContent ?? "";
  let resetTimer: number | null = null;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash(COPIED_LABEL, `Copied ${text}`);
    } catch {
      announce(`Couldn't copy — select and copy manually`);
    }
  });

  function flash(visible: string, announcement: string) {
    labelEl.textContent = visible;
    button.classList.add("is-copied");
    announce(announcement);
    if (resetTimer !== null) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      labelEl.textContent = originalLabel;
      button.classList.remove("is-copied");
      resetTimer = null;
    }, FEEDBACK_DURATION_MS);
  }
}

function announce(message: string) {
  const region = document.querySelector<HTMLElement>("[data-copy-status]");
  if (!region) return;
  // Re-set even when the message is the same so screen readers re-announce.
  region.textContent = "";
  window.requestAnimationFrame(() => {
    region.textContent = message;
  });
}

import type { TypedSequenceController } from "./typed-sequence";

// Footer viewport coverage that pauses the sequence, and the (lower)
// coverage that resumes it. The gap is hysteresis: without it, a scroll
// position resting near one threshold would flicker pause/resume.
const PAUSE_COVERAGE = 0.25;
const RESUME_COVERAGE = 0.19;

/**
 * Pauses the typing sequence and dims the hero (`typed--background`) while
 * the footer covers enough of the viewport, and resumes it on the way back
 * up. Keeps the animation from churning behind the footer's frosted glass.
 */
export function mountFooterDim(
  host: HTMLElement,
  footer: HTMLElement,
  controller: TypedSequenceController,
): void {
  let pausedByFooter = false;

  function evaluate() {
    const top = footer.getBoundingClientRect().top;
    const coverage = 1 - Math.max(top, 0) / window.innerHeight;
    if (coverage >= PAUSE_COVERAGE && !pausedByFooter) {
      pausedByFooter = true;
      // Dim only once the sequence has actually parked (the pause takes
      // effect at the next segment boundary), so the fade never falls
      // over a sentence still in motion.
      controller.pause().then(() => {
        if (pausedByFooter) host.classList.add("typed--background");
      });
    } else if (coverage < RESUME_COVERAGE && pausedByFooter) {
      pausedByFooter = false;
      host.classList.remove("typed--background");
      controller.resume();
    }
  }

  // Body is the parallax scroll container, so the scroll events fire
  // there, not on window. Coalesce bursts to one read per frame.
  let ticking = false;
  function schedule() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      evaluate();
    });
  }

  document.body.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  evaluate();
}

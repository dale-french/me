import Typed from "typed.js";

const delay = 750;
const delayLong = delay * 2;

const activeClass = "typed--active";
const backgroundClass = "typed--background";
const freshClass = "typed--fresh";
const pausedClass = "typed--paused";
const repeatingClass = "typed--repeating";
const runningClass = "typed--running";
const typingClass = "typed--typing";

export interface TypedSequenceController {
  pause(): void;
  resume(): void;
  destroy(): void;
}

type TypedSelf = Typed & {
  el: HTMLElement;
  strings: string[];
  sequence: number[];
  arrayPos: number;
  options: { stringsElement: string } & Record<string, unknown>;
  afterDelay: number;
  startDelay: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export function startTypedSequence(
  host: HTMLElement,
  options: { pauseThreshold?: number } = {},
): TypedSequenceController {
  const pauseThreshold = options.pauseThreshold ?? 0;

  let alreadyPaused = false;
  let currentSentence: TypedSelf | null = null;
  let firstRun = true;
  const moreSentences: TypedSelf[] = [];
  let paused = false;
  let runCount = 0;
  let sentences: TypedSelf[] = [];
  let startTimeout: number | null = null;

  function setTyping(self: TypedSelf) {
    host
      .querySelectorAll("." + typingClass)
      .forEach((el) => el.classList.remove(typingClass));
    self.el.classList.add(typingClass);
  }

  function clearTyping(self: TypedSelf) {
    self.el.classList.remove(typingClass);
  }

  function setActive(self: TypedSelf) {
    currentSentence = self;
    host
      .querySelectorAll("." + activeClass)
      .forEach((el) => el.classList.remove(activeClass));
    self.el.classList.add(activeClass);
  }

  function nextSentence(self: TypedSelf) {
    self.stop();
    const nextIndex = (sentences.indexOf(self) + 1) % sentences.length;
    const next = sentences[nextIndex];
    const nextString = next.strings[next.sequence[next.arrayPos]];
    const extraDelay = nextIndex === 1 ? delay : 0;
    if (paused) {
      onPause(next);
    } else {
      setActive(next);
      if (!nextString) {
        next.start();
      } else {
        startTimeout = window.setTimeout(
          () => next.start(),
          delay + extraDelay,
        );
      }
    }
  }

  function randomSentence(self: TypedSelf) {
    self.stop();
    const otherIndexes = Object.keys(sentences);
    otherIndexes.splice(sentences.indexOf(self), 1);
    let randomIndex = Number(
      otherIndexes[Math.floor(Math.random() * otherIndexes.length)],
    );
    let random = sentences[randomIndex];
    const previousString = random.strings[random.sequence[random.arrayPos]];
    const nextString = random.strings[random.sequence[random.arrayPos + 1]];
    let extraDelay = 0;
    const currentElement = self.options.stringsElement;
    if (paused) {
      onPause(random);
    } else if (nextString === previousString) {
      random.afterDelay = 0;
      random.start();
      currentSentence = random;
    } else {
      if (firstRun) {
        extraDelay = delayLong;
        randomIndex = Math.floor(Math.random() * moreSentences.length);
        random = moreSentences[randomIndex];
      } else if (
        currentElement.includes("seg-next") ||
        currentElement.includes("seg-outro")
      ) {
        extraDelay = delay;
      }
      random.afterDelay = delay;
      window.setTimeout(() => setActive(random), delay + extraDelay);
      startTimeout = window.setTimeout(
        () => random.start(),
        delayLong + extraDelay,
      );
    }
  }

  function onPause(self: TypedSelf) {
    if (startTimeout !== null) clearTimeout(startTimeout);
    currentSentence = self;
    host
      .querySelectorAll("." + freshClass)
      .forEach((el) => el.classList.remove(freshClass));
    host.classList.add(pausedClass);
    host.classList.add(repeatingClass);
  }

  function setPause() {
    paused = true;
  }

  function clearPause() {
    if (startTimeout !== null) clearTimeout(startTimeout);
    paused = false;
    host
      .querySelectorAll("." + activeClass)
      .forEach((el) => el.classList.remove(activeClass));
    host.classList.remove(pausedClass);
    window.setTimeout(() => {
      if (currentSentence) setActive(currentSentence);
    }, delay);
    startTimeout = window.setTimeout(() => {
      if (currentSentence) currentSentence.start();
    }, delayLong);
  }

  const sharedOptions = {
    afterDelay: delay,
    autoInsertCss: false,
    backDelay: delay,
    backSpeed: 20,
    loop: true,
    loopCount: Infinity,
    showCursor: false,
    shuffle: true,
    smartBackspace: false,
    typeSpeed: 40,
    onStart: (_pos: number, self: TypedSelf) => setTyping(self),
    preStringTyped: (_pos: number, self: TypedSelf) => {
      runCount = runCount + 1;
      setTyping(self);
      if (runCount === 1) host.classList.add(runningClass);
      host
        .querySelectorAll("." + freshClass)
        .forEach((el) => el.classList.remove(freshClass));
      self.el.classList.add(freshClass);
    },
    onTypingPaused: (_pos: number, self: TypedSelf) => clearTyping(self),
    onTypingResumed: (_pos: number, self: TypedSelf) => setTyping(self),
    onStringTyped: (_pos: number, self: TypedSelf) => {
      clearTyping(self);
      randomSentence(self);
      if (runCount === 5) host.classList.add(repeatingClass);
    },
    afterBackspaced: (_pos: number, self: TypedSelf) => {
      if (paused) {
        self.stop();
        onPause(self);
      }
      clearTyping(self);
    },
    onLastStringBackspaced: (self: TypedSelf) => {
      clearTyping(self);
      randomSentence(self);
      self.reset();
    },
  };

  const initialSet = {
    onBegin: (self: TypedSelf) => {
      sentences.push(self);
      self.stop();
    },
    onStringTyped: (_pos: number, self: TypedSelf) => {
      clearTyping(self);
      if (runCount === 5) host.classList.add(repeatingClass);
      if (firstRun) {
        const lastSentence = sentences[sentences.length - 1];
        if (currentSentence === lastSentence) {
          sentences = sentences.concat(moreSentences);
          randomSentence(self);
          firstRun = false;
        } else {
          nextSentence(self);
        }
      } else {
        randomSentence(self);
      }
    },
  };

  const neverEmpty = {
    onLastStringBackspaced: (self: TypedSelf) => {
      clearTyping(self);
      self.stop();
      startTimeout = window.setTimeout(() => self.start(), delay);
    },
  };

  const secondSet = {
    onBegin: (self: TypedSelf) => {
      moreSentences.push(self);
      self.stop();
    },
  };

  const hello = new Typed("#seg-hello", {
    ...sharedOptions,
    ...initialSet,
    startDelay: delayLong,
    stringsElement: "#seg-hello--strings",
    onBegin: (self: TypedSelf) => {
      sentences.push(self);
      setActive(self);
    },
    onStop: (_self: TypedSelf) => {
      if (firstRun) (hello as unknown as TypedSelf).startDelay = 0;
    },
  } as unknown as ConstructorParameters<typeof Typed>[1]) as unknown as TypedSelf;

  new Typed("#seg-name", {
    ...sharedOptions,
    ...initialSet,
    ...neverEmpty,
    stringsElement: "#seg-name--strings",
  } as unknown as ConstructorParameters<typeof Typed>[1]);

  new Typed("#seg-job", {
    ...sharedOptions,
    ...initialSet,
    ...neverEmpty,
    stringsElement: "#seg-job--strings",
  } as unknown as ConstructorParameters<typeof Typed>[1]);

  new Typed("#seg-fact", {
    ...sharedOptions,
    ...secondSet,
    stringsElement: "#seg-fact--strings",
  } as unknown as ConstructorParameters<typeof Typed>[1]);

  new Typed("#seg-live", {
    ...sharedOptions,
    ...secondSet,
    stringsElement: "#seg-live--strings",
  } as unknown as ConstructorParameters<typeof Typed>[1]);

  new Typed("#seg-previous", {
    ...sharedOptions,
    ...initialSet,
    stringsElement: "#seg-previous--strings",
  } as unknown as ConstructorParameters<typeof Typed>[1]);

  new Typed("#seg-next", {
    ...sharedOptions,
    ...initialSet,
    ...neverEmpty,
    stringsElement: "#seg-next--strings",
  } as unknown as ConstructorParameters<typeof Typed>[1]);

  new Typed("#seg-outro", {
    ...sharedOptions,
    ...secondSet,
    stringsElement: "#seg-outro--strings",
  } as unknown as ConstructorParameters<typeof Typed>[1]);

  document
    .querySelectorAll('ul[id$="--strings"]')
    .forEach((el) => el.remove());

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        host.classList.remove(backgroundClass);
        if (paused && !alreadyPaused) clearPause();
      } else {
        host.classList.add(backgroundClass);
        if (paused) {
          alreadyPaused = true;
        } else {
          alreadyPaused = false;
          if (currentSentence) {
            onPause(currentSentence);
            setPause();
          }
        }
      }
    },
    { threshold: pauseThreshold },
  );
  observer.observe(host);

  return {
    pause() {
      setPause();
    },
    resume() {
      clearPause();
    },
    destroy() {
      observer.disconnect();
    },
  };
}

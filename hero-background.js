(() => {
  const canvas = document.querySelector("[data-hero-canvas]");

  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const hero = canvas.closest(".hero-section");
  const context = canvas.getContext("2d", { alpha: true });

  if (!(hero instanceof HTMLElement) || !context) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0.5, y: 0.5 };
  const pointerTarget = { ...pointer };
  const beanSeeds = [
    { x: 0.08, y: 0.14, size: 62, drift: 5.2, bob: 13, spin: 0.028, phase: 0.2, tone: "sage", depth: 0.55 },
    { x: 0.86, y: 0.13, size: 78, drift: -4.2, bob: 10, spin: -0.021, phase: 1.7, tone: "cream", depth: 0.9 },
    { x: 0.68, y: 0.3, size: 43, drift: 6.4, bob: 15, spin: 0.036, phase: 2.9, tone: "clay", depth: 0.75 },
    { x: 0.15, y: 0.47, size: 73, drift: -3.7, bob: 12, spin: -0.018, phase: 4.1, tone: "cream", depth: 0.8 },
    { x: 0.92, y: 0.49, size: 52, drift: 4.6, bob: 18, spin: 0.031, phase: 5.2, tone: "sage", depth: 0.62 },
    { x: 0.56, y: 0.66, size: 84, drift: -5.1, bob: 11, spin: -0.024, phase: 0.9, tone: "cream", depth: 1 },
    { x: 0.08, y: 0.8, size: 39, drift: 6.8, bob: 14, spin: 0.043, phase: 2.2, tone: "clay", depth: 0.68 },
    { x: 0.8, y: 0.84, size: 66, drift: -4.5, bob: 16, spin: -0.029, phase: 3.6, tone: "sage", depth: 0.84 },
    { x: 0.36, y: 0.9, size: 47, drift: 3.9, bob: 10, spin: 0.025, phase: 4.8, tone: "cream", depth: 0.58 },
    { x: 0.3, y: 0.12, size: 35, drift: -6.2, bob: 12, spin: -0.039, phase: 1.1, tone: "clay", depth: 0.7 },
    { x: 0.49, y: 0.2, size: 57, drift: 4.1, bob: 17, spin: 0.022, phase: 2.5, tone: "sage", depth: 0.92 },
    { x: 0.98, y: 0.74, size: 88, drift: -3.4, bob: 9, spin: -0.016, phase: 3.3, tone: "cream", depth: 1.05 },
    { x: 0.42, y: 0.49, size: 38, drift: 7.1, bob: 14, spin: 0.047, phase: 4.4, tone: "sage", depth: 0.65 },
    { x: 0.66, y: 0.94, size: 54, drift: -5.8, bob: 13, spin: -0.033, phase: 5.6, tone: "clay", depth: 0.78 },
    { x: 0.25, y: 0.69, size: 48, drift: 5.5, bob: 16, spin: 0.03, phase: 0.5, tone: "sage", depth: 0.72 },
    { x: 0.76, y: 0.48, size: 33, drift: -7.4, bob: 12, spin: -0.045, phase: 1.9, tone: "clay", depth: 0.6 },
  ];
  const tones = {
    cream: "247, 242, 232",
    sage: "174, 192, 150",
    clay: "191, 143, 96",
  };
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let startTime = performance.now();

  const resizeCanvas = () => {
    const bounds = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
  };

  const wrap = (value, minimum, maximum) => {
    const range = maximum - minimum;
    return ((((value - minimum) % range) + range) % range) + minimum;
  };

  const traceBean = (bean, elapsed, index) => {
    const compact = width < 720;
    const size = bean.size * (compact ? 0.72 : Math.min(1, 0.78 + width / 4200));
    const beanWidth = size * (0.58 + (index % 3) * 0.025);
    const margin = size * 1.2;
    const seconds = elapsed / 1000;
    const x = wrap(bean.x * width + seconds * bean.drift, -margin, width + margin);
    const y = bean.y * height + Math.sin(seconds * 0.3 + bean.phase) * bean.bob;
    const pointerX = (pointer.x - 0.5) * 23 * bean.depth;
    const pointerY = (pointer.y - 0.5) * 17 * bean.depth;
    const rotation = bean.phase * 0.58 + seconds * bean.spin + (pointer.x - 0.5) * 0.09;
    const alpha = (compact ? 0.15 : 0.17) + (index % 4) * 0.014;
    const tone = tones[bean.tone];

    context.save();
    context.translate(x + pointerX, y + pointerY);
    context.rotate(rotation);
    context.scale(1 + Math.sin(seconds * 0.22 + bean.phase) * 0.025, 1);

    context.beginPath();
    context.moveTo(-beanWidth * 0.04, -size * 0.5);
    context.bezierCurveTo(beanWidth * 0.34, -size * 0.47, beanWidth * 0.55, -size * 0.18, beanWidth * 0.46, size * 0.1);
    context.bezierCurveTo(beanWidth * 0.38, size * 0.38, beanWidth * 0.12, size * 0.53, -beanWidth * 0.08, size * 0.48);
    context.bezierCurveTo(-beanWidth * 0.37, size * 0.41, -beanWidth * 0.54, size * 0.12, -beanWidth * 0.44, -size * 0.16);
    context.bezierCurveTo(-beanWidth * 0.35, -size * 0.4, -beanWidth * 0.15, -size * 0.53, -beanWidth * 0.04, -size * 0.5);
    context.closePath();
    context.fillStyle = `rgba(${tone}, ${alpha * 0.12})`;
    context.fill();
    context.strokeStyle = `rgba(${tone}, ${alpha})`;
    context.lineWidth = compact ? 1 : 1.15;
    context.stroke();

    context.beginPath();
    context.moveTo(-beanWidth * 0.03, -size * 0.4);
    context.bezierCurveTo(beanWidth * 0.13, -size * 0.18, -beanWidth * 0.14, size * 0.14, beanWidth * 0.03, size * 0.4);
    context.strokeStyle = `rgba(${tone}, ${Math.min(0.32, alpha * 1.35)})`;
    context.lineWidth = compact ? 0.85 : 1;
    context.stroke();

    context.beginPath();
    context.moveTo(-beanWidth * 0.27, -size * 0.25);
    context.bezierCurveTo(-beanWidth * 0.14, -size * 0.1, -beanWidth * 0.15, size * 0.13, -beanWidth * 0.25, size * 0.26);
    context.moveTo(beanWidth * 0.25, -size * 0.24);
    context.bezierCurveTo(beanWidth * 0.13, -size * 0.08, beanWidth * 0.14, size * 0.11, beanWidth * 0.24, size * 0.25);
    context.strokeStyle = `rgba(${tone}, ${alpha * 0.62})`;
    context.lineWidth = compact ? 0.65 : 0.8;
    context.stroke();
    context.restore();
  };

  const drawFrame = (timestamp) => {
    const elapsed = reducedMotion.matches ? 0 : timestamp - startTime;
    pointer.x += (pointerTarget.x - pointer.x) * 0.035;
    pointer.y += (pointerTarget.y - pointer.y) * 0.035;
    context.clearRect(0, 0, width, height);

    const beanCount = width < 560 ? 9 : width < 980 ? 13 : beanSeeds.length;
    for (let beanIndex = 0; beanIndex < beanCount; beanIndex += 1) {
      traceBean(beanSeeds[beanIndex], elapsed, beanIndex);
    }

    if (!reducedMotion.matches && !document.hidden) {
      animationFrame = window.requestAnimationFrame(drawFrame);
    }
  };

  const restartAnimation = () => {
    window.cancelAnimationFrame(animationFrame);
    startTime = performance.now();
    animationFrame = window.requestAnimationFrame(drawFrame);
  };

  hero.addEventListener(
    "pointermove",
    (event) => {
      const bounds = hero.getBoundingClientRect();
      pointerTarget.x = (event.clientX - bounds.left) / bounds.width;
      pointerTarget.y = (event.clientY - bounds.top) / bounds.height;
    },
    { passive: true },
  );

  hero.addEventListener("pointerleave", () => {
    pointerTarget.x = 0.5;
    pointerTarget.y = 0.5;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      restartAnimation();
    }
  });

  reducedMotion.addEventListener("change", restartAnimation);
  new ResizeObserver(() => {
    resizeCanvas();
    restartAnimation();
  }).observe(hero);

  resizeCanvas();
  restartAnimation();
})();

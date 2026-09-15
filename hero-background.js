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
  const pointer = { x: 0.68, y: 0.42 };
  const pointerTarget = { ...pointer };
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
  };

  const getWavePoint = (lineIndex, progress, elapsed) => {
    const direction = lineIndex % 2 === 0 ? 1 : -1;
    const x = progress * (width + 240) - 120;
    const baseY = height * (0.08 + lineIndex * 0.085);
    const primaryWave = Math.sin(progress * 5.1 + lineIndex * 0.72 + elapsed * 0.00008 * direction);
    const secondaryWave = Math.sin(progress * 11.4 - lineIndex * 0.45 - elapsed * 0.000035);
    const pointerLift = (pointer.y - 0.5) * 34 * Math.sin(progress * Math.PI);

    return {
      x: x + (pointer.x - 0.5) * 24 * Math.sin(progress * Math.PI),
      y: baseY + primaryWave * (26 + lineIndex * 2.8) + secondaryWave * 9 + pointerLift,
    };
  };

  const traceRoute = (lineIndex, elapsed) => {
    const pointCount = width < 720 ? 34 : 54;
    context.beginPath();

    for (let pointIndex = 0; pointIndex <= pointCount; pointIndex += 1) {
      const progress = pointIndex / pointCount;
      const point = getWavePoint(lineIndex, progress, elapsed);

      if (pointIndex === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    }

    const isClayRoute = lineIndex === 2 || lineIndex === 7;
    context.strokeStyle = isClayRoute ? "rgba(191, 143, 96, 0.23)" : "rgba(196, 213, 174, 0.19)";
    context.lineWidth = isClayRoute ? 1.15 : 0.8;
    context.setLineDash(lineIndex % 3 === 0 ? [62, 128] : [105, 82]);
    context.lineDashOffset = elapsed * (lineIndex % 2 === 0 ? -0.008 : 0.006) + lineIndex * 28;
    context.stroke();
  };

  const drawMovingMarkers = (elapsed) => {
    const markerCount = width < 720 ? 10 : 18;

    for (let markerIndex = 0; markerIndex < markerCount; markerIndex += 1) {
      const lineIndex = markerIndex % 9;
      const speed = 0.000018 + (markerIndex % 4) * 0.000003;
      const progress = (markerIndex * 0.137 + elapsed * speed) % 1;
      const point = getWavePoint(lineIndex, progress, elapsed);
      const nextPoint = getWavePoint(lineIndex, Math.min(1, progress + 0.008), elapsed);
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      const length = 5 + (markerIndex % 4) * 2.5;

      context.save();
      context.translate(point.x, point.y);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(-length / 2, 0);
      context.lineTo(length / 2, 0);
      context.strokeStyle = markerIndex % 5 === 0 ? "rgba(231, 191, 145, 0.62)" : "rgba(237, 241, 218, 0.52)";
      context.lineWidth = markerIndex % 5 === 0 ? 1.8 : 1.35;
      context.setLineDash([]);
      context.stroke();
      context.restore();
    }
  };

  const drawFrame = (timestamp) => {
    const elapsed = reducedMotion.matches ? 0 : timestamp - startTime;
    pointer.x += (pointerTarget.x - pointer.x) * 0.035;
    pointer.y += (pointerTarget.y - pointer.y) * 0.035;
    context.clearRect(0, 0, width, height);

    for (let lineIndex = 0; lineIndex < 9; lineIndex += 1) {
      traceRoute(lineIndex, elapsed);
    }

    drawMovingMarkers(elapsed);

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
    pointerTarget.x = 0.68;
    pointerTarget.y = 0.42;
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

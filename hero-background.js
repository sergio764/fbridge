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
  const ingredientSeeds = [
    { kind: "cocoa", x: 0.08, y: 0.14, size: 62, drift: 5.2, bob: 13, spin: 0.028, phase: 0.2, tone: "sage", depth: 0.55 },
    { kind: "matcha", x: 0.86, y: 0.13, size: 78, drift: -4.2, bob: 10, spin: -0.021, phase: 1.7, tone: "sage", depth: 0.9 },
    { kind: "coffee", x: 0.68, y: 0.3, size: 43, drift: 6.4, bob: 15, spin: 0.036, phase: 2.9, tone: "clay", depth: 0.75 },
    { kind: "date", x: 0.15, y: 0.47, size: 73, drift: -3.7, bob: 12, spin: -0.018, phase: 4.1, tone: "cream", depth: 0.8 },
    { kind: "cocoa", x: 0.92, y: 0.49, size: 52, drift: 4.6, bob: 18, spin: 0.031, phase: 5.2, tone: "sage", depth: 0.62 },
    { kind: "matcha", x: 0.56, y: 0.66, size: 84, drift: -5.1, bob: 11, spin: -0.024, phase: 0.9, tone: "cream", depth: 1 },
    { kind: "coffee", x: 0.08, y: 0.8, size: 39, drift: 6.8, bob: 14, spin: 0.043, phase: 2.2, tone: "clay", depth: 0.68 },
    { kind: "date", x: 0.8, y: 0.84, size: 66, drift: -4.5, bob: 16, spin: -0.029, phase: 3.6, tone: "sage", depth: 0.84 },
    { kind: "cocoa", x: 0.36, y: 0.9, size: 47, drift: 3.9, bob: 10, spin: 0.025, phase: 4.8, tone: "cream", depth: 0.58 },
    { kind: "matcha", x: 0.3, y: 0.12, size: 35, drift: -6.2, bob: 12, spin: -0.039, phase: 1.1, tone: "sage", depth: 0.7 },
    { kind: "coffee", x: 0.49, y: 0.2, size: 57, drift: 4.1, bob: 17, spin: 0.022, phase: 2.5, tone: "cream", depth: 0.92 },
    { kind: "date", x: 0.98, y: 0.74, size: 88, drift: -3.4, bob: 9, spin: -0.016, phase: 3.3, tone: "clay", depth: 1.05 },
    { kind: "cocoa", x: 0.42, y: 0.49, size: 38, drift: 7.1, bob: 14, spin: 0.047, phase: 4.4, tone: "sage", depth: 0.65 },
    { kind: "matcha", x: 0.66, y: 0.94, size: 54, drift: -5.8, bob: 13, spin: -0.033, phase: 5.6, tone: "cream", depth: 0.78 },
    { kind: "coffee", x: 0.25, y: 0.69, size: 48, drift: 5.5, bob: 16, spin: 0.03, phase: 0.5, tone: "clay", depth: 0.72 },
    { kind: "date", x: 0.76, y: 0.48, size: 33, drift: -7.4, bob: 12, spin: -0.045, phase: 1.9, tone: "cream", depth: 0.6 },
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

  const traceCocoaBean = (size, alpha, tone, compact, index) => {
    const beanWidth = size * (0.58 + (index % 3) * 0.025);

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
  };

  const traceDate = (size, alpha, tone, compact) => {
    const dateWidth = size * 0.3;
    const dateHeight = size * 0.5;

    context.beginPath();
    context.moveTo(0, -dateHeight);
    context.bezierCurveTo(dateWidth * 0.78, -dateHeight * 0.96, dateWidth, -dateHeight * 0.42, dateWidth * 0.94, 0);
    context.bezierCurveTo(dateWidth * 0.87, dateHeight * 0.58, dateWidth * 0.5, dateHeight, 0, dateHeight);
    context.bezierCurveTo(-dateWidth * 0.5, dateHeight, -dateWidth * 0.87, dateHeight * 0.58, -dateWidth * 0.94, 0);
    context.bezierCurveTo(-dateWidth, -dateHeight * 0.42, -dateWidth * 0.78, -dateHeight * 0.96, 0, -dateHeight);
    context.closePath();
    context.fillStyle = `rgba(${tone}, ${alpha * 0.11})`;
    context.fill();
    context.strokeStyle = `rgba(${tone}, ${alpha})`;
    context.lineWidth = compact ? 1 : 1.15;
    context.stroke();

    context.beginPath();
    context.moveTo(-dateWidth * 0.05, -dateHeight);
    context.lineTo(dateWidth * 0.08, -dateHeight * 1.13);
    context.moveTo(-dateWidth * 0.55, -dateHeight * 0.45);
    context.bezierCurveTo(-dateWidth * 0.15, -dateHeight * 0.33, dateWidth * 0.13, -dateHeight * 0.42, dateWidth * 0.5, -dateHeight * 0.24);
    context.moveTo(-dateWidth * 0.62, 0);
    context.bezierCurveTo(-dateWidth * 0.2, dateHeight * 0.12, dateWidth * 0.18, -dateHeight * 0.08, dateWidth * 0.62, dateHeight * 0.05);
    context.moveTo(-dateWidth * 0.48, dateHeight * 0.42);
    context.bezierCurveTo(-dateWidth * 0.12, dateHeight * 0.56, dateWidth * 0.14, dateHeight * 0.38, dateWidth * 0.45, dateHeight * 0.5);
    context.strokeStyle = `rgba(${tone}, ${alpha * 0.72})`;
    context.lineWidth = compact ? 0.7 : 0.85;
    context.stroke();
  };

  const traceMatchaLeaf = (size, alpha, tone, compact) => {
    const leafWidth = size * 0.35;
    const leafHeight = size * 0.52;

    context.beginPath();
    context.moveTo(0, -leafHeight);
    context.bezierCurveTo(leafWidth * 0.9, -leafHeight * 0.5, leafWidth, leafHeight * 0.22, 0, leafHeight);
    context.bezierCurveTo(-leafWidth, leafHeight * 0.22, -leafWidth * 0.9, -leafHeight * 0.5, 0, -leafHeight);
    context.closePath();
    context.fillStyle = `rgba(${tone}, ${alpha * 0.1})`;
    context.fill();
    context.strokeStyle = `rgba(${tone}, ${alpha})`;
    context.lineWidth = compact ? 1 : 1.15;
    context.stroke();

    context.beginPath();
    context.moveTo(0, -leafHeight * 0.82);
    context.bezierCurveTo(-leafWidth * 0.08, -leafHeight * 0.24, leafWidth * 0.08, leafHeight * 0.28, 0, leafHeight * 1.13);
    context.moveTo(-leafWidth * 0.03, -leafHeight * 0.38);
    context.lineTo(-leafWidth * 0.62, -leafHeight * 0.08);
    context.moveTo(leafWidth * 0.01, -leafHeight * 0.16);
    context.lineTo(leafWidth * 0.67, leafHeight * 0.08);
    context.moveTo(-leafWidth * 0.01, leafHeight * 0.12);
    context.lineTo(-leafWidth * 0.57, leafHeight * 0.35);
    context.moveTo(leafWidth * 0.01, leafHeight * 0.34);
    context.lineTo(leafWidth * 0.38, leafHeight * 0.5);
    context.strokeStyle = `rgba(${tone}, ${alpha * 0.7})`;
    context.lineWidth = compact ? 0.7 : 0.85;
    context.stroke();
  };

  const traceCoffeeBean = (size, alpha, tone, compact) => {
    const beanWidth = size * 0.35;
    const beanHeight = size * 0.46;

    context.beginPath();
    context.moveTo(0, -beanHeight);
    context.bezierCurveTo(beanWidth * 0.84, -beanHeight, beanWidth * 1.05, -beanHeight * 0.36, beanWidth * 0.92, beanHeight * 0.16);
    context.bezierCurveTo(beanWidth * 0.78, beanHeight * 0.76, beanWidth * 0.35, beanHeight, 0, beanHeight);
    context.bezierCurveTo(-beanWidth * 0.46, beanHeight, -beanWidth * 0.9, beanHeight * 0.62, -beanWidth * 0.94, beanHeight * 0.08);
    context.bezierCurveTo(-beanWidth, -beanHeight * 0.46, -beanWidth * 0.62, -beanHeight, 0, -beanHeight);
    context.closePath();
    context.fillStyle = `rgba(${tone}, ${alpha * 0.11})`;
    context.fill();
    context.strokeStyle = `rgba(${tone}, ${alpha})`;
    context.lineWidth = compact ? 1 : 1.15;
    context.stroke();

    context.beginPath();
    context.moveTo(-beanWidth * 0.08, -beanHeight * 0.8);
    context.bezierCurveTo(beanWidth * 0.5, -beanHeight * 0.45, -beanWidth * 0.48, beanHeight * 0.28, beanWidth * 0.08, beanHeight * 0.82);
    context.strokeStyle = `rgba(${tone}, ${Math.min(0.34, alpha * 1.42)})`;
    context.lineWidth = compact ? 0.9 : 1.05;
    context.stroke();

    context.beginPath();
    context.moveTo(-beanWidth * 0.56, -beanHeight * 0.2);
    context.bezierCurveTo(-beanWidth * 0.4, -beanHeight * 0.42, -beanWidth * 0.28, -beanHeight * 0.55, -beanWidth * 0.08, -beanHeight * 0.68);
    context.moveTo(beanWidth * 0.53, beanHeight * 0.22);
    context.bezierCurveTo(beanWidth * 0.4, beanHeight * 0.42, beanWidth * 0.27, beanHeight * 0.56, beanWidth * 0.08, beanHeight * 0.68);
    context.strokeStyle = `rgba(${tone}, ${alpha * 0.55})`;
    context.lineWidth = compact ? 0.65 : 0.8;
    context.stroke();
  };

  const traceIngredient = (ingredient, elapsed, index) => {
    const compact = width < 720;
    const size = ingredient.size * (compact ? 0.72 : Math.min(1, 0.78 + width / 4200));
    const margin = size * 1.2;
    const seconds = elapsed / 1000;
    const x = wrap(ingredient.x * width + seconds * ingredient.drift, -margin, width + margin);
    const y = ingredient.y * height + Math.sin(seconds * 0.3 + ingredient.phase) * ingredient.bob;
    const pointerX = (pointer.x - 0.5) * 23 * ingredient.depth;
    const pointerY = (pointer.y - 0.5) * 17 * ingredient.depth;
    const rotation = ingredient.phase * 0.58 + seconds * ingredient.spin + (pointer.x - 0.5) * 0.09;
    const alpha = (compact ? 0.15 : 0.17) + (index % 4) * 0.014;
    const tone = tones[ingredient.tone];

    context.save();
    context.translate(x + pointerX, y + pointerY);
    context.rotate(rotation);
    context.scale(1 + Math.sin(seconds * 0.22 + ingredient.phase) * 0.025, 1);

    if (ingredient.kind === "date") {
      traceDate(size, alpha, tone, compact);
    } else if (ingredient.kind === "matcha") {
      traceMatchaLeaf(size, alpha, tone, compact);
    } else if (ingredient.kind === "coffee") {
      traceCoffeeBean(size, alpha, tone, compact);
    } else {
      traceCocoaBean(size, alpha, tone, compact, index);
    }

    context.restore();
  };

  const drawFrame = (timestamp) => {
    const elapsed = reducedMotion.matches ? 0 : timestamp - startTime;
    pointer.x += (pointerTarget.x - pointer.x) * 0.035;
    pointer.y += (pointerTarget.y - pointer.y) * 0.035;
    context.clearRect(0, 0, width, height);

    const ingredientCount = width < 560 ? 9 : width < 980 ? 13 : ingredientSeeds.length;
    for (let ingredientIndex = 0; ingredientIndex < ingredientCount; ingredientIndex += 1) {
      traceIngredient(ingredientSeeds[ingredientIndex], elapsed, ingredientIndex);
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

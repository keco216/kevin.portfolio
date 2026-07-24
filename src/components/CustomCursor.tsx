"use client";

import { useEffect, useRef } from "react";

type CursorShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

type MagneticState = {
  element: HTMLElement;
  currentX: number;
  currentY: number;
  velocityX: number;
  velocityY: number;
  targetX: number;
  targetY: number;
  active: boolean;
};

const INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], summary, label[for], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [contenteditable="true"], [tabindex]:not([tabindex="-1"]), [data-cursor]';

const DEFAULT_SIZE = 44;
const INTERACTIVE_PADDING = 8;
const POSITION_STIFFNESS = 420;
const POSITION_DAMPING = 38;
const SIZE_STIFFNESS = 280;
const SIZE_DAMPING = 31;
const MAGNETIC_STIFFNESS = 175;
const MAGNETIC_DAMPING = 19;
const MAGNETIC_MAX_OFFSET = 18;
const FULL_STRETCH_VELOCITY = 1350;
const MAX_CURSOR_LAG = 38;

function springStep(
  current: number,
  velocity: number,
  target: number,
  deltaTime: number,
  stiffness: number,
  damping: number,
) {
  const acceleration = (target - current) * stiffness - velocity * damping;
  const nextVelocity = velocity + acceleration * deltaTime;

  return {
    value: current + nextVelocity * deltaTime,
    velocity: nextVelocity,
  };
}

function isSettled(current: CursorShape, target: CursorShape) {
  return (
    Math.abs(current.x - target.x) < 0.1 &&
    Math.abs(current.y - target.y) < 0.1 &&
    Math.abs(current.width - target.width) < 0.1 &&
    Math.abs(current.height - target.height) < 0.1 &&
    Math.abs(current.radius - target.radius) < 0.1
  );
}

function isVelocitySettled(velocity: CursorShape) {
  return (
    Math.abs(velocity.x) < 0.1 &&
    Math.abs(velocity.y) < 0.1 &&
    Math.abs(velocity.width) < 0.1 &&
    Math.abs(velocity.height) < 0.1 &&
    Math.abs(velocity.radius) < 0.1
  );
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  shape: CursorShape,
) {
  const radius = Math.max(
    0,
    Math.min(shape.radius, shape.width / 2, shape.height / 2),
  );
  const right = shape.x + shape.width;
  const bottom = shape.y + shape.height;

  context.moveTo(shape.x + radius, shape.y);
  context.lineTo(right - radius, shape.y);
  context.quadraticCurveTo(right, shape.y, right, shape.y + radius);
  context.lineTo(right, bottom - radius);
  context.quadraticCurveTo(right, bottom, right - radius, bottom);
  context.lineTo(shape.x + radius, bottom);
  context.quadraticCurveTo(shape.x, bottom, shape.x, bottom - radius);
  context.lineTo(shape.x, shape.y + radius);
  context.quadraticCurveTo(shape.x, shape.y, shape.x + radius, shape.y);
  context.closePath();
}

function drawMotionBlob(
  context: CanvasRenderingContext2D,
  shape: CursorShape,
  angle: number,
  stretch: number,
) {
  const baseSize = Math.min(shape.width, shape.height);
  const radius = baseSize / 2;
  const tailLength = 42 * stretch;
  const halfHeight = Math.max(9, radius * (1 - stretch * 0.16));
  const tail = -radius - tailLength;
  const front = radius + stretch * 3;
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  context.save();
  context.translate(centerX, centerY);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(tail, 0);
  context.bezierCurveTo(
    tail + tailLength * 0.52,
    -halfHeight * 0.56,
    -radius * 0.3,
    -halfHeight,
    0,
    -halfHeight,
  );
  context.bezierCurveTo(
    radius * 0.64,
    -halfHeight,
    front,
    -halfHeight * 0.62,
    front,
    0,
  );
  context.bezierCurveTo(
    front,
    halfHeight * 0.62,
    radius * 0.64,
    halfHeight,
    0,
    halfHeight,
  );
  context.bezierCurveTo(
    -radius * 0.3,
    halfHeight,
    tail + tailLength * 0.52,
    halfHeight * 0.56,
    tail,
    0,
  );
  context.closePath();
  context.fill();
  context.restore();
}

/**
 * Desktop-Cursor nach dem Prinzip des Referenz-Portfolios:
 * Eine weiße Canvas-Fläche wird im Difference-Modus über die Seite gelegt.
 * Der echte Cursor ist ein kleiner schwarzer Punkt. Über interaktiven
 * Elementen morphiert die Fläche in deren Form.
 */
export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    if (!canvas || !finePointer.matches) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const root = document.documentElement;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let pointerX = -100;
    let pointerY = -100;
    let motionStrength = 0;
    let motionAngle = 0;
    let hoveredElement: Element | null = null;
    let activeMagneticElement: HTMLElement | null = null;
    let visible = false;
    let pressed = false;
    let positioned = false;
    let reducedMotion = reducedMotionQuery.matches;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let previousDrawnShape: CursorShape | null = null;
    const magneticStates = new Map<HTMLElement, MagneticState>();

    let target: CursorShape = {
      x: -100,
      y: -100,
      width: DEFAULT_SIZE,
      height: DEFAULT_SIZE,
      radius: DEFAULT_SIZE / 2,
    };

    let current = { ...target };
    let velocity: CursorShape = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      radius: 0,
    };

    const resizeCanvas = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(viewportWidth * pixelRatio);
      canvas.height = Math.round(viewportHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      previousDrawnShape = null;
      scheduleRender();
    };

    const setCircleTarget = () => {
      const pressedSize = pressed ? DEFAULT_SIZE * 0.82 : DEFAULT_SIZE;

      target = {
        x: pointerX - pressedSize / 2,
        y: pointerY - pressedSize / 2,
        width: pressedSize,
        height: pressedSize,
        radius: pressedSize / 2,
      };
    };

    const clearMagneticStyle = (element: HTMLElement) => {
      element.classList.remove("cursor-magnetic-target");
      element.removeAttribute("data-cursor-magnetic-active");
      element.style.removeProperty("--cursor-magnetic-x");
      element.style.removeProperty("--cursor-magnetic-y");
    };

    const releaseMagneticElement = (element: HTMLElement | null) => {
      if (!element) {
        return;
      }

      const state = magneticStates.get(element);

      if (!state) {
        return;
      }

      state.active = false;
      state.targetX = 0;
      state.targetY = 0;
      element.dataset.cursorMagneticActive = "false";
      scheduleRender();
    };

    const releaseActiveMagneticElement = () => {
      releaseMagneticElement(activeMagneticElement);
      activeMagneticElement = null;
    };

    const updateMagneticTarget = (element: HTMLElement) => {
      if (activeMagneticElement !== element) {
        releaseActiveMagneticElement();
        activeMagneticElement = element;
      }

      let state = magneticStates.get(element);

      if (!state) {
        state = {
          element,
          currentX: 0,
          currentY: 0,
          velocityX: 0,
          velocityY: 0,
          targetX: 0,
          targetY: 0,
          active: true,
        };
        magneticStates.set(element, state);
      }

      state.active = true;
      element.classList.add("cursor-magnetic-target");
      element.dataset.cursorMagneticActive = "true";

      const renderedRect = element.getBoundingClientRect();
      const baseLeft = renderedRect.left - state.currentX;
      const baseTop = renderedRect.top - state.currentY;
      const centerX = baseLeft + renderedRect.width / 2;
      const centerY = baseTop + renderedRect.height / 2;
      const normalizedX = Math.max(
        -1,
        Math.min(
          1,
          (pointerX - centerX) / Math.max(renderedRect.width / 2, 1),
        ),
      );
      const normalizedY = Math.max(
        -1,
        Math.min(
          1,
          (pointerY - centerY) / Math.max(renderedRect.height / 2, 1),
        ),
      );

      state.targetX = normalizedX * MAGNETIC_MAX_OFFSET;
      state.targetY = normalizedY * MAGNETIC_MAX_OFFSET;
    };

    const setInteractiveCursorTarget = () => {
      if (
        !hoveredElement ||
        !document.documentElement.contains(hoveredElement)
      ) {
        return false;
      }

      const rect = hoveredElement.getBoundingClientRect();
      const computedRadius = Number.parseFloat(
        window.getComputedStyle(hoveredElement).borderRadius,
      );
      const padding = pressed ? 4 : INTERACTIVE_PADDING;
      const magneticState =
        hoveredElement instanceof HTMLElement
          ? magneticStates.get(hoveredElement)
          : undefined;

      canvas.dataset.magneticX = (
        magneticState?.currentX ?? 0
      ).toFixed(2);
      canvas.dataset.magneticY = (
        magneticState?.currentY ?? 0
      ).toFixed(2);
      target = {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        radius: Number.isFinite(computedRadius)
          ? computedRadius + padding
          : 8 + padding,
      };

      return true;
    };

    const updateTarget = () => {
      if (
        hoveredElement &&
        document.documentElement.contains(hoveredElement)
      ) {
        canvas.dataset.mode = "interactive";

        if (hoveredElement instanceof HTMLElement && !reducedMotion) {
          updateMagneticTarget(hoveredElement);
        } else {
          releaseActiveMagneticElement();
        }

        setInteractiveCursorTarget();
        scheduleRender();
        return;
      }

      releaseActiveMagneticElement();
      canvas.dataset.mode = "default";
      canvas.dataset.magneticX = "0";
      canvas.dataset.magneticY = "0";
      setCircleTarget();
      scheduleRender();
    };

    const findInteractiveElement = (eventTarget: EventTarget | null) => {
      if (!(eventTarget instanceof Element)) {
        return null;
      }

      return eventTarget.closest(INTERACTIVE_SELECTOR);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (positioned) {
        const deltaX = event.clientX - pointerX;
        const deltaY = event.clientY - pointerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > 0.35) {
          canvas.dataset.direction =
            Math.abs(deltaX) >= Math.abs(deltaY)
              ? deltaX < 0
                ? "left"
                : "right"
              : deltaY < 0
                ? "up"
                : "down";
        }
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      canvas.dataset.pointerX = pointerX.toFixed(2);
      canvas.dataset.pointerY = pointerY.toFixed(2);
      const hitTarget =
        document.elementFromPoint(event.clientX, event.clientY) ?? event.target;
      hoveredElement = findInteractiveElement(hitTarget);
      visible = true;
      updateTarget();

      if (!positioned) {
        current = { ...target };
        velocity = {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          radius: 0,
        };
        positioned = true;
      }

      canvas.dataset.visible = "true";
    };

    const handlePointerDown = () => {
      pressed = true;
      updateTarget();
    };

    const handlePointerUp = () => {
      pressed = false;
      updateTarget();
    };

    const hideCursor = () => {
      visible = false;
      positioned = false;
      motionStrength = 0;
      hoveredElement = null;
      releaseActiveMagneticElement();
      canvas.dataset.visible = "false";
      scheduleRender();
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;

      if (reducedMotion) {
        releaseActiveMagneticElement();
      }

      scheduleRender();
    };

    const scheduleRender = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const stepMagneticStates = (deltaTime: number) => {
      let moving = false;

      magneticStates.forEach((state, element) => {
        if (!document.documentElement.contains(element)) {
          clearMagneticStyle(element);
          magneticStates.delete(element);
          return;
        }

        const desiredX = state.active && !reducedMotion ? state.targetX : 0;
        const desiredY = state.active && !reducedMotion ? state.targetY : 0;

        if (reducedMotion) {
          state.currentX = desiredX;
          state.currentY = desiredY;
          state.velocityX = 0;
          state.velocityY = 0;
        } else {
          const xStep = springStep(
            state.currentX,
            state.velocityX,
            desiredX,
            deltaTime,
            MAGNETIC_STIFFNESS,
            MAGNETIC_DAMPING,
          );
          const yStep = springStep(
            state.currentY,
            state.velocityY,
            desiredY,
            deltaTime,
            MAGNETIC_STIFFNESS,
            MAGNETIC_DAMPING,
          );

          state.currentX = xStep.value;
          state.currentY = yStep.value;
          state.velocityX = xStep.velocity;
          state.velocityY = yStep.velocity;
        }

        const settled =
          Math.abs(state.currentX - desiredX) < 0.05 &&
          Math.abs(state.currentY - desiredY) < 0.05 &&
          Math.abs(state.velocityX) < 0.05 &&
          Math.abs(state.velocityY) < 0.05;

        if (settled) {
          state.currentX = desiredX;
          state.currentY = desiredY;
          state.velocityX = 0;
          state.velocityY = 0;
        } else {
          moving = true;
        }

        element.style.setProperty(
          "--cursor-magnetic-x",
          `${state.currentX.toFixed(3)}px`,
        );
        element.style.setProperty(
          "--cursor-magnetic-y",
          `${state.currentY.toFixed(3)}px`,
        );

        if (!state.active && settled) {
          clearMagneticStyle(element);
          magneticStates.delete(element);
        }
      });

      return moving;
    };

    const render = (frameTime: number) => {
      animationFrame = 0;
      const deltaTime =
        lastFrameTime === 0
          ? 1 / 60
          : Math.min((frameTime - lastFrameTime) / 1000, 1 / 30);
      lastFrameTime = frameTime;
      const interactiveMode = canvas.dataset.mode === "interactive";
      const magneticMoving = stepMagneticStates(deltaTime);

      if (interactiveMode) {
        setInteractiveCursorTarget();
      }

      if (reducedMotion) {
        current = { ...target };
        velocity = {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          radius: 0,
        };
      } else {
        const xStep = springStep(
          current.x,
          velocity.x,
          target.x,
          deltaTime,
          POSITION_STIFFNESS,
          POSITION_DAMPING,
        );
        const yStep = springStep(
          current.y,
          velocity.y,
          target.y,
          deltaTime,
          POSITION_STIFFNESS,
          POSITION_DAMPING,
        );
        const widthStep = springStep(
          current.width,
          velocity.width,
          target.width,
          deltaTime,
          SIZE_STIFFNESS,
          SIZE_DAMPING,
        );
        const heightStep = springStep(
          current.height,
          velocity.height,
          target.height,
          deltaTime,
          SIZE_STIFFNESS,
          SIZE_DAMPING,
        );
        const radiusStep = springStep(
          current.radius,
          velocity.radius,
          target.radius,
          deltaTime,
          SIZE_STIFFNESS,
          SIZE_DAMPING,
        );

        current = {
          x: xStep.value,
          y: yStep.value,
          width: Math.max(1, widthStep.value),
          height: Math.max(1, heightStep.value),
          radius: Math.max(0, radiusStep.value),
        };
        velocity = {
          x: xStep.velocity,
          y: yStep.velocity,
          width: widthStep.velocity,
          height: heightStep.velocity,
          radius: radiusStep.velocity,
        };
      }

      /*
       * Der schwarze Hotspot liegt exakt am Systemzeiger. Die Feder darf den
       * weißen Blob sichtbar dehnen, aber nie so weit zurückfallen, dass beide
       * wie zwei getrennte Cursor wirken.
       */
      if (!interactiveMode && positioned) {
        const centerX = current.x + current.width / 2;
        const centerY = current.y + current.height / 2;
        const lagX = pointerX - centerX;
        const lagY = pointerY - centerY;
        const lagDistance = Math.hypot(lagX, lagY);

        if (lagDistance > MAX_CURSOR_LAG) {
          const correction = lagDistance - MAX_CURSOR_LAG;

          current.x += (lagX / lagDistance) * correction;
          current.y += (lagY / lagDistance) * correction;
        }
      }

      if (isSettled(current, target) && isVelocitySettled(velocity)) {
        current = { ...target };
        velocity = {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          radius: 0,
        };
      }

      canvas.dataset.lagDistance = interactiveMode
        ? "0"
        : Math.hypot(
            pointerX - (current.x + current.width / 2),
            pointerY - (current.y + current.height / 2),
          ).toFixed(2);

      const springSpeed = Math.hypot(velocity.x, velocity.y);
      const requestedStretch =
        reducedMotion || interactiveMode
          ? 0
          : Math.min(1, springSpeed / FULL_STRETCH_VELOCITY);
      const morphResponse =
        requestedStretch > motionStrength ? 22 : interactiveMode ? 28 : 9;
      const morphBlend = 1 - Math.exp(-morphResponse * deltaTime);

      motionStrength +=
        (requestedStretch - motionStrength) * morphBlend;

      if (springSpeed > 24) {
        motionAngle = Math.atan2(velocity.y, velocity.x);
        const movingHorizontally =
          Math.abs(velocity.x) >= Math.abs(velocity.y);

        canvas.dataset.blobDirection = movingHorizontally
          ? velocity.x < 0
            ? "left"
            : "right"
          : velocity.y < 0
            ? "up"
            : "down";
        canvas.dataset.trailDirection = movingHorizontally
          ? velocity.x < 0
            ? "right"
            : "left"
          : velocity.y < 0
            ? "down"
            : "up";
      }

      if (motionStrength < 0.001) {
        motionStrength = 0;
      }

      const stretch = reducedMotion ? 0 : motionStrength;

      if (previousDrawnShape) {
        const clearPadding = 72;
        context.clearRect(
          previousDrawnShape.x - clearPadding,
          previousDrawnShape.y - clearPadding,
          previousDrawnShape.width + clearPadding * 2,
          previousDrawnShape.height + clearPadding * 2,
        );
      }

      if (visible) {
        context.fillStyle = "#ffffff";

        const cursorIsRound =
          Math.abs(current.width - current.height) <
          Math.max(current.width, current.height) * 0.4;
        const shouldDeform =
          !interactiveMode &&
          !reducedMotion &&
          cursorIsRound &&
          stretch > 0.025;

        if (shouldDeform) {
          drawMotionBlob(context, current, motionAngle, stretch);
        } else {
          context.beginPath();
          drawRoundedRect(context, current);
          context.fill();
        }

        previousDrawnShape = { ...current };
      } else {
        previousDrawnShape = null;
      }

      if (
        (visible &&
          (!isSettled(current, target) ||
            !isVelocitySettled(velocity) ||
            motionStrength > 0.01)) ||
        magneticMoving
      ) {
        scheduleRender();
      } else {
        lastFrameTime = 0;
      }
    };

    root.classList.add("custom-cursor-active");
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("blur", hideCursor);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("scroll", updateTarget, true);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.cancelAnimationFrame(animationFrame);
      magneticStates.forEach(({ element }) => {
        clearMagneticStyle(element);
      });
      magneticStates.clear();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("blur", hideCursor);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("scroll", updateTarget, true);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="custom-cursor-canvas"
      data-visible="false"
      aria-hidden="true"
    />
  );
}

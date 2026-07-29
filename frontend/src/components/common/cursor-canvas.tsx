import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
}

/**
 * Ambient canvas layer: a soft glowing ribbon that traces the pointer,
 * plus a slow drifting spark field. Purely decorative.
 */
export function CursorCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const trail: Point[] = [];
    const pointer = { x: width / 2, y: height / 2, active: false };
    const eased = { x: pointer.x, y: pointer.y };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const sparks = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      s: Math.random() * 0.00016 + 0.00004,
      p: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let t = 0;

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      // drifting spark field
      for (const s of sparks) {
        const sx = ((s.x + Math.sin(t * s.s * 40 + s.p) * 0.02) % 1) * width;
        const sy = ((s.y + t * s.s) % 1) * height;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(168, 70%, 70%, ${0.06 + s.r * 0.05})`;
        ctx.fill();
      }

      // pointer trail
      eased.x += (pointer.x - eased.x) * 0.18;
      eased.y += (pointer.y - eased.y) * 0.18;

      if (pointer.active) {
        trail.push({ x: eased.x, y: eased.y, age: 0 });
      }
      while (trail.length > 26) trail.shift();

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const k = i / trail.length;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${168 + (1 - k) * 70}, 85%, 68%, ${k * 0.5})`;
        ctx.lineWidth = k * 9 + 0.6;
        ctx.stroke();
      }

      if (pointer.active) {
        const g = ctx.createRadialGradient(eased.x, eased.y, 0, eased.x, eased.y, 130);
        g.addColorStop(0, "hsla(168, 90%, 70%, 0.16)");
        g.addColorStop(0.5, "hsla(200, 90%, 65%, 0.06)");
        g.addColorStop(1, "hsla(200, 90%, 65%, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(eased.x, eased.y, 130, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(render);
    };
    raf = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 hidden mix-blend-screen md:block"
    />

  );
}

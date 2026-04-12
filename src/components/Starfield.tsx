import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  driftAngle: number;
  driftSpeed: number;
  driftRadius: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -9999, y: -9999 };
    let stars: Star[] = [];
    let animId: number;

    const STAR_COUNT  = 600;
    const INFLUENCE_R = 160;  // radius of cursor disturbance
    const SPRING      = 0.012;
    const DAMPING     = 0.88;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      stars = Array.from({ length: STAR_COUNT }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x, y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          size: 0.4 + Math.random() * 1.4,
          baseOpacity: 0.3 + Math.random() * 0.7,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: 0.002 + Math.random() * 0.003,
          driftRadius: 8 + Math.random() * 12,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.018 + Math.random() * 0.025,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        // Distance from cursor
        const dxCursor = star.x - mouse.x;
        const dyCursor = star.y - mouse.y;
        const distCursor = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);

        // Excitement: 0 far away, 1 at cursor center (smooth falloff)
        const excitement = Math.max(0, 1 - distCursor / INFLUENCE_R);

        // Ambient drift — speed and radius scale up with excitement
        star.driftAngle += star.driftSpeed * (1 + excitement * 6);
        star.twinklePhase += star.twinkleSpeed * (1 + excitement * 3);

        const effectiveRadius = star.driftRadius * (1 + excitement * 7);
        const driftX = star.homeX + Math.cos(star.driftAngle) * effectiveRadius;
        const driftY = star.homeY + Math.sin(star.driftAngle) * effectiveRadius;

        // Spring toward drifting home — no cursor attraction
        const fx = (driftX - star.x) * SPRING;
        const fy = (driftY - star.y) * SPRING;

        star.vx = (star.vx + fx) * DAMPING;
        star.vy = (star.vy + fy) * DAMPING;
        star.x += star.vx;
        star.y += star.vy;

        // Size: base + scale up near cursor
        const renderSize = star.size * (1 + excitement * 2.5);

        // Opacity: ambient base + boost near cursor, twinkle always
        const twinkle = 0.4 + 0.6 * Math.sin(star.twinklePhase);
        const opacity = (0.30 + excitement * 0.65) * star.baseOpacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, renderSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => { init(); };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    init();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

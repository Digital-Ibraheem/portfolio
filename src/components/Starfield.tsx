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

    const isMobile = width < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mouse = { x: -9999, y: -9999 };
    const gyroTarget = { x: -9999, y: -9999 };
    let gyroEnabled = false;
    let stars: Star[] = [];
    let animId: number;

    const STAR_COUNT  = isMobile ? 150 : 600;
    const INFLUENCE_R = 160;
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

      // Smooth gyro input toward target
      if (gyroEnabled) {
        mouse.x += (gyroTarget.x - mouse.x) * 0.08;
        mouse.y += (gyroTarget.y - mouse.y) * 0.08;
      }

      ctx.fillStyle = '#ffffff';

      stars.forEach(star => {
        if (reducedMotion) {
          // Static render — no drift, no twinkle
          ctx.globalAlpha = star.baseOpacity * 0.5;
          ctx.beginPath();
          ctx.arc(star.homeX, star.homeY, star.size, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        const dxCursor = star.x - mouse.x;
        const dyCursor = star.y - mouse.y;
        const distCursor = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);

        const excitement = Math.max(0, 1 - distCursor / INFLUENCE_R);

        star.driftAngle += star.driftSpeed * (1 + excitement * 6);
        star.twinklePhase += star.twinkleSpeed * (1 + excitement * 3);

        const effectiveRadius = star.driftRadius * (1 + excitement * 7);
        const driftX = star.homeX + Math.cos(star.driftAngle) * effectiveRadius;
        const driftY = star.homeY + Math.sin(star.driftAngle) * effectiveRadius;

        const fx = (driftX - star.x) * SPRING;
        const fy = (driftY - star.y) * SPRING;

        star.vx = (star.vx + fx) * DAMPING;
        star.vy = (star.vy + fy) * DAMPING;
        star.x += star.vx;
        star.y += star.vy;

        const renderSize = star.size * (1 + excitement * 2.5);

        const twinkle = 0.4 + 0.6 * Math.sin(star.twinklePhase);
        const opacity = (0.30 + excitement * 0.65) * star.baseOpacity * twinkle;

        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, renderSize, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    // Desktop: mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Mobile: device orientation (gyroscope)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      // gamma: left-right tilt (-90 to 90), map ±45° to viewport width
      const gClamped = Math.max(-45, Math.min(45, e.gamma));
      gyroTarget.x = ((gClamped + 45) / 90) * width;
      // beta: front-back tilt (0 to 180 when face-up), neutral ~45°, map ±45° around that
      const bClamped = Math.max(0, Math.min(90, e.beta));
      gyroTarget.y = (bClamped / 90) * height;
    };

    const enableGyro = () => {
      gyroEnabled = true;
      window.addEventListener('deviceorientation', handleOrientation);
    };

    // iOS 13+ requires permission for gyroscope
    const requestGyroPermission = () => {
      const DOE = DeviceOrientationEvent as any;
      if (typeof DOE.requestPermission === 'function') {
        DOE.requestPermission().then((state: string) => {
          if (state === 'granted') enableGyro();
        }).catch(() => {});
      } else {
        // Android or older iOS — just enable
        enableGyro();
      }
    };

    const handleResize = () => { init(); };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Enable gyroscope on mobile
    if (isMobile && !reducedMotion) {
      // Try to request on first user interaction (required on iOS)
      const onFirstTouch = () => {
        requestGyroPermission();
        window.removeEventListener('touchstart', onFirstTouch);
      };
      window.addEventListener('touchstart', onFirstTouch, { once: true });
    }

    init();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

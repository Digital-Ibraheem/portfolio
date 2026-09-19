import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export const DataCursor: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState('nominal');
  const [enabled, setEnabled] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const springX = useSpring(0, { stiffness: 150, damping: 20 });
  const springY = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
      setHasMoved(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, springX, springY]);

  // Randomly flicker status for "technical" feel
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setStatus('calibrating...');
        setTimeout(() => setStatus('nominal'), 1000);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled || !hasMoved) return null;

  return (
    <>
      {/* The Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      />
      
      {/* The Technical Readout */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] ml-6 mt-6 flex flex-col gap-1"
        style={{ x: springX, y: springY }}
      >
        <div className="text-[10px] font-label text-white/40 tracking-[0.15em] whitespace-nowrap">
          pos: {(coords.x / window.innerWidth).toFixed(2)}, {(coords.y / window.innerHeight).toFixed(2)}
        </div>
        <div className="text-[10px] font-label text-white/40 tracking-[0.2em] whitespace-nowrap">
          sys_status: {status}
        </div>
      </motion.div>
    </>
  );
};

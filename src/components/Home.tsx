import React from 'react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (view: 'experience' | 'archive') => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 text-center flex flex-col items-center pointer-events-none"
      >
        <h1 className="font-headline text-7xl md:text-[6rem] lg:text-[8rem] font-bold text-white leading-none tracking-[-0.04em] mb-4">
          ibraheem dawod.
        </h1>
        <p className="font-body italic font-extralight text-secondary text-base md:text-lg tracking-[0.02em] max-w-md">
          computer science student at carleton university. building things and learning along the way.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mt-12 pointer-events-auto">
          <button 
            onClick={() => onNavigate('archive')}
            className="px-8 py-2 bg-transparent text-white border border-white/30 font-headline font-bold text-sm lowercase tracking-tight rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer"
          >
            view_archive
          </button>
          <button 
            onClick={() => onNavigate('experience')}
            className="px-8 py-2 bg-transparent text-white border border-white/30 font-headline font-bold text-sm lowercase tracking-tight rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer"
          >
            experience_log
          </button>
        </div>
      </motion.div>
      
      {/* Tonal Section (Visual depth shift) */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-surface-container-lowest to-transparent pointer-events-none z-20" />
    </div>
  );
};

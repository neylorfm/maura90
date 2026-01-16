import React from 'react';
import { CoverSlideData } from '../types';
import { motion } from 'framer-motion';

interface CoverSlideProps {
  data: CoverSlideData;
}

export const CoverSlide: React.FC<CoverSlideProps> = ({ data }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark text-center light-leak">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5" />
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <header className="absolute top-0 w-full flex items-center justify-between px-12 py-8 z-20 opacity-60">
        <div className="flex items-center gap-3 text-primary-dark dark:text-white">
          <span className="material-symbols-outlined">auto_awesome</span>
          <h2 className="text-sm font-bold leading-tight tracking-[0.2em] uppercase">M. Magalhães</h2>
        </div>
        <div className="text-sm font-medium tracking-widest uppercase dark:text-white">
          {data.years}
        </div>
      </header>

      <main className="relative flex flex-col items-center z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mb-6"
        >
          <p className="text-accent-gold text-lg md:text-xl font-normal tracking-[0.4em] uppercase">
            Celebrando um Legado
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, type: 'spring', stiffness: 50 }}
          className="relative py-4"
        >
          <h1 className="text-primary-dark dark:text-white tracking-tighter text-[56px] md:text-[100px] lg:text-[130px] font-black leading-none text-glow font-display">
            {data.name}
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col items-center gap-8 mt-6"
        >
          <div className="w-24 h-[2px] bg-primary" />
          <h2 className="text-primary-dark dark:text-primary text-[32px] md:text-[56px] font-light leading-tight tracking-[0.2em] uppercase font-display">
            {data.subtitle}
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20"
        >
          <p className="text-accent-gold dark:text-white/40 text-sm md:text-base font-medium tracking-[0.3em] uppercase">
            {data.tagline}
          </p>
        </motion.div>
      </main>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 animate-bounce">
         <span className="material-symbols-outlined text-4xl">keyboard_double_arrow_right</span>
      </div>
    </div>
  );
};
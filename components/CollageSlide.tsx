import React from 'react';
import { CollageData } from '../types';
import { motion } from 'framer-motion';

import { EditOverlay } from './EditOverlay';

interface CollageSlideProps {
  data: CollageData;
  isEditMode?: boolean;
  onEditImage?: (index: number) => void;
  onUpdateImage?: (index: number | undefined, updates: { position?: string, scale?: number }) => void;
}

export const CollageSlide: React.FC<CollageSlideProps> = ({ data, isEditMode = false, onEditImage = (_i) => { }, onUpdateImage }) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-y-auto md:overflow-hidden bg-background-light dark:bg-background-dark text-primary-dark dark:text-white transition-colors duration-300">

      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-3xl rounded-full"></div>
      </div>

      <header className="flex items-center justify-between px-10 py-6 z-20">
        <div className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight uppercase font-display">{data.subtitle}</h2>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-4 md:px-10 pb-16 relative z-10">
        <div className="max-w-7xl w-full">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-4 md:mb-10"
          >
            <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-2 font-display">{data.title}</h1>
            <p className="text-primary text-sm md:text-xl font-medium tracking-[0.2em] uppercase">{data.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8 items-center min-h-0 md:min-h-[550px]">
            {data.images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, rotate: img.rotation ? img.rotation * 2 : 0 }}
                animate={{ opacity: 1, y: 0, rotate: img.rotation || 0 }}
                transition={{ delay: 0.2 * idx, duration: 0.8 }}
                className={`${img.highlight ? 'col-span-2 md:col-span-6 z-10 order-first md:order-none' : 'col-span-1 md:col-span-3'} ${idx === 0 ? 'md:self-end' : ''} ${idx === 2 ? 'md:self-start' : ''}`}
              >
                <div className={`bg-white p-2 md:p-4 shadow-2xl rounded-sm transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] ${img.highlight ? 'border-4 md:border-8 border-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]' : ''}`}>
                  <div className={`${img.highlight ? 'aspect-video' : 'aspect-[3/4]'} overflow-hidden rounded-sm bg-gray-100 relative`}>
                    <div
                      className="w-full h-full bg-center bg-no-repeat bg-cover hover:scale-110 transition-transform duration-[2s]"
                      style={{
                        backgroundImage: `url(${img.src})`,
                        backgroundPosition: img.position || 'center',
                        backgroundSize: img.scale ? `${img.scale}%` : 'cover'
                      }}
                    ></div>
                    <EditOverlay
                      isEditing={isEditMode}
                      onEdit={() => onEditImage && onEditImage(idx)}
                      currentPosition={img.position}
                      currentScale={img.scale}
                      onPositionChange={(pos) => onUpdateImage?.(idx, { position: pos })}
                      onScaleChange={(scale) => onUpdateImage?.(idx, { scale })}
                    />
                  </div>
                  <div className="mt-2 md:mt-4 text-center">
                    <p className={`font-semibold ${img.highlight ? 'text-lg md:text-2xl text-primary-dark' : 'text-xs md:text-sm text-accent-gold'}`}>{img.label}</p>
                    <p className={`text-gray-400 mt-0.5 md:mt-1 uppercase tracking-widest ${img.highlight ? 'text-primary font-bold' : 'text-[10px] md:text-xs'}`}>{img.sublabel}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 md:mt-12 flex flex-wrap justify-center gap-6 md:gap-12">
            {data.stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center group">
                  <p className="text-accent-gold text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{stat.label}</p>
                  <p className="text-4xl font-bold leading-none font-display">{stat.value}</p>
                </div>
                {idx < data.stats.length - 1 && <div className="hidden md:block w-px h-12 bg-primary/20"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
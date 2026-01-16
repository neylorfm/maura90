import React, { useRef, useState } from 'react';
import { PhotoShowcaseData } from '../types';
import { motion } from 'framer-motion';

import { EditOverlay } from './EditOverlay';

interface PhotoShowcaseProps {
  data: PhotoShowcaseData;
  isEditMode?: boolean;
  onEditImage?: () => void;
  onUpdateImage?: (index: number | undefined, updates: { position?: string, scale?: number }) => void;
}

export const PhotoShowcaseSlide: React.FC<PhotoShowcaseProps> = ({ data, isEditMode = false, onEditImage = () => { }, onUpdateImage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    // Slight rotation effect based on mouse position
    setRotation({ x: y * 5, y: -x * 5 });
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-background-dark flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
    >
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-110 z-0 transition-all duration-1000"
        style={{ backgroundImage: `url(${data.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background-dark/90 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://cdnjs.cloudflare.com/ajax/libs/startbootstrap-clean-blog/5.0.10/img/home-bg.jpg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-12 flex justify-between items-start z-20 pointer-events-none">
        <div className="flex flex-col pointer-events-auto">
          <p className="text-primary text-sm font-bold tracking-[0.3em] uppercase opacity-80">Maura 90</p>
          <div className="w-12 h-[1px] bg-primary mt-2" />
        </div>
        <div className="text-white/40 flex gap-4 pointer-events-auto">
          <span className="material-symbols-outlined text-2xl">grid_view</span>
          <span className="material-symbols-outlined text-2xl">fullscreen</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        <motion.div
          ref={containerRef}
          className="w-full bg-white p-4 pb-36 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] rounded-sm"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full aspect-[4/3] bg-center bg-cover bg-no-repeat overflow-hidden rounded-sm bg-gray-200">
            <div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${data.image})`,
                backgroundPosition: data.position || 'center',
                backgroundSize: data.scale ? `${data.scale}%` : 'cover'
              }}
            />
            <EditOverlay
              isEditing={isEditMode}
              onEdit={onEditImage}
              currentPosition={data.position}
              currentScale={data.scale}
              onPositionChange={(pos) => onUpdateImage?.(undefined, { position: pos })}
              onScaleChange={(scale) => onUpdateImage?.(undefined, { scale })}
            />
          </div>
          <div className="absolute bottom-4 left-0 w-full px-8 text-center text-[#181611]/80 italic font-serif">
            <p className="text-xl md:text-3xl leading-snug">
              {data.location}{data.location && data.year ? ', ' : ''}{data.year}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Caption */}
      <motion.div
        className="absolute bottom-0 right-0 p-8 md:p-16 z-20 text-right max-w-xl pointer-events-none"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1
          className="text-primary tracking-[0.1em] text-[40px] md:text-[64px] font-light leading-none pb-2 font-display break-words drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
          style={{ WebkitTextStroke: '1px black' }}
        >
          {data.decade}
        </h1>
        <p className="text-white text-xl md:text-2xl font-normal leading-relaxed opacity-90 font-sans text-shadow-sm">
          {data.description}
        </p>
      </motion.div>

      {/* Decorative Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 z-20">
        <motion.div
          className="h-full bg-primary shadow-[0_0_15px_rgba(238,183,43,0.5)]"
          initial={{ width: '0%' }}
          animate={{ width: '20%' }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </div>
  );
};
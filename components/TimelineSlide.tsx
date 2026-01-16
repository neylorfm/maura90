import React from 'react';
import { TimelineData } from '../types';
import { motion } from 'framer-motion';

import { EditOverlay } from './EditOverlay';

interface TimelineSlideProps {
  data: TimelineData;
  isEditMode?: boolean;
  onEditImage?: (index: number) => void;
  onUpdateImage?: (index: number | undefined, updates: { position?: string, scale?: number }) => void;
}

export const TimelineSlide: React.FC<TimelineSlideProps> = ({ data, isEditMode = false, onEditImage = () => { }, onUpdateImage }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark p-6 md:p-12 overflow-hidden">
      {/* Golden Radial BG */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,#fdfbf7_70%,#f7f1e3_100%)] dark:bg-none dark:bg-background-dark"></div>

      <header className="flex flex-col items-center justify-center text-center mb-8 md:mb-16 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary-dark dark:text-white text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 font-serif"
        >
          {data.title}
        </motion.h1>
        <div className="h-1 w-24 bg-primary mb-4 rounded-full"></div>
        <p className="text-accent-gold dark:text-primary/70 text-xl md:text-2xl font-normal italic font-serif">
          {data.subtitle}
        </p>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-4 md:px-20 z-10">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full max-w-[1600px] z-10">
          {data.events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 * idx, duration: 0.6 }}
              className={`flex flex-col items-center group ${idx === 1 ? 'md:mt-12' : ''}`}
            >
              {idx === 1 ? (
                <>
                  <div className="relative w-full aspect-[4/5] rounded-lg border-[3px] border-primary/40 bg-white p-3 md:p-4 overflow-hidden mb-4 md:mb-8 shadow-xl">
                    <div
                      className="w-full h-full bg-center bg-no-repeat bg-cover hover:scale-105 transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${event.image})`,
                        backgroundPosition: event.position || 'center',
                        backgroundSize: event.scale ? `${event.scale}%` : 'cover'
                      }}
                    ></div>
                    <EditOverlay
                      isEditing={isEditMode}
                      onEdit={() => onEditImage(idx)}
                      currentPosition={event.position}
                      currentScale={event.scale}
                      onPositionChange={(pos) => onUpdateImage?.(idx, { position: pos })}
                      onScaleChange={(scale) => onUpdateImage?.(idx, { scale })}
                    />
                  </div>
                  <div className="mb-4 text-center">
                    <span className="text-primary text-4xl md:text-5xl font-bold mb-2 block font-display">{event.year}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 text-center">
                    <span className="text-primary text-4xl md:text-5xl font-bold mb-2 block font-display">{event.year}</span>
                  </div>
                  <div className="relative w-full aspect-[4/5] rounded-lg border-[3px] border-primary/40 bg-white p-3 md:p-4 overflow-hidden mb-4 md:mb-8 shadow-xl">
                    <div
                      className="w-full h-full bg-center bg-no-repeat bg-cover hover:scale-105 transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${event.image})`,
                        backgroundPosition: event.position || 'center',
                        backgroundSize: event.scale ? `${event.scale}%` : 'cover'
                      }}
                    ></div>
                    <EditOverlay
                      isEditing={isEditMode}
                      onEdit={() => onEditImage(idx)}
                      currentPosition={event.position}
                      currentScale={event.scale}
                      onPositionChange={(pos) => onUpdateImage?.(idx, { position: pos })}
                      onScaleChange={(scale) => onUpdateImage?.(idx, { scale })}
                    />
                  </div>
                </>
              )}

              <div className="text-center px-2 md:px-4">
                <p className="text-primary-dark dark:text-white text-lg md:text-2xl font-medium leading-relaxed font-serif">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <div className="absolute top-0 right-0 p-8 z-0">
        <svg className="w-32 h-32 text-primary opacity-10" fill="currentColor" viewBox="0 0 48 48">
          <path d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"></path>
        </svg>
      </div>
    </div>
  );
};
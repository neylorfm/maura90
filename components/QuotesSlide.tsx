import React, { useEffect, useState } from 'react';
import { QuotesData } from '../types';
import { motion } from 'framer-motion';
import { EditOverlay } from './EditOverlay';

interface QuotesSlideProps {
  data: QuotesData;
  isEditMode?: boolean;
  onEditImage?: (index?: number) => void;
  onUpdateImage?: (index: number | undefined, updates: { position?: string, scale?: number, x?: number, y?: number }) => void;
  isFinished?: boolean;
  allImages?: string[];
}

const CoordinateVisor = ({ x, y, index }: { x: number, y: number, index: number }) => (
  <div className="fixed bottom-24 right-6 bg-black/80 backdrop-blur-md border border-accent-gold/50 text-white p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-2 min-w-[150px]">
    <div className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-700 pb-1 mb-1">
      Bolha #{index + 1}
    </div>
    <div className="flex justify-between items-center font-mono text-sm">
      <span className="text-accent-gold">X:</span>
      <span>{x.toFixed(1)}%</span>
    </div>
    <div className="flex justify-between items-center font-mono text-sm">
      <span className="text-accent-gold">Y:</span>
      <span>{y.toFixed(1)}%</span>
    </div>
    <div className="text-[10px] text-gray-500 mt-1 italic">
      Clique para selecionar. Segure SHIFT + Setas para mover (1px).
    </div>
  </div>
);

const FloatingBubble = ({
  img,
  index,
  isEditMode,
  isSelected,
  isShiftHeld,
  mainRef,
  onSelect,
  onEdit,
  onUpdate,
  isVisible = true,
  overrideSrc
}: {
  img: any,
  index: number,
  isEditMode: boolean,
  isSelected: boolean,
  isShiftHeld: boolean,
  mainRef: React.RefObject<HTMLElement>,
  onSelect: () => void,
  onEdit: () => void,
  onUpdate: (idx: number, updates: { x: number, y: number }) => void,
  isVisible?: boolean,
  overrideSrc?: string | null
}) => {
  const [currentSrc, setCurrentSrc] = useState(img.src);

  useEffect(() => {
    if (overrideSrc) {
      setCurrentSrc(overrideSrc);
    }
  }, [overrideSrc]);




  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? (isSelected ? 1.1 : 1) : 0,
        x: 0,
        y: 0,
        zIndex: isSelected ? 50 : 20
      }}
      transition={{
        default: { type: 'spring', delay: index * 0.1 },
        scale: { duration: 0.2 }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditMode) onSelect();
      }}
      className={`absolute rounded-full border-4 shadow-2xl overflow-hidden pointer-events-auto transition-all duration-200 
        ${isEditMode && isSelected ? 'border-accent-gold ring-4 ring-accent-gold/30' : 'border-white/50'}
        ${isEditMode ? 'cursor-pointer' : ''}
      `}
      style={{
        left: `${img.x}%`,
        top: `${img.y}%`,
        width: `${img.size}px`,
        height: `${img.size}px`,
        touchAction: 'none'
      }}
    >
      <img src={currentSrc} alt="" className="w-full h-full object-cover pointer-events-none transition-opacity duration-500" />

      {isEditMode && (
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-200 ${isSelected || isShiftHeld ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
          {/* Edit Button - Disabled when Shift is held */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isShiftHeld) onEdit();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors
              ${isShiftHeld ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white/20 hover:bg-white/40 cursor-pointer text-white'}
            `}
            title={isShiftHeld ? "Solte o SHIFT para editar" : "Alterar foto"}
          >
            <span className="material-symbols-outlined text-lg">add_a_photo</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export const QuotesSlide: React.FC<QuotesSlideProps> = ({ data, isEditMode = false, onEditImage = () => { }, onUpdateImage, isFinished = false, allImages = [] }) => {
  const mainRef = React.useRef<HTMLElement>(null);
  const [selectedBubbleIndex, setSelectedBubbleIndex] = useState<number | null>(null);
  const [isShiftHeld, setIsShiftHeld] = useState(false);

  // Consume and Vanish Logic
  const [hiddenBubbleIndices, setHiddenBubbleIndices] = useState<Set<number>>(new Set());
  const [consumerOverrideSrc, setConsumerOverrideSrc] = useState<string | null>(null);
  const [isConsumerHidden, setIsConsumerHidden] = useState(false);

  useEffect(() => {
    if (!isFinished || !data.floatingImages) return;

    const consumerIndex = data.floatingImages.findIndex(img => img.cyclic);
    if (consumerIndex === -1) return;

    const targetIndices = data.floatingImages
      .map((_, idx) => idx)
      .filter(idx => idx !== consumerIndex);

    // Shuffle target indices for random consumption order
    for (let i = targetIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targetIndices[i], targetIndices[j]] = [targetIndices[j], targetIndices[i]];
    }

    let currentIndex = 0;

    const consumeNext = () => {
      if (currentIndex >= targetIndices.length) {
        // All consumed, now vanish the consumer
        setTimeout(() => {
          setIsConsumerHidden(true);
        }, 2000);
        return;
      }

      const targetIndex = targetIndices[currentIndex];
      const targetImg = data.floatingImages![targetIndex];

      // 1. Update Consumer to show target image
      setConsumerOverrideSrc(targetImg.src);

      // 2. Hide target bubble immediately (or short delay)
      // Let's hide it immediately to simulate "it moved to the center"
      setHiddenBubbleIndices(prev => new Set(prev).add(targetIndex));

      currentIndex++;

      // Wait before next consumption
      setTimeout(consumeNext, 3000);
    };

    // Start delay
    const startTimeout = setTimeout(consumeNext, 1000);

    return () => clearTimeout(startTimeout);

  }, [isFinished, data.floatingImages]);

  // Deselect when clicking outside
  const handleBackgroundClick = () => {
    if (isEditMode) setSelectedBubbleIndex(null);
  };

  const getPositionClass = (position: string) => {
    switch (position) {
      case 'top-left': return 'col-start-1 row-start-1 self-end justify-self-center mb-12';
      case 'top-right': return 'col-start-2 row-start-1 self-end justify-self-center mb-12';
      case 'bottom-left': return 'col-start-1 row-start-2 self-start justify-self-center mt-12';
      case 'bottom-right': return 'col-start-2 row-start-2 self-start justify-self-center mt-12';
      default: return '';
    }
  };

  return (
    <div
      className="relative h-screen w-full flex flex-col bg-[#fdfbf7] dark:bg-background-dark p-6 md:p-12 overflow-hidden"
      onClick={handleBackgroundClick}
    >
      <header className="flex flex-col items-center justify-center text-center mb-6 relative z-10 pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-primary-dark dark:text-white text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 font-serif"
        >
          {data.title}
        </motion.h1>
        <div className="h-1 w-24 bg-primary mb-4 rounded-full"></div>
        <p className="text-accent-gold dark:text-primary/70 text-xl md:text-2xl font-normal italic font-serif">
          {data.subtitle}
        </p>
      </header>

      <main ref={mainRef} className="relative flex-1 flex items-center justify-center">
        {data.floatingImages ? (
          <div className="absolute inset-0 z-20">
            {data.floatingImages.map((img, idx) => (
              <FloatingBubble
                key={idx}
                img={img}
                index={idx}
                isEditMode={!!isEditMode}
                isSelected={selectedBubbleIndex === idx}
                isShiftHeld={isShiftHeld}
                mainRef={mainRef}
                onSelect={() => setSelectedBubbleIndex(idx)}
                onEdit={() => onEditImage && onEditImage(1000 + idx)}
                onUpdate={(idx, updates) => onUpdateImage && onUpdateImage(1000 + idx, updates)}
                isVisible={img.cyclic ? !isConsumerHidden : !hiddenBubbleIndices.has(idx)}
                overrideSrc={img.cyclic ? consumerOverrideSrc : null}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Central Image - Fallback */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative z-20 group"
            >
              <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-[12px] border-primary shadow-2xl overflow-hidden bg-white p-2">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                    style={{
                      backgroundImage: `url(${data.centralImage})`,
                      backgroundPosition: data.position || 'center',
                      backgroundSize: data.scale ? `${data.scale}%` : 'cover'
                    }}
                  />
                  <EditOverlay
                    isEditing={!!isEditMode}
                    onEdit={() => onEditImage && onEditImage()}
                    currentPosition={data.position}
                    currentScale={data.scale}
                    onPositionChange={(pos) => onUpdateImage?.(undefined, { position: pos })}
                    onScaleChange={(scale) => onUpdateImage?.(undefined, { scale })}
                  />
                </div>
              </div>
            </motion.div>

            {/* Orbit Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="w-[600px] h-[300px] md:w-[800px] md:h-[400px] border-[1px] border-primary/20 rounded-full"
              />
            </div>
          </>
        )}

        {/* Quotes Grid Layer - Absolute on top */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 items-center justify-items-center px-4 md:px-12 pointer-events-none z-30">
          {data.quotes.map((quote, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: quote.position.includes('left') ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (idx * 0.2) }}
              className={`bg-[#fdfaf3] dark:bg-[#1a1814] border-2 border-primary/40 rounded-2xl p-6 md:p-8 shadow-xl relative w-full max-w-[350px] md:max-w-[420px] pointer-events-auto ${getPositionClass(quote.position)}`}
            >
              <span className={`material-symbols-outlined absolute text-primary bg-white dark:bg-gray-800 rounded-full p-2 text-3xl shadow-md ${quote.position.includes('top') ? '-top-4' : '-bottom-4'} ${quote.position.includes('left') ? '-left-4' : '-right-4'} ${quote.position.includes('bottom') ? 'rotate-180' : ''}`}>
                format_quote
              </span>
              <h3 className="text-primary font-bold text-lg md:text-xl uppercase tracking-widest mb-3 font-sans">{quote.relation}</h3>
              <p className="text-primary-dark dark:text-gray-200 text-lg md:text-xl leading-relaxed italic font-serif">"{quote.text}"</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Visor */}
      {isEditMode && selectedBubbleIndex !== null && data.floatingImages && data.floatingImages[selectedBubbleIndex] && (
        <CoordinateVisor
          x={data.floatingImages[selectedBubbleIndex].x}
          y={data.floatingImages[selectedBubbleIndex].y}
          index={selectedBubbleIndex}
        />
      )}

      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <svg className="w-48 h-48 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
      </div>
      <div className="absolute bottom-0 left-0 p-12 opacity-10 pointer-events-none scale-x-[-1]">
        <svg className="w-48 h-48 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
      </div>
    </div>
  );
};
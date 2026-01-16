import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { APP_DATA, MUSIC_TRACKS } from './constants';
import { SlideType, SlideData } from './types';
import { CoverSlide } from './components/CoverSlide';
import { PhotoShowcaseSlide } from './components/PhotoShowcaseSlide';
import { CollageSlide } from './components/CollageSlide';
import { TimelineSlide } from './components/TimelineSlide';
import { QuotesSlide } from './components/QuotesSlide';
import { MultiPhotoSlide } from './components/MultiPhotoSlide';
import { Navigation } from './components/Navigation';
import { SlideTransition } from './components/SlideTransition';
import { PhotoPicker } from './components/PhotoPicker';

import { ExportModal } from './components/ExportModal';
import { ScreenRecorder } from './components/ScreenRecorder';

const App: React.FC = () => {
  // State for slides with localStorage persistence
  const [slides, setSlides] = useState<SlideData[]>(() => {
    const saved = localStorage.getItem('maura-journey-slides-v24');
    return saved ? JSON.parse(saved) : APP_DATA;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCode, setExportCode] = useState('');
  const [editingImageId, setEditingImageId] = useState<{ slideId: string, imageIndex?: number } | null>(null);

  const totalSlides = slides.length;

  useEffect(() => {
    // If we just upgraded to v24 and have no saved data for it, ensure we are using APP_DATA
    // This fixes the issue where HMR preserves the old state even after code changes.
    const saved = localStorage.getItem('maura-journey-slides-v24');
    if (!saved) {
      setSlides(APP_DATA);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('maura-journey-slides-v24', JSON.stringify(slides));
  }, [slides]);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable nav if Shift is held (for bubble dragging) or if picker/modal is open
      if (e.shiftKey || editingImageId || showExportModal) return;

      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'e' || e.key === 'E') setIsEditMode(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, editingImageId, showExportModal]);

  const handleImageUpdate = (newImageSrc: string) => {
    if (!editingImageId) return;

    setSlides(prev => prev.map(slide => {
      if (slide.id !== editingImageId.slideId) return slide;

      // Deep copy to modify
      const newSlide = { ...slide };

      if (newSlide.type === SlideType.PHOTO_SHOWCASE && 'image' in newSlide) {
        newSlide.image = newImageSrc;
      }
      else if (newSlide.type === SlideType.TIMELINE && 'events' in newSlide) {
        if (typeof editingImageId.imageIndex === 'number' && newSlide.events[editingImageId.imageIndex]) {
          newSlide.events[editingImageId.imageIndex] = {
            ...newSlide.events[editingImageId.imageIndex],
            image: newImageSrc
          };
        }
      }
      else if (newSlide.type === SlideType.COLLAGE && 'images' in newSlide) {
        if (typeof editingImageId.imageIndex === 'number' && newSlide.images[editingImageId.imageIndex]) {
          newSlide.images[editingImageId.imageIndex] = {
            ...newSlide.images[editingImageId.imageIndex],
            src: newImageSrc
          };
        }
      }
      else if (newSlide.type === SlideType.MULTI_PHOTO && 'images' in newSlide) {
        if (typeof editingImageId.imageIndex === 'number' && newSlide.images[editingImageId.imageIndex]) {
          newSlide.images[editingImageId.imageIndex] = {
            ...newSlide.images[editingImageId.imageIndex],
            src: newImageSrc
          };
        }
      }
      else if (newSlide.type === SlideType.QUOTES) {
        if (typeof editingImageId.imageIndex === 'number') {
          if (editingImageId.imageIndex >= 1000 && newSlide.floatingImages) {
            const bubbleIndex = editingImageId.imageIndex - 1000;
            if (newSlide.floatingImages[bubbleIndex]) {
              newSlide.floatingImages[bubbleIndex] = {
                ...newSlide.floatingImages[bubbleIndex],
                src: newImageSrc
              };
            }
          } else if (newSlide.quotes && newSlide.quotes[editingImageId.imageIndex]) {
            newSlide.quotes[editingImageId.imageIndex] = {
              ...newSlide.quotes[editingImageId.imageIndex],
              image: newImageSrc
            };
          }
        } else if ('centralImage' in newSlide) {
          newSlide.centralImage = newImageSrc;
        }
      }

      return newSlide as SlideData;
    }));

    setEditingImageId(null);
  };

  const generateExportCode = () => {
    // Helper to format the generated code
    const imports = "import { SlideType, SlideData } from './types';\n\n// Dynamically import all images from the img directory\nconst imageModules = import.meta.glob('./img/*.{png,jpg,jpeg,svg}', { eager: true });\n\n// Extract URLs from modules\nexport const IMAGES: string[] = Object.values(imageModules).map((mod: any) => mod.default);\n\n// Helper to get random image\nconst getRandomImage = () => IMAGES[Math.floor(Math.random() * IMAGES.length)];\n\n// Helper to get image at specific index (looping)\nconst getImage = (index: number) => IMAGES[index % IMAGES.length];\n\n";

    // Formatting the array is tricky because we need to preserve function calls like getImage() if possible,
    // OR just dump the raw data if the user has replaced them with static strings.
    // For safety and simplicity in "Edit Mode" exports, we will flatten everything to actual string values
    // since the user is visually editing the *result*.
    // However, if we want to be fancy, we can try to keep logic, but 'JSON.stringify' will resolve values.
    // Let's use JSON.stringify but clean it up to look like valid TS code (removing quotes from keys, etc if needed, though JSON is valid JS/TS).

    // Actually, passing JSON straight into the variable is fine.
    const dataExport = `export const APP_DATA: SlideData[] = ${JSON.stringify(slides, null, 2)};`;

    // Refine the JSON to use SlideType enum instead of raw strings for readability/correctness
    const refinedExport = dataExport
      .replace(/"type": "COVER"/g, 'type: SlideType.COVER')
      .replace(/"type": "PHOTO_SHOWCASE"/g, 'type: SlideType.PHOTO_SHOWCASE')
      .replace(/"type": "COLLAGE"/g, 'type: SlideType.COLLAGE')
      .replace(/"type": "TIMELINE"/g, 'type: SlideType.TIMELINE')
      .replace(/"type": "QUOTES"/g, 'type: SlideType.QUOTES')
      .replace(/"type": "MULTI_PHOTO"/g, 'type: SlideType.MULTI_PHOTO');

    setExportCode(imports + refinedExport);
    setShowExportModal(true);
  };

  const handleImageSettingsUpdate = (slideId: string, imageIndex: number | undefined, updates: { position?: string, scale?: number, x?: number, y?: number }) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      const newSlide = { ...slide };

      if (newSlide.type === SlideType.PHOTO_SHOWCASE && 'image' in newSlide) {
        if (updates.position) newSlide.position = updates.position;
        if (updates.scale) newSlide.scale = updates.scale;
      }
      else if (newSlide.type === SlideType.TIMELINE && 'events' in newSlide) {
        if (typeof imageIndex === 'number' && newSlide.events[imageIndex]) {
          newSlide.events[imageIndex] = { ...newSlide.events[imageIndex], ...updates };
        }
      }
      else if (newSlide.type === SlideType.COLLAGE && 'images' in newSlide) {
        if (typeof imageIndex === 'number' && newSlide.images[imageIndex]) {
          newSlide.images[imageIndex] = { ...newSlide.images[imageIndex], ...updates };
        }
      }
      else if (newSlide.type === SlideType.MULTI_PHOTO && 'images' in newSlide) {
        if (typeof imageIndex === 'number' && newSlide.images[imageIndex]) {
          newSlide.images[imageIndex] = { ...newSlide.images[imageIndex], ...updates };
        }
      }
      else if (newSlide.type === SlideType.QUOTES) {
        if (typeof imageIndex === 'number' && imageIndex >= 1000 && newSlide.floatingImages) {
          const bubbleIndex = imageIndex - 1000;
          if (newSlide.floatingImages[bubbleIndex]) {
            if (typeof updates.x === 'number') newSlide.floatingImages[bubbleIndex].x = updates.x;
            if (typeof updates.y === 'number') newSlide.floatingImages[bubbleIndex].y = updates.y;
            if (updates.scale) newSlide.floatingImages[bubbleIndex].size = updates.scale; // Reusing scale for size if needed
          }
        } else {
          if (updates.position) newSlide.position = updates.position;
          if (updates.scale) newSlide.scale = updates.scale;
        }
      }
      return newSlide as SlideData;
    }));
  };

  const openPicker = (slideId: string, imageIndex?: number) => {
    setEditingImageId({ slideId, imageIndex });
  };

  const renderSlide = (data: SlideData) => {
    // We pass down isEditMode and onEdit callback to all slides
    const commonProps = {
      data,
      isEditMode,
      onEditImage: (index?: number) => openPicker(data.id, index),
      onUpdateImage: (index: number | undefined, updates: { position?: string, scale?: number, x?: number, y?: number }) => handleImageSettingsUpdate(data.id, index, updates)
    };

    switch (data.type) {
      case SlideType.COVER:
        // @ts-ignore
        return <CoverSlide {...commonProps} />;
      case SlideType.PHOTO_SHOWCASE:
        // @ts-ignore
        return <PhotoShowcaseSlide {...commonProps} />;
      case SlideType.COLLAGE:
        // @ts-ignore
        return <CollageSlide {...commonProps} />;
      case SlideType.TIMELINE:
        // @ts-ignore
        return <TimelineSlide {...commonProps} />;
      case SlideType.QUOTES:
        // @ts-ignore
        return <QuotesSlide {...commonProps} />;
      case SlideType.MULTI_PHOTO:
        // @ts-ignore
        return <MultiPhotoSlide {...commonProps} />;
      default:
        return null;
    }
  };

  const currentData = slides[currentSlideIndex];

  // Audio state
  const [audioSrc, setAudioSrc] = useState<string | null>(() => {
    // Default to 'gratidaoMaior.mp3' if available, otherwise first available track
    return MUSIC_TRACKS['dMaura.mp3'] || Object.values(MUSIC_TRACKS)[0] || null;
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fade out logic when reaching the last slide
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isLastSlide = currentSlideIndex === totalSlides - 1;

    if (isLastSlide) {
      // Fade out
      const fadeAudio = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeAudio);
        }
      }, 200);
      return () => clearInterval(fadeAudio);
    } else {
      // Fade in / Start playing
      if (audio.paused && audioSrc) {
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Fade in
              const fadeAudio = setInterval(() => {
                if (audio.volume < 0.95) {
                  audio.volume += 0.05;
                } else {
                  audio.volume = 1;
                  clearInterval(fadeAudio);
                }
              }, 200);
            })
            .catch(error => {
              console.log("Audio play prevented:", error);
            });
        }
      } else if (audio.volume < 1) {
        // Just restore volume if it was fading out but didn't stop
        audio.volume = 1;
      }
    }
  }, [currentSlideIndex, totalSlides, audioSrc]);

  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background text-primary font-sans selection:bg-primary selection:text-white">
      {/* Audio Element */}
      <audio ref={audioRef} src={audioSrc || undefined} loop />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-accent-gold"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
        <ScreenRecorder audioRef={audioRef} />

        {/* Link to Auto-Play Version */}
        <a
          href="/video.html"
          target="_blank"
          className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-white text-primary-dark dark:text-white shadow-sm transition-all hover:scale-105"
          title="Versão Automática (Para Instagram)"
        >
          <span className="material-symbols-outlined text-xl">smart_display</span>
        </a>

        {/* Music Control */}
        <div className="relative group">
          <label htmlFor="music-upload" className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-black/60 transition-all shadow-sm text-primary-dark dark:text-white group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </label>
          <input
            id="music-upload"
            type="file"
            accept="audio/mp3,audio/*"
            className="hidden"
            onChange={handleMusicUpload}
          />
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            {audioSrc ? 'Alterar Música' : 'Adicionar Música'}
          </div>
        </div>

        {/* Edit Mode Toggle */}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${isEditMode ? 'bg-primary text-white scale-110' : 'bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white text-primary-dark dark:text-white'}`}
          title={isEditMode ? "Sair da Edição" : "Entrar na Edição"}
        >
          {isEditMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          )}
        </button>

        {/* Export Button (only in edit mode) */}
        {isEditMode && (
          <button
            onClick={generateExportCode}
            className="w-10 h-10 rounded-full bg-accent-gold text-white flex items-center justify-center shadow-sm hover:scale-105 transition-all"
            title="Salvar Alterações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          </button>
        )}
      </div>

      <SlideTransition id={currentData.id} type={currentData.type}>
        {renderSlide(currentData)}
      </SlideTransition>



      <PhotoPicker
        isOpen={!!editingImageId}
        onClose={() => setEditingImageId(null)}
        onSelect={handleImageUpdate}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        code={exportCode}
      />
    </div >
  );
};

export default App;
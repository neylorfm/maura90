import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_DATA, MUSIC_TRACKS } from '@/constants';
import { SlideTransition } from '@/components/SlideTransition';
import { SlideType, SlideData } from '@/types';
import { PhotoShowcaseSlide } from '@/components/PhotoShowcaseSlide';
import { CollageSlide } from '@/components/CollageSlide';
import { TimelineSlide } from '@/components/TimelineSlide';
import { MultiPhotoSlide } from '@/components/MultiPhotoSlide';
import { QuotesSlide } from '@/components/QuotesSlide';



export default function AutoPlayApp() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [duration, setDuration] = useState(0);

    // Explicitly select dMaura.mp3
    const audioSrc = MUSIC_TRACKS['dMaura.mp3'] || Object.values(MUSIC_TRACKS)[0];
    const audioRef = useRef<HTMLAudioElement>(null);
    const timerRef = useRef<number | null>(null);

    const slides = APP_DATA;
    const totalSlides = slides.length;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsReady(true);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        return () => audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    }, []);

    const startPresentation = () => {
        const audio = audioRef.current;
        if (!audio || !isReady) return;

        audio.play()
            .then(() => {
                setIsPlaying(true);

                // Calculate time per slide
                // Give a bit of buffer at the end (e.g. 2 seconds)
                const safeDuration = duration - 2;
                const timePerSlideMs = (safeDuration / totalSlides) * 1000;

                console.log(`Starting Auto-Play. Duration: ${duration}s, Slides: ${totalSlides}, Time/Slide: ${timePerSlideMs}ms`);

                timerRef.current = window.setInterval(() => {
                    setCurrentIndex(prev => {
                        if (prev >= totalSlides - 1) {
                            // Finished
                            if (timerRef.current) clearInterval(timerRef.current);
                            return prev;
                        }
                        return prev + 1;
                    });
                }, timePerSlideMs);
            })
            .catch(e => console.error("Play error:", e));
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const renderSlide = (slide: SlideData) => {
        switch (slide.type) {
            case SlideType.COVER:
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-background-light dark:bg-background-dark">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-display text-4xl md:text-8xl font-black text-primary mb-4"
                        >
                            {slide.name}
                        </motion.h1>
                        <p className="font-serif text-2xl italic text-gray-600 dark:text-gray-300">{slide.tagline}</p>
                    </div>
                );
            case SlideType.PHOTO_SHOWCASE:
                return <PhotoShowcaseSlide {...slide} isActive={true} />;
            case SlideType.COLLAGE:
                return <CollageSlide {...slide} isActive={true} />;
            case SlideType.TIMELINE:
                return <TimelineSlide {...slide} isActive={true} />;
            case SlideType.MULTI_PHOTO:
                return <MultiPhotoSlide {...slide} isActive={true} />;
            case SlideType.QUOTES:
                return <QuotesSlide {...slide} isActive={true} />;
            default:
                return <div>Unknown Slide Type</div>;
        }
    };

    const currentSlide = slides[currentIndex];

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden bg-background text-primary font-sans">
            <audio ref={audioRef} src={audioSrc} preload="auto" />

            {!isPlaying && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 text-white backdrop-blur-md">
                    <h1 className="text-3xl font-bold mb-8">Maura 90 Anos</h1>
                    <button
                        onClick={startPresentation}
                        disabled={!isReady}
                        className="px-8 py-4 bg-primary text-white text-xl font-bold rounded-full hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 group"
                    >
                        {!isReady ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Carregando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">play_circle</span>
                                Iniciar Vídeo Automático
                            </>
                        )}
                    </button>
                    <p className="mt-4 text-white/50 text-sm">A apresentação será sincronizada com a música.</p>
                </div>
            )}

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-900 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <AnimatePresence mode='wait'>
                <SlideTransition key={currentSlide.id} id={currentSlide.id} type={currentSlide.type}>
                    {renderSlide(currentSlide)}
                </SlideTransition>
            </AnimatePresence>
        </div>
    );
}

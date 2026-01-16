import React, { useMemo } from 'react';
import { MultiPhotoData } from '../types';
import { motion } from 'framer-motion';
import { EditOverlay } from './EditOverlay';

interface MultiPhotoSlideProps {
    data: MultiPhotoData;
    isEditMode?: boolean;
    onEditImage?: (index: number) => void;
    onUpdateImage?: (index: number | undefined, updates: { position?: string, scale?: number }) => void;
}

export const MultiPhotoSlide: React.FC<MultiPhotoSlideProps> = ({
    data,
    isEditMode = false,
    onEditImage = () => { },
    onUpdateImage
}) => {

    // Memoize the random positions so they don't change on re-renders (like when editing)
    // We generate random top/left within 10%-80% range to keep them somewhat central but messy
    const scatteredImages = useMemo(() => {
        return data.images.map((img, idx) => {
            // Deterministic randomness based on index if we wanted matches across refreshes, 
            // but simple Math.random() is fine for "messy" feel on each load.
            // We'll use a seeded-like approach based on index to ensure it feels "designed" yet chaotic.

            const seed = (idx * 137.5) % 100; // Fake random distinctness
            const top = 15 + (seed % 60); // 15% to 75%
            const left = 10 + ((idx * 23) % 70); // 10% to 80%
            const rotate = -15 + ((idx * 47) % 30); // -15 to +15 deg

            return {
                ...img,
                style: { top: `${top}%`, left: `${left}%`, rotate },
                zIndex: idx + 10
            };
        });
    }, [data.images.length]); // Only re-calc if image count changes (not valid for 'data' prop deep changes, but fine here)

    return (
        <div className="relative w-full h-full min-h-screen bg-[#fdfbf7] dark:bg-background-dark overflow-hidden flex flex-col">
            {/* Header - Fixed at top, z-index very high */}
            <header className="relative z-[100] text-center pt-8 md:pt-12 mb-4 pointer-events-none mix-blend-multiply dark:mix-blend-normal">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-primary-dark dark:text-white text-4xl md:text-6xl font-bold uppercase tracking-tight mb-2 font-serif text-shadow-sm"
                >
                    {data.title}
                </motion.h1>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="h-1 w-24 bg-primary mx-auto mb-2 rounded-full"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-accent-gold dark:text-primary/70 text-xl md:text-2xl font-light italic font-serif"
                >
                    {data.subtitle}
                </motion.p>
            </header>

            {/* Scattered Photos Area */}
            <div className="relative flex-1 w-full h-full">
                {scatteredImages.map((img, idx) => {
                    return (
                        <motion.div
                            key={`pile-${idx}`}
                            initial={{ opacity: 0, scale: 0, y: 500 }} // Fly in from bottom
                            animate={{ opacity: 1, scale: 1, y: 0, rotate: img.style.rotate }}
                            transition={{
                                delay: 0.2 + (idx * 0.05), // Stagger fast for pile effect
                                type: 'spring',
                                stiffness: 120,
                                damping: 20
                            }}
                            style={{
                                top: img.style.top,
                                left: img.style.left,
                                zIndex: img.zIndex,
                            }}
                            className="absolute w-[25vw] max-w-[200px] md:max-w-[240px] aspect-[4/5] bg-white p-2 md:p-3 shadow-lg border border-gray-200 transform hover:z-[90] hover:scale-110 transition-all duration-300 ease-out cursor-pointer"
                        >
                            {/* Photo Container */}
                            <div className="w-full h-[90%] relative overflow-hidden bg-gray-100">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${img.src})`,
                                        backgroundPosition: img.position || 'center',
                                        backgroundSize: img.scale ? `${img.scale}%` : 'cover'
                                    }}
                                />
                                <EditOverlay
                                    isEditing={isEditMode}
                                    onEdit={() => onEditImage(idx)}
                                    currentPosition={img.position}
                                    currentScale={img.scale}
                                    onPositionChange={(pos) => onUpdateImage?.(idx, { position: pos })}
                                    onScaleChange={(scale) => onUpdateImage?.(idx, { scale })}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EditOverlayProps {
    isEditing: boolean;
    onEdit: () => void;
    currentPosition?: string;
    currentScale?: number;
    onPositionChange?: (newPos: string) => void;
    onScaleChange?: (newScale: number) => void;
    className?: string;
}

export const EditOverlay: React.FC<EditOverlayProps> = ({
    isEditing,
    onEdit,
    currentPosition = '50% 50%',
    currentScale = 100,
    onPositionChange,
    onScaleChange,
    className = ""
}) => {
    if (!isEditing) return null;

    const parsePosition = (pos: string) => {
        const parts = pos.split(' ');
        let x = 50;
        let y = 50;

        if (parts.length >= 1) {
            if (parts[0] === 'left') x = 0;
            else if (parts[0] === 'right') x = 100;
            else if (parts[0] === 'center') x = 50;
            else x = parseFloat(parts[0]);
        }

        if (parts.length >= 2) {
            if (parts[1] === 'top') y = 0;
            else if (parts[1] === 'bottom') y = 100;
            else if (parts[1] === 'center') y = 50;
            else y = parseFloat(parts[1]);
        } else if (parts.length === 1) {
            // If only one value is provided, it usually applies to horizontal, vertical defaults to center (50%)
            // standard CSS background-position logic
            y = 50;
        }

        return { x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y };
    };

    const handlePan = (dx: number, dy: number) => {
        if (!onPositionChange) return;
        const current = parsePosition(currentPosition);
        let newX = Math.max(0, Math.min(100, current.x + dx));
        let newY = Math.max(0, Math.min(100, current.y + dy));
        onPositionChange(`${newX}% ${newY}%`);
    };

    const handleZoom = (delta: number) => {
        if (!onScaleChange) return;
        // Min scale 100%, Max 300%
        const newScale = Math.max(100, Math.min(300, currentScale + delta));
        onScaleChange(newScale);
    };

    // Prevent click propagation for controls
    const stopProp = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 z-10 bg-black/10 hover:bg-black/30 transition-colors cursor-default flex items-center justify-center group border-4 border-dashed border-transparent hover:border-primary/50 overflow-hidden ${className}`}
        >
            {/* Center Edit Icon */}
            <div
                className="bg-white/90 dark:bg-black/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 z-20 cursor-pointer hover:bg-white dark:hover:bg-black"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
            >
                <span className="material-symbols-outlined text-primary text-2xl">edit</span>
            </div>

            {/* Position Controls (Arrows) */}
            <div className="absolute inset-x-0 top-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <button onClick={(e) => { stopProp(e); handlePan(0, -5); }} className="pointer-events-auto p-2 bg-white/80 dark:bg-black/80 rounded-full hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined">expand_less</span>
                </button>
            </div>
            <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <button onClick={(e) => { stopProp(e); handlePan(0, 5); }} className="pointer-events-auto p-2 bg-white/80 dark:bg-black/80 rounded-full hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined">expand_more</span>
                </button>
            </div>
            <div className="absolute inset-y-0 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <button onClick={(e) => { stopProp(e); handlePan(-5, 0); }} className="pointer-events-auto p-2 bg-white/80 dark:bg-black/80 rounded-full hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <button onClick={(e) => { stopProp(e); handlePan(5, 0); }} className="pointer-events-auto p-2 bg-white/80 dark:bg-black/80 rounded-full hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Scale Controls (+/-) */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <button onClick={(e) => { stopProp(e); handleZoom(-10); }} className="pointer-events-auto p-1.5 bg-white/80 dark:bg-black/80 rounded-md hover:bg-primary hover:text-white transition-colors" title="Zoom Out">
                    <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <div className="pointer-events-auto px-2 bg-black/50 text-white rounded-md flex items-center text-xs font-mono">
                    {Math.round(currentScale)}%
                </div>
                <button onClick={(e) => { stopProp(e); handleZoom(10); }} className="pointer-events-auto p-1.5 bg-white/80 dark:bg-black/80 rounded-md hover:bg-primary hover:text-white transition-colors" title="Zoom In">
                    <span className="material-symbols-outlined text-lg">add</span>
                </button>
            </div>
        </motion.div>
    );
};

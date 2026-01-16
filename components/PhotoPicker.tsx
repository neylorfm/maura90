import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../constants';

interface PhotoPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (imageSrc: string) => void;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                        <h2 className="text-2xl font-serif text-zinc-900 dark:text-zinc-100">Escolha uma Foto</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {IMAGES.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSelect(img)}
                                    className="group relative aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-all"
                                >
                                    <img
                                        src={img}
                                        alt={`Option ${index}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

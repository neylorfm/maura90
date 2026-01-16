import React from 'react';

interface NavigationProps {
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalSlides: number;
  variant?: 'default' | 'mini';
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  onNext,
  onPrev,
  currentIndex,
  totalSlides,
  variant = 'default',
  className = ''
}) => {
  if (variant === 'mini') {
    return (
      <div className={`flex items-center gap-2 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-primary/20 ${className}`}>
        <button
          onClick={onPrev}
          className="size-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-primary/20 text-primary-dark dark:text-white hover:bg-primary/10 transition-colors shadow-sm"
          aria-label="Previous Slide"
        >
          <span className="material-symbols-outlined !text-lg">arrow_back</span>
        </button>

        <div className="text-center min-w-[50px]">
          <span className="text-primary text-sm font-bold font-display">{currentIndex + 1} / {totalSlides}</span>
        </div>

        <button
          onClick={onNext}
          className="size-8 flex items-center justify-center rounded-full bg-primary text-primary-dark hover:scale-105 transition-transform shadow-lg"
          aria-label="Next Slide"
        >
          <span className="material-symbols-outlined !text-lg text-white">arrow_forward</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-8 left-0 right-0 z-50 flex items-center justify-center gap-6 pointer-events-none ${className}`}>
      <div className="flex items-center gap-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-8 py-3 rounded-full shadow-2xl border border-primary/20 pointer-events-auto">
        <button
          onClick={onPrev}
          className="size-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-primary/20 text-primary-dark dark:text-white hover:bg-primary/10 transition-colors shadow-sm"
          aria-label="Previous Slide"
        >
          <span className="material-symbols-outlined !text-2xl">arrow_back</span>
        </button>

        <div className="text-center min-w-[80px]">
          <span className="text-primary text-xl font-bold font-display">{currentIndex + 1} / {totalSlides}</span>
        </div>

        <button
          onClick={onNext}
          className="size-12 flex items-center justify-center rounded-full bg-primary text-primary-dark hover:scale-105 transition-transform shadow-lg"
          aria-label="Next Slide"
        >
          <span className="material-symbols-outlined !text-3xl text-white">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { SlideType } from '../types';

interface SlideTransitionProps {
  children: React.ReactNode;
  id: string;
  type?: SlideType;
}

const variants: Record<string, Variants> = {
  default: {
    initial: { opacity: 0, scale: 1.05, filter: "blur(5px)", zIndex: 1 },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)", zIndex: 2 },
    exit: { opacity: 0, scale: 1, filter: "blur(0px)", zIndex: 1 },
  },
  timeline: {
    initial: { opacity: 0, x: 50, zIndex: 1 },
    animate: { opacity: 1, x: 0, zIndex: 2 },
    exit: { opacity: 0, x: -50, zIndex: 1 },
  },
  cover: {
    initial: { opacity: 0, scale: 1.1, zIndex: 1 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" }, zIndex: 2 },
    exit: { opacity: 0, zIndex: 1 },
  },
  collage: {
    initial: { opacity: 0, scale: 1.05, zIndex: 1 },
    animate: { opacity: 1, scale: 1, zIndex: 2 },
    exit: { opacity: 0, scale: 1, zIndex: 1 },
  }
};

export const SlideTransition: React.FC<SlideTransitionProps> = ({ children, id, type }) => {
  const getVariant = () => {
    switch (type) {
      case SlideType.TIMELINE:
        return variants.timeline;
      case SlideType.COVER:
        return variants.cover;
      case SlideType.COLLAGE:
        return variants.collage;
      default:
        return variants.default;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        variants={getVariant()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
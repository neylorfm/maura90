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
    initial: { opacity: 0, scale: 1.1, filter: "blur(10px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
  },
  timeline: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  cover: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -50 },
  },
  collage: {
    initial: { opacity: 0, rotate: -2, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 2, scale: 1.1 },
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
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        variants={getVariant()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Custom cubic bezier for "elegant" feel
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
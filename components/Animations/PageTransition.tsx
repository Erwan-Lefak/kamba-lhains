import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/router';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Variantes d'animation pour les transitions de page
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.55, 0.055, 0.675, 0.19],
    },
  },
};

// Variantes pour les éléments enfants
const childVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Hook pour les animations staggered
export const StaggerContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        enter: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

// Composant pour les éléments animés
export const AnimatedElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={childVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// Transition de type slide
const slideVariants: Variants = {
  initial: (direction: string) => ({
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    opacity: 0,
  }),
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: (direction: string) => ({
    x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.55, 0.055, 0.675, 0.19],
    },
  }),
};

export const SlideTransition: React.FC<{
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}> = ({ children, direction = 'right', className }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={router.pathname}
        custom={direction}
        variants={slideVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Transition en fondu avec scale
const fadeScaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 1.1,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const FadeScaleTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.pathname}
        variants={fadeScaleVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Transition 3D flip
const flipVariants: Variants = {
  initial: {
    rotateY: -90,
    opacity: 0,
  },
  enter: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    rotateY: 90,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

export const FlipTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.pathname}
        variants={flipVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={className}
        style={{ perspective: 1000 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
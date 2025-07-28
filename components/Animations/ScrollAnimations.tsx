import React, { useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

// Hook pour les animations au scroll
export const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
  });

  return { ref, isInView };
};

// Composant de révélation au scroll
interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10%' });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={
        isInView
          ? { x: 0, y: 0, opacity: 1 }
          : getInitialPosition()
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// Sticky scroll progress
export const ScrollProgress: React.FC<{ className?: string }> = ({ className }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 origin-left z-50 ${className || ''}`}
      style={{ scaleX }}
    />
  );
};

// Image avec effet de zoom au scroll
interface ScrollZoomImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ScrollZoomImage: React.FC<ScrollZoomImageProps> = ({
  src,
  alt,
  className,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

  return (
    <div ref={ref} className={`overflow-hidden ${className || ''}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ scale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// Texte qui apparaît mot par mot
interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  delay = 0,
  speed = 0.1,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <motion.div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: delay + index * speed,
            ease: 'easeOut',
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Compteur animé
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({
  from,
  to,
  duration = 2,
  className,
  suffix = '',
  prefix = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const count = useTransform(
    useSpring(isInView ? to : from, {
      duration: duration * 1000,
      bounce: 0,
    }),
    (value) => Math.round(value)
  );

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{count}</motion.span>
      {suffix}
    </motion.span>
  );
};

// Scroll trigger avec callbacks
interface ScrollTriggerProps {
  children: React.ReactNode;
  onEnter?: () => void;
  onLeave?: () => void;
  threshold?: number;
  once?: boolean;
}

export const ScrollTrigger: React.FC<ScrollTriggerProps> = ({
  children,
  onEnter,
  onLeave,
  threshold = 0.1,
  once = false,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  useEffect(() => {
    if (isInView && onEnter) {
      onEnter();
    } else if (!isInView && onLeave && !once) {
      onLeave();
    }
  }, [isInView, onEnter, onLeave, once]);

  return <div ref={ref}>{children}</div>;
};

// Rotation au scroll
interface ScrollRotateProps {
  children: React.ReactNode;
  rotations?: number;
  className?: string;
}

export const ScrollRotate: React.FC<ScrollRotateProps> = ({
  children,
  rotations = 1,
  className,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360 * rotations]);

  return (
    <motion.div ref={ref} style={{ rotate }} className={className}>
      {children}
    </motion.div>
  );
};

// Morphing shapes au scroll
export const ScrollMorph: React.FC<{
  className?: string;
  paths: string[];
}> = ({ className, paths }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const pathIndex = useTransform(scrollYProgress, [0, 1], [0, paths.length - 1]);
  
  return (
    <div ref={ref} className={className}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.path
          d={useTransform(pathIndex, (latest) => {
            const index = Math.floor(latest);
            const progress = latest - index;
            const currentPath = paths[index] || paths[0];
            const nextPath = paths[index + 1] || paths[paths.length - 1];
            
            // Simple interpolation between paths (simplified)
            return progress < 0.5 ? currentPath : nextPath;
          })}
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

// Staggered reveal pour listes
interface StaggeredListProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 0.1,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ScrollReveal;
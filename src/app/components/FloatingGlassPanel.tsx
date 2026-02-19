import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface FloatingGlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Layered depth: higher = more lift and shadow */
  depth?: 'sm' | 'md' | 'lg';
}

const depthStyles = {
  sm: 'shadow-soft hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)]',
  md: 'shadow-float hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]',
  lg: 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.55)]',
};

export function FloatingGlassPanel({ children, className = '', depth = 'md' }: FloatingGlassPanelProps) {
  return (
    <motion.div
      className={`glass-strong rounded-3xl border border-white/10 transition-shadow duration-300 ${depthStyles[depth]} ${className}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  );
}

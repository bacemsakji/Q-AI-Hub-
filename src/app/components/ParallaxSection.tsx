import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  /** Parallax speed (e.g. 0.3 = moves slower than scroll) */
  speed?: number;
}

export function ParallaxSection({ children, className = '', speed = 0.4 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 120]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

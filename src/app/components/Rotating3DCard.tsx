import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Rotating3DCardProps {
  children: ReactNode;
  className?: string;
  /** When true, no cursor-follow 3D tilt – just a simple hover bump */
  simple?: boolean;
}

export function Rotating3DCard({ children, className = '', simple = false }: Rotating3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 300, damping: 25 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), spring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (simple || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relX = (e.clientX - centerX) / rect.width;
    const relY = (e.clientY - centerY) / rect.height;
    x.set(relX);
    y.set(relY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovering(false);
  };

  const cardContent = (
    <div className="relative w-full h-full">{children}</div>
  );

  if (simple) {
    return (
      <motion.div
        ref={cardRef}
        className={`w-full ${className}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        initial={false}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-full h-full min-h-[280px] rounded-3xl overflow-hidden border border-border glass-strong shadow-float">
          {cardContent}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-[1200px] w-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative w-full h-full min-h-[320px] rounded-3xl overflow-hidden border border-border glass-strong shadow-float"
        style={{ transform: 'translateZ(24px)' }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: isHovering ? 1.02 : 1 }}
      >
        {cardContent}
      </motion.div>
    </motion.div>
  );
}

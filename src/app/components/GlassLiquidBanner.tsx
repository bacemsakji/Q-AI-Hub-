import { motion } from 'motion/react';

interface GlassLiquidBannerProps {
  className?: string;
}

export function GlassLiquidBanner({ className = '' }: GlassLiquidBannerProps) {
  return (
    <div className={`w-full overflow-hidden px-4 md:px-6 ${className}`}>
      <motion.div
        className="relative w-full py-4 md:py-5 rounded-[2rem] overflow-hidden border border-white/15 bg-white/5"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated shimmer – liquid sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.8 }}
          style={{
            width: '60%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), rgba(255,255,255,0.14), rgba(255,255,255,0.08), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
}

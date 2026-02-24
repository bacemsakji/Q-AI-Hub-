import { motion } from 'motion/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 48, text: 'text-xl' },
    lg: { icon: 80, text: 'text-3xl' },
  };

  const iconSize = sizes[size].icon;

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative"
        style={{
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3)) drop-shadow(0 0 1px rgba(255,255,255,0.15))',
          width: iconSize,
          height: iconSize,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Q head - circular with concentric rings */}
          <circle cx="50" cy="30" r="18" fill="url(#quantumGradient)" />
          <circle cx="50" cy="30" r="14" fill="none" stroke="url(#quantumGradient)" strokeWidth="1" opacity="0.6" />
          <circle cx="50" cy="30" r="10" fill="none" stroke="url(#quantumGradient)" strokeWidth="1" opacity="0.4" />
          <circle cx="50" cy="30" r="6" fill="none" stroke="url(#quantumGradient)" strokeWidth="1" opacity="0.3" />
          
          {/* A body - wide-spread legs */}
          <path
            d="M 50 48 L 35 85 L 42 85 L 50 65 L 58 85 L 65 85 Z"
            fill="url(#quantumGradient)"
          />
          {/* A crossbar */}
          <rect x="42" y="70" width="16" height="3" fill="#0A0E1A" />
          
          <defs>
            <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {showText && (
        <span
          className={`${sizes[size].text} font-bold text-foreground`}
          style={{ fontFamily: 'var(--font-heading)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
        >
          Q-AI Hub
        </span>
      )}
    </div>
  );
}

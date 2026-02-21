import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'liquid-glass text-white hover:scale-[1.02] border-white/12 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
    ghost: 'bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 relative overflow-hidden backdrop-blur-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]',
    danger: 'bg-[#FF4757]/90 backdrop-blur-sm text-white border border-red-400/20 hover:bg-[#ff3344] shadow-[0_8px_24px_rgba(255,71,87,0.25)] hover:shadow-[0_12px_32px_rgba(255,71,87,0.3)]',
  };

  const ghostTextStyle = variant === 'ghost' ? 'text-white' : '';

  return (
    <motion.button
      whileHover={{ scale: variant === 'ghost' ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className={`${ghostTextStyle} whitespace-nowrap inline-flex items-center gap-2`}>{children}</span>
    </motion.button>
  );
}

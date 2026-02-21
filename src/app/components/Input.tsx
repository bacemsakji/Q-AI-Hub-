import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, type, className = '', placeholder, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const isFloating = isFocused || hasValue || !!props.value;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type={inputType}
          placeholder={isFloating ? placeholder : ''}
          className={`w-full px-4 pt-7 pb-2.5 bg-[#1A2035] rounded-xl border transition-all duration-300 outline-none text-sm text-white
            ${error
              ? 'border-[#FF4757] animate-shake'
              : isFocused
                ? 'border-white/20 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]'
                : 'border-white/8'
            }
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props.onChange?.(e);
          }}
          {...props}
        />
        {isFocused && !error && (
          <div className="absolute inset-0 bg-[#1A2035] rounded-xl -z-10 m-[1px]" />
        )}

        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none leading-none
            ${isFloating
              ? 'top-2.5 text-[11px] text-[#8892A4]'
              : 'top-1/2 -translate-y-1/2 text-sm text-[#8892A4]'
            }
          `}
        >
          {label}
        </label>

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8892A4] hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-[#FF4757]">{error}</p>
      )}
    </div>
  );
}


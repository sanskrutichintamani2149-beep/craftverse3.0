import React from 'react';
import { useTheme } from '../context/ThemeContext';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

const SIZE_CLASSES: Record<
  NonNullable<BrandLogoProps['size']>,
  { box: string; img: string; title: string }
> = {
  sm: {
    box: 'p-1.5 rounded-xl',
    img: 'h-10 w-10 sm:h-11 sm:w-11 object-contain',
    title: 'text-xl',
  },
  md: {
    box: 'p-2 rounded-xl',
    img: 'h-13 w-13 sm:h-14 sm:w-14 object-contain',
    title: 'text-2xl',
  },
  lg: {
    box: 'p-3 rounded-2xl',
    img: 'h-18 w-18 sm:h-20 sm:w-20 object-contain',
    title: 'text-3xl',
  },
  xl: {
    box: 'p-3 sm:p-4 rounded-2xl shrink-0 flex items-center justify-center',
    img: 'h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 w-auto max-w-full object-contain',
    title: 'text-xl sm:text-2xl md:text-3xl',
  },
};

/**
 * Official DhanaDrishti Logo Component
 * - CHANGE 1: Keeps "DhanaDrishti" text securely inside its box at every screen size (mobile & desktop)
 * - In Dark Mode, area behind logo has a rich navy-blue treatment (#0A1A3A to #12306B)
 * - Uses `/logo.png` directly without alteration, with object-fit: contain, centered and comfortable padding.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'sm',
  showText = true,
  subtitle,
  className = '',
}) => {
  const { theme } = useTheme();
  const dimensions = SIZE_CLASSES[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none max-w-full min-w-0 ${className}`}>
      <div
        className={`inline-flex items-center justify-center shrink-0 transition-all ${dimensions.box} ${
          theme === 'light'
            ? 'bg-[#0B1120] border border-slate-800/90 shadow-md ring-1 ring-blue-500/20'
            : 'bg-gradient-to-br from-[#0A1A3A] to-[#12306B] border border-blue-500/30 shadow-md ring-1 ring-cyan-400/20'
        }`}
      >
        <img
          src="/logo.png"
          alt="DhanaDrishti Official Logo"
          referrerPolicy="no-referrer"
          className={`${dimensions.img} block`}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight min-w-0 max-w-full shrink">
          <div
            className={`font-display font-extrabold tracking-tight ${dimensions.title} min-w-0 max-w-full truncate whitespace-nowrap ${
              theme === 'light'
                ? 'bg-[#0B1120] px-2.5 py-0.5 rounded-lg border border-slate-800 shadow-sm'
                : 'text-white'
            }`}
          >
            <span className="text-white">Dhana</span>
            <span className="text-amber-400">Drishti</span>
          </div>
          {subtitle && (
            <span className="text-xs text-[var(--text-muted)] mt-0.5 font-normal truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

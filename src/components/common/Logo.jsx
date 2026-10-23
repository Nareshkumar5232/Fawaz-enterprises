import React from 'react';
import { Link } from 'react-router-dom';
import logoDark from '../../assets/logo.png';
import logoLight from '../../assets/logo-light.png';
import logoMark from '../../assets/logo-mark.png';

export default function Logo({
  light = false,
  className = '',
  showSubtitle = true,
  variant = 'brand', // 'brand' (emblem + vector typography), 'image' (full raster logo), 'mark' (emblem only)
  size = 'md',
  imgClassName = ''
}) {
  const markSizeClasses = {
    sm: 'h-7 sm:h-8 w-auto',
    md: 'h-9 sm:h-10 w-auto',
    lg: 'h-11 sm:h-12 w-auto',
    xl: 'h-14 sm:h-16 w-auto',
  }[size] || 'h-9 sm:h-10 w-auto';

  const fullImageSizeClasses = {
    sm: 'h-7 sm:h-8 w-auto',
    md: 'h-9 sm:h-10 w-auto',
    lg: 'h-11 sm:h-12 w-auto',
    xl: 'h-14 sm:h-16 w-auto',
  }[size] || 'h-9 sm:h-10 w-auto';

  if (variant === 'image') {
    return (
      <Link
        to="/"
        aria-label="Fawaz Enterprises Home"
        className={`inline-flex items-center group select-none transition-all duration-200 ${className}`}
      >
        <img
          src={light ? logoLight : logoDark}
          alt="Fawaz Enterprises"
          className={`${fullImageSizeClasses} object-contain transition-transform duration-300 group-hover:scale-[1.02] ${imgClassName}`}
          loading="eager"
        />
      </Link>
    );
  }

  if (variant === 'mark') {
    return (
      <Link
        to="/"
        aria-label="Fawaz Enterprises Home"
        className={`inline-flex items-center group select-none transition-all duration-200 ${className}`}
      >
        <img
          src={logoMark}
          alt="Fawaz Enterprises"
          className={`${markSizeClasses} object-contain drop-shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:brightness-105 ${imgClassName}`}
          loading="eager"
        />
      </Link>
    );
  }

  // Default 'brand' layout: 3D Emblem Mark + Crisp Responsive Typography
  return (
    <Link
      to="/"
      aria-label="Fawaz Enterprises Home"
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none transition-all duration-200 ${className}`}
    >
      {/* 3D Gold & Navy Emblem */}
      <img
        src={logoMark}
        alt="Fawaz Enterprises"
        className={`${markSizeClasses} object-contain drop-shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 ${imgClassName}`}
        loading="eager"
      />

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <span
          className={`text-[16px] sm:text-[18px] font-black tracking-wider uppercase transition-colors ${
            light ? 'text-white' : 'text-neutral-900'
          }`}
        >
          FAWAZ
        </span>
        {showSubtitle && (
          <span
            className={`text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.26em] uppercase mt-0.5 transition-colors ${
              light ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            ENTERPRISES
          </span>
        )}
      </div>
    </Link>
  );
}



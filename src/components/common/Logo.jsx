import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ light = false, className = '', showSubtitle = true }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* High-tech Audio / Waveform Glyph matching reference */}
      <div className="flex items-center gap-[3px] h-7 px-1">
        <span
          className={`w-[3.5px] h-3.5 rounded-full transition-all duration-300 group-hover:h-5 ${
            light ? 'bg-white' : 'bg-neutral-900'
          }`}
        />
        <span
          className={`w-[3.5px] h-6 rounded-full transition-all duration-300 group-hover:h-4 ${
            light ? 'bg-white' : 'bg-neutral-900'
          }`}
        />
        <span
          className={`w-[3.5px] h-7 rounded-full transition-all duration-300 group-hover:h-7 ${
            light ? 'bg-sky-400' : 'bg-neutral-900'
          }`}
        />
        <span
          className={`w-[3.5px] h-4.5 rounded-full transition-all duration-300 group-hover:h-6 ${
            light ? 'bg-white' : 'bg-neutral-900'
          }`}
        />
        <span
          className={`w-[3.5px] h-3 rounded-full transition-all duration-300 group-hover:h-4 ${
            light ? 'bg-white' : 'bg-neutral-900'
          }`}
        />
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`text-base sm:text-lg font-black tracking-wider uppercase transition-colors ${
            light ? 'text-white' : 'text-neutral-900'
          }`}
        >
          FAWAZ
        </span>
        {showSubtitle && (
          <span
            className={`text-[9px] font-bold tracking-[0.25em] uppercase ${
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

import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 36, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="ShuruKaro Logo"
    >
      <defs>
        <linearGradient id="skEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="skGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="512" height="512" rx="120" fill="url(#skEmerald)" />
      <path d="M188 292 L130 344 C122 351 126 364 137 364 L192 364 Z" fill="url(#skGold)" />
      <path d="M324 292 L382 344 C390 351 386 364 375 364 L320 364 Z" fill="url(#skGold)" />
      <path
        d="M256 72 L364 196 C370 203 365 214 356 214 L322 214 L322 356 C322 365 315 372 306 372 L206 372 C197 372 190 365 190 356 L190 214 L156 214 C147 214 142 203 148 196 Z"
        fill="#FFFFFF"
      />
      <path d="M256 72 L292 114 L220 114 Z" fill="url(#skGold)" />
      <circle cx="256" cy="272" r="56" fill="#047857" stroke="#FBBF24" strokeWidth="8" />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M234 244 H278" stroke="#FDE68A" strokeWidth="11" />
        <path d="M234 263 H278" stroke="#FDE68A" strokeWidth="11" />
        <path d="M242 244 C264 244 268 278 242 280 L274 306" stroke="#FFFFFF" strokeWidth="11" />
      </g>
      <path d="M220 388 L256 446 L292 388 Z" fill="url(#skGold)" />
    </svg>
  );
};

// src/components/Icons.tsx
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string; // Fallback color if gradient isn't used
  useGradient?: boolean; // Toggle between gradient or solid color
}

// ===== BRAND SPARKLE ICON =====
export const SparkleIcon = ({ 
  size = 24, 
  className = "", 
  color = "#00a36c",
  useGradient = true 
}: IconProps) => {
  // Generate a unique ID so multiple instances don't conflict
  const gradientId = `sparkleGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg 
      width={size}
      height={size}
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" 
        fill={useGradient ? `url(#${gradientId})` : color} 
      />
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#00a36c" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};

// ===== OTHER COMMON ICONS (Using React Icons or SVG) =====

// Example: Search Icon
export const SearchIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Example: Dashboard Icon
export const DashboardIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

// Example: Target/Demo Icon
export const TargetIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// Example: Logout Icon
export const LogoutIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

// Example: Login Icon
export const LoginIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);
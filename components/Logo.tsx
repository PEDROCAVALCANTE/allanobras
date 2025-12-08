import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M50 15 L15 50 V85 H40 V65 H60 V85 H85 V50 L50 15 Z"
      fill="#FBBF24" 
      stroke="#FBBF24" 
      strokeWidth="8" 
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);
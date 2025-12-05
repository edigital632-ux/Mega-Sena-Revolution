import React from 'react';

interface BallProps {
  number: number;
  delay?: number;
}

export const Ball: React.FC<BallProps> = ({ number, delay = 0 }) => {
  return (
    <div 
      className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg border-2 border-emerald-300 text-white font-bold text-lg sm:text-xl animate-bounce-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <span className="drop-shadow-md">{number.toString().padStart(2, '0')}</span>
      <div className="absolute top-1 left-2 w-3 h-3 bg-white opacity-30 rounded-full blur-[1px]"></div>
    </div>
  );
};

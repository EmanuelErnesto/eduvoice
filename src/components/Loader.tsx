import React from 'react';

interface LoaderProps {
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = "Processando...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>
        
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-violet-500 border-b-transparent border-l-transparent animate-spin"></div>
        
        <div className="absolute inset-2 rounded-full border-4 border-b-indigo-400 border-l-cyan-400 border-t-transparent border-r-transparent animate-spin-reverse opacity-70" style={{ animationDuration: '1.5s' }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-xl font-bold text-white tracking-wide animate-pulse text-center">
          {text}
        </p>
      </div>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
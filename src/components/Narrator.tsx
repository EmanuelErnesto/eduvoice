import React, { useState, forwardRef, useImperativeHandle } from "react";

export interface NarratorHandle {
  setSpeaking: (speaking: boolean) => void;
}

export const Narrator = forwardRef<NarratorHandle, {}>((_, ref) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useImperativeHandle(ref, () => ({
    setSpeaking: (speaking: boolean) => {
      setIsSpeaking(speaking);
    },
  }));

  const animationDelays = [0.1, 0.3, 0.0, 0.4, 0.2];

  return (
    <div className="flex flex-col items-center justify-center mb-6 w-full h-24 relative">
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${
          isSpeaking ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        aria-hidden={!isSpeaking}
      >
        {animationDelays.map((delay, i) => (
          <div
            key={i}
            className="w-2 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)] origin-bottom"
            style={{
              height: "100%",
              maxHeight: "60px",
              animation: isSpeaking
                ? `audioWave 0.8s ease-in-out infinite`
                : "none",
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          !isSpeaking ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="w-14 h-14 rounded-full border-2 border-slate-700 bg-slate-800/80 backdrop-blur flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes audioWave {
          0%, 100% {
            transform: scaleY(0.2);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.6);
          }
        }
      `}</style>
    </div>
  );
});

Narrator.displayName = "Narrator";

import React from "react";

interface MascotProps {
  isHappy: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ isHappy }) => {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6 animate-bounce-slow">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
        style={{
          animation: isHappy
            ? "mascotHappy 1s ease-in-out infinite"
            : "mascotSad 2s ease-in-out infinite",
        }}
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#667eea", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#764ba2", stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="100"
          cy="110"
          r="70"
          fill="url(#bodyGradient)"
          filter="url(#glow)"
        />

        <circle
          cx="100"
          cy="65"
          r="45"
          fill="url(#bodyGradient)"
          filter="url(#glow)"
        />

        <circle cx="80" cy="60" r="8" fill="white">
          <animate
            attributeName="cy"
            values={isHappy ? "60;58;60" : "60;62;60"}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="80" cy="60" r="4" fill="#1a202c">
          <animate
            attributeName="cy"
            values={isHappy ? "60;58;60" : "60;62;60"}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="120" cy="60" r="8" fill="white">
          <animate
            attributeName="cy"
            values={isHappy ? "60;58;60" : "60;62;60"}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="120" cy="60" r="4" fill="#1a202c">
          <animate
            attributeName="cy"
            values={isHappy ? "60;58;60" : "60;62;60"}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {isHappy ? (
          <>
            <path
              d="M 75 75 Q 100 90 125 75"
              stroke="#FF6B9D"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="70" cy="55" r="6" fill="#FF6B9D" opacity="0.6" />
            <circle cx="130" cy="55" r="6" fill="#FF6B9D" opacity="0.6" />
          </>
        ) : (
          <>
            <path
              d="M 75 85 Q 100 70 125 85"
              stroke="#94A3B8"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 70 50 L 78 52"
              stroke="#94A3B8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 130 50 L 122 52"
              stroke="#94A3B8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="85" cy="95" r="2" fill="#94A3B8" opacity="0.4">
              <animate
                attributeName="cy"
                values="95;105;95"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}

        <ellipse
          cx="100"
          cy="150"
          rx="50"
          ry="20"
          fill="#667eea"
          opacity="0.3"
          filter="url(#glow)"
        >
          <animate
            attributeName="rx"
            values="50;45;50"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="20;18;20"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        {isHappy && (
          <>
            <circle cx="40" cy="80" r="5" fill="#FFA07A" opacity="0.8">
              <animate
                attributeName="cy"
                values="80;70;80"
                dur="1.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0.3;0.8"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="160" cy="90" r="4" fill="#4ECDC4" opacity="0.8">
              <animate
                attributeName="cy"
                values="90;80;90"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0.3;0.8"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="120" r="3" fill="#F7DC6F" opacity="0.8">
              <animate
                attributeName="cy"
                values="120;110;120"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0.3;0.8"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>

      <style>{`
        @keyframes mascotHappy {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.05) rotate(2deg);
          }
        }

        @keyframes mascotSad {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(0.98) translateY(5px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

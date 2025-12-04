import React from "react";

interface MascotProps {
  isHappy: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ isHappy }) => {
  return (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-6 animate-bounce-slow">
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-2xl"
        style={{
          animation: isHappy
            ? "mascotHappy 1s ease-in-out infinite"
            : "mascotSad 2s ease-in-out infinite",
        }}
      >
        <defs>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#6BC5F8", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#4A9FD8", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#FFA726", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#FF9800", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="sleeveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#6BC5F8", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#8D3DAF", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#6BC5F8", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#8D3DAF", stopOpacity: 1 }}
            />
            <stop
              offset="30%"
              style={{ stopColor: "#3B82F6", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#8D3DAF", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient
            id="backpackGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#8E44AD", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#6C3483", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#9B59B6", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#8E44AD", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <ellipse
          cx="100"
          cy="220"
          rx="65"
          ry="12"
          fill="#8E44AD"
          opacity="0.25"
        />

        <rect
          x="30"
          y="180"
          width="140"
          height="20"
          rx="2"
          fill="url(#deskGradient)"
        />

        <polygon
          points="55,135 35,125 35,175 55,185"
          fill="#6C3483"
          opacity="0.7"
        />
        <polygon
          points="145,135 165,125 165,175 145,185"
          fill="#6C3483"
          opacity="0.7"
        />

        <rect
          x="65"
          y="125"
          width="70"
          height="70"
          rx="8"
          fill="url(#backpackGradient)"
        />
        <rect x="75" y="135" width="50" height="10" fill="#A569BD" rx="2" />
        <circle cx="90" cy="160" r="4" fill="#7D3C98" />
        <circle cx="110" cy="160" r="4" fill="#7D3C98" />

        <ellipse cx="52" cy="155" rx="14" ry="20" fill="url(#sleeveGradient)" />
        <ellipse
          cx="148"
          cy="155"
          rx="14"
          ry="20"
          fill="url(#sleeveGradient)"
        />

        <circle cx="52" cy="172" r="11" fill="#5E9FD8" />
        <circle cx="148" cy="172" r="11" fill="#5E9FD8" />

        <rect
          x="70"
          y="130"
          width="60"
          height="55"
          rx="6"
          fill="url(#shirtGradient)"
        />
        <polygon points="100,130 70,145 70,130" fill="#FF6F00" opacity="0.4" />
        <polygon
          points="100,130 130,145 130,130"
          fill="#FFAB00"
          opacity="0.3"
        />
        <rect x="85" y="145" width="30" height="5" fill="#F57C00" rx="2" />

        <rect
          x="85"
          y="170"
          width="30"
          height="25"
          fill="#FFA726"
          rx="5"
          opacity="0.9"
        />

        <circle cx="100" cy="75" r="32" fill="url(#skinGradient)" />

        <path
          d="M 68 58 Q 72 42 83 46 Q 88 40 95 48 Q 100 38 105 48 Q 112 40 117 46 Q 128 42 132 58 L 100 68 Z"
          fill="url(#hairGradient)"
        />

        <polygon points="70,62 75,70 66,70" fill="#3B82F6" opacity="0.7" />
        <polygon points="130,62 125,70 134,70" fill="#3B82F6" opacity="0.7" />

        <circle cx="88" cy="75" r="3.5" fill="#1E3A8A" />
        <circle cx="112" cy="75" r="3.5" fill="#1E3A8A" />

        <rect x="97" y="80" width="6" height="8" rx="3" fill="#E91E63" />

        <ellipse cx="80" cy="82" rx="7" ry="6" fill="#EC407A" opacity="0.5" />
        <ellipse cx="120" cy="82" rx="7" ry="6" fill="#EC407A" opacity="0.5" />

        {isHappy ? (
          <>
            <path
              d="M 86 90 Q 100 97 114 90"
              stroke="#1E3A8A"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {[...Array(6)].map((_, i) => (
              <g key={i}>
                <polygon
                  points="0,-7 1.8,-2 7,-2 2.8,1.5 4.5,7 0,3.5 -4.5,7 -2.8,1.5 -7,-2 -1.8,-2"
                  fill="#FFD700"
                  transform={`translate(${45 + i * 22}, ${
                    28 + Math.sin(i * 1.3) * 12
                  })`}
                  opacity="0.85"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${45 + i * 22} ${28 + Math.sin(i * 1.3) * 12}`}
                    to={`360 ${45 + i * 22} ${28 + Math.sin(i * 1.3) * 12}`}
                    dur={`${2.2 + i * 0.25}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.85;0.4;0.85"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </polygon>
              </g>
            ))}
          </>
        ) : (
          <>
            <path
              d="M 86 95 Q 100 88 114 95"
              stroke="#1E3A8A"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            <path
              d="M 80 68 L 86 71"
              stroke="#8D3DAF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 120 68 L 114 71"
              stroke="#8D3DAF"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <ellipse
              cx="118"
              cy="82"
              rx="3"
              ry="5"
              fill="#4A90E2"
              opacity="0.65"
            >
              <animate
                attributeName="cy"
                values="82;98;98"
                dur="2.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.65;0.65;0"
                dur="2.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="5;7;7"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </ellipse>
          </>
        )}
      </svg>

      <style>{`
        @keyframes mascotHappy {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.03) translateY(-3px);
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

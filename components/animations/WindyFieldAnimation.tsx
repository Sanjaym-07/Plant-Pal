import React from 'react';

export const WindyFieldAnimation: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden">
        <style>
            {`
            .plant {
                transform-origin: bottom center;
                animation: wind-sway 5s ease-in-out infinite alternate;
            }
            @keyframes wind-sway {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(2deg); }
                100% { transform: rotate(-2deg); }
            }
            .plant:nth-child(2n) { animation-delay: -0.5s; animation-duration: 6s; }
            .plant:nth-child(3n) { animation-delay: -1s; animation-duration: 4.5s; }
            .scarecrow { animation: float 6s ease-in-out infinite; }
            `}
        </style>
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <filter id="scarecrow-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="10" dy="10" stdDeviation="5" floodColor="#000" floodOpacity="0.5" />
                </filter>
            </defs>
        
            {/* Field */}
            <path d="M0 800 C 480 750, 960 850, 1920 800 V 1080 H 0 Z" fill="#10b981" opacity="0.2" />
            <path d="M0 850 C 640 900, 1280 800, 1920 850 V 1080 H 0 Z" fill="#10b981" opacity="0.3" />

            {/* Scarecrow */}
            <g className="scarecrow" transform="translate(400 650)" filter="url(#scarecrow-shadow)">
                {/* Post */}
                <rect x="-5" y="0" width="10" height="200" fill="#4a2e1d" />
                <rect x="-40" y="30" width="80" height="10" fill="#4a2e1d" />
                {/* Head */}
                <circle cx="0" cy="0" r="30" fill="#f0e68c" />
                {/* Hat */}
                <path d="M-35 0 L 0 -40 L 35 0 Z" fill="#5d4037" />
                <rect x="-40" y="0" width="80" height="5" fill="#5d4037" />
                {/* Shirt */}
                <path d="M-35 40 L 0 50 L 35 40 L 0 120 Z" fill="#8b5cf6" opacity="0.7"/>
            </g>

            {/* Plants */}
            {Array.from({ length: 150 }).map((_, i) => {
                const x = (i / 150) * 1920 + Math.random() * 20 - 10;
                const y = 800 + Math.random() * 280;
                const height = 40 + Math.random() * 60;
                const swayDelay = Math.random() * 2;
                return (
                    <g key={i} className="plant" style={{ animationDelay: `${swayDelay}s` }}>
                        <path d={`M ${x} ${y} q 5 -${height*0.5} 0 -${height}`} stroke="#10b981" strokeWidth="2" fill="none" opacity="0.8"/>
                    </g>
                );
            })}
        </svg>
    </div>
  );
};

import React from 'react';

const Raindrop: React.FC<{ left: string; duration: string; delay: string }> = ({ left, duration, delay }) => (
    <div
        className="absolute top-[-20px] w-[1px] h-[20px] bg-gradient-to-b from-transparent to-blue-300"
        style={{
            left,
            animation: `fall ${duration} ${delay} linear infinite`,
            transform: 'translate3d(0, 0, 0)',
        }}
    />
);

export const RainAnimation: React.FC = () => {
    const drops = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: `${0.5 + Math.random() * 0.5}s`,
        delay: `${Math.random() * 5}s`,
    }));

    return (
        <>
            <style>
                {`
                    @keyframes fall {
                        to {
                            transform: translateY(100vh);
                        }
                    }
                `}
            </style>
            <div className="absolute inset-0 z-0 pointer-events-none">
                {drops.map(drop => (
                    <Raindrop key={drop.id} left={drop.left} duration={drop.duration} delay={drop.delay} />
                ))}
            </div>
        </>
    );
};

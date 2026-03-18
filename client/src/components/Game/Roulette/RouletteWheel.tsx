// src/components/Game/Roulette/RouletteWheel.tsx
import React, { useState } from 'react';
import { Sector } from '../../../types/game.types';
import './RouletteWheel.css';

interface RouletteWheelProps {
    sectors: Sector[];
    onSpin?: (sector: Sector) => void;
    disabled?: boolean;
    marketType?: 'crisis' | 'growth';
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
                                                                sectors,
                                                                onSpin,
                                                                disabled = false,
                                                                marketType
                                                            }) => {
    const [isSpinning, setIsSpinning] = useState(false);

    const handleSpin = () => {
        if (!disabled && !isSpinning && sectors.length > 0) {
            setIsSpinning(true);

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * sectors.length);
                onSpin?.(sectors[randomIndex]);
                setIsSpinning(false);
            }, 2000);
        }
    };

    return (
        <div className="roulette-container">
            <div className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}>
                <div className="wheel-center">
                    {marketType === 'crisis' ? '⚡' : marketType === 'growth' ? '📈' : '?'}
                </div>
                <div className="wheel-sectors">
                    {sectors.map((sector, index) => (
                        <div
                            key={sector.id}
                            className="wheel-sector"
                            style={{
                                transform: `rotate(${index * (360 / sectors.length)}deg)`,
                                backgroundColor: sector.color
                            }}
                        />
                    ))}
                </div>
            </div>
            <button
                className="spin-button"
                onClick={handleSpin}
                disabled={disabled || isSpinning}
            >
                {isSpinning ? 'Spinning...' : 'Spin Roulette'}
            </button>
        </div>
    );
};
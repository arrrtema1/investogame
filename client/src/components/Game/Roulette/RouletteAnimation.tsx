import React, { useEffect, useState } from 'react';
import { Sector } from '../../../types/game.types';
import './RouletteAnimation.css';

interface RouletteAnimationProps {
    sectors: Sector[];
    onComplete: (sector: Sector) => void;
    duration?: number;
}

export const RouletteAnimation: React.FC<RouletteAnimationProps> = ({
                                                                        sectors,
                                                                        onComplete,
                                                                        duration = 3000
                                                                    }) => {
    const [isSpinning, setIsSpinning] = useState(true);
    const [rotation, setRotation] = useState(0);
    const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

    useEffect(() => {
        // Выбираем случайный сектор
        const randomIndex = Math.floor(Math.random() * sectors.length);
        const finalSector = sectors[randomIndex];

        // Вычисляем конечный угол
        const sectorAngle = 360 / sectors.length;
        const targetRotation = 360 * 5 + (randomIndex * sectorAngle); // 5 полных оборотов

        setRotation(targetRotation);

        // Таймер окончания анимации
        const timer = setTimeout(() => {
            setIsSpinning(false);
            setSelectedSector(finalSector);
            onComplete(finalSector);
        }, duration);

        return () => clearTimeout(timer);
    }, [sectors, duration, onComplete]);

    return (
        <div className="roulette-animation-overlay">
            <div className="roulette-animation-container">
                <div className="roulette-wheel-container">
                    <div
                        className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {sectors.map((sector, index) => (
                            <div
                                key={sector.id}
                                className="roulette-sector"
                                style={{
                                    transform: `rotate(${index * (360 / sectors.length)}deg)`,
                                    backgroundColor: sector.color
                                }}
                            >
                                <span className="sector-name">{sector.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="roulette-pointer">▼</div>
                </div>

                <div className="roulette-status">
                    {isSpinning ? 'Вращение...' : selectedSector && `Сектор: ${selectedSector.name}`}
                </div>
            </div>
        </div>
    );
};
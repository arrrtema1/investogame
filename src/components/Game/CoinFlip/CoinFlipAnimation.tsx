import React, { useEffect, useState } from 'react';
import './CoinFlipAnimation.css';

interface CoinFlipAnimationProps {
    onComplete: (result: 'crisis' | 'growth') => void;
    duration?: number;
}

export const CoinFlipAnimation: React.FC<CoinFlipAnimationProps> = ({
                                                                        onComplete,
                                                                        duration = 2000
                                                                    }) => {
    const [isFlipping, setIsFlipping] = useState(true);
    const [result, setResult] = useState<'crisis' | 'growth' | null>(null);

    useEffect(() => {
        // Выбираем случайный результат
        const finalResult = Math.random() > 0.5 ? 'crisis' : 'growth';

        // Таймер окончания анимации
        const timer = setTimeout(() => {
            setIsFlipping(false);
            setResult(finalResult);
            onComplete(finalResult);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <div className="coin-animation-overlay">
            <div className="coin-animation-container">
                <div className={`coin ${isFlipping ? 'flipping' : ''} ${result || ''}`}>
                    <div className="coin-side crisis">⚡</div>
                    <div className="coin-side growth">📈</div>
                </div>
                <div className="coin-status">
                    {isFlipping ? 'Подбрасывание...' : result === 'crisis' ? 'КРИЗИС!' : 'РОСТ!'}
                </div>
            </div>
        </div>
    );
};
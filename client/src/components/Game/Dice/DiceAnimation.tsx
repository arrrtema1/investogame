import React, { useEffect, useState } from 'react';
import { Stock } from '../../../types/game.types';
import './DiceAnimation.css';

interface DiceAnimationProps {
    company: Stock;
    onComplete: (diceValue: number, isBankrupt: boolean) => void;
    duration?: number;
}

export const DiceAnimation: React.FC<DiceAnimationProps> = ({
                                                                company,
                                                                onComplete,
                                                                duration = 2000
                                                            }) => {
    const [isRolling, setIsRolling] = useState(true);
    const [diceValue, setDiceValue] = useState(1);
    const [isBankrupt, setIsBankrupt] = useState(false);

    const getBankruptcyThreshold = (size: string) => {
        switch(size) {
            case 'large': return 5;
            case 'medium': return 4;
            case 'small': return 3;
            default: return 4;
        }
    };

    useEffect(() => {
        // Анимация вращения - меняем значение каждые 100мс
        const rollInterval = setInterval(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
        }, 100);

        // Таймер окончания
        const timer = setTimeout(() => {
            clearInterval(rollInterval);

            const finalValue = Math.floor(Math.random() * 6) + 1;
            const threshold = getBankruptcyThreshold(company.size);
            const bankrupt = finalValue >= threshold;

            setDiceValue(finalValue);
            setIsBankrupt(bankrupt);
            setIsRolling(false);

            setTimeout(() => {
                onComplete(finalValue, bankrupt);
            }, 500); // Показываем результат 0.5 сек
        }, duration);

        return () => {
            clearInterval(rollInterval);
            clearTimeout(timer);
        };
    }, [company, duration, onComplete]);

    const threshold = getBankruptcyThreshold(company.size);

    return (
        <div className="dice-animation-overlay">
            <div className="dice-animation-container">
                <div className="company-info">
                    <h3>{company.name}</h3>
                    <span className={`company-size ${company.size}`}>
            {company.size === 'large' ? '🏢 Крупная' :
                company.size === 'medium' ? '🏬 Средняя' : '🏪 Малая'}
          </span>
                </div>

                <div className="dice-box">
                    <div className={`dice ${isRolling ? 'rolling' : ''} ${isBankrupt ? 'bankrupt' : 'safe'}`}>
                        <div className="dice-face">{diceValue}</div>
                    </div>
                </div>

                <div className="dice-info">
                    {isRolling ? (
                        <p>Бросок...</p>
                    ) : (
                        <>
                            <p className={`threshold ${isBankrupt ? 'bankrupt' : 'safe'}`}>
                                {isBankrupt
                                    ? `💀 БАНКРОТ! (${diceValue} ≥ ${threshold})`
                                    : `✅ Выжила (${diceValue} < ${threshold})`}
                            </p>
                            <p className="threshold-info">
                                Порог банкротства: {threshold}+
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
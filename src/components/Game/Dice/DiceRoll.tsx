import React, { useState } from 'react';
import { Company } from '../../../types/game.types';
import './DiceRoll.css';

interface DiceRollProps {
    company: Company;
    onRoll?: (value: number, isBankrupt: boolean) => void;
    disabled?: boolean;
}

export const DiceRoll: React.FC<DiceRollProps> = ({
                                                      company,
                                                      onRoll,
                                                      disabled = false
                                                  }) => {
    const [isRolling, setIsRolling] = useState(false);
    const [diceValue, setDiceValue] = useState(1);

    const getBankruptcyThreshold = (size: string) => {
        switch(size) {
            case 'large': return 5;
            case 'medium': return 4;
            case 'small': return 3;
            default: return 4;
        }
    };

    const handleRoll = () => {
        if (!disabled && !isRolling) {
            setIsRolling(true);

            const interval = setInterval(() => {
                setDiceValue(Math.floor(Math.random() * 6) + 1);
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                const finalValue = Math.floor(Math.random() * 6) + 1;
                setDiceValue(finalValue);
                setIsRolling(false);

                const threshold = getBankruptcyThreshold(company.size);
                onRoll?.(finalValue, finalValue >= threshold);
            }, 1500);
        }
    };

    const threshold = getBankruptcyThreshold(company.size);

    return (
        <div className="dice-roll-container">
            <div className="company-info">
                <h4>{company.name}</h4>
                <span className={`size ${company.size}`}>
          {company.size === 'large' ? '🏢 Large' :
              company.size === 'medium' ? '🏬 Medium' : '🏪 Small'}
        </span>
            </div>

            <div className="dice-box">
                <div className={`dice ${isRolling ? 'rolling' : ''}`}>
                    {diceValue}
                </div>
            </div>

            <div className="bankruptcy-info">
                <div>Bankruptcy on: {threshold}+</div>
                {!isRolling && diceValue >= threshold && (
                    <div className="bankrupt-warning">💀 BANKRUPT!</div>
                )}
            </div>

            <button
                className="roll-button"
                onClick={handleRoll}
                disabled={disabled || isRolling}
            >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
        </div>
    );
};
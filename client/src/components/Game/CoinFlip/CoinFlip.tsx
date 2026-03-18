import React from 'react';
import './CoinFlip.css';

interface CoinFlipProps {
    onFlip?: (result: 'crisis' | 'growth') => void;
    disabled?: boolean;
}

export const CoinFlip: React.FC<CoinFlipProps> = ({ onFlip, disabled = false }) => {
    const handleFlip = () => {
        if (!disabled) {
            const result = Math.random() > 0.5 ? 'crisis' : 'growth';
            onFlip?.(result);
        }
    };

    return (
        <div className="coin-flip-container">
            <div className="coin" onClick={handleFlip}>
                🪙
            </div>
            <button
                className="flip-button"
                onClick={handleFlip}
                disabled={disabled}
            >
                Flip Coin
            </button>
        </div>
    );
};
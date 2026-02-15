// src/components/Player/Balance/Balance.tsx
import React from 'react';
import './Balance.css';

interface BalanceProps {
    amount: number;
    showChange?: boolean;
    change?: number;
}

export const Balance: React.FC<BalanceProps> = ({ amount, showChange = false, change = 0 }) => {
    const formatBalance = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="balance-container">
            <div className="balance-label">Balance</div>
            <div className="balance-amount">{formatBalance(amount)}</div>
            {showChange && change !== 0 && (
                <div className={`balance-change ${change > 0 ? 'positive' : 'negative'}`}>
                    {change > 0 ? '↑' : '↓'} {formatBalance(Math.abs(change))}
                </div>
            )}
        </div>
    );
};
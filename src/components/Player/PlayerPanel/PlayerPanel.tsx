// src/components/Player/PlayerPanel/PlayerPanel.tsx
import React from 'react';
import { Player } from '../../../types/game.types';
import { Balance } from '../Balance';
import { Portfolio } from '../Portfolio';
import './PlayerPanel.css';

interface PlayerPanelProps {
    player: Player;
    onReady?: () => void;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({ player, onReady }) => {
    const calculateNetWorth = () => {
        const stocksValue = player.portfolio.stocks.reduce((sum, s) => sum + (s.price * s.quantity), 0);
        const bondsValue = player.portfolio.bonds.reduce((sum, b) => sum + (b.price * b.quantity), 0);
        const realEstateValue = player.portfolio.realEstate.reduce((sum, r) => sum + (r.price * r.quantity), 0);

        return player.balance + stocksValue + bondsValue + realEstateValue;
    };

    const calculateTotalIncome = () => {
        const stocksIncome = player.portfolio.stocks.reduce((sum, s) => sum + (s.income * s.price * s.quantity / 100), 0);
        const bondsIncome = player.portfolio.bonds.reduce((sum, b) => sum + (b.income * b.price * b.quantity / 100), 0);
        const realEstateIncome = player.portfolio.realEstate.reduce((sum, r) => sum + (r.income * r.price * r.quantity / 100), 0);

        return stocksIncome + bondsIncome + realEstateIncome;
    };

    return (
        <div className="player-panel">
            <div className="player-header">
                <h3>👤 {player.id}</h3>
                {player.isReady && <span className="ready-badge">Ready ✅</span>}
            </div>

            <Balance amount={player.balance} />

            <div className="player-stats">
                <div className="stat-item">
                    <span className="stat-label">Net Worth</span>
                    <span className="stat-value">${calculateNetWorth()}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Monthly Income</span>
                    <span className="stat-value income">+${Math.round(calculateTotalIncome())}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Assets</span>
                    <span className="stat-value">
            {player.portfolio.stocks.length +
                player.portfolio.bonds.length +
                player.portfolio.realEstate.length}
          </span>
                </div>
            </div>

            <Portfolio portfolio={player.portfolio} />

            {onReady && (
                <button
                    className={`ready-button ${player.isReady ? 'ready' : ''}`}
                    onClick={onReady}
                    disabled={player.isReady}
                >
                    {player.isReady ? 'Ready!' : 'Mark Ready'}
                </button>
            )}
        </div>
    );
};
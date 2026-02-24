import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../UI/Button';
import { GAME_CONSTANTS } from '../../data/constants';
import './StartMenu.css';

export interface StartMenuProps {
    onStartGame: (playerName: string, startingBalance: number) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStartGame }) => {
    const { initializeNewGame } = useGame();
    const [playerName, setPlayerName] = useState('Player');
    const [startingBalance, setStartingBalance] = useState(GAME_CONSTANTS.STARTING_BALANCE);
    const [showSettings, setShowSettings] = useState(false);

    const handleStart = () => {
        if (playerName.trim()) {
            // Инициализировать игру с выбранными параметрами
            initializeNewGame(playerName.trim(), startingBalance);
            onStartGame(playerName.trim(), startingBalance);
        }
    };

    return (
        <div className="start-menu">
            <div className="start-menu-container">
                <div className="logo-section">
                    <h1>InvestoGame</h1>
                    <p className="tagline">investoga.me</p>
                </div>

                <div className="menu-content">
                    <div className="input-group">
                        <label>Your name:</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                            maxLength={20}
                            className="player-name-input"
                        />
                    </div>

                    {showSettings && (
                        <div className="settings-group">
                            <div className="input-group">
                                <label>Starting balance: ${startingBalance.toLocaleString()}</label>
                                <input
                                    type="range"
                                    min="1000"
                                    max="50000"
                                    step="1000"
                                    value={startingBalance}
                                    onChange={(e) => setStartingBalance(Number(e.target.value))}
                                    className="balance-slider"
                                />
                                <div className="balance-presets">
                                    <button onClick={() => setStartingBalance(2000)}>$2k</button>
                                    <button onClick={() => setStartingBalance(5000)}>$5k</button>
                                    <button onClick={() => setStartingBalance(10000)}>$10k</button>
                                    <button onClick={() => setStartingBalance(25000)}>$25k</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="menu-actions">
                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleStart}
                            disabled={!playerName.trim()}
                            fullWidth
                        >
                            🚀 Start Game
                        </Button>

                        <Button
                            variant="secondary"
                            size="medium"
                            onClick={() => setShowSettings(!showSettings)}
                            fullWidth
                        >
                            {showSettings ? '▲ Hide settings' : '▼ Game settings'}
                        </Button>
                    </div>

                    <div className="game-rules">
                        <h3>📖 How to play</h3>
                        <ul>
                            <li>Start with ${startingBalance.toLocaleString()}</li>
                            <li>Play {GAME_CONSTANTS.MAX_YEARS} years</li>
                            <li>Buy stocks, bonds, and real estate</li>
                            <li>Earn income from your investments</li>
                            <li>Goal: Have more than ${startingBalance.toLocaleString()} after {GAME_CONSTANTS.MAX_YEARS} years</li>
                        </ul>
                    </div>
                </div>

                <div className="footer">
                    <p>© 2026 InvestoGame. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};
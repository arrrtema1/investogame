import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../UI/Button';
import { GAME_CONSTANTS } from '../../data/constants';
import { Language } from '../../data/translations';
import { useNavigate } from 'react-router-dom';
import './StartMenu.css';


const currentYear = new Date().getFullYear();

export interface StartMenuProps {
    onStartGame: (playerName: string, startingBalance: number) => void;
}

export const StartMenu: React.FC = () => {
    const navigate = useNavigate();
    const { initializeNewGame } = useGame();
    const { language, setLanguage, t } = useLanguage();
    const [playerName, setPlayerName] = useState('');
    const [startingBalance, setStartingBalance] = useState(GAME_CONSTANTS.STARTING_BALANCE);
    const [showSettings, setShowSettings] = useState(false);

    const handleStart = () => {
        if (playerName.trim()) {
            // Инициализировать игру с выбранными параметрами
            initializeNewGame(playerName.trim(), startingBalance);
            navigate('/game');
        }
    };

    const languages: { code: Language; flag: string }[] = [
        { code: 'en', flag: '🇺🇸'},
        { code: 'ru', flag: '🇷🇺'}
    ];

    return (
        <div className="start-menu">
            <div className="start-menu-container">
                <div className="logo-section">
                    <h1>InvestoGame</h1>
                </div>

                <div className="menu-content">
                    <div className="input-group">
                        <label>{t.yourName}</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={20}
                            className="player-name-input"
                        />
                    </div>

                    {showSettings && (
                        <div className="settings-group">
                            {/* Язык */}
                            <div className="input-group">
                                <label>{t.language}</label>
                                <div className="language-selector">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            className={`language-option ${language === lang.code ? 'active' : ''}`}
                                            onClick={() => setLanguage(lang.code)}
                                        >
                                            <span className="flag">{lang.flag}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Начальный баланс */}
                            <div className="input-group">
                                <label>{t.startingBalance}: ${startingBalance.toLocaleString()}</label>
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
                                    <button onClick={() => setStartingBalance(2000)}>$2K</button>
                                    <button onClick={() => setStartingBalance(5000)}>$5K</button>
                                    <button onClick={() => setStartingBalance(10000)}>$10K</button>
                                    <button onClick={() => setStartingBalance(25000)}>$25K</button>
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
                            🚀 {t.startGame}
                        </Button>

                        <Button
                            variant="secondary"
                            size="medium"
                            onClick={() => setShowSettings(!showSettings)}
                            fullWidth
                        >
                            {showSettings ? `▲ ${t.hideSettings}` : `▼ ${t.gameSettings}`}
                        </Button>
                    </div>

                    <div className="game-rules">
                        <h3>📖 {t.howToPlay}</h3>
                        <ul>
                            <li>{t.startWith + startingBalance.toLocaleString()}</li>
                            <li>{t.playYears.replace('{years}', GAME_CONSTANTS.MAX_YEARS.toString())}</li>
                            <li>{t.buyStocks}</li>
                            <li>{t.earnIncome}</li>
                            <li>{t.goal.replace('{years}', GAME_CONSTANTS.MAX_YEARS.toString()).replace('{money}', startingBalance.toLocaleString())}</li>
                        </ul>
                    </div>
                </div>

                <div className="footer">
                    <p>© {currentYear} InvestoGame. {t.allRightsReserved}</p>
                </div>
            </div>
        </div>
    );
};
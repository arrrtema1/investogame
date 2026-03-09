import React, { useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '../../UI/Button';
import { Clock } from '../../UI/Clock'
import { AssetCard } from '../../Market/AssetCard';
import { Sector } from '../../../types/game.types';
import { GAME_CONSTANTS } from '../../../data/constants';
import { CoinFlipAnimation } from '../CoinFlip/CoinFlipAnimation';
import { RouletteAnimation } from '../Roulette/RouletteAnimation';
import { DiceAnimation } from '../Dice/DiceAnimation';

import './GameBoard.css';

export const GameBoard: React.FC = () => {
    const { gameState, setGamePhase, setMarketType, nextYear, buyAsset, sellAsset, applyCrisisEffects, applyGrowthEffects, processBankruptcy } = useGame();
    const { t } = useLanguage();

    const [selectedTab, setSelectedTab] = useState<'market' | 'bonds' | 'realestate' | 'metals' | 'portfolio'>('market');
    const [showCoinFlip, setShowCoinFlip] = useState(false);
    const [showRoulette, setShowRoulette] = useState(false);
    const [showDice, setShowDice] = useState(false);
    const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);
    const [crisisCompanies, setCrisisCompanies] = useState<any[]>([]);

    const getCurrentStockPrice = (stockId: number): number => {
        for (const sector of gameState.sectors) {
            const found = sector.companies.find(c => c.id === stockId);
            if (found) {
                return found.currentPrice;
            }
        }
        return 0;
    };

    const currentPlayer = gameState.players[0];

    // Запуск броска монетки
    const handleFlipCoin = () => {
        setShowCoinFlip(true);
    };

    // Завершение броска монетки
    const handleCoinFlipComplete = (result: 'crisis' | 'growth') => {
        setShowCoinFlip(false);
        setMarketType(result);

        if (result === 'crisis') {
            setShowRoulette(true);  // Рулетка выберет сектор для кризиса
        } else {
            setShowRoulette(true);  // Рулетка выберет сектор для роста
        }
    };

    // Конец рулетки
    const handleRouletteComplete = (sector: any) => {
        setShowRoulette(false);

        console.log('Market type:', gameState.marketType);
        console.log('Selected sector:', sector);
        if (gameState.marketType === 'crisis') {
            // Если кризис - применяем кризис к сектору
            applyCrisisEffects(sector);
            setCrisisCompanies(sector.companies);
            setCurrentCompanyIndex(0);
            setShowDice(true);
        } else {
            // Если рост - просто применяем рост
            applyGrowthEffects(sector);
            setGamePhase('trading');
        }
    };

// Завершение броска кубика
    const handleDiceComplete = (diceValue: number) => {
        const currentCompany = crisisCompanies[currentCompanyIndex];
        processBankruptcy(currentCompany, diceValue);

        if (currentCompanyIndex < crisisCompanies.length - 1) {
            setCurrentCompanyIndex(prev => prev + 1);
        } else {
            setShowDice(false);
            setCrisisCompanies([]);
            setGamePhase('trading');
        }
    };

    const handleBuyAsset = (asset: any) => {
        if (gameState.phase === 'trading') {
            buyAsset(asset, 1);
            console.log(`Bought: ${asset.name} for $${asset.price}`);
        }
    };

    const getPhaseDisplay = () => {
        switch(gameState.phase) {
            case 'coin_flip': return t.phase.coin_flip
            case 'sector_select': return t.phase.sector_select
            case 'crisis_dice': return t.phase.crisis_dice
            case 'income': return t.phase.income
            case 'trading': return t.phase.trading
            case 'year_end': return t.phase.year_end
            default: return gameState.phase;
        }
    };

    const getMarketTypeDisplay = () => {
        if (!gameState.marketType) return null;
        return gameState.marketType === 'crisis'
            ? '🔴 Crisis in one sector'
            : '🟢 Grow in one sector';
    };

    const renderSectorCard = (sector: Sector) => {
        const isAffected = sector.id === gameState.selectedSector?.id;
        const sectorClass = `sector-card ${isAffected ? 'affected' : ''} ${sector.marketType || ''}`;

        return (
            <div key={sector.id} className={sectorClass} style={{ borderColor: sector.color }}>
                <div className="sector-header">
                    <h4>{sector.name}</h4>
                    {sector.marketType === 'crisis' && <span className="badge crisis-badge">Crisis</span>}
                    {sector.marketType === 'growth' && <span className="badge growth-badge">Growth</span>}
                </div>
                <div className="companies">
                    {sector.companies.map(company => (
                        <div key={company.id} className={`company-item ${company.isBankrupt ? 'bankrupt' : ''}`}>
                            <div className="company-info">
                                <div className="company-name">
                                    {company.name}
                                    {company.size === 'large' && ' 🏢'}
                                    {company.size === 'medium' && ' 🏬'}
                                    {company.size === 'small' && ' 🏪'}
                                </div>
                                <div className="company-details">
                                    <span className="price">${company.currentPrice}</span>
                                    <span className={`income ${company.currentIncome > 0 ? 'positive' : 'negative'}`}>
                                    {company.currentIncome}%
                                </span>
                                    {company.isBankrupt && <span className="bankrupt-label">💀</span>}
                                </div>
                            </div>

                            {gameState.phase === 'trading' && !company.isBankrupt && (
                                <div className="company-actions">
                                    <Button
                                        size="small"
                                        variant="success"
                                        onClick={() => handleBuyAsset(company)}
                                        disabled={currentPlayer.balance < company.currentPrice}
                                    >
                                        {t.buttons.buy}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderBonds = () => {
        const bonds = gameState.availableBonds || [];
        return (
            <div className="assets-grid">
                {bonds.map(bond => (
                    <AssetCard
                        key={bond.id}
                        asset={bond}
                        onBuy={handleBuyAsset}
                        showActions={gameState.phase === 'trading'}
                        playerBalance={currentPlayer.balance}
                    />
                ))}
            </div>
        );
    };

    const renderRealEstate = () => {
        const realEstate = gameState.availableRealEstate || [];
        return (
            <div className="assets-grid">
                {realEstate.map(property => (
                    <AssetCard
                        key={property.id}
                        asset={property}
                        onBuy={handleBuyAsset}
                        showActions={gameState.phase === 'trading'}
                        playerBalance={currentPlayer.balance}
                    />
                ))}
            </div>
        );
    };

    const renderMetals = () => {
        const metals = gameState.availableMetals || [];
        return (
            <div className="assets-grid">
                {metals.map(metal => (
                    <AssetCard
                        key={metal.id}
                        asset={metal}
                        onBuy={handleBuyAsset}
                        showActions={gameState.phase === 'trading'}
                        playerBalance={currentPlayer.balance}
                    />
                ))}
            </div>
        );
    };

    const renderPortfolio = () => {
        const portfolio = currentPlayer.portfolio;

        const handleSellAsset = (asset: any) => {
            if (gameState.phase === 'trading') {
                sellAsset(asset, 1);
                console.log(`Sold: ${asset.name} x1 for $${asset.currentPrice || asset.price}`);
            }
        };

        return (
            <div className="portfolio-view">
                <div className="portfolio-summary">
                    <div className="summary-item">
                        <span>{t.portfolio.cash}:</span>
                        <span className="cash-amount">${currentPlayer.balance}</span>
                    </div>
                    <div className="summary-item">
                        <span>{t.portfolio.totalValue}:</span>
                        <span className="total-amount">
                        ${currentPlayer.balance +
                            portfolio.stocks.reduce((sum, s) => sum + (getCurrentStockPrice(s.id) * s.quantity), 0) +
                            portfolio.bonds.reduce((sum, b) => sum + (b.price * b.quantity), 0) +
                            portfolio.realEstate.reduce((sum, r) => sum + (r.price * r.quantity), 0) +
                            portfolio.metals.reduce((sum, r) => sum + (r.price * r.quantity), 0)
                        }
                        </span>
                    </div>
                </div>

                {portfolio.stocks.length > 0 && (
                    <div className="portfolio-section">
                        <h4>📈 {t.tabs.stocks}</h4>
                        {portfolio.stocks.map(stock => (
                            <div key={stock.id} className="portfolio-item">
                                <span>{stock.name} x{stock.quantity}</span>
                                <div className="item-sell">
                                    <span>${getCurrentStockPrice(stock.id) * stock.quantity}</span>
                                    {gameState.phase === 'trading' && (
                                        <Button
                                            onClick={() => handleSellAsset({
                                                ...stock,
                                                currentPrice: getCurrentStockPrice(stock.id)
                                            })}
                                            size={'small'}
                                            variant={'danger'}
                                        >
                                            {t.buttons.sell}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {portfolio.bonds.length > 0 && (
                    <div className="portfolio-section">
                        <h4>📊 {t.tabs.bonds}</h4>
                        {portfolio.bonds.map(bond => (
                            <div key={bond.id} className="portfolio-item">
                                <span>{bond.name} x{bond.quantity}</span>
                                <div className="item-sell">
                                    <span>${bond.price * bond.quantity}</span>
                                    {gameState.phase === 'trading' && (
                                        <Button
                                            onClick={() => handleSellAsset(bond)}
                                            size={'small'}
                                            variant={'danger'}
                                        >
                                            {t.buttons.sell}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {portfolio.realEstate.length > 0 && (
                    <div className="portfolio-section">
                        <h4>🏠 {t.tabs.realEstate}</h4>
                        {portfolio.realEstate.map(property => (
                            <div key={property.id} className="portfolio-item">
                                <span>{property.name} x{property.quantity}</span>
                                <div className="item-sell">
                                    <span>${property.price * property.quantity}</span>
                                    {gameState.phase === 'trading' && (
                                        <Button
                                            onClick={() => handleSellAsset(property)}
                                            size={'small'}
                                            variant={'danger'}
                                        >
                                            {t.buttons.sell}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {portfolio.metals.length > 0 && (
                    <div className="portfolio-section">
                        <h4>🪙 {t.tabs.metals}</h4>
                        {portfolio.metals.map(metal => (
                            <div key={metal.id} className="portfolio-item">
                                <span>{metal.name} x{metal.quantity}</span>
                                <div className="item-sell">
                                    <span>${metal.price * metal.quantity}</span>
                                    {gameState.phase === 'trading' && (
                                        <Button
                                            onClick={() => handleSellAsset(metal)}
                                            size={'small'}
                                            variant={'danger'}
                                        >
                                            {t.buttons.sell}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {portfolio.stocks.length === 0 &&
                portfolio.bonds.length === 0 &&
                portfolio.realEstate.length === 0 &&
                portfolio.metals.length === 0 && (
                    <div className="empty-portfolio">
                        {t.portfolio.empty}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="game-board">
            <div className="game-header">
                <div className="header-left">
                    <img src={'../../../assets/images/logo.png'} alt={''}></img>
                    <a href={'/'}>
                        <h1>InvestoGame</h1>
                    </a>
                </div>
                <div className="header-right">
                    <Clock format="time" />
                    <div className="game-info">
                        <span className="year">{t.year} {gameState.currentYear}/{GAME_CONSTANTS.MAX_YEARS}</span>
                        <span className="phase">{getPhaseDisplay()}</span>
                        {getMarketTypeDisplay() && (
                            <span className="market-type">{getMarketTypeDisplay()}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="game-content">
                <div className="left-panel">
                    <div className="player-info">
                        <h3>👤 {currentPlayer.name || 'Player'}</h3>
                        <div className="balance-large">${currentPlayer.balance}</div>
                        <div className="player-stats">
                            <div>{t.income}: ${currentPlayer.totalIncome}</div>
                            <div>{t.assets}: {
                                currentPlayer.portfolio.stocks.reduce((sum, item) => sum + item.quantity, 0) +
                                currentPlayer.portfolio.bonds.reduce((sum, item) => sum + item.quantity, 0) +
                                currentPlayer.portfolio.realEstate.reduce((sum, item) => sum + item.quantity, 0) +
                                currentPlayer.portfolio.metals.reduce((sum, item) => sum + item.quantity, 0)
                            }</div>
                        </div>
                    </div>

                    <div className="game-controls">
                        <h3>🎮 {t.controls}</h3>
                        <Button
                            onClick={nextYear}
                            disabled={gameState.phase !== 'trading'}
                            variant="warning"
                            size="large"
                        >
                            {t.buttons.nextYear} 📅
                        </Button>
                        <Button
                            onClick={handleFlipCoin}
                            disabled={gameState.phase !== 'coin_flip'}
                            variant="primary"
                            size="large"
                        >
                            Flip coin
                        </Button>
                    </div>
                </div>

                <div className="main-panel">
                    <div className="market-tabs">
                        <button
                            className={`tab ${selectedTab === 'market' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('market')}
                        >
                            📈 <span>{t.tabs.stocks}</span>
                        </button>
                        <button
                            className={`tab ${selectedTab === 'bonds' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('bonds')}
                        >
                            📊 <span>{t.tabs.bonds}</span>
                        </button>
                        <button
                            className={`tab ${selectedTab === 'realestate' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('realestate')}
                        >
                            🏠 <span>{t.tabs.realEstate}</span>
                        </button>
                        <button
                            className={`tab ${selectedTab === 'metals' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('metals')}
                        >
                            🪙 <span>{t.tabs.metals}</span>
                        </button>
                        <button
                            className={`tab ${selectedTab === 'portfolio' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('portfolio')}
                        >
                            💼 <span>{t.tabs.portfolio}</span>
                        </button>
                    </div>

                    <div className="tab-content">
                        {selectedTab === 'market' && (
                            <div className="market-view">
                                <h3>{t.tabs.stocks}</h3>
                                <div className="sectors-grid">
                                    {gameState.sectors.map(sector => renderSectorCard(sector))}
                                </div>
                            </div>
                        )}

                        {selectedTab === 'bonds' && (
                            <div className="bonds-view">
                                <h3>{t.tabs.bonds}</h3>
                                {renderBonds()}
                            </div>
                        )}

                        {selectedTab === 'realestate' && (
                            <div className="realestate-view">
                                <h3>{t.tabs.realEstate}</h3>
                                {renderRealEstate()}
                            </div>
                        )}

                        {selectedTab === 'metals' && (
                            <div className="metals-view">
                                <h3>{t.tabs.metals}</h3>
                                {renderMetals()}
                            </div>
                        )}

                        {selectedTab === 'portfolio' && (
                            <div className="portfolio-view-container">
                                <h3>{t.tabs.portfolio}</h3>
                                {renderPortfolio()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {gameState.selectedSector && gameState.phase === 'crisis_dice' && (
                <div className="crisis-modal">
                    <div className="crisis-content">
                        <h2>⚡ CRISIS IN {gameState.selectedSector.name} ⚡</h2>
                        <p>Rolling dice for each company...</p>
                        <Button>Continue</Button>
                    </div>
                </div>
            )}
            {/* Анимации */}
            {showCoinFlip && (
                <CoinFlipAnimation onComplete={handleCoinFlipComplete} />
            )}

            {showRoulette && (
                <RouletteAnimation
                    sectors={gameState.sectors}
                    onComplete={handleRouletteComplete}
                />
            )}

            {showDice && crisisCompanies.length > 0 && (
                <DiceAnimation
                    company={crisisCompanies[currentCompanyIndex]}
                    onComplete={handleDiceComplete}
                />
            )}
        </div>
    );
};
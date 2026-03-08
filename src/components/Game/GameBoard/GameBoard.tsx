import React, { useState } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '../../UI/Button';
import { Clock } from '../../UI/Clock'
import { AssetCard } from '../../Market/AssetCard';
import { Sector, Company, Bond, RealEstate } from '../../../types/game.types';
import { GAME_CONSTANTS } from '../../../data/constants';
import './GameBoard.css';

export const GameBoard: React.FC = () => {
    const { gameState, setGamePhase, nextYear, resetGame, buyAsset, sellAsset } = useGame();
    const { t } = useLanguage();

    const [selectedTab, setSelectedTab] = useState<'market' | 'bonds' | 'realestate' | 'portfolio' | 'metals'>('market');

    const currentPlayer = gameState.players[0];

    const handleCoinFlip = () => {
        setGamePhase('sector_select');
    };

    const handleBuyAsset = (asset: any) => {
        if (gameState.phase === 'trading') {
            buyAsset(asset, 1);
            console.log(`Bought: ${asset.name} for $${asset.price}`);
        }
    };

    const getPhaseDisplay = () => {
        switch(gameState.phase) {
            case 'coin_flip': return '🎲 Coin flip';
            case 'sector_select': return '🎯 Selecting sector';
            case 'crisis_dice': return '⚡ Choosing what company has crisis';
            case 'trading': return '💹 Trading';
            case 'income': return '💰 Generating income';
            case 'year_end': return '📊 End of the year';
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
                                    <span className="price">${company.price}</span>
                                    <span className={`income ${company.income > 0 ? 'positive' : 'negative'}`}>
                                    {company.income}%
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
                                        disabled={currentPlayer.balance < company.price}
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
                console.log(`Sold: ${asset.name} x1 for $${asset.price}`);
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
                            portfolio.stocks.reduce((sum, s) => sum + (s.price * s.quantity), 0) +
                            portfolio.bonds.reduce((sum, b) => sum + (b.price * b.quantity), 0) +
                            portfolio.realEstate.reduce((sum, r) => sum + (r.price * r.quantity), 0) +
                            portfolio.metals.reduce((sum, r) => sum + (r.price * r.quantity), 0)}
                        </span>
                    </div>
                </div>

                {portfolio.stocks.length > 0 && (
                    <div className="portfolio-section">
                        <h4>📈 {t.tabs.stocks}</h4>
                        {portfolio.stocks.map(stock => (
                            <div key={stock.id} className="portfolio-item">
                                <span>{stock.name} x{stock.quantity}</span>
                                <span>${stock.price * stock.quantity}</span>
                                {gameState.phase === 'trading' && (
                                    <Button
                                        onClick={() => handleSellAsset(stock)}
                                        size={'small'}
                                        variant={'danger'}
                                    >
                                        {t.buttons.sell}
                                    </Button>
                                )}
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
                        ))}
                    </div>
                )}

                {portfolio.realEstate.length > 0 && (
                    <div className="portfolio-section">
                        <h4>🏠 {t.tabs.realEstate}</h4>
                        {portfolio.realEstate.map(property => (
                            <div key={property.id} className="portfolio-item">
                                <span>{property.name} x{property.quantity}</span>
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
                        ))}
                    </div>
                )}

                {portfolio.metals.length > 0 && (
                    <div className="portfolio-section">
                        <h4>🪙 {t.tabs.metals}</h4>
                        {portfolio.metals.map(metal => (
                            <div key={metal.id} className="portfolio-item">
                                <span>{metal.name} x{metal.quantity}</span>
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
                    <h1>InvestoGame</h1>
                </div>
                <div className="header-right">
                    <Clock format="time" />
                    <div className="game-info">
                        <span className="year">Year {gameState.currentYear}/{GAME_CONSTANTS.MAX_YEARS}</span>
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
                            <div>Income: ${currentPlayer.totalIncome}</div>
                            <div>Assets: {
                                currentPlayer.portfolio.stocks.reduce((sum, item) => sum + item.quantity, 0) +
                                currentPlayer.portfolio.bonds.reduce((sum, item) => sum + item.quantity, 0) +
                                currentPlayer.portfolio.realEstate.reduce((sum, item) => sum + item.quantity, 0) +
                                currentPlayer.portfolio.metals.reduce((sum, item) => sum + item.quantity, 0)
                            }</div>
                        </div>
                    </div>

                    <div className="game-controls">
                        <h3>🎮 Controls</h3>
                        <Button
                            onClick={nextYear}
                            disabled={gameState.phase !== 'trading'}
                            variant="warning"
                            size="large"
                        >
                            {t.buttons.nextYear} 📅
                        </Button>
                    </div>
                </div>

                <div className="main-panel">
                    <div className="market-tabs">
                        <button
                            className={`tab ${selectedTab === 'market' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('market')}
                        >
                            📈 {t.tabs.stocks}
                        </button>
                        <button
                            className={`tab ${selectedTab === 'bonds' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('bonds')}
                        >
                            📊 {t.tabs.bonds}
                        </button>
                        <button
                            className={`tab ${selectedTab === 'realestate' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('realestate')}
                        >
                            🏠 {t.tabs.realEstate}
                        </button>
                        <button
                            className={`tab ${selectedTab === 'metals' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('metals')}
                        >
                            🪙 {t.tabs.metals}
                        </button>
                        <button
                            className={`tab ${selectedTab === 'portfolio' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('portfolio')}
                        >
                            💼 {t.tabs.portfolio}
                        </button>
                    </div>

                    <div className="tab-content">
                        {selectedTab === 'market' && (
                            <div className="market-view">
                                <h3>Sectors</h3>
                                <div className="sectors-grid">
                                    {gameState.sectors.map(sector => renderSectorCard(sector))}
                                </div>
                            </div>
                        )}

                        {selectedTab === 'bonds' && (
                            <div className="bonds-view">
                                <h3>Government Bonds</h3>
                                {renderBonds()}
                            </div>
                        )}

                        {selectedTab === 'realestate' && (
                            <div className="realestate-view">
                                <h3>Real Estate</h3>
                                {renderRealEstate()}
                            </div>
                        )}

                        {selectedTab === 'metals' && (
                            <div className="metals-view">
                                <h3>Metals</h3>
                                {renderMetals()}
                            </div>
                        )}

                        {selectedTab === 'portfolio' && (
                            <div className="portfolio-view-container">
                                <h3>Your Portfolio</h3>
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
                    </div>r
                </div>
            )}
        </div>
    );
};
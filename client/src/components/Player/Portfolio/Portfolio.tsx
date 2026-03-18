import React, { useState } from 'react';
import { Portfolio as PortfolioType, Sector } from '../../../types/game.types';
import { AssetCard } from '../../Market/AssetCard';
import './Portfolio.css';

interface PortfolioProps {
    portfolio: PortfolioType;
    onSell?: (asset: any) => void;
    sectors?: Sector[];
}

export const Portfolio: React.FC<PortfolioProps> = ({ portfolio, onSell, sectors = [] }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'stocks' | 'bonds' | 'realestate'>('all');

    const hasStocks = portfolio.stocks.length > 0;
    const hasBonds = portfolio.bonds.length > 0;
    const hasRealEstate = portfolio.realEstate.length > 0;

    const getCurrentStockPrice = (stockId: number): number => {
        for (const sector of sectors) {
            const found = sector.companies.find(c => c.id === stockId);
            if (found) {
                return found.currentPrice;
            }
        }
        return 0;
    };

    const prepareAssetForSell = (asset: any) => {
        if (asset.type === 'stock') {
            return {
                ...asset,
                currentPrice: getCurrentStockPrice(asset.id)  // добавляем текущую цену
            };
        }
        return asset;
    };

    const getFilteredAssets = () => {
        switch(activeTab) {
            case 'stocks':
                return portfolio.stocks;
            case 'bonds':
                return portfolio.bonds;
            case 'realestate':
                return portfolio.realEstate;
            default:
                return [
                    ...portfolio.stocks,
                    ...portfolio.bonds,
                    ...portfolio.realEstate
                ];
        }
    };

    const getTotalValue = () => {
        const stocks = portfolio.stocks.reduce((sum, s) => {
            const currentPrice = getCurrentStockPrice(s.id);
            return sum + (currentPrice * s.quantity);
        }, 0);

        const bonds = portfolio.bonds.reduce((sum, b) => sum + (b.price * b.quantity), 0);
        const realEstate = portfolio.realEstate.reduce((sum, r) => sum + (r.price * r.quantity), 0);
        const metals = portfolio.metals?.reduce((sum, m) => sum + (m.price * m.quantity), 0) || 0;

        return stocks + bonds + realEstate + metals;
    };

    if (!hasStocks && !hasBonds && !hasRealEstate) {
        return (
            <div className="portfolio-empty">
                <div className="empty-icon">📭</div>
                <h4>Empty Portfolio</h4>
                <p>Start buying assets to build your portfolio</p>
            </div>
        );
    }

    return (
        <div className="portfolio">
            <div className="portfolio-header">
                <h4>Your Portfolio</h4>
                <div className="portfolio-total">
                    Total: ${getTotalValue()}
                </div>
            </div>

            <div className="portfolio-tabs">
                <button
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All ({getFilteredAssets().length})
                </button>
                {hasStocks && (
                    <button
                        className={`tab ${activeTab === 'stocks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stocks')}
                    >
                        Stocks ({portfolio.stocks.length})
                    </button>
                )}
                {hasBonds && (
                    <button
                        className={`tab ${activeTab === 'bonds' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bonds')}
                    >
                        Bonds ({portfolio.bonds.length})
                    </button>
                )}
                {hasRealEstate && (
                    <button
                        className={`tab ${activeTab === 'realestate' ? 'active' : ''}`}
                        onClick={() => setActiveTab('realestate')}
                    >
                        Real Estate ({portfolio.realEstate.length})
                    </button>
                )}
            </div>

            <div className="portfolio-assets">
                {getFilteredAssets().map(asset => (
                    <AssetCard
                        key={`${asset.id}-${asset.type}`}
                        asset={asset.type === 'stock'
                            ? { ...asset, currentPrice: getCurrentStockPrice(asset.id)
                        }
                            : asset
                        }
                        quantity={asset.quantity}
                        onSell={onSell ? () => onSell(prepareAssetForSell(asset)) : undefined}
                    />
                ))}
            </div>
        </div>
    );
};
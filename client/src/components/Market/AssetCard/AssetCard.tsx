import React from 'react';
import { Asset, Stock, Bond, RealEstate, Metal } from '../../../types/game.types';
import { Button } from '../../UI/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import './AssetCard.css';

interface AssetCardProps {
    asset: Asset & { currentPrice?: number };
    onBuy?: (asset: Asset) => void;
    onSell?: (asset: any) => void;
    quantity?: number;
    showActions?: boolean;
    playerBalance?: number;
}

export const AssetCard: React.FC<AssetCardProps> = ({
                                                        asset,
                                                        onBuy,
                                                        onSell,
                                                        quantity = 0,
                                                        showActions = true,
                                                        playerBalance = 0
                                                    }) => {
    const { t } = useLanguage();

    // Получаем цену в зависимости от типа актива
    const getPrice = (): number => {
        // Для акций сначала проверяем currentPrice (переданный из Portfolio)
        if (asset.type === 'stock') {
            if (asset.currentPrice) return asset.currentPrice;
            return (asset as Stock).currentPrice;
        }
        return (asset as Bond | RealEstate | Metal).price;
    };

    // Получаем доход в зависимости от типа актива
    const getIncome = (): number => {
        if (asset.type === 'stock') {
            return (asset as Stock).currentIncome;
        }
        return (asset as Bond | RealEstate | Metal).income;
    };

    const getAssetIcon = () => {
        switch(asset.type) {
            case 'bond': return '📊';
            case 'realestate': return '🏠';
            case 'metal': return '🪙';
            default: return '📈';
        }
    };

    const getAssetTypeLabel = () => {
        switch(asset.type) {
            case 'bond': return t.shorts.bond;
            case 'realestate': return t.shorts.realEstate;
            case 'metal': return t.shorts.metal;
            default: return t.shorts.stock;
        }
    };

    const getRiskLevel = () => {
        switch(asset.type) {
            case 'bond': return 'low';
            case 'realestate': return 'medium';
            case 'metal': return 'low';
            default:
                if ('size' in asset) {
                    if (asset.size === 'large') return 'medium';
                    if (asset.size === 'medium') return 'high';
                    return 'very-high';
                }
                return 'medium';
        }
    };

    const getAssetIncomeName = () => {
        switch (asset.type) {
            case "metal": return t.grow;
            default: return t.income;
        }
    }

    const price = getPrice();
    const income = getIncome();
    const canAfford = playerBalance >= price;

    return (
        <div className={`asset-card ${getRiskLevel()}`}>
            <div className="asset-icon">{getAssetIcon()}&nbsp;</div>

            <div className="asset-info">
                <div className="asset-header">
                    <h4>{asset.name}</h4>
                    <span className="asset-type">{getAssetTypeLabel()}</span>
                </div>

                <div className="asset-details">
                    <div className="detail-item">
                        <span className="label">{t.price}</span>
                        <span className="value price">${price}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">{getAssetIncomeName()}</span>
                        <span className={`value income ${income > 0 ? 'positive' : 'negative'}`}>
              {income}%
            </span>
                    </div>
                    {quantity > 0 && (
                        <div className="detail-item">
                            <span className="label">Quantity</span>
                            <span className="value quantity">{quantity}</span>
                        </div>
                    )}
                </div>

                {showActions && (
                    <div className="asset-actions">
                        {onBuy && (
                            <Button
                                size="small"
                                variant="success"
                                onClick={() => onBuy(asset)}
                                disabled={!canAfford}
                            >
                                {t.buttons.buy}
                            </Button>
                        )}
                        {onSell && quantity > 0 && (
                            <Button
                                size="small"
                                variant="danger"
                                onClick={() => onSell(asset)}
                            >
                                {t.buttons.sell}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
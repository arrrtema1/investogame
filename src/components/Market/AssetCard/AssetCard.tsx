import React from 'react';
import { Asset } from '../../../types/game.types';
import { Button } from '../../UI/Button';
import './AssetCard.css';

interface AssetCardProps {
    asset: Asset;
    onBuy?: (asset: Asset) => void;
    onSell?: (asset: Asset) => void;
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
                                                        playerBalance,
                                                    }) => {
    const canAfford = playerBalance !== undefined && playerBalance >= asset.price;

    const getAssetIcon = () => {
        if (asset.type === 'bond') return '📊';
        if (asset.type === 'realestate') return '🏠';
        if (asset.type === 'metal') return '🪙';
        return '📈';
    };

    const getAssetTypeLabel = () => {
        if (asset.type === 'bond') return 'Bond';
        if (asset.type === 'realestate') return 'Real Estate';
        if (asset.type === 'metal') return 'Metals';
        return 'Stock';
    };

    const getRiskLevel = () => {
        if (asset.type === 'bond') return 'low';
        if (asset.type === 'metal') return 'low';
        if (asset.type === 'realestate') return 'medium';
        return 'high';
    };


    return (
        <div className={`asset-card ${getRiskLevel()}`}>
            <div className="asset-icon">{getAssetIcon()}</div>

            <div className="asset-info">
                <div className="asset-header">
                    <h4>{asset.name}</h4>
                    <span className="asset-type">{getAssetTypeLabel()}</span>
                </div>

                <div className="asset-details">
                    <div className="detail-item">
                        <span className="label">Price</span>
                        <span className="value price">${asset.price}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Income</span>
                        <span className={`value income ${asset.income > 0 ? 'positive' : 'negative'}`}>
              {asset.income}%
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
                            <Button size="small"
                                    variant="success"
                                    onClick={() => onBuy(asset)}
                                    disabled={!canAfford}
                            >
                                Buy
                            </Button>
                        )}
                        {onSell && quantity > 0 && (
                            <Button size="small" variant="danger" onClick={() => onSell(asset)}>
                                Sell
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
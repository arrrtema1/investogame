import React from 'react';
import { Sector } from '../../../types/game.types';
import { SectorCard } from '../SectorCard';
import './MarketPanel.css';

interface MarketPanelProps {
    sectors: Sector[];
    affectedSector?: Sector | null;
    marketType?: 'crisis' | 'growth' | null;
}

export const MarketPanel: React.FC<MarketPanelProps> = ({
                                                            sectors,
                                                            affectedSector,
                                                            marketType
                                                        }) => {
    return (
        <div className="market-panel">
            <div className="market-header">
                <h3>Market Overview</h3>
                {marketType && (
                    <div className={`market-badge ${marketType}`}>
                        {marketType === 'crisis' ? '🔴 CRISIS' : '🟢 GROWTH'}
                    </div>
                )}
            </div>

            <div className="sectors-grid">
                {sectors.map(sector => (
                    <SectorCard
                        key={sector.id}
                        sector={sector}
                        isAffected={sector.id === affectedSector?.id}
                    />
                ))}
            </div>
        </div>
    );
};
import React from 'react';
import { Sector } from '../../../types/game.types';
import './SectorCard.css';

interface SectorCardProps {
    sector: Sector;
    isAffected?: boolean;
}

export const SectorCard: React.FC<SectorCardProps> = ({ sector, isAffected }) => {
    return (
        <div
            className={`sector-card ${isAffected ? 'affected' : ''}`}
            style={{ borderColor: sector.color }}
        >
            <div className="sector-header">
                <h4>{sector.name}</h4>
                {sector.marketType === 'crisis' && (
                    <span className="badge crisis">CRISIS</span>
                )}
                {sector.marketType === 'growth' && (
                    <span className="badge growth">GROWTH</span>
                )}
            </div>

            <div className="companies-list">
                {sector.companies.map(company => (
                    <div key={company.id} className="company-row">
                        <span className="company-name">
                            {company.name}
                            {company.size === 'large' && ' 🏢'}
                            {company.size === 'medium' && ' 🏬'}
                            {company.size === 'small' && ' 🏪'}
                        </span>
                        <span className="company-price">${company.currentPrice}</span>
                        <span className={`company-income ${company.currentIncome > 0 ? 'positive' : 'negative'}`}>
                            {company.currentIncome}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
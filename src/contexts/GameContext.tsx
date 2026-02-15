// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    GameState,
    GamePhase,
    Sector,
    Company,
    Bond,
    RealEstate,
    Asset,
    CompanyWithQuantity,
    BondWithQuantity,
    RealEstateWithQuantity,
    AssetWithQuantity
} from '../types/game.types';
import { INITIAL_SECTORS, INITIAL_BONDS, INITIAL_REAL_ESTATE } from '../data/initialData';

interface GameContextType {
    gameState: GameState;
    setGamePhase: (phase: GamePhase) => void;
    setMarketType: (type: 'crisis' | 'growth' | null) => void;
    setSelectedSector: (sector: Sector | null) => void;
    resetGame: () => void;
    nextYear: () => void;
    applyCrisisEffects: (sector: Sector) => void;
    applyGrowthEffects: (sector: Sector) => void;
    processBankruptcy: (company: Company, diceValue: number) => void;
    buyAsset: (asset: Asset, quantity: number) => void;
    sellAsset: (asset: AssetWithQuantity, quantity: number) => void;
}

const initialState: GameState = {
    currentYear: 1,
    phase: 'coin_flip',
    marketType: null,
    selectedSector: null,
    players: [
        {
            id: 'player1',
            balance: 2000,
            portfolio: {
                stocks: [],
                bonds: [],
                realEstate: []
            },
            totalIncome: 0,
            isReady: false
        }
    ],
    sectors: INITIAL_SECTORS.map(sector => ({
        ...sector,
        companies: sector.companies.map(company => ({
            ...company,
            originalPrice: company.price,
            originalIncome: company.income
        }))
    })),
    availableBonds: INITIAL_BONDS,
    availableRealEstate: INITIAL_REAL_ESTATE
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [gameState, setGameState] = useState<GameState>(initialState);

    const setGamePhase = (phase: GamePhase) => {
        setGameState(prev => ({ ...prev, phase }));
    };

    const setMarketType = (type: 'crisis' | 'growth' | null) => {
        setGameState(prev => ({ ...prev, marketType: type }));
    };

    const setSelectedSector = (sector: Sector | null) => {
        setGameState(prev => ({ ...prev, selectedSector: sector }));
    };

    const resetGame = () => {
        setGameState(initialState);
    };

    const nextYear = () => {
        if (gameState.currentYear < 10) {
            setGameState(prev => {
                const restoredSectors = prev.sectors.map(sector => ({
                    ...sector,
                    isAffected: false,
                    marketType: undefined,
                    companies: sector.companies.map(company => ({
                        ...company,
                        price: company.originalPrice || company.price,
                        income: company.originalIncome || company.income,
                        isBankrupt: false,
                        diceValue: undefined
                    }))
                }));

                return {
                    ...prev,
                    currentYear: prev.currentYear + 1,
                    phase: 'coin_flip' as GamePhase,
                    marketType: null,
                    selectedSector: null,
                    sectors: restoredSectors,
                    players: prev.players.map(player => ({
                        ...player,
                        isReady: false
                    }))
                };
            });
        }
    };

    const applyCrisisEffects = (sector: Sector) => {
        setGameState(prev => {
            const updatedSectors = prev.sectors.map(s => {
                if (s.id === sector.id) {
                    return {
                        ...s,
                        isAffected: true,
                        marketType: 'crisis' as const,
                        companies: s.companies.map(company => ({
                            ...company,
                            price: Math.floor((company.originalPrice || company.price) * 0.8),
                            income: Math.floor((company.originalIncome || company.income) * 0.7)
                        }))
                    };
                }
                return s;
            });

            return {
                ...prev,
                sectors: updatedSectors,
                phase: 'crisis_dice' as GamePhase
            };
        });
    };

    const applyGrowthEffects = (sector: Sector) => {
        setGameState(prev => {
            const updatedSectors = prev.sectors.map(s => {
                if (s.id === sector.id) {
                    return {
                        ...s,
                        isAffected: true,
                        marketType: 'growth' as const,
                        companies: s.companies.map(company => ({
                            ...company,
                            price: Math.floor((company.originalPrice || company.price) * 1.2),
                            income: Math.floor((company.originalIncome || company.income) * 1.15)
                        }))
                    };
                }
                return s;
            });

            return {
                ...prev,
                sectors: updatedSectors,
                phase: 'trading' as GamePhase
            };
        });
    };

    const processBankruptcy = (company: Company, diceValue: number) => {
        setGameState(prev => {
            const updatedSectors = prev.sectors.map(sector => {
                if (sector.id === company.sectorId) {
                    return {
                        ...sector,
                        companies: sector.companies.map(c => {
                            if (c.id === company.id) {
                                const threshold = c.size === 'large' ? 5 : c.size === 'medium' ? 4 : 3;
                                const isBankrupt = diceValue >= threshold;
                                return {
                                    ...c,
                                    diceValue,
                                    isBankrupt,
                                    price: isBankrupt ? 0 : c.price
                                };
                            }
                            return c;
                        })
                    };
                }
                return sector;
            });

            return {
                ...prev,
                sectors: updatedSectors
            };
        });
    };

    const buyAsset = (asset: Asset, quantity: number) => {
        setGameState(prev => {
            const player = prev.players[0];
            const totalCost = asset.price * quantity;

            if (player.balance >= totalCost) {
                let updatedPortfolio = { ...player.portfolio };

                if (asset.type === 'bond') {
                    const bondWithQuantity: BondWithQuantity = {
                        ...asset as Bond,
                        quantity
                    };
                    updatedPortfolio.bonds = [...player.portfolio.bonds, bondWithQuantity];
                } else if (asset.type === 'realestate') {
                    const realEstateWithQuantity: RealEstateWithQuantity = {
                        ...asset as RealEstate,
                        quantity
                    };
                    updatedPortfolio.realEstate = [...player.portfolio.realEstate, realEstateWithQuantity];
                } else {
                    const companyWithQuantity: CompanyWithQuantity = {
                        ...asset as Company,
                        quantity
                    };
                    updatedPortfolio.stocks = [...player.portfolio.stocks, companyWithQuantity];
                }

                const updatedPlayer = {
                    ...player,
                    balance: player.balance - totalCost,
                    portfolio: updatedPortfolio
                };

                return {
                    ...prev,
                    players: [updatedPlayer, ...prev.players.slice(1)]
                };
            }
            return prev;
        });
    };

    const sellAsset = (asset: AssetWithQuantity, quantity: number) => {
        setGameState(prev => {
            const player = prev.players[0];

            if (asset.type === 'bond') {
                const assetIndex = player.portfolio.bonds.findIndex(a => a.id === asset.id);
                if (assetIndex !== -1) {
                    const currentAsset = player.portfolio.bonds[assetIndex];
                    const newQuantity = currentAsset.quantity - quantity;

                    let updatedBonds: BondWithQuantity[];
                    if (newQuantity <= 0) {
                        updatedBonds = player.portfolio.bonds.filter((_, i) => i !== assetIndex);
                    } else {
                        updatedBonds = [...player.portfolio.bonds];
                        updatedBonds[assetIndex] = { ...currentAsset, quantity: newQuantity };
                    }

                    const updatedPlayer = {
                        ...player,
                        balance: player.balance + (asset.price * quantity),
                        portfolio: {
                            ...player.portfolio,
                            bonds: updatedBonds
                        }
                    };

                    return {
                        ...prev,
                        players: [updatedPlayer, ...prev.players.slice(1)]
                    };
                }
            } else if (asset.type === 'realestate') {
                const assetIndex = player.portfolio.realEstate.findIndex(a => a.id === asset.id);
                if (assetIndex !== -1) {
                    const currentAsset = player.portfolio.realEstate[assetIndex];
                    const newQuantity = currentAsset.quantity - quantity;

                    let updatedRealEstate: RealEstateWithQuantity[];
                    if (newQuantity <= 0) {
                        updatedRealEstate = player.portfolio.realEstate.filter((_, i) => i !== assetIndex);
                    } else {
                        updatedRealEstate = [...player.portfolio.realEstate];
                        updatedRealEstate[assetIndex] = { ...currentAsset, quantity: newQuantity };
                    }

                    const updatedPlayer = {
                        ...player,
                        balance: player.balance + (asset.price * quantity),
                        portfolio: {
                            ...player.portfolio,
                            realEstate: updatedRealEstate
                        }
                    };

                    return {
                        ...prev,
                        players: [updatedPlayer, ...prev.players.slice(1)]
                    };
                }
            } else {
                const assetIndex = player.portfolio.stocks.findIndex(a => a.id === asset.id);
                if (assetIndex !== -1) {
                    const currentAsset = player.portfolio.stocks[assetIndex];
                    const newQuantity = currentAsset.quantity - quantity;

                    let updatedStocks: CompanyWithQuantity[];
                    if (newQuantity <= 0) {
                        updatedStocks = player.portfolio.stocks.filter((_, i) => i !== assetIndex);
                    } else {
                        updatedStocks = [...player.portfolio.stocks];
                        updatedStocks[assetIndex] = { ...currentAsset, quantity: newQuantity };
                    }

                    const updatedPlayer = {
                        ...player,
                        balance: player.balance + (asset.price * quantity),
                        portfolio: {
                            ...player.portfolio,
                            stocks: updatedStocks
                        }
                    };

                    return {
                        ...prev,
                        players: [updatedPlayer, ...prev.players.slice(1)]
                    };
                }
            }

            return prev;
        });
    };

    return (
        <GameContext.Provider value={{
            gameState,
            setGamePhase,
            setMarketType,
            setSelectedSector,
            resetGame,
            nextYear,
            applyCrisisEffects,
            applyGrowthEffects,
            processBankruptcy,
            buyAsset,
            sellAsset
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    GameState,
    GamePhase,
    Sector,
    Stock,
    Bond,
    RealEstate,
    Metal,
    Asset,
    StockWithQuantity,
    BondWithQuantity,
    RealEstateWithQuantity,
    MetalWithQuantity,
    AssetWithQuantity
} from '../types/game.types';
import { INITIAL_SECTORS, INITIAL_BONDS, INITIAL_REAL_ESTATE, INITIAL_METALS } from '../data/initialData';
import { GAME_CONSTANTS } from '../data/constants';

interface GameContextType {
    gameState: GameState;
    setGamePhase: (phase: GamePhase) => void;
    setMarketType: (type: 'crisis' | 'growth' | null) => void;
    setSelectedSector: (sector: Sector | null) => void;
    nextYear: () => void;
    applyCrisisEffects: (sector: Sector) => void;
    applyGrowthEffects: (sector: Sector) => void;
    processBankruptcy: (stock: Stock, diceValue: number) => void;
    buyAsset: (asset: Asset, quantity: number) => void;
    sellAsset: (asset: AssetWithQuantity, quantity: number) => void;
    initializeNewGame: (playerName: string, startingBalance: number) => void;
}

const initialState: GameState = {
    currentYear: 1,
    phase: 'trading',
    marketType: null,
    selectedSector: null,
    players: [
        {
            id: 'player1',
            name: '',
            balance: GAME_CONSTANTS.STARTING_BALANCE,
            portfolio: {
                stocks: [],
                bonds: [],
                realEstate: [],
                metals: []
            },
            totalIncome: 0,
            isReady: false
        }
    ],
    sectors: INITIAL_SECTORS.map(sector => ({
        ...sector,
        companies: sector.companies.map(stock => ({
            ...stock,
            originalPrice: stock.basePrice,
            originalIncome: stock.baseIncome
        }))
    })),
    availableBonds: INITIAL_BONDS,
    availableRealEstate: INITIAL_REAL_ESTATE,
    availableMetals: INITIAL_METALS
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

    const nextYear = () => {
        if (gameState.currentYear < 10) {
            setGameState(prev => {
                // Восстанавливаем базовые цены, но сохраняем банкротство
                const resetSectors = prev.sectors.map(sector => ({
                    ...sector,
                    isAffected: false,
                    marketType: undefined,
                    companies: sector.companies.map(stock => {
                        // Если компания банкрот - оставляем как есть (цена 0, доход 0)
                        if (stock.isBankrupt) {
                            return {
                                ...stock,
                                diceValue: undefined
                            };
                        }

                        // Для живых компаний - возвращаем базовые цены
                        return {
                            ...stock,
                            currentPrice: stock.basePrice,
                            currentIncome: stock.baseIncome,
                            diceValue: undefined
                        };
                    })
                }));

                return {
                    ...prev,
                    currentYear: prev.currentYear + 1,
                    phase: 'coin_flip' as GamePhase,
                    marketType: null,
                    selectedSector: null,
                    sectors: resetSectors,
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
                        companies: s.companies.map(stock => {
                            // Пропускаем банкротные компании
                            if (stock.isBankrupt) return stock;

                            let priceMultiplier = 1.0;
                            switch(stock.size) {
                                case 'small': priceMultiplier = 0.85; break;
                                case 'medium': priceMultiplier = 0.90; break;
                                case 'large': priceMultiplier = 0.95; break;
                            }

                            return {
                                ...stock,
                                currentPrice: Math.floor(stock.basePrice * priceMultiplier),
                                currentIncome: 0
                            };
                        })
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
                        companies: s.companies.map(stock => {
                            let priceMultiplier = 1.0;
                            let incomeBonus = 0;

                            switch(stock.size) {
                                case 'small':
                                    priceMultiplier = 1.15;
                                    incomeBonus = 15;
                                    break;
                                case 'medium':
                                    priceMultiplier = 1.10;
                                    incomeBonus = 10;
                                    break;
                                case 'large':
                                    priceMultiplier = 1.05;
                                    incomeBonus = 5;
                                    break;
                            }

                            return {
                                ...stock,
                                currentPrice: Math.floor(stock.basePrice * priceMultiplier),
                                currentIncome: stock.baseIncome + incomeBonus
                            };
                        })
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

    const processBankruptcy = (stock: Stock, diceValue: number) => {
        setGameState(prev => {
            // Определяем, банкрот или нет
            const threshold = stock.size === 'large' ? 5 : stock.size === 'medium' ? 4 : 3;
            const isBankrupt = diceValue >= threshold;

            // Обновляем компанию в секторе
            const updatedSectors = prev.sectors.map(sector => {
                if (sector.id === stock.sectorId) {
                    return {
                        ...sector,
                        companies: sector.companies.map(c => {
                            if (c.id === stock.id) {
                                return {
                                    ...c,
                                    diceValue,
                                    isBankrupt,
                                    // Если банкрот - цена 0, доход 0
                                    currentPrice: isBankrupt ? 0 : c.currentPrice,
                                    currentIncome: isBankrupt ? 0 : c.currentIncome
                                };
                            }
                            return c;
                        })
                    };
                }
                return sector;
            });

            // Если компания банкрот - удаляем из портфеля игрока
            const updatedPlayers = isBankrupt
                ? prev.players.map(player => ({
                    ...player,
                    portfolio: {
                        ...player.portfolio,
                        stocks: player.portfolio.stocks.filter(s => s.id !== stock.id)
                    }
                }))
                : prev.players;

            return {
                ...prev,
                sectors: updatedSectors,
                players: updatedPlayers
            };
        });
    };

    const buyAsset = (asset: Asset, quantity: number) => {
        setGameState(prev => {
            const player = prev.players[0];

            // Получаем цену в зависимости от типа актива
            let price = 0;
            if (asset.type === 'stock') {
                price = (asset as Stock).currentPrice;
            } else if (asset.type === 'bond') {
                price = (asset as Bond).price;
            } else if (asset.type === 'realestate') {
                price = (asset as RealEstate).price;
            } else if (asset.type === 'metal') {
                price = (asset as Metal).price;
            }

            const totalCost = price * quantity;

            if (player.balance >= totalCost) {
                let updatedPortfolio = { ...player.portfolio };

                if (asset.type === 'bond') {
                    const existingBondIndex = player.portfolio.bonds.findIndex(b => b.id === asset.id);

                    if (existingBondIndex >= 0) {
                        const updatedBonds = [...player.portfolio.bonds];
                        updatedBonds[existingBondIndex] = {
                            ...updatedBonds[existingBondIndex],
                            quantity: updatedBonds[existingBondIndex].quantity + quantity
                        };
                        updatedPortfolio.bonds = updatedBonds;
                    } else {
                        const bondWithQuantity: BondWithQuantity = {
                            ...(asset as Bond),
                            quantity
                        };
                        updatedPortfolio.bonds = [...player.portfolio.bonds, bondWithQuantity];
                    }
                }
                else if (asset.type === 'realestate') {
                    const existingREIndex = player.portfolio.realEstate.findIndex(r => r.id === asset.id);

                    if (existingREIndex >= 0) {
                        const updatedRE = [...player.portfolio.realEstate];
                        updatedRE[existingREIndex] = {
                            ...updatedRE[existingREIndex],
                            quantity: updatedRE[existingREIndex].quantity + quantity
                        };
                        updatedPortfolio.realEstate = updatedRE;
                    } else {
                        const realEstateWithQuantity: RealEstateWithQuantity = {
                            ...(asset as RealEstate),
                            quantity
                        };
                        updatedPortfolio.realEstate = [...player.portfolio.realEstate, realEstateWithQuantity];
                    }
                }
                else if (asset.type === 'metal') {
                    const existingMetalsIndex = player.portfolio.metals.findIndex(r => r.id === asset.id);

                    if (existingMetalsIndex >= 0) {
                        const updatedMetals = [...player.portfolio.metals];
                        updatedMetals[existingMetalsIndex] = {
                            ...updatedMetals[existingMetalsIndex],
                            quantity: updatedMetals[existingMetalsIndex].quantity + quantity
                        };
                        updatedPortfolio.metals = updatedMetals;
                    } else {
                        const metalWithQuantity: MetalWithQuantity = {
                            ...(asset as Metal),
                            quantity
                        };
                        updatedPortfolio.metals = [...player.portfolio.metals, metalWithQuantity];
                    }
                }
                else {
                    // Для акций
                    const existingStockIndex = player.portfolio.stocks.findIndex(s => s.id === asset.id);

                    if (existingStockIndex >= 0) {
                        const updatedStocks = [...player.portfolio.stocks];
                        updatedStocks[existingStockIndex] = {
                            ...updatedStocks[existingStockIndex],
                            quantity: updatedStocks[existingStockIndex].quantity + quantity
                        };
                        updatedPortfolio.stocks = updatedStocks;
                    } else {
                        const stockWithQuantity: StockWithQuantity = {
                            ...(asset as Stock),
                            quantity
                        };
                        updatedPortfolio.stocks = [...player.portfolio.stocks, stockWithQuantity];
                    }
                }

                const updatedPlayer = {
                    ...player,
                    balance: player.balance - totalCost,
                    portfolio: updatedPortfolio
                };

                console.log(`Bought ${asset.name} x${quantity} for $${totalCost}`);

                return {
                    ...prev,
                    players: [updatedPlayer, ...prev.players.slice(1)]
                };
            } else {
                console.log(`Недостаточно средств! Нужно $${totalCost}, есть $${player.balance}`);
                return prev;
            }
        });
    };

    const sellAsset = (asset: AssetWithQuantity, quantity: number) => {
        setGameState(prev => {
            const player = prev.players[0];

            // Получаем цену в зависимости от типа актива
            let price = 0;
            if (asset.type === 'stock') {
                // Для акций нужно найти текущую цену в секторах
                for (const sector of prev.sectors) {
                    const found = sector.companies.find(c => c.id === asset.id);
                    if (found) {
                        price = found.currentPrice;
                        break;
                    }
                }
            } else if (asset.type === 'bond') {
                const found = prev.availableBonds.find(b => b.id === asset.id);
                if (found) price = found.price;
            } else if (asset.type === 'realestate') {
                const found = prev.availableRealEstate.find(r => r.id === asset.id);
                if (found) price = found.price;
            } else if (asset.type === 'metal') {
                const found = prev.availableMetals.find(m => m.id === asset.id);
                if (found) price = found.price;
            }

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
                        balance: player.balance + (price * quantity),
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
                        balance: player.balance + (price * quantity),
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
            } else if (asset.type === 'metal') {
                const assetIndex = player.portfolio.metals.findIndex(a => a.id === asset.id);
                if (assetIndex !== -1) {
                    const currentAsset = player.portfolio.metals[assetIndex];
                    const newQuantity = currentAsset.quantity - quantity;

                    let updatedMetals: MetalWithQuantity[];
                    if (newQuantity <= 0) {
                        updatedMetals = player.portfolio.metals.filter((_, i) => i !== assetIndex);
                    } else {
                        updatedMetals = [...player.portfolio.metals];
                        updatedMetals[assetIndex] = { ...currentAsset, quantity: newQuantity };
                    }

                    const updatedPlayer = {
                        ...player,
                        balance: player.balance + (price * quantity),
                        portfolio: {
                            ...player.portfolio,
                            metals: updatedMetals
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

                    let updatedStocks: StockWithQuantity[];
                    if (newQuantity <= 0) {
                        updatedStocks = player.portfolio.stocks.filter((_, i) => i !== assetIndex);
                    } else {
                        updatedStocks = [...player.portfolio.stocks];
                        updatedStocks[assetIndex] = { ...currentAsset, quantity: newQuantity };
                    }

                    const updatedPlayer = {
                        ...player,
                        balance: player.balance + (price * quantity),
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

    const initializeNewGame = (playerName: string, startingBalance: number) => {
        setGameState({
            ...initialState,
            players: [
                {
                    id: 'player1',
                    name: playerName,
                    balance: startingBalance,
                    portfolio: {
                        stocks: [],
                        bonds: [],
                        realEstate: [],
                        metals: []
                    },
                    totalIncome: 0,
                    isReady: false
                }
            ]
        });
    };

    return (
        <GameContext.Provider value={{
            gameState,
            setGamePhase,
            setMarketType,
            setSelectedSector,
            nextYear,
            applyCrisisEffects,
            applyGrowthEffects,
            processBankruptcy,
            buyAsset,
            sellAsset,
            initializeNewGame
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
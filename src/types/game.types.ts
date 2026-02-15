// src/types/game.types.ts

export type CompanySize = 'large' | 'medium' | 'small';
export type GamePhase = 'coin_flip' | 'sector_select' | 'crisis_dice' | 'trading' | 'income' | 'year_end';
export type AssetType = 'stock' | 'bond' | 'realestate';

export interface Company {
    id: number;
    name: string;
    price: number;
    income: number;
    size: CompanySize;
    sectorId: number;
    isBankrupt?: boolean;
    diceValue?: number;
    originalPrice?: number;
    originalIncome?: number;
    type: 'stock';
}

export interface CompanyWithQuantity extends Company {
    quantity: number;
}

export interface Sector {
    id: number;
    name: string;
    color: string;
    companies: Company[];
    isAffected?: boolean;
    marketType?: 'crisis' | 'growth';
}

export interface Bond {
    id: number;
    name: string;
    price: number;
    income: number;
    type: 'bond';
}

export interface BondWithQuantity extends Bond {
    quantity: number;
}

export interface RealEstate {
    id: number;
    name: string;
    price: number;
    income: number;
    type: 'realestate';
}

export interface RealEstateWithQuantity extends RealEstate {
    quantity: number;
}

export type Asset = Company | Bond | RealEstate;
export type AssetWithQuantity = CompanyWithQuantity | BondWithQuantity | RealEstateWithQuantity;

export interface Portfolio {
    stocks: CompanyWithQuantity[];
    bonds: BondWithQuantity[];
    realEstate: RealEstateWithQuantity[];
}

export interface Player {
    id: string;
    balance: number;
    portfolio: Portfolio;
    totalIncome: number;
    isReady?: boolean;
}

export interface GameState {
    currentYear: number;
    phase: GamePhase;
    marketType: 'crisis' | 'growth' | null;
    selectedSector: Sector | null;
    players: Player[];
    sectors: Sector[];
    availableBonds: Bond[];
    availableRealEstate: RealEstate[];
    diceResults?: {
        coinFlip: 'crisis' | 'growth';
        selectedSector: Sector;
        diceRolls?: Array<{
            companyId: number;
            value: number;
            isBankrupt: boolean;
        }>;
    };
}
export type CompanySize = 'large' | 'medium' | 'small';
export type GamePhase = 'coin_flip' | 'sector_select' | 'crisis_dice' | 'trading' | 'income' | 'year_end';
export type AssetType = 'stock' | 'bond' | 'realestate' | 'metal';

// Для акций (с изменяемой ценой)
export interface Stock {
    id: number;
    name: string;
    basePrice: number;
    baseIncome: number;
    currentPrice: number;
    currentIncome: number;
    size: CompanySize;
    sectorId: number;
    isBankrupt?: boolean;
    diceValue?: number;
    type: 'stock';
    quantity?: number;
}

// Для облигаций (фиксированная цена)
export interface Bond {
    id: number;
    name: string;
    price: number;      // фиксированная цена
    income: number;     // фиксированный доход
    type: 'bond';
    quantity?: number;
}

// Для недвижимости (фиксированная цена)
export interface RealEstate {
    id: number;
    name: string;
    price: number;      // фиксированная цена
    income: number;     // фиксированный доход
    type: 'realestate';
    quantity?: number;
}

// Для металлов (фиксированная цена)
export interface Metal {
    id: number;
    name: string;
    price: number;      // фиксированная цена
    income: number;     // фиксированный доход
    type: 'metal';
    quantity?: number;
}

// Объединенный тип для всех активов
export type Asset = Stock | Bond | RealEstate | Metal;

// Типы с quantity для портфеля
export interface StockWithQuantity extends Stock {
    quantity: number;
}

export interface BondWithQuantity extends Bond {
    quantity: number;
}

export interface RealEstateWithQuantity extends RealEstate {
    quantity: number;
}

export interface MetalWithQuantity extends Metal {
    quantity: number;
}

export type AssetWithQuantity = StockWithQuantity | BondWithQuantity | RealEstateWithQuantity | MetalWithQuantity;

export interface Sector {
    id: number;
    name: string;
    color: string;
    companies: Stock[];  // только акции в секторах
    isAffected?: boolean;
    marketType?: 'crisis' | 'growth';
}

export interface Portfolio {
    stocks: StockWithQuantity[];
    bonds: BondWithQuantity[];
    realEstate: RealEstateWithQuantity[];
    metals: MetalWithQuantity[];
}

export interface Player {
    id: string;
    name: string;
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
    availableMetals: Metal[];
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
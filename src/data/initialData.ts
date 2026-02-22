import {Sector, Bond, RealEstate, Metal} from '../types/game.types';

export const INITIAL_SECTORS: Sector[] = [
    {
        id: 1,
        name: 'Automakers',
        color: 'red',
        companies: [
            { id: 101, name: 'Toyota', price: 3000, income: 10, size: 'large', sectorId: 2, type: 'stock' },
            { id: 102, name: 'Ford', price: 2200, income: 10, size: 'large', sectorId: 2, type: 'stock' },
            { id: 103, name: 'Tesla', price: 1500, income: 10, size: 'medium', sectorId: 2, type: 'stock' }
        ]
    },
    {
        id: 2,
        name: 'IT Development',
        color: 'orange',
        companies: [
            { id: 201, name: 'Google', price: 2500, income: 15, size: 'large', sectorId: 1, type: 'stock' },
            { id: 202, name: 'OpenAI', price: 1500, income: 20, size: 'medium', sectorId: 1, type: 'stock' },
            { id: 203, name: 'JetBrains', price: 1000, income: 25, size: 'small', sectorId: 1, type: 'stock' }
        ]
    },
    {
        id: 3,
        name: 'Oil companies',
        color: 'black',
        companies: [
            { id: 301, name: 'ExxonMobil', price: 3500, income: 10, size: 'large', sectorId: 3, type: 'stock' },
            { id: 302, name: 'EOG Resources', price: 3000, income: 10, size: 'large', sectorId: 3, type: 'stock' }
        ]
    },
    {
        id: 4,
        name: 'Furniture retailers',
        color: 'violet',
        companies: [
            { id: 401, name: 'HomeDepot', price: 750, income: 5, size: 'medium', sectorId: 4, type: 'stock' },
            { id: 402, name: 'OBI', price: 500, income: 7.5, size: 'small', sectorId: 4, type: 'stock' }
        ]
    }
];

export const INITIAL_REAL_ESTATE: RealEstate[] = [
    { id: 701, name: 'Small Flat', price: 1250, income: 15, type: 'realestate' },
    { id: 702, name: 'Big Flat', price: 2500, income: 15, type: 'realestate' },
    { id: 703, name: 'Shop', price: 4000, income: 20, type: 'realestate' },
    { id: 704, name: 'House', price: 6000, income: 25, type: 'realestate' },
    { id: 705, name: 'Warehouse', price: 7500, income: 30, type: 'realestate' },
    { id: 706, name: 'Building', price: 10000, income: 35, type: 'realestate' }
];


export const INITIAL_BONDS: Bond[] = [
    { id: 801, name: 'Gov. Bond', price: 1000, income: 10, type: 'bond' },
    { id: 802, name: 'Walmart', price: 1500, income: 10, type: 'bond' },
    { id: 803, name: 'Construction Co.', price: 2000, income: 10, type: 'bond' }
];

export const INITIAL_METALS: Metal[] = [
    { id: 901, name: 'Silver', price: 500, income: 10, type: 'metal' },
    { id: 902, name: 'Palladium', price: 2000, income: 10, type: 'metal' },
    { id: 903, name: 'Platinum', price: 2500, income: 10, type: 'metal' },
    { id: 904, name: 'Gold', price: 6000, income: 5, type: 'metal' }
];

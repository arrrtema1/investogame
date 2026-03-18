import { Sector, Bond, RealEstate, Metal } from '../types/game.types';
import { translations, Language } from './translations';

// Функция для получения переведенных названий
export const getTranslatedSectors = (lang: Language): Sector[] => {
    const t = translations[lang];

    return [
        {
            id: 1,
            name: t.sectors.automakers,  // перевод названия сектора
            color: 'red',
            companies: [
                {
                    id: 101,
                    name: t.names.automakers[1],  // Toyota / Toyota
                    basePrice: 3000,
                    baseIncome: 10,
                    currentPrice: 3000,
                    currentIncome: 10,
                    size: 'large',
                    sectorId: 1,
                    type: 'stock'
                },
                {
                    id: 102,
                    name: t.names.automakers[2],  // Ford / Ford
                    basePrice: 2200,
                    baseIncome: 10,
                    currentPrice: 2200,
                    currentIncome: 10,
                    size: 'large',
                    sectorId: 1,
                    type: 'stock'
                },
                {
                    id: 103,
                    name: t.names.automakers[3],  // Лада / Tesla
                    basePrice: 1500,
                    baseIncome: 10,
                    currentPrice: 1500,
                    currentIncome: 10,
                    size: 'medium',
                    sectorId: 1,
                    type: 'stock'
                }
            ]
        },
        {
            id: 2,
            name: t.sectors.development,  // IT Development / Разработка ПО
            color: 'orange',
            companies: [
                {
                    id: 201,
                    name: t.names.development[1],  // Яндекс / Google
                    basePrice: 2500,
                    baseIncome: 15,
                    currentPrice: 2500,
                    currentIncome: 15,
                    size: 'large',
                    sectorId: 2,
                    type: 'stock'
                },
                {
                    id: 202,
                    name: t.names.development[2],  // ВК / OpenAI
                    basePrice: 1500,
                    baseIncome: 20,
                    currentPrice: 1500,
                    currentIncome: 20,
                    size: 'medium',
                    sectorId: 2,
                    type: 'stock'
                },
                {
                    id: 203,
                    name: t.names.development[3],  // Касперский / JetBrains
                    basePrice: 1000,
                    baseIncome: 25,
                    currentPrice: 1000,
                    currentIncome: 25,
                    size: 'small',
                    sectorId: 2,
                    type: 'stock'
                }
            ]
        },
        {
            id: 3,
            name: t.sectors.oil,  // Oil companies / Нефтяные компании
            color: 'black',
            companies: [
                {
                    id: 301,
                    name: t.names.oil[1],  // Газпром / ExxonMobil
                    basePrice: 3500,
                    baseIncome: 10,
                    currentPrice: 3500,
                    currentIncome: 10,
                    size: 'large',
                    sectorId: 3,
                    type: 'stock'
                },
                {
                    id: 302,
                    name: t.names.oil[2],  // Лукойл / EOG Resources
                    basePrice: 3000,
                    baseIncome: 10,
                    currentPrice: 3000,
                    currentIncome: 10,
                    size: 'large',
                    sectorId: 3,
                    type: 'stock'
                }
            ]
        },
        {
            id: 4,
            name: t.sectors.furniture,  // Furniture retailers / Мебельные магазины
            color: 'violet',
            companies: [
                {
                    id: 401,
                    name: t.names.furniture[1],  // IKEA / HomeDepot
                    basePrice: 750,
                    baseIncome: 5,
                    currentPrice: 750,
                    currentIncome: 5,
                    size: 'medium',
                    sectorId: 4,
                    type: 'stock'
                },
                {
                    id: 402,
                    name: t.names.furniture[2],  // OBI / OBI
                    basePrice: 500,
                    baseIncome: 7.5,
                    currentPrice: 500,
                    currentIncome: 7.5,
                    size: 'small',
                    sectorId: 4,
                    type: 'stock'
                }
            ]
        }
    ];
};

// Недвижимость с переводом
export const getTranslatedRealEstate = (lang: Language): RealEstate[] => {
    const t = translations[lang];

    return [
        { id: 701, name: t.realEstate.smallFlat, price: 1250, income: 15, type: 'realestate' },
        { id: 702, name: t.realEstate.bigFlat, price: 2500, income: 15, type: 'realestate' },
        { id: 703, name: t.realEstate.shop, price: 4000, income: 20, type: 'realestate' },
        { id: 704, name: t.realEstate.house, price: 6000, income: 25, type: 'realestate' },
        { id: 705, name: t.realEstate.warehouse, price: 7500, income: 30, type: 'realestate' },
        { id: 706, name: t.realEstate.building, price: 10000, income: 35, type: 'realestate' }
    ];
};

// Облигации с переводом
export const getTranslatedBonds = (lang: Language): Bond[] => {
    const t = translations[lang];

    return [
        { id: 801, name: t.bonds.gov, price: 1000, income: 10, type: 'bond' },
        { id: 802, name: t.bonds.walmart, price: 1500, income: 10, type: 'bond' },
        { id: 803, name: t.bonds.construction, price: 2000, income: 10, type: 'bond' }
    ];
};

// Металлы с переводом
export const getTranslatedMetals = (lang: Language): Metal[] => {
    const t = translations[lang];

    return [
        { id: 901, name: t.metals.silver, price: 500, income: 10, type: 'metal' },
        { id: 902, name: t.metals.palladium, price: 2000, income: 10, type: 'metal' },
        { id: 903, name: t.metals.platinum, price: 2500, income: 10, type: 'metal' },
        { id: 904, name: t.metals.gold, price: 6000, income: 5, type: 'metal' }
    ];
};
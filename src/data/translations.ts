// src/data/translations.ts

export type Language = 'en' | 'ru';

export const translations = {
    en: {
        // Стартовое меню
        yourName: 'Your name:',
        gameSettings: 'Game settings',
        hideSettings: 'Hide settings',
        startingBalance: 'Starting balance',
        startGame: 'Start game',
        howToPlay: 'How to play',
        startWith: 'Start with $',
        playYears: 'Play {years} years',
        buyStocks: 'Buy stocks, bonds, and real estate',
        earnIncome: 'Earn income from your investments',
        goal: 'Goal: have more than ${money} after {years} years',
        allRightsReserved: 'All rights reserved',

        // Игровой интерфейс
        player: 'Player',
        year: 'Year',
        income: 'Income',
        assets: 'Assets',
        phase: {
            trading: '💹 Trading Session',
            coin_flip: '🎲 Coin Flip',
            sector_select: '🎯 Sector Selection',
            crisis_dice: '⚡ Crisis - Dice Roll',
            income: '💰 Income',
            year_end: '📊 Year End',
        },
        marketType: {
            crisis: '🔴 Crisis in one sector',
            growth: '🟢 Growth in all sectors',
        },

        // Вкладки
        tabs: {
            stocks: 'Stocks',
            bonds: 'Bonds',
            realEstate: 'Real Estate',
            metals: 'Metals',
            portfolio: 'Portfolio',
        },

        // Кнопки
        buttons: {
            buy: 'Buy',
            sell: 'Sell',
            nextYear: 'Ready',
            flipCoin: 'Flip Coin',
            continue: 'Continue',
        },

        // Портфолио
        portfolio: {
            cash: 'Cash',
            totalValue: 'Total Value',
            empty: 'No assets yet. Start trading!',
        },

        // Кризис
        crisis: {
            title: '⚡ CRISIS IN {sector} ⚡',
            description: 'Rolling dice for each company...',
        },

        // Язык
        language: 'Language',
    },

    ru: {
        // Стартовое меню
        yourName: 'Ваше имя:',
        gameSettings: 'Настройки',
        hideSettings: 'Скрыть',
        startingBalance: 'Начальный баланс',
        startGame: 'Начать игру',
        howToPlay: 'Как играть',
        startWith: 'Начинаете с $',
        playYears: 'Играете {years} лет',
        buyStocks: 'Покупайте акции, облигации и недвижимость',
        earnIncome: 'Получайте доход от инвестиций',
        goal: 'Цель: иметь более ${money} к концу игры (через {years} лет)',
        allRightsReserved: 'Все права защищены',

        // Игровой интерфейс
        player: 'Игрок',
        year: 'Год',
        income: 'Доход',
        assets: 'Активы',
        phase: {
            trading: '💹 Торговая сессия',
            coin_flip: '🎲 Бросок монетки',
            sector_select: '🎯 Выбор сектора',
            crisis_dice: '⚡ Кризис - Бросок кубиков',
            income: '💰 Получение дохода',
            year_end: '📊 Конец года',
        },
        marketType: {
            crisis: '🔴 Кризис в одном секторе',
            growth: '🟢 Рост во всех секторах',
        },

        // Вкладки
        tabs: {
            stocks: 'Акции',
            bonds: 'Облигации',
            realEstate: 'Недвижимость',
            metals: 'Металлы',
            portfolio: 'Портфолио',
        },

        // Кнопки
        buttons: {
            buy: 'Купить',
            sell: 'Продать',
            nextYear: 'Готов',
            flipCoin: 'Бросить монетку',
            continue: 'Продолжить',
        },

        // Портфолио
        portfolio: {
            cash: 'Наличными',
            totalValue: 'Общая стоимость',
            empty: 'Нет активов. Начните торговать!',
        },

        // Кризис
        crisis: {
            title: '⚡ КРИЗИС В {sector} ⚡',
            description: 'Бросок кубиков для каждой компании...',
        },

        // Язык
        language: 'Язык',
    },
};

export type Translation = typeof translations.en;
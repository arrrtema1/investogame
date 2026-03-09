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
        controls: 'Controls',
        phase: {
            coin_flip: '🎲 Coin flip',
            sector_select: '🎯 Selecting sector',
            crisis_dice: '⚡ Choosing what company has crisis',
            income: '💰 Generating income',
            trading: '💹 Trading',
            year_end: '📊 End of the year',
        },
        marketType: {
            crisis: '🔴 Crisis in one sector',
            growth: '🟢 Growth in one sector',
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
        goal: 'Цель: иметь более ${money} через {years} лет',
        allRightsReserved: 'Все права защищены',

        // Игровой интерфейс
        player: 'Игрок',
        year: 'Год',
        income: 'Доход',
        assets: 'Активов',
        controls: 'Управление',
        phase: {
            coin_flip: '🎲 Бросок монетки',
            sector_select: '🎯 Выбор сектора',
            crisis_dice: '⚡ Определение у какой компании кризис',
            income: '💰 Получение дохода',
            trading: '💹 Торговля',
            year_end: '📊 Конец года',
        },
        marketType: {
            crisis: '🔴 Кризис в одном секторе',
            growth: '🟢 Рост в одном секторе секторах',
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
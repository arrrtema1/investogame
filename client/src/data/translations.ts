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
        price: 'Price',
        income: 'Income',
        grow: 'Grow',
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

        // Сокращения
        shorts: {
            stock: 'Stock',
            bond: 'Bond',
            realEstate: 'Real Estate',
            metal: 'Metal',
        },

        // Добавить новые поля для секторов:
        sectors: {
            automakers: 'Automakers',
            development: 'IT Development',
            oil: 'Oil companies',
            furniture: 'Furniture retailers',
        },

        // Названия компаний (уже есть в names)
        names: {
            automakers: {
                1: 'Toyota',
                2: 'Ford',
                3: 'Tesla',
            },
            development: {
                1: 'Google',
                2: 'OpenAI',
                3: 'JetBrains',
            },
            oil: {
                1: 'ExxonMobil',
                2: 'EOG Resources',
            },
            furniture: {
                1: 'HomeDepot',
                2: 'OBI',
            },
        },

        // Для недвижимости:
        realEstate: {
            smallFlat: 'Small Flat',
            bigFlat: 'Big Flat',
            shop: 'Shop',
            house: 'House',
            warehouse: 'Warehouse',
            building: 'Building',
        },

        // Для облигаций:
        bonds: {
            gov: 'Gov. Bond',
            walmart: 'Walmart',
            construction: 'Construction Co.',
        },

        // Для металлов:
        metals: {
            silver: 'Silver',
            palladium: 'Palladium',
            platinum: 'Platinum',
            gold: 'Gold',
        },

        // Кнопки
        buttons: {
            buy: 'Buy',
            sell: 'Sell',
            nextYear: 'Ready',
            flipCoin: 'Flip coin' // TODO: след. год
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
        price: 'Цена',
        income: 'Доход',
        grow: 'Рост',
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

        // Сокращения
        shorts: {
            stock: 'Акция',
            bond: 'Облиг.',
            realEstate: 'Недвиж.',
            metal: 'Металл',
        },

        sectors: {
            automakers: 'Автопроизводство',
            development: 'IT разработка',
            oil: 'Нефтяные компании',
            furniture: 'Мебельные магазины',
        },

        names: {
            automakers: {
                1: 'Toyota',
                2: 'Ford',
                3: 'Lada',
            },
            development: {
                1: 'Яндекс',
                2: 'ВКонтакте',
                3: 'Лаб. Касперского',
            },
            oil: {
                1: 'Газпром',
                2: 'Лукойл',
            },
            furniture: {
                1: 'IKEA',
                2: 'OBI',
            },
        },

        realEstate: {
            smallFlat: 'Студия',
            bigFlat: 'Квартира',
            shop: 'Магазин',
            house: 'Дом',
            warehouse: 'Склад',
            building: 'Здание',
        },

        bonds: {
            gov: 'Гос. облигация',
            walmart: 'Пятёрочка',
            construction: 'Строй. компания',
        },

        metals: {
            silver: 'Серебро',
            palladium: 'Палладий',
            platinum: 'Платина',
            gold: 'Золото',
        },

        // Кнопки
        buttons: {
            buy: 'Купить',
            sell: 'Продать',
            nextYear: 'Готов',
            flipCoin: 'Подкинуть монетку' // TODO: след. год
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
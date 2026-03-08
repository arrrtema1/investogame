import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { GameBoard } from './components/Game/GameBoard';
import { StartMenu } from './components/StartMenu/StartMenu';
import './App.css';

function App() {
    const [gameStarted, setGameStarted] = useState(false);

    const handleStartGame = (playerName: string, startingBalance: number) => {
        setGameStarted(true);
    };

    return (
        <LanguageProvider>
            <GameProvider>
                <div className="App">
                    {!gameStarted ? (
                        <StartMenu onStartGame={handleStartGame} />
                    ) : (
                        <GameBoard />
                    )}
                </div>
            </GameProvider>
        </LanguageProvider>
    );
}

export default App;
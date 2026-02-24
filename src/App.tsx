import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { GameBoard } from './components/Game/GameBoard';
import { StartMenu } from './components/StartMenu/StartMenu';
import './App.css';

function App() {
    const [gameStarted, setGameStarted] = useState(false);

    const handleStartGame = (playerName: string, startingBalance: number) => {
        // GameProvider будет обновлен через initializeNewGame
        setGameStarted(true);
    };

    return (
        <GameProvider>
            <div className="App">
                {!gameStarted ? (
                    <StartMenu onStartGame={handleStartGame} />
                ) : (
                    <GameBoard />
                )}
            </div>
        </GameProvider>
    );
}

export default App;
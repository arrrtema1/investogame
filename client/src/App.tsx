import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { GameBoard } from './components/Game/GameBoard';
import { StartMenu } from './components/StartMenu';
import './App.css';

function App() {
    return (
        <LanguageProvider>
            <GameProvider>
                <BrowserRouter>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<StartMenu />} />
                            <Route path="/game" element={<GameBoard />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </GameProvider>
        </LanguageProvider>
    );
}

export default App;
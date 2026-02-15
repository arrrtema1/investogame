import React from 'react';
import { GameProvider } from './contexts/GameContext';
import { GameBoard } from "./components/Game/GameBoard";
import './App.css';

function App() {
  return (
      <GameProvider>
        <div className="App">
          <GameBoard />
        </div>
      </GameProvider>
  );
}

export default App;
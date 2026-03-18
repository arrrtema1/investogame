export type GameMode = 'friendly' | 'ranked';
export type PlayerCount = 4 | 8;
export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface SocketPlayer {
    id: string;
    name: string;
    rating?: number;
    isReady: boolean;
    joinedAt: Date;
}

export interface GameRoom {
    id: string;
    code?: string;  // для дружеских игр
    mode: GameMode;
    maxPlayers: PlayerCount;
    players: SocketPlayer[];
    status: RoomStatus;
    createdAt: Date;
    gameState: any;  // текущее состояние игры (ваш GameState)
}

export interface MatchmakingTicket {
    playerId: string;
    playerName: string;
    playerRating: number;
    mode: GameMode;
    playerCount: PlayerCount;
    timestamp: Date;
}
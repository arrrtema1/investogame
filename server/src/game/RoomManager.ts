import { v4 as uuidv4 } from 'uuid';
import { GameRoom, Player, GameMode, PlayerCount } from '../types/socket.types';

export class RoomManager {
    private rooms: Map<string, GameRoom> = new Map();

    createRoom(mode: GameMode, maxPlayers: PlayerCount, creatorId: string): GameRoom {
        const roomId = uuidv4().slice(0, 8);
        const joinCode = mode === 'friendly' ? this.generateJoinCode() : undefined;

        const room: GameRoom = {
            id: roomId,
            code: joinCode,
            mode,
            maxPlayers,
            players: [{
                id: creatorId,
                name: '',
                isReady: false,
                joinedAt: new Date()
            }],
            status: 'waiting',
            createdAt: new Date(),
            gameState: null
        };

        this.rooms.set(roomId, room);
        return room;
    }

    joinRoom(roomId: string, playerId: string): GameRoom | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (room.players.length >= room.maxPlayers) return null;
        if (room.status !== 'waiting') return null;

        room.players.push({
            id: playerId,
            name: '',
            isReady: false,
            joinedAt: new Date()
        });

        return room;
    }

    leaveRoom(roomId: string, playerId: string): void {
        const room = this.rooms.get(roomId);
        if (!room) return;

        room.players = room.players.filter(p => p.id !== playerId);

        if (room.players.length === 0) {
            this.rooms.delete(roomId);
        }
    }

    findRoomByCode(code: string): GameRoom | undefined {
        for (const room of this.rooms.values()) {
            if (room.code === code) return room;
        }
        return undefined;
    }

    private generateJoinCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }
}
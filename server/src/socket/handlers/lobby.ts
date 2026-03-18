import { Socket } from 'socket.io';
import { RoomManager } from '../../game/RoomManager';

export const setupLobbyHandlers = (socket: Socket, roomManager: RoomManager) => {
    // Создание комнаты
    socket.on('create_room', ({ mode, maxPlayers }) => {
        const room = roomManager.createRoom(mode, maxPlayers, socket.id);
        socket.join(room.id);
        socket.emit('room_created', room);
    });

    // Присоединение по коду
    socket.on('join_by_code', ({ code }) => {
        const room = roomManager.findRoomByCode(code);
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }

        const updatedRoom = roomManager.joinRoom(room.id, socket.id);
        if (updatedRoom) {
            socket.join(room.id);
            socket.emit('room_joined', updatedRoom);
            socket.to(room.id).emit('player_joined', updatedRoom);
        } else {
            socket.emit('error', { message: 'Cannot join room' });
        }
    });

    // Готовность игрока
    socket.on('player_ready', ({ roomId }) => {
        const room = roomManager.getRoom(roomId);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.isReady = true;

            // Проверяем, все ли готовы
            const allReady = room.players.every(p => p.isReady);
            if (allReady && room.players.length === room.maxPlayers) {
                room.status = 'playing';
                io.to(roomId).emit('game_start', room);
            } else {
                io.to(roomId).emit('player_ready_update', room);
            }
        }
    });
};
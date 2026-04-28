/**
 * GameHub Multiplayer Server
 * Authoritative WebSocket server using Socket.IO.
 * Rooms, host migration, reconnect, game-agnostic GameModules.
 */
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const { getGameModule } = require('./gameModules');

// --- Room code generation ---
function generateRoomCode() {
  const { ROOM_CODE_LENGTH, ROOM_CODE_CHARS } = config;
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function uniqueRoomCode(rooms) {
  let code;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));
  return code;
}

// --- In-memory store ---
/** @type {Map<string, Room>} */
const rooms = new Map();
/** @type {Map<string, { roomCode: string, playerId: string }>} socketId -> session */
const socketToSession = new Map();
/** @type {Map<string, number>} playerId -> last action timestamp (rate limit) */
const lastActionByPlayer = new Map();

// --- Rate limit ---
function checkRateLimit(playerId) {
  const now = Date.now();
  const last = lastActionByPlayer.get(playerId) ?? 0;
  if (now - last < config.ACTION_RATE_LIMIT_MS) return false;
  lastActionByPlayer.set(playerId, now);
  return true;
}

// --- Helpers ---
function getRoom(roomCode) {
  return rooms.get(roomCode) || null;
}

function broadcastToRoom(io, roomCode, event, payload) {
  io.to(roomCode).emit(event, payload);
}

function findPlayerInRoom(room, playerId) {
  return room.players.find((p) => p.id === playerId) || null;
}

function isHost(room, playerId) {
  return room.hostId === playerId;
}

/** Migrate host to first connected player or delete room if empty. */
function maybeMigrateHost(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const connected = room.players.filter((p) => p.connected);
  if (connected.length === 0) {
    rooms.delete(roomCode);
    return;
  }
  const stillHost = connected.some((p) => p.id === room.hostId);
  if (!stillHost) {
    room.hostId = connected[0].id;
    broadcastToRoom(io, roomCode, 'room_update', {
      players: room.players,
      hostId: room.hostId,
      hostMigrated: true,
    });
  }
}

// --- Socket server setup ---
const server = http.createServer();
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 20000,
  pingInterval: 5000,
});

io.on('connection', (socket) => {
  // ---------- create_room (client -> server) ----------
  socket.on('create_room', (payload, ack) => {
    const { gameType, playerName } = payload || {};
    if (!gameType || !playerName || typeof playerName !== 'string') {
      ack?.({ ok: false, error: 'gameType and playerName required' });
      return;
    }
    const mod = getGameModule(gameType);
    if (!mod) {
      ack?.({ ok: false, error: 'Unknown game type' });
      return;
    }
    const roomCode = uniqueRoomCode(rooms);
    const playerId = `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const player = {
      id: playerId,
      name: (playerName || 'Player').trim().slice(0, 50),
      connected: true,
    };
    const room = {
      code: roomCode,
      hostId: playerId,
      gameType,
      players: [player],
      gameState: null,
      gameStarted: false,
      createdAt: Date.now(),
    };
    rooms.set(roomCode, room);
    socketToSession.set(socket.id, { roomCode, playerId });
    socket.join(roomCode);
    ack?.({
      ok: true,
      roomCode,
      playerId,
      players: room.players,
      hostId: room.hostId,
    });
  });

  // ---------- join_room (client -> server) ----------
  socket.on('join_room', (payload, ack) => {
    const { roomCode: rawCode, playerName } = payload || {};
    const roomCode = (rawCode || '').toString().trim().toUpperCase();
    if (!roomCode || !playerName || typeof playerName !== 'string') {
      ack?.({ ok: false, error: 'roomCode and playerName required' });
      return;
    }
    const room = getRoom(roomCode);
    if (!room) {
      ack?.({ ok: false, error: 'Room not found' });
      return;
    }
    if (room.players.length >= config.MAX_PLAYERS_PER_ROOM) {
      ack?.({ ok: false, error: 'Room is full' });
      return;
    }
    const name = (playerName || 'Player').trim().slice(0, 50);
    const existing = room.players.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      ack?.({ ok: false, error: 'Name already taken in this room' });
      return;
    }
    const playerId = `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const player = { id: playerId, name, connected: true };
    room.players.push(player);
    socketToSession.set(socket.id, { roomCode, playerId });
    socket.join(roomCode);
    broadcastToRoom(io, roomCode, 'room_update', {
      players: room.players,
      hostId: room.hostId,
    });
    ack?.({
      ok: true,
      roomCode,
      playerId,
      players: room.players,
      hostId: room.hostId,
      gameState: room.gameState,
      gameStarted: room.gameStarted,
    });
  });

  // ---------- leave_room (client -> server) ----------
  socket.on('leave_room', () => {
    const session = socketToSession.get(socket.id);
    if (!session) return;
    const { roomCode, playerId } = session;
    const room = getRoom(roomCode);
    socketToSession.delete(socket.id);
    socket.leave(roomCode);
    if (!room) return;
    const idx = room.players.findIndex((p) => p.id === playerId);
    if (idx !== -1) {
      room.players[idx].connected = false;
      broadcastToRoom(io, roomCode, 'room_update', {
        players: room.players,
        hostId: room.hostId,
        leftPlayerId: playerId,
      });
      maybeMigrateHost(io, roomCode);
    }
  });

  // ---------- reconnect_player (client -> server) ----------
  socket.on('reconnect_player', (payload, ack) => {
    const { playerId, roomCode: rawCode } = payload || {};
    const roomCode = (rawCode || '').toString().trim().toUpperCase();
    if (!playerId || !roomCode) {
      ack?.({ ok: false, error: 'playerId and roomCode required' });
      return;
    }
    const room = getRoom(roomCode);
    if (!room) {
      ack?.({ ok: false, error: 'Room not found' });
      return;
    }
    const player = findPlayerInRoom(room, playerId);
    if (!player) {
      ack?.({ ok: false, error: 'Player not in room' });
      return;
    }
    // Remove old socket from this room if it was in another session
    const oldSession = socketToSession.get(socket.id);
    if (oldSession && oldSession.roomCode !== roomCode) {
      const oldRoom = getRoom(oldSession.roomCode);
      if (oldRoom) {
        const oldPlayer = findPlayerInRoom(oldRoom, oldSession.playerId);
        if (oldPlayer) oldPlayer.connected = false;
        broadcastToRoom(io, oldSession.roomCode, 'room_update', { players: oldRoom.players, hostId: oldRoom.hostId });
        maybeMigrateHost(io, oldSession.roomCode);
      }
      socket.leave(oldSession.roomCode);
    }
    player.connected = true;
    socketToSession.set(socket.id, { roomCode, playerId });
    socket.join(roomCode);
    broadcastToRoom(io, roomCode, 'room_update', { players: room.players, hostId: room.hostId });
    ack?.({
      ok: true,
      roomCode,
      playerId,
      players: room.players,
      hostId: room.hostId,
      gameState: room.gameState,
      gameStarted: room.gameStarted,
    });
  });

  // ---------- start_game (host -> server) ----------
  socket.on('start_game', (_, ack) => {
    const session = socketToSession.get(socket.id);
    if (!session) {
      ack?.({ ok: false, error: 'Not in a room' });
      return;
    }
    const room = getRoom(session.roomCode);
    if (!room || !isHost(room, session.playerId)) {
      ack?.({ ok: false, error: 'Only host can start' });
      return;
    }
    if (room.gameStarted) {
      ack?.({ ok: false, error: 'Game already started' });
      return;
    }
    const mod = getGameModule(room.gameType);
    if (!mod) {
      ack?.({ ok: false, error: 'Unknown game type' });
      return;
    }
    const connected = room.players.filter((p) => p.connected);
    if (connected.length < 1) {
      ack?.({ ok: false, error: 'Need at least one player' });
      return;
    }
    room.gameState = mod.initialState(room.players);
    room.gameStarted = true;
    broadcastToRoom(io, room.code, 'state_update', room.gameState);
    ack?.({ ok: true, gameState: room.gameState });
  });

  // ---------- game_action (client -> server) ----------
  socket.on('game_action', (payload, ack) => {
    const session = socketToSession.get(socket.id);
    if (!session) {
      ack?.({ ok: false, error: 'Not in a room' });
      return;
    }
    const room = getRoom(session.roomCode);
    if (!room || !room.gameStarted) {
      ack?.({ ok: false, error: 'Game not started' });
      return;
    }
    if (!checkRateLimit(session.playerId)) {
      ack?.({ ok: false, error: 'Rate limited' });
      return;
    }
    const mod = getGameModule(room.gameType);
    if (!mod) {
      ack?.({ ok: false, error: 'Unknown game type' });
      return;
    }
    const newState = mod.onPlayerAction(room.gameState, payload || {}, session.playerId);
    if (!newState || newState === room.gameState) {
      ack?.({ ok: false, error: 'Invalid action' });
      return;
    }
    room.gameState = newState;
    broadcastToRoom(io, room.code, 'state_update', newState);
    ack?.({ ok: true, gameState: newState });
  });

  socket.on('disconnect', () => {
    const session = socketToSession.get(socket.id);
    if (!session) return;
    const room = getRoom(session.roomCode);
    socketToSession.delete(socket.id);
    if (room) {
      const player = findPlayerInRoom(room, session.playerId);
      if (player) {
        player.connected = false;
        broadcastToRoom(io, session.roomCode, 'room_update', {
          players: room.players,
          hostId: room.hostId,
        });
        maybeMigrateHost(io, session.roomCode);
      }
    }
  });
});

// Optional: periodic cleanup of empty rooms
const ROOM_TTL = config.ROOM_TTL_EMPTY_MS;
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    const connected = room.players.filter((p) => p.connected).length;
    if (connected === 0 && now - room.createdAt > ROOM_TTL) {
      rooms.delete(code);
    }
  }
}, 30000);

const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`GameHub multiplayer server on http://localhost:${PORT}`);
});

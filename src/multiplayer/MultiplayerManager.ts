/**
 * MultiplayerManager – Reusable WebSocket multiplayer for GameHub.
 * Games use this API only; they must not use the socket directly.
 * Handles connect, room state, reconnect, and exposes a stable API for all games.
 */
import { io, Socket } from 'socket.io-client';
import type {
  MultiplayerRoomState,
  StateUpdateCallback,
  RoomUpdateCallback,
  GameAction,
} from './types';

const PLAYER_STORAGE_KEY = '@gamehub_multiplayer_player';
const ROOM_STORAGE_KEY = '@gamehub_multiplayer_room';

const defaultRoomState: MultiplayerRoomState = {
  roomCode: null,
  hostId: null,
  playerId: null,
  players: [],
  gameState: null,
  gameStarted: false,
  gameType: null,
};

export class MultiplayerManager {
  private socket: Socket | null = null;
  private serverUrl: string;
  private roomState: MultiplayerRoomState = { ...defaultRoomState };
  private onStateUpdateCallback: StateUpdateCallback | null = null;
  private onRoomUpdateCallback: RoomUpdateCallback | null = null;
  private listenersAttached = false;

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl.replace(/\/$/, '');
  }

  /** Ensure socket exists and is connected. */
  private getSocket(): Socket {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });
      this.attachListeners();
    }
    return this.socket;
  }

  private attachListeners() {
    if (!this.socket || this.listenersAttached) return;
    this.listenersAttached = true;

    this.socket.on('state_update', (gameState: Record<string, unknown>) => {
      this.roomState.gameState = gameState;
      this.roomState.gameStarted = true;
      this.onStateUpdateCallback?.(gameState);
    });

    this.socket.on('room_update', (payload: { players: MultiplayerRoomState['players']; hostId: string | null; hostMigrated?: boolean; leftPlayerId?: string }) => {
      this.roomState.players = payload.players ?? this.roomState.players;
      if (payload.hostId != null) this.roomState.hostId = payload.hostId;
      this.onRoomUpdateCallback?.(payload);
    });

    this.socket.on('connect', () => {
      const stored = this.getStoredSession();
      if (stored?.playerId && stored?.roomCode) {
        this.reconnectPlayer(stored.playerId, stored.roomCode).catch(() => {});
      }
    });
  }

  private getStoredSession(): { playerId: string; roomCode: string } | null {
    try {
      if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
        const p = (globalThis as unknown as { localStorage: Storage }).localStorage.getItem(PLAYER_STORAGE_KEY);
        const r = (globalThis as unknown as { localStorage: Storage }).localStorage.getItem(ROOM_STORAGE_KEY);
        if (p && r) return { playerId: p, roomCode: r };
      }
    } catch (_) {}
    return null;
  }

  private setStoredSession(playerId: string | null, roomCode: string | null) {
    try {
      if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
        const ls = (globalThis as unknown as { localStorage: Storage }).localStorage;
        if (playerId) ls.setItem(PLAYER_STORAGE_KEY, playerId);
        else ls.removeItem(PLAYER_STORAGE_KEY);
        if (roomCode) ls.setItem(ROOM_STORAGE_KEY, roomCode);
        else ls.removeItem(ROOM_STORAGE_KEY);
      }
    } catch (_) {}
  }

  /** Create a room (host). */
  createRoom(gameType: string, playerName: string): Promise<{ roomCode: string; playerId: string; players: MultiplayerRoomState['players']; hostId: string }> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      socket.emit('create_room', { gameType, playerName }, (res: { ok: boolean; error?: string; roomCode?: string; playerId?: string; players?: MultiplayerRoomState['players']; hostId?: string }) => {
        if (res?.ok && res.roomCode && res.playerId) {
          this.roomState = {
            roomCode: res.roomCode,
            hostId: res.hostId ?? res.playerId,
            playerId: res.playerId,
            players: res.players ?? [],
            gameState: null,
            gameStarted: false,
            gameType,
          };
          this.setStoredSession(res.playerId, res.roomCode);
          resolve({
            roomCode: res.roomCode,
            playerId: res.playerId,
            players: this.roomState.players,
            hostId: this.roomState.hostId!,
          });
        } else {
          reject(new Error(res?.error || 'Failed to create room'));
        }
      });
    });
  }

  /** Join existing room by code. */
  joinRoom(roomCode: string, playerName: string): Promise<{ playerId: string; players: MultiplayerRoomState['players']; hostId: string; gameState: Record<string, unknown> | null; gameStarted: boolean }> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      const code = String(roomCode).trim().toUpperCase();
      socket.emit('join_room', { roomCode: code, playerName }, (res: { ok: boolean; error?: string; playerId?: string; players?: MultiplayerRoomState['players']; hostId?: string; gameState?: Record<string, unknown>; gameStarted?: boolean }) => {
        if (res?.ok && res.playerId) {
          this.roomState = {
            roomCode: code,
            hostId: res.hostId ?? null,
            playerId: res.playerId,
            players: res.players ?? [],
            gameState: res.gameState ?? null,
            gameStarted: res.gameStarted ?? false,
            gameType: this.roomState.gameType,
          };
          this.setStoredSession(res.playerId, code);
          resolve({
            playerId: res.playerId,
            players: this.roomState.players,
            hostId: this.roomState.hostId!,
            gameState: this.roomState.gameState,
            gameStarted: this.roomState.gameStarted,
          });
        } else {
          reject(new Error(res?.error || 'Failed to join room'));
        }
      });
    });
  }

  /** Leave current room. */
  leaveRoom(): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_room');
    }
    this.roomState = { ...defaultRoomState };
    this.setStoredSession(null, null);
  }

  /** Restore session after reconnect (e.g. app reopen). */
  reconnectPlayer(playerId: string, roomCode: string): Promise<{ players: MultiplayerRoomState['players']; hostId: string; gameState: Record<string, unknown> | null; gameStarted: boolean }> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      const code = String(roomCode).trim().toUpperCase();
      socket.emit('reconnect_player', { playerId, roomCode: code }, (res: { ok: boolean; error?: string; players?: MultiplayerRoomState['players']; hostId?: string; gameState?: Record<string, unknown>; gameStarted?: boolean }) => {
        if (res?.ok) {
          this.roomState.roomCode = code;
          this.roomState.playerId = playerId;
          this.roomState.players = res.players ?? this.roomState.players;
          this.roomState.hostId = res.hostId ?? null;
          this.roomState.gameState = res.gameState ?? this.roomState.gameState;
          this.roomState.gameStarted = res.gameStarted ?? false;
          this.setStoredSession(playerId, code);
          resolve({
            players: this.roomState.players,
            hostId: this.roomState.hostId!,
            gameState: this.roomState.gameState,
            gameStarted: this.roomState.gameStarted,
          });
        } else {
          reject(new Error(res?.error || 'Reconnect failed'));
        }
      });
    });
  }

  /** Host starts the game. */
  startGame(): Promise<{ gameState: Record<string, unknown> }> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      socket.emit('start_game', {}, (res: { ok: boolean; error?: string; gameState?: Record<string, unknown> }) => {
        if (res?.ok && res.gameState != null) {
          this.roomState.gameState = res.gameState;
          this.roomState.gameStarted = true;
          resolve({ gameState: res.gameState });
        } else {
          reject(new Error(res?.error || 'Failed to start game'));
        }
      });
    });
  }

  /** Send a game action (validated on server). */
  sendAction(action: GameAction): Promise<{ gameState: Record<string, unknown> }> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      socket.emit('game_action', action, (res: { ok: boolean; error?: string; gameState?: Record<string, unknown> }) => {
        if (res?.ok && res.gameState != null) {
          this.roomState.gameState = res.gameState;
          resolve({ gameState: res.gameState });
        } else {
          reject(new Error(res?.error || 'Action rejected'));
        }
      });
    });
  }

  onStateUpdate(callback: StateUpdateCallback): () => void {
    this.onStateUpdateCallback = callback;
    return () => { this.onStateUpdateCallback = null; };
  }

  onRoomUpdate(callback: RoomUpdateCallback): () => void {
    this.onRoomUpdateCallback = callback;
    return () => { this.onRoomUpdateCallback = null; };
  }

  getRoomState(): Readonly<MultiplayerRoomState> {
    return this.roomState;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  isHost(): boolean {
    return this.roomState.hostId !== null && this.roomState.playerId === this.roomState.hostId;
  }

  disconnect(): void {
    this.leaveRoom();
    this.socket?.disconnect();
    this.socket = null;
    this.listenersAttached = false;
  }
}

// Singleton for app-wide use; games use Multiplayer.createRoom(), etc.
let defaultInstance: MultiplayerManager | null = null;

export function getMultiplayerManager(serverUrl?: string): MultiplayerManager {
  if (!defaultInstance) {
    defaultInstance = new MultiplayerManager(serverUrl);
  }
  if (serverUrl != null && defaultInstance.getRoomState().roomCode === null) {
    defaultInstance = new MultiplayerManager(serverUrl);
  }
  return defaultInstance;
}

export const Multiplayer = {
  createRoom: (gameType: string, playerName: string) => getMultiplayerManager().createRoom(gameType, playerName),
  joinRoom: (roomCode: string, playerName: string) => getMultiplayerManager().joinRoom(roomCode, playerName),
  leaveRoom: () => getMultiplayerManager().leaveRoom(),
  startGame: () => getMultiplayerManager().startGame(),
  sendAction: (action: GameAction) => getMultiplayerManager().sendAction(action),
  onStateUpdate: (cb: StateUpdateCallback) => getMultiplayerManager().onStateUpdate(cb),
  onRoomUpdate: (cb: RoomUpdateCallback) => getMultiplayerManager().onRoomUpdate(cb),
  getRoomState: () => getMultiplayerManager().getRoomState(),
  isConnected: () => getMultiplayerManager().isConnected(),
  isHost: () => getMultiplayerManager().isHost(),
  reconnectPlayer: (playerId: string, roomCode: string) => getMultiplayerManager().reconnectPlayer(playerId, roomCode),
  setServerUrl: (url: string) => {
    defaultInstance = new MultiplayerManager(url);
  },
  disconnect: () => { getMultiplayerManager().disconnect(); },
};

export default Multiplayer;

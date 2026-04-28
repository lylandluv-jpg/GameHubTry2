/**
 * Shared types for multiplayer (client).
 * Align with server Room / Player and events.
 */

export interface MultiplayerPlayer {
  id: string;
  name: string;
  connected: boolean;
}

export interface MultiplayerRoomState {
  roomCode: string | null;
  hostId: string | null;
  playerId: string | null;
  players: MultiplayerPlayer[];
  gameState: Record<string, unknown> | null;
  gameStarted: boolean;
  gameType: string | null;
}

export type StateUpdateCallback = (gameState: Record<string, unknown>) => void;
export type RoomUpdateCallback = (payload: {
  players: MultiplayerPlayer[];
  hostId: string | null;
  hostMigrated?: boolean;
  leftPlayerId?: string;
}) => void;

export type GameAction = Record<string, unknown> & { type: string };

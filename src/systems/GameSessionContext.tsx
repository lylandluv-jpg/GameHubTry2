// Game session context for managing state across the app
// Based on specs/core/GameHubMaster.sdd.md Section 4

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameSession, Player, Mode } from '../types';
import { PlayerSystem } from './PlayerSystem';

interface GameSessionContextType {
  session: GameSession | null;
  selectedGameId: string | null;
  selectedMode: Mode | null;
  
  setSession: (session: GameSession | null) => void;
  setSelectedGameId: (gameId: string | null) => void;
  setSelectedMode: (mode: Mode | null) => void;
  
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerScore: (playerId: string, delta: number) => void;
  setWinner: (player: Player) => void;
  
  resetSession: () => void;
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

export const GameSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const addPlayer = (name: string) => {
    const newPlayer = PlayerSystem.createPlayer(name);
    
    if (!session) {
      // Create new session with first player as host
      setSession({
        host: newPlayer,
        players: [newPlayer],
        winner: null
      });
      return;
    }

    setSession({
      ...session,
      players: [...session.players, newPlayer]
    });
  };

  const removePlayer = (playerId: string) => {
    if (!session) return;

    // Cannot remove the host
    if (playerId === session.host.id) return;

    setSession({
      ...session,
      players: session.players.filter(p => p.id !== playerId)
    });
  };

  const updatePlayerScore = (playerId: string, delta: number) => {
    if (!session) return;

    setSession({
      ...session,
      players: session.players.map(p =>
        p.id === playerId ? PlayerSystem.updateScore(p, delta) : p
      )
    });
  };

  const setWinner = (player: Player) => {
    if (!session) return;

    setSession({
      ...session,
      winner: player
    });
  };

  const resetSession = () => {
    setSession(null);
    setSelectedGameId(null);
    setSelectedMode(null);
  };

  return (
    <GameSessionContext.Provider
      value={{
        session,
        selectedGameId,
        selectedMode,
        setSession,
        setSelectedGameId,
        setSelectedMode,
        addPlayer,
        removePlayer,
        updatePlayerScore,
        setWinner,
        resetSession
      }}
    >
      {children}
    </GameSessionContext.Provider>
  );
};

export const useGameSession = () => {
  const context = useContext(GameSessionContext);
  if (!context) {
    throw new Error('useGameSession must be used within GameSessionProvider');
  }
  return context;
};

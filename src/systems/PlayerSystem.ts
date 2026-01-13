// Player management system
// Based on specs/core/GameHubMaster.sdd.md Section 4

import { Player } from '../types';

export class PlayerSystem {
  private static idCounter = 0;

  static createPlayer(name: string): Player {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
    ];

    return {
      id: `player_${++this.idCounter}`,
      name,
      avatarColor: colors[this.idCounter % colors.length],
      score: 0
    };
  }

  static updateScore(player: Player, delta: number): Player {
    return {
      ...player,
      score: (player.score || 0) + delta
    };
  }

  static resetScores(players: Player[]): Player[] {
    return players.map(p => ({ ...p, score: 0 }));
  }

  static getRandomPlayer(players: Player[], excludeId?: string): Player {
    const available = excludeId
      ? players.filter(p => p.id !== excludeId)
      : players;

    if (available.length === 0) {
      return players[Math.floor(Math.random() * players.length)];
    }

    return available[Math.floor(Math.random() * available.length)];
  }

  static validatePlayers(players: Player[], minPlayers: number, maxPlayers?: number): {
    valid: boolean;
    error?: string;
  } {
    if (players.length < minPlayers) {
      return {
        valid: false,
        error: `Minimum ${minPlayers} player${minPlayers > 1 ? 's' : ''} required`
      };
    }

    if (maxPlayers && players.length > maxPlayers) {
      return {
        valid: false,
        error: `Maximum ${maxPlayers} players allowed`
      };
    }

    const duplicateNames = players.filter((p, i) =>
      players.findIndex(p2 => p2.name === p.name) !== i
    );

    if (duplicateNames.length > 0) {
      return {
        valid: false,
        error: 'Player names must be unique'
      };
    }

    return { valid: true };
  }
}

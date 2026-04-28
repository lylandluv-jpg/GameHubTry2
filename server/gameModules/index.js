/**
 * Game modules registry.
 * Each game implements: gameType, initialState(players), onPlayerAction(state, action, playerId), isGameOver(state).
 */
const path = require('path');
const config = require('../config');

const gameModules = new Map();

function loadGameModule(gameType) {
  if (gameModules.has(gameType)) return gameModules.get(gameType);
  try {
    const mod = require(path.join(__dirname, gameType));
    if (mod.gameType && typeof mod.initialState === 'function' && typeof mod.onPlayerAction === 'function' && typeof mod.isGameOver === 'function') {
      gameModules.set(gameType, mod);
      return mod;
    }
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') console.error('Game module load error:', gameType, e.message);
  }
  return null;
}

function getGameModule(gameType) {
  return gameModules.get(gameType) || loadGameModule(gameType);
}

module.exports = { getGameModule, gameModules, loadGameModule };

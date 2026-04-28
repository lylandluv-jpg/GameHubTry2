/**
 * Multiplayer server configuration
 */
module.exports = {
  PORT: process.env.PORT || 3001,
  MAX_PLAYERS_PER_ROOM: 12,
  ROOM_CODE_LENGTH: 6,
  ROOM_CODE_CHARS: '0123456789', // 6-digit numeric code
  ROOM_TTL_EMPTY_MS: 60 * 1000,
  ACTION_RATE_LIMIT_MS: 500,
  GAME_MODULES_PATH: './gameModules',
};

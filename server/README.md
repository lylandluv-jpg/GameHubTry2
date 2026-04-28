# GameHub Multiplayer Server

Authoritative WebSocket server for GameHub party games. Uses **Socket.IO** and a **game-agnostic** engine: any game plugs in via a `GameModule`.

## Run

```bash
cd server
npm install
npm start
```

Server listens on **http://localhost:3001** (or `PORT` env).

## Config (`config.js`)

- `MAX_PLAYERS_PER_ROOM`: 12
- `ROOM_CODE_LENGTH`: 5
- `ACTION_RATE_LIMIT_MS`: 500

## Socket Events

| Event            | Direction       | Description                    |
| ---------------- | --------------- | ------------------------------ |
| `create_room`    | client → server | Host creates room             |
| `join_room`      | client → server | Player joins by code           |
| `leave_room`     | client → server | Player leaves                  |
| `start_game`     | host → server   | Begin match                    |
| `game_action`    | client → server | Player move (validated)        |
| `state_update`   | server → room   | Broadcast game state           |
| `room_update`    | server → room   | Player list / host change      |
| `reconnect_player` | client → server | Restore session after reconnect |

## Adding a Game

1. Add a file under `gameModules/<gameType>.js` (e.g. `gameModules/never-have-i-ever.js`).
2. Export a **GameModule**:

```js
module.exports = {
  gameType: 'never-have-i-ever',
  initialState(players) {
    return { phase: 'idle', round: 0 /* ... */ };
  },
  onPlayerAction(state, action, playerId) {
    // Validate action, return new state (or same if invalid).
    return { ...state, /* ... */ };
  },
  isGameOver(state) {
    return false;
  },
};
```

3. Client uses `Multiplayer.createRoom('never-have-i-ever', playerName)` and the same events; no server code change needed beyond the new file.

## Security

- Server is authoritative: clients never set game state directly.
- All actions validated in `onPlayerAction`.
- Rate limit per player on `game_action`.
- Duplicate joins (same name in room) rejected.

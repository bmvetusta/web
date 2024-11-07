## Stopwatch

- `CREATE` action should be renamed to `SET` and send a payload to became the active stopwatch
- `createStartOrToggle` action. This can be done with any action by passing opts.
- Reset action that resets the state to the initial state and not to 0
- Save the state to redis to restore the stopwatch and sync the state across multiple instances
- Active stopwatch using redis so the stopwatch should be presented when set

## Scores

- Persist the scores across multiple instances using redis

## Advertising

- `TOGGLE` action

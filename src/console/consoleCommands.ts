import { gameEvents } from "../events/EventEmitter";
import { gameState } from "../state/gameState";

export function initConsoleCommands() {
  gameEvents.on("consoleCommand", (command: string, args: string[]) => {
    switch (command.toLowerCase()) {
      case "setplayerhp":
        setPlayerHp(args);
        break;
      case "killall":
        killAll();
        break;
      default:
        return;
    }
  });
}

const setPlayerHp = (args: string[]) => {
  const hpValue = parseInt(args[0], 10);
  if (isNaN(hpValue) || hpValue < 0) {
    gameEvents.emit("consoleCommand", "error", [
      "Invalid HP value. Use a positive number.",
    ]);
    return;
  }
  gameState.player.hp = hpValue;
  gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
  gameEvents.emit("consoleCommand", "success", [`Player HP set to ${hpValue}`]);
};

const killAll = () => {
  const enemies = [...gameState.enemies];
  const timestamp = Date.now();
  enemies.forEach((enemy) => {
    gameEvents.emit("enemyKilled", enemy, timestamp);
  });
  gameEvents.emit("consoleCommand", "success", [
    `Killed ${enemies.length} enemies`,
  ]);
};

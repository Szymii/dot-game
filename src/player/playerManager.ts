import { gameEvents } from "../events/EventEmitter";
import { gameState } from "../state/gameState";

export function initPlayerManager() {
  gameEvents.on("playerHit", (bulletIndex: number) => {
    if (bulletIndex >= 0 && bulletIndex < gameState.enemyBullets.length) {
      gameState.player.hp -= 1;
      gameState.enemyBullets.splice(bulletIndex, 1);
      if (gameState.player.hp <= 0) {
        gameState.gameOver = true;
      }
    }
  });
}

import type { Enemy } from "../enemy/Enemy";

type EventType =
  | "waveCleared"
  | "waveStarted"
  | "update"
  | "consoleCommand"
  | "enemyKilled"
  | "playerHit"
  | "enemyHit";

interface EventArgs {
  waveCleared: [timestamp: number];
  waveStarted: [wave: number];
  update: [timestamp: number];
  consoleCommand: [command: string, args: string[]];
  enemyKilled: [enemy: Enemy, timestamp: number];
  playerHit: [bulletIndex: number];
  enemyHit: [enemyIndex: number, bulletIndex: number];
}

type EventCallback<T extends EventType> = (...args: EventArgs[T]) => void;

interface EventMap {
  [key: string]: EventCallback<EventType>[];
}

export class EventEmitter {
  private events: EventMap = {};

  on<T extends EventType>(event: T, callback: EventCallback<T>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback as EventCallback<EventType>);
  }

  off<T extends EventType>(event: T, callback: EventCallback<T>) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        (cb) => cb !== (callback as EventCallback<EventType>)
      );
    }
  }

  emit<T extends EventType>(event: T, ...args: EventArgs[T]) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args));
    }
  }
}

export const gameEvents = new EventEmitter();

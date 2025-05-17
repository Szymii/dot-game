import { gameEvents } from "../events/EventEmitter";

export function initConsole(app: HTMLElement) {
  const consoleContainer = document.createElement("div");
  consoleContainer.id = "dev-console";
  consoleContainer.style.display = "none";
  consoleContainer.className =
    "fixed top-2 left-2 w-96 bg-black/80 text-white p-4 rounded-lg z-50 duration-300 font-mono";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter command (e.g., help)";
  input.className =
    "w-full bg-transparent border border-white text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50";

  const output = document.createElement("div");
  output.id = "console-output";
  output.className = "max-h-24 overflow-y-auto mt-2 text-sm";

  consoleContainer.appendChild(input);
  consoleContainer.appendChild(output);
  app.appendChild(consoleContainer);

  // Funkcja do dodawania wiadomości do konsoli
  function logToConsole(message: string) {
    const messageEl = document.createElement("div");
    messageEl.textContent = message;
    output.appendChild(messageEl);
    output.scrollTop = output.scrollHeight;
  }

  // Obsługa wysyłania komend
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const [command, ...args] = input.value.trim().split(/\s+/);
      gameEvents.emit("consoleCommand", command, args);
      logToConsole(`> ${input.value}`);
      input.value = ""; // Wyczyść input
    }
  });

  // Obsługa pokazywania/ukrywania konsoli (klawisz `~`)
  document.addEventListener("keydown", (e) => {
    if (e.key === "`" || e.key === "~") {
      e.preventDefault();
      consoleContainer.style.display =
        consoleContainer.style.display === "none" ? "block" : "none";
      if (consoleContainer.style.display === "block") {
        input.focus();
      }
    }
  });

  // Subskrybuj odpowiedzi konsoli (np. błędy, potwierdzenia)
  gameEvents.on("consoleCommand", (command, args) => {
    logToConsole(`Executed: ${command} ${args.join(" ")}`);
  });
}

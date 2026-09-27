const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");

let restartCount = 0;
let lastRestartTime = Date.now();
const BASE_DELAY = 3000;
const MAX_DELAY = 60000;

function getRestartDelay() {
  const delay = Math.min(BASE_DELAY * Math.pow(1.5, restartCount), MAX_DELAY);
  return Math.round(delay);
}

// ✅ SERVEUR — GARDE RENDER EN LIGNE
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 ANGELA — En ligne ! Créée par Ariel Aks Otaku ✨");
});

app.get("/keepalive", (req, res) => {
  res.send("✅ Toujours active — " + new Date().toLocaleString());
});

app.listen(PORT, () => {
  log.info("INDEX", `Serveur de maintien actif sur le port ${PORT}`);
  log.info("INDEX", "🤖 ANGELA — Prête à fonctionner !");
});

// 🔄 LANCEMENT DU BOT
function startProject() {
  const now = Date.now();
  if (now - lastRestartTime > 10 * 60 * 1000) {
    restartCount = 0;
  }
  lastRestartTime = now;

  const child = spawn("node", ["azadx69x.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: process.env
  });

  child.on("close", (code) => {
    if (code === 2) {
      restartCount = 0;
      log.info("INDEX", "🔄 Redémarrage demandé...");
      setTimeout(startProject, 3000);
    } else if (code !== 0) {
      restartCount++;
      const delay = getRestartDelay();
      log.info("INDEX", `⚠️ Bot arrêté (code ${code}) — Nouvelle tentative dans ${delay/1000}s...`);
      setTimeout(startProject, delay);
    } else {
      log.info("INDEX", "✅ Bot arrêté normalement");
    }
  });

  child.on("error", (err) => {
    log.err("INDEX", "❌ Erreur démarrage :", err.message);
    restartCount++;
    const delay = getRestartDelay();
    setTimeout(startProject, delay);
  });
}

startProject();

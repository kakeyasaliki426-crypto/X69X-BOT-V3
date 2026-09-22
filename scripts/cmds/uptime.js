const axios = require("axios");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "status"],
    version: "1.0.0",
    description: "Affiche le temps d'activité du bot et maintient le processus actif.",
    usage: "{prefix}uptime",
    credit: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    hasPrefix: true,
    permission: "PUBLIC",
    cooldown: 5,
    category: "SYSTEM"
  },

  run: async function({ api, message }) {
    const { threadID, messageID } = message;

    try {
      const uptime = process.uptime();
      const days = Math.floor(uptime / (24 * 60 * 60));
      const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((uptime % (60 * 60)) / 60);
      const seconds = Math.floor(uptime % 60);

      const statusMessage = `🚀 𝐁𝐨𝐭 𝐒𝐭𝐚𝐭𝐮𝐬\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞: ${days}j ${hours}h ${minutes}m ${seconds}s\n` +
        `📶 𝐄́𝐭𝐚𝐭: Opérationnel\n` +
        `🛠️ 𝐒𝐞𝐫𝐯𝐢𝐜𝐞: Keep-Alive actif\n` +
        `━━━━━━━━━━━━━━━━━━`;

      return api.sendMessage(statusMessage, threadID, messageID);
    } catch (error) {
      global.logger.error(`Erreur dans la commande uptime: ${error.message}`);
      return api.sendMessage("❌ Une erreur est survenue lors de la récupération de l'uptime.", threadID, messageID);
    }
  },

  init: function(api) {
    // Empêche le bot de s'endormir en enregistrant une activité système toutes les 5 minutes
    if (!global.keepAliveInterval) {
      global.keepAliveInterval = true;
      setInterval(() => {
        global.logger.system("Keep-alive : Le bot est toujours actif.");
      }, 300000); // 300,000ms = 5 minutes
    }
  }
};

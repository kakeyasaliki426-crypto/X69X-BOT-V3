const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["h", "menu", "commandes"],
    version: "1.0.0",
    description: "Affiche la liste des commandes disponibles d'Angela.",
    usage: "{prefix}help [nom de la commande]",
    credit: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    hasPrefix: true,
    permission: "PUBLIC",
    cooldown: 5,
    category: "SYSTEM"
  },

  run: async function({ api, message, args }) {
    const { threadID, messageID, senderID } = message;
    const prefix = global.config.prefix;

    try {
      // Configuration de l'image de profil (Règles Graph API)
      const FALLBACK_GRAPH_TOKEN = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
      const tempDir = path.join(__dirname, "cache");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      const imgPath = path.join(tempDir, `help_${senderID}.jpg`);

      // Fonction de téléchargement
      async function downloadProfilePic(userID, savePath) {
        const url = `https://graph.facebook.com/${userID}/picture?height=720&width=720&access_token=${FALLBACK_GRAPH_TOKEN}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(savePath, response.data);
      }

      const commands = global.client.commands;
      
      // Si aucune commande n'est spécifiée (Affiche la liste complète)
      if (!args[0]) {
        await downloadProfilePic(senderID, imgPath);

        const categories = {};
        for (const [name, command] of commands.entries()) {
          const category = command.config.category || "GENERAL";
          if (!categories[category]) categories[category] = [];
          categories[category].push(name);
        }

        let helpMessage = "✨ 𝐀𝐍𝐆𝐄𝐋𝐀 𝐁𝐎𝐓 ✨\n";
        helpMessage += "━━━━━━━━━━━━━━━━━━\n";
        helpMessage += `👤 Créé par : Ariel Aks Otaku\n\n`;

        for (const category in categories) {
          helpMessage += `📂 [ ${category} ]\n`;
          helpMessage += `⮕ ${categories[category].join(", ")}\n\n`;
        }

        helpMessage += `━━━━━━━━━━━━━━━━━━\n`;
        helpMessage += `📝 Total: ${commands.size} commandes\n`;
        helpMessage += `💡 Tape ${prefix}help <nom> pour plus d'infos.`;

        return api.sendMessage({
          body: helpMessage,
          attachment: fs.createReadStream(imgPath)
        }, threadID, () => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }, messageID);
      }

      // Si une commande spécifique est demandée
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(global.client.aliases.get(commandName));

      if (!command) {
        return api.sendMessage(`❌ La commande "${commandName}" n'existe pas.`, threadID, messageID);
      }

      const { name, version, description, usage, permission, cooldown, category, aliases } = command.config;
      let detailMsg = `🔍 𝐃𝐄́𝐓𝐀𝐈𝐋𝐒 𝐃𝐄 𝐋𝐀 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄\n`;
      detailMsg += `━━━━━━━━━━━━━━━━━━\n`;
      detailMsg += `▶ Nom : ${name}\n`;
      detailMsg += `▶ Version : ${version}\n`;
      detailMsg += `▶ Alias : ${aliases.length > 0 ? aliases.join(", ") : "Aucun"}\n`;
      detailMsg += `▶ Catégorie : ${category}\n`;
      detailMsg += `▶ Permission : ${permission}\n`;
      detailMsg += `▶ Cooldown : ${cooldown}s\n`;
      detailMsg += `▶ Description : ${description}\n`;
      detailMsg += `▶ Usage : ${usage.replace(/{prefix}/g, prefix)}\n`;
      detailMsg += `━━━━━━━━━━━━━━━━━━\n`;
      detailMsg += `Angela Bot - Ariel Aks Otaku`;

      return api.sendMessage(detailMsg, threadID, messageID);

    } catch (error) {
      global.logger.error(`Error in help command: ${error.message}`);
      return api.sendMessage("❌ Une erreur est survenue lors de l'affichage de l'aide.", threadID, messageID);
    }
  }
};

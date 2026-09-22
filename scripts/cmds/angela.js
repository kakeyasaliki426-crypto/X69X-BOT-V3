const axios = require("axios");

module.exports = {
  config: {
    name: "angela",
    aliases: ["aks", "ariel"],
    version: "1.0.0",
    description: "Discutez avec l'IA Angela (créée par Ariel Aks Otaku)",
    usage: "{prefix}angela [votre message]",
    credit: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    hasPrefix: true,
    permission: "PUBLIC",
    cooldown: 5,
    category: "UTILITY"
  },

  run: async function({ api, message, args }) {
    const { threadID, messageID } = message;
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("Veuillez poser une question à Angela. \n\nExemple: #angela Bonjour, comment vas-tu ?", threadID, messageID);
    }

    api.sendMessage("Angela est en train de réfléchir... ⏳", threadID, (err, info) => {
      // On stocke l'ID du message de chargement pour éventuellement le supprimer ou le modifier
      const waitingMsgID = info.messageID;

      try {
        // Note: Utilisation d'une API d'IA publique. 
        // Si Ariel Aks Otaku possède une API spécifique, remplacez l'URL ci-dessous.
        axios.get(`https://api.kenliejugarap.com/blackbox/?text=${encodeURIComponent(prompt)}`)
          .then(res => {
            const response = res.data.response;
            const msg = `✨ 𝐀𝐧𝐠𝐞𝐥𝐚 𝐀𝐈 ✨\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━\n👤 Créé par: Ariel Aks Otaku`;
            
            api.unsendMessage(waitingMsgID); // Supprime le message de chargement
            return api.sendMessage(msg, threadID, messageID);
          })
          .catch(err => {
            global.logger.error(`Erreur Angela API: ${err.message}`);
            api.unsendMessage(waitingMsgID);
            return api.sendMessage("❌ Désolé, le serveur d'Angela est occupé pour le moment.", threadID, messageID);
          });

      } catch (error) {
        global.logger.error(`Error in angela command: ${error.message}`);
        return api.sendMessage("❌ Une erreur interne est survenue.", threadID, messageID);
      }
    }, messageID);
  }
};

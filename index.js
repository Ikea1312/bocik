const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const config = require("./config.json");
const express = require("express");

// Express keep-alive (Render.com)
const app = express();
app.get("/", (req, res) => res.send("Bot działa"));
app.listen(3000);

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

bot.on("ready", () => {
  console.log(`Bot zalogowany jako ${bot.user.tag}`);
});

// Funkcja udawana – QC API trzeba będzie podmienić na prawdziwe
async function getQCPhotos(url) {
  return {
    name: "Example item",
    price: "120¥",
    weight: "0.72kg",
    views: "1234",
    photos: [
      "https://via.placeholder.com/600",
      "https://via.placeholder.com/700"
    ]
  };
}

bot.on("messageCreate", async (msg) => {
  if (!msg.content.includes("weidian") && !msg.content.includes("taobao")) return;

  msg.reply("🔍 Pobieram QC zdjęcia, moment...");

  try {
    const data = await getQCPhotos(msg.content);

    let reply = `**${data.name}**\n`;
    reply += `💴 Cena: ${data.price}\n`;
    reply += `⚖️ Waga: ${data.weight}\n`;
    reply += `👁️ Wyświetlenia: ${data.views}\n\n`;

    reply += `🔗 **Refy:**\n`;
    reply += `[CSSBuy](${config.REFERRALS.cssbuy})\n`;
    reply += `[Kakobuy](${config.REFERRALS.kakobuy})\n`;
    reply += `[Oopbuy](${config.REFERRALS.oopbuy})\n`;

    await msg.channel.send(reply);

    for (const photo of data.photos) {
      await msg.channel.send(photo);
    }
  } catch (e) {
    msg.reply("❌ Nie udało się pobrać QC zdjęć!");
  }
});

bot.login(config.TOKEN);

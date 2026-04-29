const TeleBot = require('telebot');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

bot.on('text', async (msg) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(msg.text);
        const response = await result.response;
        return bot.sendMessage(msg.from.id, response.text());
    } catch (error) {
        console.error(error);
        return bot.sendMessage(msg.from.id, "Қате шықты, кейінірек көріңіз.");
    }
});

bot.start();

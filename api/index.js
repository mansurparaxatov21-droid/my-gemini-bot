const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Ең жаңа модель

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { message } = req.body;
        if (message && message.text) {
            const chatId = message.chat.id;
            try {
                const result = await model.generateContent(message.text);
                const response = await result.response;
                const text = response.text();

                await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: chatId,
                    text: text
                });
            } catch (error) {
                console.error("Gemini Error:", error);
            }
        }
    }
    res.status(200).send('OK');
};


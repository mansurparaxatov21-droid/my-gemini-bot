const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { message } = req.body;
        if (message && message.text) {
            try {
                // Модельдің атын ең қарапайым түріне қойдым
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(message.text);
                const response = await result.response;
                const text = response.text();

                await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: message.chat.id,
                    text: text
                });
            } catch (error) {
                console.error("Error:", error.message);
            }
        }
    }
    res.status(200).send('OK');
};


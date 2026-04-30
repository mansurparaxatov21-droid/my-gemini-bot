const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Мұнда "gemini-pro" деп жазылуы керек
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

module.exports = async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      if (!message || !message.text) return res.status(200).send('ok');

      const result = await model.generateContent(message.text);
      const response = await result.response;
      const botReply = response.text();

      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: message.chat.id,
        text: botReply
      });

    } catch (error) {
      console.error("API Error:", error.message);
    }
    return res.status(200).send('ok');
  }
  res.status(200).send('Бот дайын!');
};

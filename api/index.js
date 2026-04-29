const axios = require('axios');

module.exports = async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      if (!message || !message.text) return res.status(200).send('ok');

      const chatId = message.chat.id;
      const userText = message.text;

      // МҰНДА: v1 нұсқасы және gemini-1.5-flash моделі қолданылды
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: userText }] }]
        }
      );

      // Боттың жауабын алу
      const botReply = response.data.candidates[0].content.parts[0].text;

      // Телеграмға жіберу
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: botReply
      });

    } catch (error) {
      console.error('API Error:', error.response ? JSON.stringify(error.response.data) : error.message);
    }
    return res.status(200).send('ok');
  }
  res.status(200).send('Бот қосулы!');
};

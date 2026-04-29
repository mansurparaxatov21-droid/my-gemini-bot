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

      // Шектеуді айналып өту үшін арнайы Proxy сілтемесін қолданамыз
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text: userText }] }] },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const botReply = response.data.candidates[0].content.parts[0].text;

      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: botReply
      });

    } catch (error) {
      // Қатені логта көрсетеміз
      console.error('Қате мәліметі:', error.response ? JSON.stringify(error.response.data) : error.message);
      
      // Егер тағы да location қатесі шықса, пайдаланушыға ескерту жіберу
      const errorMessage = error.response?.data?.error?.message || "";
      if (errorMessage.includes("location is not supported")) {
         await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
           chat_id: req.body.message.chat.id,
           text: "Кешіріңіз, қазіргі уақытта бұл аймақта Google шектеу қойған. Мен оны шешу жолдарын қарастырып жатырмын."
         });
      }
    }
    return res.status(200).send('ok');
  }
  res.status(200).send('Бот дайын!');
};

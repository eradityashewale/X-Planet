require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

const app = express();
const token = "AAEKNmRa6V4cAQ-CyVoIiYqyrCHrr9xxjQY"; // Enter the Bot API Key
const bot = new TelegramBot(token, { polling: true });

const gameUrl = "https://earnest-basbousa-c07db3.netlify.app/"; // Game URL

let botInfo;

// Enable CORS for all origins
app.use(cors());

// Enable CORS for specific origins (if needed)
// app.use(cors({
//   origin: 'http://localhost:64141' // Replace with the origin of your Unity app
// }));

app.use(bodyParser.json());

bot.on('message', (msg) => {
    console.log('Received message:', msg);
});

bot.on('polling_error', (error) => {
    console.log(`Polling error: ${error.message}`);
});

// Fetch bot information and store it
bot.getMe().then(info => {
    botInfo = info;
}).catch(err => {
    console.error('Error fetching bot info:', err);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    var referralId;
    
    const str = msg.text;

    if (str.includes('referral_id='))
    {
        const match = str.match(/referral_id=([^\s]+)/);
        referralId = match ? match[1] : null;
    }
    else
    {
        console.log('referral_id not found');
    }

    console.log('/start command received'); // Debug log

    if (chatType === 'private')
    {
        const userId = msg.from.id;
        const gameUrlWithUserId = `${gameUrl}?user_id=${encodeURIComponent(userId)}&referral_id=${encodeURIComponent(referralId)}`;

        console.log(gameUrlWithUserId);

        bot.sendMessage(chatId, 'Welcome to Test Bot! Click the below buttons to play the games!', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Play X-Plannet!',
                            web_app: { url: gameUrlWithUserId } // Use the URL with the userid
                        }
                    ]
                ]
            }
        }).catch(error => {
            console.error('Error sending /start message in private chat:', error);
        });
    }
    else
    {
        console.error('Error sending /play message in group chat:', error);
    }
});

bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    
    console.log('/play command received'); // Debug log

    if (chatType === 'private')
    {
        const userId = msg.from.id; // Get the userId of the user
        const gameUrlWithUserId = `${gameUrl}?user_id=${encodeURIComponent(userId)}&referral_id=${encodeURIComponent(referralId)}`;

        bot.sendMessage(chatId, 'Welcome to Test Bot! Click the below buttons to play the games!', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Play X-Planet!',
                            web_app: { url: gameUrlWithUserId } // Use the URL with the userid
                        }
                    ]
                ]
            }
        }).catch(error => {
            console.error('Error sending /play message in private chat:', error);
        });
    }
    else
    {
        console.error('Error sending /play message in group chat:', error);
    }
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = 4444;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

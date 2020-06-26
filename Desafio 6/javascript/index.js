process.env.NTBA_FIX_319 = true; // Silences an annoying error message.
const TelegramBot = require('node-telegram-bot-api');
const jokempo = require('./jokempo');
const randomPhrases = require('./random-phrases');
// DESAFIO BÔNUS 1
const tokenFile = require('./token');
// DESAFIO
const commands = require('./commands');
// DESAFIO BÔNUS 3
const game = require('./dodge-or-dare');

// replace the value below with the Telegram token you receive from @BotFather
const token = tokenFile.token;

if (token === 'YOUR ACCESS TOKEN HERE') {
	console.log('You forgot to replace the access token!!! Properly read the README before continuing >:(');
	process.exit(-1);
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// DESAFIO 
// listen for a message containg /help. If it does, replies with a list of all commands fom the list
bot.onText(/\/help/, async (msg, match) => {
	const chatId = msg.chat.id;

	let ans = '';
	const commandsList = commands.commandsList;
	for (const commandName in commandsList) {
		/**
		 * /command1 - description of command1
		 * /command2 - description of command2
		 */
		ans += '/' + commandName + ' - ' + commandsList[commandName] + '\n';
	}
	
	bot.sendMessage(chatId, ans);
})

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
	const chatMessage = msg.text.trim().toLowerCase();
	const chatId = msg.chat.id;
	if (chatMessage.startsWith('ola') || chatMessage.startsWith('oi')) {
		bot.sendMessage(chatId, 'Olá! Como vai o seu dia?');
	} else if (chatMessage.includes('quem é o seu criador') || chatMessage.includes('quem te fez')) {
		// DESAFIO BÔNUS 2
		bot.sendMessage(chatId,
			'Hm? Minha mãe se chama Nicole mas talvez você esteja procurando o @lfvperes.'
		);
	} else if (jokempo.main(bot, chatId, chatMessage)) {
		return;
	} else if (game.main(bot, chatId, chatMessage)) {
		// DESAFIO BÔNUS 3
		return;
	} else if (chatMessage == '/help') {
		// DESAFIO 
		return;
	} else if (!chatMessage.includes('dare') && !chatMessage.includes('dodge')) {
		// avoid the random phrase during the game
		randomPhrases.writeRandomPhrase(bot, chatId);
	} else if (chatMessage.includes('dare') || chatMessage.includes('dodge')) {
		bot.sendMessage(chatId, 
			'Ah, você quer jogar Dodge or Dare? Legal! Digite /dod enquanto eu busco a caixa com o tabuleiro.'
			);
	}
});

console.log('Fetching data...');
bot.getMe().then(me => {
	console.log(`I'm ready to serve! Talk to me on @${me.username}`);
	console.log(`or visit this link: https://t.me/${me.username}`);
});
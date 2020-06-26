// DESAFIO 3

let isPlayingDoD = false;

// list of all Dare cards
const dares = [
    'Lamba seu próprio cotovelo!',
    'Arrote o Alfabeto Cirílico.',
    'Desenhe sua mãe no teto usando refrigerante.',
    'Construa algo para jogar uma bola na Lua usando apenas o que encontrar no lixo.',
    'Vista tudo que tem na sua casa.'
];

// list of all Dodge cards
const dodges = [
    'Agora o chão é feito de lava fervente!',
    'Gravidade aumenta 5x.',
    'Não se pode mais respirar até o jogo terminar.',
    'Fale apenas cantando.',
    'Jogue de ponta-cabeça.'
];

// how to play
const instructions = 
`Eu e meu melhor amigo Darwin criamos este jogo!
Instruções:\n
    1. Jogue o dado.\n
    2. Pegue uma carta DARE ou pegue DODGE e perca a vez.\n
    3. Se você pegou DARE, deve completar o desafio para avançar o número do dado. Se pegou DODGE, sofra as consequências. Se sair do tabuleiro, volte ao início.\n
    4. Você ganha se atingir exatamente a linha de chegada.\n\n
    No tabuleiro, o x marca a linha de chegada e o ^ é você!
`;

// the finish line is the last position
// if it's exceeded, the player starts again
let table = '^----x';
let position = 0;

let dice = 0;
/**
 * rolls the dice and expect the player to choose a card
 * @argument { import('node-telegram-bot-api') } bot 
 * @argument { number } chatId 
 */
async function roll (bot, chatId) {
    // the dice number is between 1 and 6
    // if it's 0 the dice hasn't been rolled
    dice = Math.floor(Math.random() * 5) + 1;
    await bot.sendMessage(chatId, 'Você tirou ' + dice);

    // the card options are only shown after rolling the dice
    await bot.sendMessage(chatId, 'Escolha uma carta:', {
        "reply_markup": {
            "keyboard": [["Dare"],["Dodge"],["Desistir"]],
            "one_time_keyboard": true
        }
    });
}

/**
 * starts a new turn
 * @param { import('node-telegram-bot-api') } bot 
 * @param { number } chatId 
 */
async function turn (bot, chatId) {
    // showing where the player is
    await bot.sendMessage(chatId, 'Você está aqui:[' + table + ']');    
    
    // returning the dice to default
    dice = 0;
    // start next turn
    await bot.sendMessage(chatId, 'Jogue o dado:', {
        "reply_markup": {
            "keyboard": [["Jogar"],["Desistir"]],
            "one_time_keyboard": true
        }
    });
}

/**
 * terminates the game
 * if the player won, the game ends automatically
 * if the player gives up, the game is interrupted
 * @argument { import('node-telegram-bot-api') } bot 
 * @argument { number } chatId 
 * @argument { boolean } ended if true, the player won
 */
async function gameOver (bot, chatId, ended) {
    let message = ended ? 'Uau, você ganhou!!!' : 'Uau, você é fraco.'
    await bot.sendMessage(chatId, message, {
        "remove_keyboard": true
    });
    isPlayingDoD = false;
}

/**
 * draws a card from the chosen list
 * @argument { import('node-telegram-bot-api') } bot 
 * @argument { number } chatId 
 * @argument { String } message
 */
async function draw (bot, chatId, message) {
    // the list to be chosen
    let list = [];
    if (message == 'dare') {
        list = dares;

        // return to start if the finish line is exceeded, otherwise advance
        position = (position + dice > table.length - 1) ? 0 : position + dice;
        // updating position in table
        table = table.replace("^", "-");
        table = table.slice(0, position) + "^" + table.slice(position + 1);
    } else if (message == 'dodge') {
        // if the player chooses dodge they can't advance
        list = dodges;
    }

    // choosing a random card from the choosen pile
    const number = Math.floor(Math.random() * list.length);
    await bot.sendMessage(chatId, list[number]);

    // if the player is exactly at the last position, they win
    if (position != table.length - 1) {
        // if the player didn't win yet, start next turn
        turn(bot, chatId);
    } else if (position === 5) {
        // if the player wins, terminate game
        await gameOver(bot, chatId, true);
    }
}

/**
 * start playing
 * @argument { import('node-telegram-bot-api') } bot 
 * @argument { number } chatId 
 */
function play (bot, chatId) {
    isPlayingDoD = true;

    // show game rules
    bot.sendMessage(chatId, instructions);
    
    // start first turn
    turn(bot, chatId);
}

/**
 * shows a keyboard for the user to choose between Dare or Dodge
 * @argument { import('node-telegram-bot-api') } bot 
 * @argument { number } chatId 
 */
function main (bot, chatId, message) {
    if (isPlayingDoD) {
        if (message == 'desistir') {
            // if the player gives up, interrupt the game
            gameOver(bot, chatId, false);
        } else if (dice == 0){
            // roll dice if it hasn't been rolled yet
            if (message == 'jogar') {
                roll(bot, chatId)
            }       
        } else if (dice != 0) {
            // draw the chosen card if the dice has been rolled
            // this means the message is either dodge or dare
            draw(bot, chatId, message);
        }

        return true;
    } else if (message == '/dod') {
        // starts playing
        play(bot, chatId);

        return true;
    } else { return false }
}

module.exports = {
    main
}
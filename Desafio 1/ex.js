const playerHpElement = document.getElementById('player-health');
const opponentHpElement = document.getElementById('opponent-health');

const turnText = document.getElementById('text');
let isTurnHappening = false;
/*
var music = new Audio("../poketusca.mp3");
music.play();
//console.log(music.played);
*/
let Attack = class {
  constructor(power, accuracy, name, type){
    this.power = power;
    this.accuracy = accuracy;
    this.name = name;
    this.type = type;
  }
};

class Pokemon {
  constructor({name,id, attacks, maxHp, hp, type}){
    this.name = name;
    this.id = id;
    this.attacks = attacks;
    this.maxHp = maxHp;
    this.hp = hp;
    this.type = type;
    this.isLoser = false;
  }
  updatePokemonHp(newHP) {
    // Prevents the HP to go lower than 0
    this.hp = Math.max(newHP, 0);
  
    // If player health is equal 0 opponent wins
    if (this.hp === 0) {
      this.isLoser = true;
      gameOver(this.name);
    }
  
    // Update the pokemon hp bar
    let hpElement = document.getElementById(this.id + '-health');
    const barWidth = (this.hp / this.maxHp) * 100;
    hpElement.style.width = barWidth + '%';
  }
  verifyEffect(defenseType, attackType){
    let effect = 1;
    for (let type of defenseType){
      /* The loop allows the effectiveness to be cumulative. It won't happen
      in this case, but if a Fire/Ground pokémon were to receive a
      Water-type attack, the effectiveness would be 4x, not 2x. */
      switch (type){
        /* If it is a weaker type, then the attack is more effective
        otherwise it can be less effective or normally effective */
        case 'water':
          effect *= (attackType === 'fire') ? 0.75 : 1;
          break;
        case 'flying':
          effect *= (attackType === 'fighting') ? 0.75 : 1;
          break;
        case 'fire':
          effect *= (attackType === 'water') ? 1.5
                : (attackType === 'ice') ? 0.75
                : 1;
          break;
        case 'fighting':
          effect *= (attackType === 'flying') ? 1.5 : 1;
          break;
        /* Note that "no effect" (0x) was not implemented here due to the
        absence of the types whose relations produce such state of 
        (non-)effectiveness. Also note that the values were changed to 1.5x
        and 0.75 to improve gameplay experience. */
      }
    }
    return effect;
  }
  // Every attack calls this method instead of two different functions for each attack
  attack(opponent, chosenAttack) {
    // Based on the attacks accracy, determine wether it will miss
    let hit = !willAttackMiss(chosenAttack.accuracy);
    
    // Based on the attack type and the target pokémon's type, calculate damage nerf/buff
    let effect = this.verifyEffect(opponent.type, chosenAttack.type);
    console.log(chosenAttack.name, effect);

    // If the attack hits, the target's HP will be updated
    if (hit) opponent.updatePokemonHp(opponent.hp - chosenAttack.power * effect);

    // Update HTML text with the used attack
    turnText.innerText = this.name + ' used ' + chosenAttack.name;

    // Update HTML text in case the attack misses
    turnText.innerText += (!hit) ? ', but missed!'
                      : (effect > 1) ? ', eita.'
                      : (effect < 1) ? ', kkkkkk'
                      : ' ';
    return hit;
  }
};

const heatWave = new Attack(95, 90,'Heat Wave', 'fire');
const brickBreak = new Attack(75, 90, 'Brick Break', 'fighting');
const flamethrower = new Attack(90, 100, 'Flamethrower', 'fire');
const trash = new Attack(120, 100, 'Trash', 'normal');
const hurricane = new Attack(110, 70, 'Hurricane', 'flying');
const iceFang = new Attack(65, 95, 'Ice Fang', 'ice');
const hidroPump = new Attack(110, 80, 'Hidro Pump', 'water');

var pignite = new Pokemon(
  {
    name: 'caaso',
    id: 'player',
    attacks: {
    heatWave, brickBreak, flamethrower, trash
    },
    maxHp: 574,
    hp: 574,
    type: ['fire', 'fighting']
  }
);

var gyarados = new Pokemon(
  {
  name: 'federal',
  id: 'opponent',
  attacks: {
    hurricane, iceFang, hidroPump, trash
  },
  maxHp: 550,
  hp: 550,
  type: ['water', 'flying']
  }
);

function gameOver (loser) {
  // Wait 1000 (Health loss animation)
  setTimeout(() => {
    for (player of [pignite, gyarados]) {
      if (!player.isLoser){
        // Update HTML text with the winner
        turnText.innerText = player.name + ' is the winner!';
        // Open alert with the winner
        alert(player.name + ' is the winner! Close this alert to play again');
        player.isLoser = false;
      }
    }
    // Reload the game
    window.location.reload();
  }, 1000);
}

// Check if attacks misses
function willAttackMiss (accuracy) {
  return Math.floor(Math.random() * 100) > accuracy;
}

function chooseOpponentAttack () {
  // Put all opponents attacks in a array
  let possibleAttacks = Object.values(gyarados.attacks);
  // Randomly chooses one attack from the array
  let choice = possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
  return choice
}

function turn(playerChosenAttack) {
  // Don't start another turn till the current one is not finished
  if (isTurnHappening) {
    return;
  }
  isTurnHappening = true;

  const didPlayerHit = pignite.attack(gyarados, playerChosenAttack);

  // Wait 2000ms to execute opponent attack (Player attack animation time)
  setTimeout(() => {
    // Randomly chooses opponents attack
    const opponentChosenAttack = chooseOpponentAttack();

    const didOpponentHit = gyarados.attack(pignite, opponentChosenAttack);
    
    var sprite = window.document.getElementById("sprite-gyarados");
    sprite.src = "assets/gyarados.gif";
    
    // Wait 2000ms to end the turn (Opponent attack animation time)
    setTimeout(() => {
      // Update HTML text for the next turn
      turnText.innerText = 'Please choose one attack';
      isTurnHappening = false;
      sprite.src = "assets/gyarados-idle.gif";
    }, 2000);
  }, 2000);
}

// Set buttons click interaction
document.getElementById('thunder-shock-button').addEventListener('click', function() {
  turn(pignite.attacks.heatWave);
});
document.getElementById('quick-attack-button').addEventListener('click', function() {
  turn(pignite.attacks.brickBreak);
});
document.getElementById('thunder-button').addEventListener('click', function() {
  turn(pignite.attacks.flamethrower);
});
document.getElementById('submission-button').addEventListener('click', function() {
  turn(pignite.attacks.trash);
});

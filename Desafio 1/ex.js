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
  constructor(power, accuracy, name, type, statusChange, chance){
    this.power = power;
    this.accuracy = accuracy;
    this.name = name;
    this.type = type;
    this.statusChange = {
      change: statusChange,
      chance: chance
    };
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
    this.status = {
      frozen: false,
      burnt: false,
      paralyzed: false,
      confused: false,
    }
    this.canFight = true;
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
        (non-)effectiveness. Also note that the values were changed from 2x
        and 0.5x to 1.5x and 0.75 to improve gameplay experience. */
      }
    }
    return effect;
  }
  changeStatus(attack){
    if (Math.floor(Math.random() * 100) < attack.statusChange.chance){
      
      let text = this.name + ' congelado';
      this.status[attack.statusChange.change] = true;
      this.canFight = false;
      return text;
    }else{
      return 'unchanged';
    }
  }

  // Every attack calls this method instead of two different functions for each attack
  attack(opponent, chosenAttack) {
    
    // Based on the attacks accracy, determine wether it will miss
    let hit = !willAttackMiss(chosenAttack.accuracy);
    
    // Based on the attack type and the target pokémon's type, calculate damage nerf/buff
    let effect = this.verifyEffect(opponent.type, chosenAttack.type);

    // If the attack hits, the target's HP will be updated
    if (hit) opponent.updatePokemonHp(opponent.hp - chosenAttack.power * effect);

    // Update HTML text with the used attack
    
    turnText.innerText = this.name + ' used ' + chosenAttack.name;

    /* Update HTML text on three cases: the attack misses, the attack is 
    super effective or the attack is not very effective  */
    if(!this.canFight){
      for (stat in this.status){
        if (this.status[stat]){
          turnText.innerText = this.name + ' is ' + stat;
        }
      }
    }else{
      turnText.innerText += (!hit) ? ', but missed!'
                  : (effect > 1) ? ", it's super effective!"
                  : (effect < 1) ? ", it's not very effective..."
                  : '!';    
    console.log(turnText.innerText);
    }

    let statusText = opponent.changeStatus(chosenAttack);

    return statusText;
  }
};

const heatWave = new Attack(95, 90,'Heat Wave', 'fire', 'frozen', 0);
const flamethrower = new Attack(90, 100, 'Flamethrower', 'fire', 'frozen', 0);
const ember = new Attack(40, 100, 'Ember', 'fire', 'frozen', 0);
const brickBreak = new Attack(75, 90, 'Brick Break', 'fighting', 'frozen', 80);
const trash = new Attack(120, 100, 'Trash', 'normal', 'frozen', 80);
const tackle = new Attack(40, 100, 'Tackle', 'normal', 'frozen', 0);
const roar = new Attack(0, 100, 'Roar', 'normal', 'frozen', 100);
const hurricane = new Attack(110, 70, 'Hurricane', 'flying', 'frozen', 80);
const iceFang = new Attack(65, 95, 'Ice Fang', 'ice', 'frozen', 80);
const hidroPump = new Attack(110, 80, 'Hidro Pump', 'water', 'frozen', 80);

var tepig = new Pokemon(
  {
    name: 'bixo caaso',
    id: 'player',
    attacks: {ember, tackle, flamethrower, roar},
    maxHp: 300,
    hp: 300,
    type: ['fire']
  }
);

var pignite = new Pokemon(
  {
    name: 'caaso',
    id: 'player-evolved',
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

function prompt (text){
  setTimeout(() =>{
    
    turnText.innerText = text;
    console.log(turnText.innerText);
  }, 3000);
}

function gameOver (loser) {
  // Wait 1000 (Health loss animation)
  setTimeout(() => {
    for (player of [pignite, gyarados]) {
      if (!player.isLoser){
        // Update HTML text with the winner
        
        turnText.innerText = player.name + ' is the winner!';
        console.log(turnText.innerText);
        // Open alert with the winner
        alert(player.name + ' is the winner! Close this alert to play again');
        player.isLoser = false;
      }
    }
    // Reload the game
    window.location.reload();
  }, 3000);
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
  return choice;
}

function statusBack (pokemon){
  // After one turn, the pokémon stops being frozen
  for (let stat in pokemon.status){
    if (pokemon.status[stat]){
      pokemon.status[stat] = false;
      
      turnText.innerText = pokemon.name + ' is not ' + stat + ' anymore';
      console.log(turnText.innerText);
    }
  }
}

function turn(playerChosenAttack) {
  if (isTurnHappening) {
    return;
  }
  isTurnHappening = true;

  statusBack(gyarados);
  setTimeout(() => {
    statusOpponent = tepig.attack(gyarados, playerChosenAttack);
    
    setTimeout(() =>{
      // Display a text saying the enemy has been burned, paralized etc
      for (stat in gyarados.status){
        if (gyarados.status[stat]){
          console.log(gyarados.name, gyarados.status, stat, gyarados.status[stat]);
          
          turnText.innerText = statusOpponent;
          console.log(turnText.innerText);
        }
      }

      setTimeout(() => {

        statusBack(tepig);

          setTimeout(() => {  

          const opponentChosenAttack = chooseOpponentAttack();
          
          statusPlayer = gyarados.attack(tepig, opponentChosenAttack);
          var sprite = window.document.getElementById("sprite-gyarados");
          sprite.src = "assets/gyarados.gif";

          setTimeout(() => {
            for (stat in tepig.status){
              if (tepig.status[stat]){
                console.log(tepig.name, tepig.status, stat, tepig.status[stat]);
                
                turnText.innerText = statusPlayer;
                console.log(turnText.innerText);
              }
            }
            

            setTimeout(() => {
              // Update HTML text for the next turn
              turnText.innerText = 'Please choose one attack';
              console.log(turnText.innerText);
              isTurnHappening = false;
              sprite.src = "assets/gyarados-idle.gif";
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  }, 1200);

}

// Set buttons click interaction
var option = document.getElementsByClassName("attack-button");

for (let i = 0; i < option.length; i++){
  option[i].addEventListener('click', function(){
    turn(tepig.attacks[option[i].id]);
  })
  option[i].innerText = tepig.attacks[option[i].id].name;
}

//Añadir Easter egg y musica medieval de fondo
//Dodge: hacer que funcione

// Define variables
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// Still defining variables, but...
// get HTML elements references
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const text = document.querySelector("#text");

// Still defining variables...
// The data stored will be objects
const locations =
    [
        {
            name: "go store",
            buttonText: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to Town Square"],
            buttonFunction: [buyHealth, buyWeapon, goTown],
            text: "You enter the store."
        },
        {
            name: "go cave",
            buttonText: ["Fight slime", "Fight fang beast", "Go to Town Square"],
            buttonFunction: [fightSlime, fightBeast, goTown],
            text: "You enter the cave. You see some monsters."
        },
        {
            name: "fight",
            buttonText: ["Attack", "Dodge", "Run"],
            buttonFunction: [attack, dodge, goTown],
            text: "You are fighting a monster."
        },
        {
            name: "lose",
            buttonText: ["Replay?", "Replay?", "Replay?"],
            buttonFunction: [restart, restart, restart],
            text: "You die. 💀"
        },
        {
            name: "defeat monster",
            buttonText: ["Go to Town Square", "Go to Town Square", "Go to Town Square"],
            buttonFunction: [goTown, easterEgg, goTown],
            text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
        },
        {
            name: "win",
            buttonText: ["Replay?", "Replay?", "Replay?"],
            buttonFunction: [restart, restart, restart],
            text: "You defeat the dragon! YOU WIN THE GAME! 🎉"
        },
        {
            name: "town square",
            buttonText: ["Go to store", "Go to cave", "Fight dragon"],
            buttonFunction: [goStore, goCave, fightDragon],
            text: "You are in the town square."
        },
        {
            name: "town square  (beginning)",
            buttonText: ["Go to store", "Go to cave", "Fight dragon"],
            buttonFunction: [goStore, goCave, fightDragon],
            text: "Welcome to Dragon Repeller. You must defeat the dragon that is preventing people from leaving the town. You are in the town square. Where do you want to go? Use the buttons above."
        },
        {
            name: "easter egg",
            buttonText: ["2", "8", "Go to town square?"],
            buttonFunction: [pickTwo, pickEight, goTown],
            text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
        }
    ];

const weapons =
    [
        {
            name: "stick",
            power: 5
        },
        {
            name: "dagger",
            power: 30
        },
        {
            name: "claw hammer",
            power: 50
        },
        {
            name: "soared",
            power: 100
        }
    ];

const monsters =
    [
        {
            name: "slime",
            level: 2,
            health: 15
        },
        {
            name: "fanged beast",
            level: 8,
            health: 60
        },
        {
            name: "dragon",
            level: 20,
            health: 300
        }
    ];

// Initialize variables
xpText.innerText = xp;
healthText.innerText = health;
goldText.innerText = gold;

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Creating funtions
function goStore() {
    update(locations[0]);
}

function goCave() {
    update(locations[1]);
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function buyHealth() {

    if (gold >= 10) {
        gold -= 10;
        health += 10;

        healthText.innerText = health;
        goldText.innerText = gold;
    } else {
        text.innerText = "You do not have enough gold to buy health."
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;

            goldText.innerText = gold;

            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You have a new weapon: " + newWeapon + ".";

            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }

}

function sellWeapon() {
    if (inventory.length - 1 > 0) {
        gold += 15;

        let currentWeapon = inventory.shift();

        goldText.innerText = gold;

        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }

}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function goFight() {
    update(locations[2]);
    monster = monsters[fighting];
    monsterNameText.innerText = monster.name;
    monsterHealthText.innerText = monster.health;
    monsterHealth = monster.health;
    monsterStats.style.display = "block";

}

function attack() {
    monster = monsters[fighting];
    text.innerText = "The " + monster.name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += "\n\nYou miss. ";
    }

    health -= getMonsterAttackValue(monster.level);
    monsterHealthText.innerText = monsterHealth;
    healthText.innerText = health;

    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        fighting === 2 ? win() : defeatMonster();
    }

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += "\n\nYour " + inventory.pop() + " breaks";
        currentWeapon--;
    }
}

function getMonsterAttackValue(level) {
    let hit = (monster.level * 5) - (Math.floor(Math.random() * xp)) + 1
    console.log("Monster attack value = " + hit);
    return hit;
}

function isMonsterHit() {
    return Math.random() > 0.1 || health < 20;
}

function dodge(monster) {
    monster = monsters[fighting];
    text.innerText += " You dodge the attack from the " + monster.name + ".";
}

function lose() {
    update(locations[3]);
}

function defeatMonster() {
    monster = monsters[fighting];
    xp += monster.level;
    gold += Math.floor(monster.level * 6.7);
    xpText.innerText = xp;
    goldText.innerText = gold;
    update(locations[4]);
}

function win() {
    update(locations[5]);
}


function goTown() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    fighting;
    monsterHealth;
    inventory = ["stick"];
    xpText.innerText = xp;
    healthText.innerText = health;
    goldText.innerText = gold;
    update(locations[7]);
}

function easterEgg() {
    update(locations[8]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers: ";

    for (let i = 0; i < 10; i++) {
        if (i !== numbers.length - 1) {
            text.innerText += " " + numbers[i] + ",";
        } else {
            text.innerText += " " + numbers[i] + ".";
        }
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += " Right! You win 20 gold!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += " Wrong! You lose 10 health!"
        health -= 10;
        healthText.innerText = health
        if (health <= 0) {
            lose();
        }
    }
}

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location.buttonText[0];
    button2.innerText = location.buttonText[1];
    button3.innerText = location.buttonText[2];

    button1.onclick = location.buttonFunction[0];
    button2.onclick = location.buttonFunction[1];
    button3.onclick = location.buttonFunction[2];

    text.innerText = location.text;
}
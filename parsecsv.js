 // Get the username from the URL
  urlParams = new URLSearchParams(window.location.search);
  username = localStorage.getItem('username');
  let character = {};
  let characters = [];

  function getArmor(armors, character) {
    //INPUT
    //classification    ,name          ,armor type ,item value    ,charm value  ,has weight
    //armor             ,guards armor  ,15         ,0             ,0            ,1

    //OUTPUT
    //armor type    ,name           ,physical bonus ,item value  ,charm value   ,armor penalty  ,wearable
    //Medium        ,Guards Armor   ,4              ,0           ,0             ,10             ,true


    let bestarmor = 0;
    let bestarmorindex = 0;

    for (let i = 0; i < armors.length; i++) {
        let armor = 0;
        if (armors[i][2] == 0) { // Minimal armor
            pb = Number(character.stamina) + Number(character.agility) + Number(character.power) + Number(character.dodge) + Number(character.athletics);
            armor = Number(armors[i][2]) + Number(armors[i][3]) + Number(armors[i][4]) + pb;
            armors[i][0] = 'Minimal(0)';
            armors[i][2] = pb;
            armors[i][5] = 0;
            armors[i][6] = true;
        } else if (armors[i][2] == 5) { // Light armor
            pb = Number(character.stamina) + Number(character.agility) + Number(character.dodge);
            armor = Number(armors[i][4]) + Number(armors[i][2]) + Number(armors[i][3]) + pb;
            armors[i][0] = 'Light(5)';
            armors[i][2] = pb;
            armors[i][5] = 0;
            armors[i][6] = true;
        } else if (armors[i][2] == 15) { // Medium armor
            pb = Number(character.stamina) + Number(character.agility) + Number(character.power);
            armor = Number(armors[i][4]) + Number(armors[i][2]) + Number(armors[i][3]) + pb;
            armors[i][0] = 'Medium(15)';
            armors[i][2] = pb;
            if (armors[i][5] == 1 && character.carry + character.stamina >= 4) { // has weight, can be carried
                armors[i][5] = Math.max(15 - character.carry - character.stamina, 0);
                armors[i][6] = true;
            }
            else if (armors[i][5] == 1) { // has weight, can't be carried
                armors[i][5] = 10;
                armors[i][6] = false;
            }
            else { //doesn't have weight
                armors[i][5] = 0;
                armors[i][6] = true;
            }
        } else if (armors[i][2] == 20) { // Heavy armor
            pb = Number(character.stamina) + Number(character.power);
            armor = Number(armors[i][4]) + Number(armors[i][2]) + Number(armors[i][3]) + pb;
            armors[i][0] = 'Heavy(20)';
            armors[i][2] = pb;
            if (armors[i][5] == 1 && character.carry + character.stamina >= 6) { // has weight, can be carried
                armors[i][5] = 15 - character.carry - character.stamina;
                armors[i][6] = true;
            }
            else if (armors[i][5] == 1) {
                armors[i][5] = 15;
                armors[i][6] = false;
            }
            else { //doesn't have weight
                armors[i][5] = 0;
                armors[i][6] = true;
            }
        } else { // Immense armor
            pb = Number(character.stamina);
            armor = Number(armors[i][4]) + Number(armors[i][2]) + Number(armors[i][3]) + pb;
            armors[i][0] = 'Immense(25)';
            armors[i][2] = pb;
            if (armors[i][5] == 1 && character.carry + character.stamina >= 10) { // has weight, can be carried
                armors[i][5] = 25 - character.carry - character.stamina;
                armors[i][6] = true;
            }
            else if (armors[i][5] == 1) {
                armors[i][5] = 25;
                armors[i][6] = false;
            }
            else { //doesn't have weight
                armors[i][5] = 0;
                armors[i][6] = true;
            }
        }
        if (armor > bestarmor) {
            bestarmor = armor;
            bestarmorindex = i;
        }
    }

    armors[bestarmorindex][1] = armors[bestarmorindex][1] + ' (equipped)';
    character.armorpenalty = armors[bestarmorindex][5];
    
    if (character.SD6 === 'A') {
        bestarmor += 1;
    }

    return bestarmor;
  }

  function getWeapons(weapons, character) {
    //INPUT
    //classification    ,name         ,weapon type  ,item value    ,charm value ,type    ,range
    //weapon            ,atropos      ,8            ,0             ,0           ,melee   ,1

    //OUTPUT
    //weapon type    ,name      ,item value  ,charm value   ,actions    ,attack bonus   ,damage ,range
    //Medium         ,atropos   ,0           ,0             ,1          ,7              ,1d8    ,1

    for (let i = 0; i < weapons.length; i++) {
        let actions = 0;
        let attackbonus = 0;
        let damage = 0;
        let range = weapons[i][6];

        let meleeattackbonus = Math.max(Number(character.power_melee) + Number(character.power), Number(character.agility_melee), Number(character.agility));
        let rangedattackbonus = Math.max(Number(character.power_ranged) + Number(character.power), Number(character.agility_ranged), Number(character.agility));

        if (weapons[i][5] == 'melee') {
            attackbonus = meleeattackbonus;
        } else if (weapons[i][5] == 'ranged') {
            attackbonus = rangedattackbonus;
        } else {
            attackbonus = meleeattackbonus + " / " + rangedattackbonus;
        }

        if (weapons[i][2] == 4) { // Minimal weapon
            actions = 0.5;
            damage = '1d4';
            weapons[i][0] = 'Minimal';
        } else if (weapons[i][2] == 6) { // Light weapon
            actions = 1;
            damage = '1d6';
            weapons[i][0] = 'Light';
        } else if (weapons[i][2] == 8) { // Medium weapon
            actions = 1;
            damage = '1d8';
            weapons[i][0] = 'Medium';
        } else if (weapons[i][2] == 10) { // Heavy weapon
            actions = 1;
            damage = '1d10';
            weapons[i][0] = 'Heavy';
        } else { // Immense weapon
            actions = 2;
            damage = '1d12';
            weapons[i][0] = 'Immense';
        }
        weapons[i][2] = weapons[i][3];
        weapons[i][3] = weapons[i][4];
        weapons[i][4] = actions;
        weapons[i][5] = attackbonus;
        weapons[i][6] = damage;
        weapons[i][7] = range;
    }
}

  function getPoints(character) {
    excessskills = Number(character.athletics) + Number(character.presence) + Number(character.power_melee) + Number(character.power_ranged) + Number(character.dodge) + Number(character.agility_melee) + Number(character.agility_ranged) + Number(character.stealth) + Number(character.tolerance) + Number(character.endure) + Number(character.carry) + Number(character.grit) + Number(character.attack) + Number(character.create) + Number(character.defence) + Number(character.decipher) + Number(character.history) + Number(character.medicine) + Number(character.skills_tools) + Number(character.recover) + Number(character.deception) + Number(character.inspire) + Number(character.performance) + Number(character.persuasion) + Number(character.alertness) + Number(character.detect) + Number(character.insight) + Number(character.investigation) + Number(character.occult) + Number(character.ritual) + Number(character.spells) - 18;
        
    let bonusattributes = 0;

    if (character.SD1[0] === 'A') {
        bonusattributes = 3;
    } else if (character.SD1[0] === 'B') {
        bonusattributes = 4;
    } else {
        bonusattributes = 5;
    }
    excessattributes = Number(character.power) + Number(character.agility) + Number(character.stamina) + Number(character.intelligence) + Number(character.knowledge) + Number(character.charisma) + Number(character.perception) - 7 - bonusattributes;

    excesstraditions = Number(character.charm) + Number(character.spark) + Number(character.reify) + Number(character.mind) + Number(character.shift) + Number(character.time) + Number(character.life) + Number(character.transform) + Number(character.spirit) - 15;

    return Number(character.level) * 3 - excessskills / 2 - excessattributes - excesstraditions - Number(character.abilities);
}

function getArcane(character) {
    totalTraditions = Number(character.charm) + Number(character.spark) + Number(character.reify) + Number(character.mind) + Number(character.shift) + Number(character.time) + Number(character.life) + Number(character.transform) + Number(character.spirit);
    character.arcane = Math.round(totalTraditions / 5 - 0.01);
}

  // Read the contents of "characters.csv"
  fetch('characters.csv')
    .then(response => response.text())
    .then(data => {
        // Parse the CSV data into an array of objects
        characters = data.split('\n').map(line => {
            const [name,level,player,deity,species,alignment,power,agility,stamina,intelligence,knowledge,charisma,perception,charm,spark,reify,mind,shift,time,life,transform,spirit,current_psyche,current_mana,recover_dots,recovery_dice,grievous_wounds,current_hp,death_timer,inventory,copper,silver,gold,platinum,SD1,SD2,SD3,SD4,SD5,SD6,abilities,athletics,presence,power_melee,power_ranged,dodge,agility_melee,agility_ranged,stealth,tolerance,endure,carry,grit,attack,create,defence,decipher,history,medicine,skills_tools,recover,deception,inspire,performance,persuasion,alertness,detect,insight,investigation,occult,ritual,spells] = line.split(',');
            return {name, level,player,deity,species,alignment,power,agility,stamina,intelligence,knowledge,charisma,perception,charm,spark,reify,mind,shift,time,life,transform,spirit,current_psyche,current_mana,recover_dots,recovery_dice,grievous_wounds,current_hp,death_timer,inventory,copper,silver,gold,platinum,SD1,SD2,SD3,SD4,SD5,SD6,abilities,athletics,presence,power_melee,power_ranged,dodge,agility_melee,agility_ranged,stealth,tolerance,endure,carry,grit,attack,create,defence,decipher,history,medicine,skills_tools,recover,deception,inspire,performance,persuasion,alertness,detect,insight,investigation,occult,ritual,spells};
        });

        // Find the character object that matches the username
        character = characters.find(c => c.name === username);

        armors = [];
        weapons = [];
        items = [];

        character.inventory = character.inventory.replaceAll('{', '').split('}');
        for (let i = 0; i < character.inventory.length; i++) {
            character.inventory[i] = character.inventory[i].split(';');
            if (character.inventory[i][0] === 'weapon') {
                weapons.push(character.inventory[i]);
            }
            else if (character.inventory[i][0] === 'armor') {
                armors.push(character.inventory[i]);
            }
            else if (character.inventory[i][0] === 'item') {
                items.push(character.inventory[i][1]);
            }
        }

        getWeapons(weapons, character);

        character.ac = getArmor(armors, character);

        character.points = getPoints(character);

        getArcane(character);

        // Populate the HTML elements with the character's data
        if (!! document.getElementById('level')) {
            document.getElementById('level').textContent = character.level;
        }
        if (!! document.getElementById('name')) {
            document.getElementById('name').textContent = character.name;
        }
        if (!! document.getElementById('xp')) {
            document.getElementById('xp').textContent = character.xp;
        }
        if (!! document.getElementById('points')) {
            document.getElementById('points').textContent = character.points;
        }
        if (!! document.getElementById('player')) {
            document.getElementById('player').textContent = character.player;
        }
        if (!! document.getElementById('deity')) {
            document.getElementById('deity').textContent = character.deity;
        }
        if (!! document.getElementById('species')) {
            document.getElementById('species').textContent = character.species;
        }
        if (!! document.getElementById('alignment')) {
            document.getElementById('alignment').textContent = character.alignment;
        }
        if (!! document.getElementById('crawl')) {
            document.getElementById('crawl').textContent = (Number(character.agility) + Number(character.shift)) / 2 > 1 ? Math.round((Number(character.agility) + Number(character.shift)) / 2 - 0.01) : 1;
        }
        if (!! document.getElementById('run')) {
            document.getElementById('run').textContent = (Number(character.agility) + Number(character.shift)) > 3 ? Math.round((Number(character.agility) + Number(character.shift))) : 3;
        }
        if (!! document.getElementById('sprint')) {
            document.getElementById('sprint').textContent = (Number(character.agility) + Number(character.shift)) > 6 ? Math.round((Number(character.agility) + Number(character.shift)) * 2) : 3;
        }
        if (!! document.getElementById('power')) {
            document.getElementById('power').textContent = character.power;
        }
        if (!! document.getElementById('athletics')) {
            document.getElementById('athletics').textContent = character.athletics - character.armorpenalty;
        }
        if (!! document.getElementById('presence')) {
            document.getElementById('presence').textContent = character.presence;
        }
        if (!! document.getElementById('powerMelee')) {
            document.getElementById('powerMelee').textContent = character.power_melee;
        }
        if (!! document.getElementById('powerRanged')) {
            document.getElementById('powerRanged').textContent = character.power_ranged;
        }
        if (!! document.getElementById('agility')) {
            document.getElementById('agility').textContent = character.agility;
        }
        if (!! document.getElementById('dodge')) {
            document.getElementById('dodge').textContent = character.dodge - character.armorpenalty;
        }
        if (!! document.getElementById('agilityMelee')) {
            document.getElementById('agilityMelee').textContent = character.agility_melee;
        }
        if (!! document.getElementById('agilityRanged')) {
            document.getElementById('agilityRanged').textContent = character.agility_ranged;
        }
        if (!! document.getElementById('stealth')) {
            document.getElementById('stealth').textContent = character.stealth - character.armorpenalty;
        }
        if (!! document.getElementById('stamina')) {
            document.getElementById('stamina').textContent = character.stamina;
        }
        if (!! document.getElementById('tolerance')) {
            document.getElementById('tolerance').textContent = character.tolerance;
        }
        if (!! document.getElementById('endure')) {
            document.getElementById('endure').textContent = character.endure;
        }
        if (!! document.getElementById('carry')) {
            document.getElementById('carry').textContent = character.carry;
        }
        if (!! document.getElementById('grit')) {
            document.getElementById('grit').textContent = character.grit;
        }
        if (!! document.getElementById('intelligence')) {
            document.getElementById('intelligence').textContent = character.intelligence;
        }
        if (!! document.getElementById('attack')) {
            document.getElementById('attack').textContent = character.attack;
        }
        if (!! document.getElementById('create')) {
            document.getElementById('create').textContent = character.create;
        }
        if (!! document.getElementById('defence')) {
            document.getElementById('defence').textContent = character.defence;
        }
        if (!! document.getElementById('decipher')) {
            document.getElementById('decipher').textContent = character.decipher;
        }
        if (!! document.getElementById('knowledge')) {
            document.getElementById('knowledge').textContent = character.knowledge;
        }
        if (!! document.getElementById('history')) {
            document.getElementById('history').textContent = character.history;
        }
        if (!! document.getElementById('medicine')) {
            document.getElementById('medicine').textContent = character.medicine;
        }
        if (!! document.getElementById('skillsTools')) {
            document.getElementById('skillsTools').textContent = character.skills_tools;
        }
        if (!! document.getElementById('recover')) {
            document.getElementById('recover').textContent = character.recover;
        }
        if (!! document.getElementById('charisma')) {
            document.getElementById('charisma').textContent = character.charisma;
        }
        if (!! document.getElementById('deception')) {
            document.getElementById('deception').textContent = character.deception;
        }
        if (!! document.getElementById('inspire')) {
            document.getElementById('inspire').textContent = character.inspire;
        }
        if (!! document.getElementById('performance')) {
            document.getElementById('performance').textContent = character.performance;
        }
        if (!! document.getElementById('persuasion')) {
            document.getElementById('persuasion').textContent = character.persuasion;
        }
        if (!! document.getElementById('perception')) {
            document.getElementById('perception').textContent = character.perception;
        }
        if (!! document.getElementById('alertness')) {
            document.getElementById('alertness').textContent = character.alertness;
        }
        if (!! document.getElementById('detect')) {
            document.getElementById('detect').textContent = character.detect;
        }
        if (!! document.getElementById('insight')) {
            document.getElementById('insight').textContent = character.insight;
        }
        if (!! document.getElementById('investigation')) {
            document.getElementById('investigation').textContent = character.investigation;
        }
        if (!! document.getElementById('arcane')) {
            document.getElementById('arcane').textContent = character.arcane;
        }
        if (!! document.getElementById('occult')) {
            document.getElementById('occult').textContent = character.occult;
        }
        if (!! document.getElementById('ritual')) {
            document.getElementById('ritual').textContent = character.ritual;
        }
        if (!! document.getElementById('spells')) {
            document.getElementById('spells').textContent = character.spells;
        }
        if (!! document.getElementById('charm')) {
            document.getElementById('charm').textContent = character.charm;
        }
        if (!! document.getElementById('spark')) {
            document.getElementById('spark').textContent = character.spark;
        }
        if (!! document.getElementById('reify')) {
            document.getElementById('reify').textContent = character.reify;
        }
        if (!! document.getElementById('mind')) {
            document.getElementById('mind').textContent = character.mind;
        }
        if (!! document.getElementById('shift')) {
            document.getElementById('shift').textContent = character.shift;
        }
        if (!! document.getElementById('time')) {
            document.getElementById('time').textContent = character.time;
        }
        if (!! document.getElementById('life')) {
            document.getElementById('life').textContent = character.life;
        }
        if (!! document.getElementById('transform')) {
            document.getElementById('transform').textContent = character.transform;
        }
        if (!! document.getElementById('spirit')) {
            document.getElementById('spirit').textContent = character.spirit;
        }
        if (!! document.getElementById('maxPsyche')) {
            document.getElementById('maxPsyche').textContent = (10 + Number(character.intelligence) + Number(character.mind) + (character.SD6 === 'E' ? 1 : 0));
        }
        if (!! document.getElementById('currentPsyche')) {
            document.getElementById('currentPsyche').textContent = character.current_psyche;
        }
        if (!! document.getElementById('maxMana')) {
            document.getElementById('maxMana').textContent = 100 + character.level * 10;
        }
        if (!! document.getElementById('currentMana')) {
            document.getElementById('currentMana').textContent = character.current_mana;
        }
        if (!! document.getElementById('recoveryDots')) {
            document.getElementById('recoveryDots').textContent = character.recovery_dots;
        }
        if (!! document.getElementById('maxRecoveryDice')) {
            document.getElementById('maxRecoveryDice').textContent = character.maxRecoveryDice;
        }
        if (!! document.getElementById('recoveryDice')) {
            document.getElementById('recoveryDice').textContent = character.recovery_dice;
        }
        if (!! document.getElementById('maxHP')) {
            document.getElementById('maxHP').textContent = (Number(character.stamina) + Number(character.life)) * Number(character.level);
        }
        if (!! document.getElementById('grievousWounds')) {
            document.getElementById('grievousWounds').textContent = character.grievous_wounds;
        }
        if (!! document.getElementById('modifiedMaxHP')) {
            document.getElementById('modifiedMaxHP').textContent = Math.round((Number(character.stamina) + Number(character.life)) * Number(character.level) / Math.pow(2, character.grievous_wounds) - 0.01);
        }
        if (!! document.getElementById('currentHP')) {
            document.getElementById('currentHP').textContent = character.current_hp;
        }
        if (!! document.getElementById('deathTimer')) {
            document.getElementById('deathTimer').textContent = character.death_timer;
        }
        if (!! document.getElementById('ac')) {
            document.getElementById('ac').textContent = character.ac;
        }
        if (!! document.getElementById('initiative')) {
            document.getElementById('initiative').textContent = Number(character.agility) + Number(character.time);
        }
        if (!! document.getElementById('attacks')) {
            document.getElementById('attacks').textContent = character.attacks;
        }
        if (!! document.getElementById('items')) {
            document.getElementById('items').textContent = items;
        }
        if (!! document.getElementById('weapons')) {
            element = document.getElementById('weapons');
            for (let i = 0; i < weapons.length; i++) {
                element.innerHTML += '<tr><td>' + weapons[i][1] + '</td><td>' + weapons[i][0] + '</td> <td>' + weapons[i][2] + '</td> <td>' + weapons[i][3] + '</td><td>' + weapons[i][4] + '</td><td>' + weapons[i][5] + '</td><td>' + weapons[i][6] + '</td><td>' + weapons[i][7] + '</td></tr>';
            }
        }
        if (!! document.getElementById('armors')) {
            element = document.getElementById('armors');
            for (let i = 0; i < armors.length; i++) {
                element.innerHTML += '<tr><td>' + armors[i][1] + '</td><td>' + armors[i][0] + '</td> <td>' + armors[i][3] + '</td> <td>' + armors[i][4] + '</td><td>' + armors[i][2] + '</td><td>' + armors[i][5] + '</td> <td>' + armors[i][6] + '</td></tr>';
            }
        }
        if (!! document.getElementById('copper')) {
            document.getElementById('copper').textContent = character.copper;
        }
        if (!! document.getElementById('silver')) {
            document.getElementById('silver').textContent = character.silver;
        }
        if (!! document.getElementById('gold')) {
            document.getElementById('gold').textContent = character.gold;
        }
        if (!! document.getElementById('platinum')) {
            document.getElementById('platinum').textContent = character.platinum;
        }
    });
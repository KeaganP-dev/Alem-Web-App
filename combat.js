// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var alt_url = window.location.href.replace('combat.html', 'update-csv-text').split('?')[0]; // Updated endpoint
var method = "POST";

function send_request(character_name, attribute, value) {
    xhr.open(method, alt_url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var data = {
        'character' : character_name,
        'attribute' : attribute,
        'value' : value
    };

    var jsonData = JSON.stringify(data);

    // Send the request
    xhr.send(jsonData);

    // Handle the response
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Request was successful
            console.log("Request was successful")
            location.reload();
            var response = JSON.parse(xhr.responseText);
            return response;
        } else {
            // Request failed
            console.error("Request failed. Status: " + xhr.status);
        }
    };

    xhr.onerror = function() {
        // Request error
        console.error("Request error");
    };
}

function change_field_stat(element, value) {
    // console.log(element);
    // console.log(value);
    // console.log(character[element]);

    let attribute_value = 0;

    if (value.includes('+')) {
        value = value.replace('+', '');
        attribute_value = parseInt(character[element.toLowerCase()]) + parseInt(value);
    } else if (value.includes('-')) {
        value = value.replace('-', '');
        attribute_value = parseInt(character[element.toLowerCase()]) - parseInt(value);
    } else {
        attribute_value = parseInt(value);
    }

    if(element == 'Death_Timer' && attribute_value >= 0 && attribute_value <= 10 || 
    element == 'Recovery_Dots' && attribute_value >= 0 && Number(character.grievous_wounds) > 0 ||
    element == 'Recovery_Dice' && attribute_value >= 0 && attribute_value <= Number(character.maxRecoveryDice)) {
        if (element == 'Recovery_Dots' && attribute_value >= 9) {
            attribute_value -= 9;
            grievous_wounds = Number(character.grievous_wounds) - 1;
            current_hp = Number(character.current_hp);
            if(current_hp == 0)
                current_hp = 1;
            if(grievous_wounds == 0)
                attribute_value = 0;


            send_request(character.name, 'grievous_wounds,current_hp,' + element.toLowerCase(), grievous_wounds + ',' + current_hp + ',' + attribute_value)
        } else {
            send_request(character.name, element.toLowerCase(), attribute_value);
        }
    }
}

function button_submit_form(element) {
    parent_element = document.getElementById(element.parentElement);

    element.disabled = true;

    new_form = document.createElement("form");
    new_input_field = document.createElement("input");
    new_input_field.type = "number";
    new_input_field.value = "";
    new_input_field.id = element.id;
    new_input = document.createElement("input");
    new_input.type = "submit";
    new_input.value = "";
    new_input.id = element.id;

    new_form.appendChild(new_input_field);
    new_form.appendChild(new_input);
    // new_form.appendChild(new_li);
        
    if (element.children.length < 1) {
        element.appendChild(new_form);
    }

    function handleForm (event) { event.preventDefault(); }
    new_input.addEventListener('click', function() {
        if (element.id == 'heal') {
            if (Number(character.current_hp) + parseInt(new_input_field.value) <= Number(character.modified_max_hp)) {
                send_request(character.name, 'current_hp', (Number(character.current_hp) + Number(new_input_field.value)));
            } else {
                send_request(character.name, 'current_hp', (Number(character.modified_max_hp)));
            }
        } else if (element.id == 'damage') {
            damage_taken = new_input_field.value;
            current_hp = Number(character.current_hp);
            modified_max_hp = Number(character.modified_max_hp);
            grievous_wounds = Number(character.grievous_wounds);
            death_timer = Number(character.death_timer);
            recovery_dice = Number(character.recovery_dice);

            max_grievous_wounds = grievous_wounds;
            for (let i = modified_max_hp; i >= 20; i = Math.round(i / 2 - 0.01)) {
                max_grievous_wounds += 1;
            }

            if (current_hp - damage_taken > 0) { //zero grievous wounds, no death
                current_hp = current_hp - damage_taken;
            } else if (100 + current_hp > damage_taken && damage_taken >= current_hp){ //1 grievous wound
                if (modified_max_hp >= 20) { //no dying
                    grievous_wounds += 1;
                    grievous_wounds = grievous_wounds + Math.round((damage_taken - current_hp) / 100);
                    modified_max_hp = Math.round(modified_max_hp / 2-0.01);
                    current_hp = modified_max_hp;
                } else { //yes dying
                    if (current_hp == 0) {
                        death_timer += Math.max(Math.round((damage_taken - current_hp - 5) / 10), 1);
                    } else {
                        death_timer += 1 + Math.round((damage_taken - current_hp) / 10);
                    }
                    current_hp = 0;
                    recovery_dice = 0;
                }
            } else if (damage_taken >= 100 + current_hp) { //multiple grievous wounds
                grievous_wounds += 1 + Math.round((damage_taken - current_hp) / 100);
                if (grievous_wounds <= max_grievous_wounds) { //no dying 
                    for (let i = 0; i < grievous_wounds; i++) {
                        modified_max_hp = Math.round(modified_max_hp / 2-0.01);
                    }
                    current_hp = modified_max_hp;
                } else { //yes dying
                    grievous_wounds = max_grievous_wounds;
                    excess_damage = damage_taken - current_hp - max_grievous_wounds * 100;
                    if (current_hp == 0) {
                        death_timer += Math.max(Math.round((excess_damage - 5) / 10), 1);
                    } else {
                        death_timer += 1 + Math.round((excess_damage) / 10);
                    }
                    current_hp = 0;
                    recovery_dice = 0;
                }
            } 
            send_request(character.name, 'current_hp,grievous_wounds,death_timer,recovery_dice', 
            current_hp + ',' + grievous_wounds + ',' + death_timer + ',' + recovery_dice);
        } else if (element.id == 'temp_hp') {
            send_request(character.name, 'current_hp', (Number(character.current_hp) + Number(new_input_field.value)));
        } 
        handleForm(event);
    })
}


const listofinputs = document.getElementsByClassName('inputfield');

for (let i = 0; i < listofinputs.length; i++) {
    function handleForm (event) { event.preventDefault(); }
    listofinputs[i].addEventListener("click", function() { change_field_stat(listofinputs[i].parentElement.children[0].id, listofinputs[i].parentElement.children[0].value);
    handleForm(event); });
}

const listofbuttons = document.getElementsByClassName('inputbutton');

for (let i = 0; i < listofbuttons.length; i++) {
    listofbuttons[i].addEventListener("click", function() {button_submit_form(listofbuttons[i])});
}
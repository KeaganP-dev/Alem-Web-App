// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var url = window.location.href.replace('index.html', 'update-csv-text').split('?')[0]; // Updated endpoint
var method = "POST";

function send_request(character_name, attribute, value) {
    xhr.open(method, url, true);

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

function change_field_stat(element) {
    console.log(element);
    console.log(character[element]);

    xhr.open(method, url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    current_hp = parseInt(character.current_hp);
    modified_max_hp = parseInt(character.modified_max_hp);
    max_hp = parseInt(character.max_hp);
    current_mana = parseInt(character.current_mana);
    death_timer = parseInt(character.death_timer);
    recovery_dots = parseInt(character.recovery_dots);
    grievous_wounds = parseInt(character.grievous_wounds);

    if(element == 'Short Rest') { 

        console.log("short rest");
    } else if (element == 'Long Rest') {
        death_timer = Math.max(death_timer - 1, 0);
        current_mana = Math.min(current_mana + 25, 100);
        if (grievous_wounds > 0) {
            recovery_dots += 1;
            if (recovery_dots >= 9) {
                grievous_wounds -= 1;
                recovery_dots -= 9;
                if (grievous_wounds == 0) {
                    recovery_dots = 0;
                }
                modified_max_hp = Math.round(max_hp / Math.pow(2, grievous_wounds) - 0.01);
            }
        }
        current_hp = modified_max_hp;

        console.log("long rest");
    } else if (element == 'Good Nights Rest') {
        death_timer = Math.max(death_timer - 3, 0);
        current_mana = Math.min(current_mana + 50, 100);
        if (grievous_wounds > 0) {
            recovery_dots += 3;
            if (recovery_dots >= 9) {
                grievous_wounds -= 1;
                recovery_dots -= 9;
                if (grievous_wounds == 0) {
                    recovery_dots = 0;
                }
                modified_max_hp = Math.round(max_hp / Math.pow(2, grievous_wounds) - 0.01);
            }
        }
        current_hp = modified_max_hp;

        console.log("good nights rest");
    }
    send_request(character.name, 'current_hp,modified_max_hp,max_hp,current_mana,death_timer,recovery_dots,grievous_wounds', 
    current_hp + ',' + modified_max_hp + ',' + max_hp + ',' + current_mana + ',' + death_timer + ',' + recovery_dots + ',' + grievous_wounds);
}

const listofinputs = document.getElementsByClassName('inputfield');

console.log(listofinputs);

for (let i = 0; i < listofinputs.length; i++) {
    // console.log(listofinputs2[i].id);
    function handleForm (event) { event.preventDefault(); }
    listofinputs[i].addEventListener("click", function() { 
        console.log(listofinputs[i].textContent);
        change_field_stat(listofinputs[i].textContent);
    handleForm(event); });
}

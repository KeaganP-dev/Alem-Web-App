
// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var url = window.location.href.replace('inventory.html', 'update-csv-text').split('?')[0]; // Updated endpoint
var item_handler_url = window.location.href.replace('inventory.html', 'item-handler').split('?')[0]; // Updated endpoint
var method = "POST";

function change_field_stat(element, value) {
    console.log(element);
    console.log(value);
    console.log(character[element]);

    // if(element == 'Current_Psyche' && Number(value) <= character.max_psyche || 
    //    element == 'Current_Mana' && Number(value) <= character.max_mana) {
        // Open the request
    xhr.open(method, url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

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

    var data = {
        'character' : character.name,
        'attribute' : element,
        'value' : attribute_value
    };

    console.log(data);

    // console.log("Data" + JSON.stringify(data));
    var jsonData = JSON.stringify(data);

    // Send the request
    xhr.send(jsonData);

    // Handle the response
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Request was successful
            location.reload();
            var response = JSON.parse(xhr.responseText);
            // console.log(response);
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

const listofinputs = document.getElementsByClassName('inputfield');

// console.log(listofinputs2);

for (let i = 0; i < listofinputs.length; i++) {
    // console.log(listofinputs2[i].id);
    function handleForm (event) { event.preventDefault(); }
    listofinputs[i].addEventListener("click", function() { change_field_stat(listofinputs[i].parentElement.children[0].id, listofinputs[i].parentElement.children[0].value);
    handleForm(event); });
}

const add_item_buttons = document.getElementsByClassName("add_to_inventory");

for (let i = 0; i < add_item_buttons.length; i++) {
    add_item_buttons[i].addEventListener("click", function() { 
        if (add_item_buttons[i].id === 'add_weapon') {
            new_form = document.createElement("form");
            type_item = document.createElement("input");
            type_item.setAttribute("id", "type_item");
            type_item.setAttribute("type", "radio");
            type_item.setAttribute("name", "item_type");
        
            type_item_label = document.createElement("label");
            type_item_label.setAttribute("for", "type_item");
        
            type_armor = document.createElement("radio");
        
            type_weapons = document.createElement("radio");
        
        
            new_form.appendChild(type_item);
            new_form.appendChild(type_item_label);
            new_form.appendChild(type_armor);
            new_form.appendChild(type_weapons);
        
            add_item_button.parentElement.appendChild(new_form);
        }
    });
}
// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var alt_url = window.location.href.replace('magic.html', 'update-csv-text').split('?')[0]; // Updated endpoint
var method = "POST";

function change_field_stat(element, value) {
    console.log(element);
    console.log(value);
    console.log(value.includes('+'));
    console.log(character[element]);

    // if(element == 'Current_Psyche' && Number(value) <= character.max_psyche || 
    //    element == 'Current_Mana' && Number(value) <= character.max_mana) {
        // Open the request
    xhr.open(method, alt_url, true);

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

    if(element == 'Current_Psyche' && attribute_value >= 0 && attribute_value <= Number(character.max_psyche) || 
    element == 'Current_Mana' && attribute_value >= 0 && attribute_value <= Number(character.max_mana)) {
        var data = {
            'character' : character.name,
            'attribute' : element,
            'value' : attribute_value
        };

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
}

function button_submit_form(element) {
    parent_element = document.getElementById(element.parentElement);

    new_form = 
    "<form>" + 
        "<li>Current Psyche: <input id=\"Current_Psyche\"></input>" + 
        "<input type=\"submit\" value=\"\" class=\"inputfield\" id=\"Psyche\"/></li>" + 
    "</form>"

    new_form = document.createElement("form");
    new_li = document.createElement("li");
    new_input_field = document.createElement("input");
    new_input_field.id = element.id;
    new_input = document.createElement("input");
    new_input.type = "submit";
    new_input.value = "";
    new_input.class = "inputfield";
    new_input.id = element.id;

    new_li.appendChild(new_input_field);
    new_li.appendChild(new_input);
    new_form.appendChild(new_li);

    test = document.createTextNode("Water");

    if (element.children.length < 1) {
        element.appendChild(new_form);
    }
}


const listofinputs = document.getElementsByClassName('inputfield');

for (let i = 0; i < listofinputs.length; i++) {
    // console.log(listofinputs2[i].id);
    function handleForm (event) { event.preventDefault(); }
    listofinputs2[i].addEventListener("click", function() { change_field_stat(listofinputs2[i].parentElement.children[0].id, listofinputs2[i].parentElement.children[0].value);
    handleForm(event); });
}

const listofbuttons = document.getElementsByClassName('inputbutton');

for (let i = 0; i < listofbuttons.length; i++) {
    // console.log(listofbuttons[i].id);
    listofbuttons[i].addEventListener("click", function() {button_submit_form(listofbuttons[i])});
}
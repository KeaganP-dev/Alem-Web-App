
// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var url = window.location.href.replace('magic.html', 'update-csv').split('?')[0]; // Updated endpoint
var alt_url = window.location.href.replace('magic.html', 'update-csv-text').split('?')[0]; // Updated endpoint
var method = "POST";

function increase_stat(confirmed, element) {

    if(confirmed && character.points > 0) {
        // Open the request
        xhr.open(method, url, true);

        // Set the request headers (if needed)
        xhr.setRequestHeader("Content-Type", "application/json");

        var data = {
            'character' : character.name,
            'attribute' : element,
            'reward' : '1'
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


const listofinputs = document.getElementsByClassName('input');

// console.log(listofinputs);

for (let i = 0; i < listofinputs.length; i++) {
    // console.log(listofinputs[i].id);
    listofinputs[i].addEventListener("click", function() { increase_stat(confirm('Do you want to spend 1 point to increase this?'), listofinputs[i].id) });
}

const listofinputs2 = document.getElementsByClassName('inputfield');

// console.log(listofinputs2);

for (let i = 0; i < listofinputs2.length; i++) {
    // console.log(listofinputs2[i].id);
    function handleForm (event) { event.preventDefault(); }
    listofinputs2[i].addEventListener("click", function() { change_field_stat(listofinputs2[i].parentElement.children[0].id, listofinputs2[i].parentElement.children[0].value);
    handleForm(event); });
}

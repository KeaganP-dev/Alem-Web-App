
// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var url = "http://localhost:3000/update-csv"; // Updated endpoint
var method = "POST";

// Open the request
xhr.open(method, url, true);

// Set the request headers (if needed)
xhr.setRequestHeader("Content-Type", "application/json");

function increase_stat(confirmed, element) {
    console.log(character.name);
    console.log(confirmed);
    console.log(element);

    if(confirmed) {
        var data = {
            'character' : character.name,
            'attribute' : element.id,
        };
        var jsonData = JSON.stringify(data);
    
        // Send the request
        xhr.send(jsonData);
    
        // Handle the response
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Request was successful
                var response = JSON.parse(xhr.responseText);
                console.log(response);
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


const table = document.getElementsByTagName('input');

for (let i = 0; i < table.length; i++) {
    table[i].addEventListener('click', function() {
        console.log('clicked')
        table[i].clicked = true;
        increase_stat(table[i].name)
    });
}

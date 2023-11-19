
// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var url = "http://localhost:3000/update-csv"; // Updated endpoint
var method = "POST";

// Open the request
xhr.open(method, url, true);

// Set the request headers (if needed)
xhr.setRequestHeader("Content-Type", "application/json");

// Set the request body (if needed)
var data = {
    'character' : character.name,
    'what' : 'stats',
    'data' : character.stats,
    'user' : character.user,
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

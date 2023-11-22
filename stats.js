
// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var url = window.location.href.replace('stats.html', 'update-csv'); // Updated endpoint
var method = "POST";

// Open the request
xhr.open(method, url, true);

// Set the request headers (if needed)
xhr.setRequestHeader("Content-Type", "application/json");

function increase_stat(confirmed, element) {
    let rewardsingle = ["Power", "Agility", "Stamina", "Intelligence", "Knowledge", "History", "Perception"]
    let reward = 0;
    if (rewardsingle.includes(element)) {
        reward = 1;
    } else {
        reward = 2;
    };

    if(confirmed && character.points > 0) {
        var data = {
            'character' : character.name,
            'attribute' : element,
            'reward' : reward
        };

        console.log("Data" + JSON.stringify(data));
        var jsonData = JSON.stringify(data);
    
        // Send the request
        xhr.send(jsonData);
    
        // Handle the response
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Request was successful
                location.reload();
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


const listofinputs = document.getElementsByClassName('input');

console.log(listofinputs);

for (let i = 0; i < listofinputs.length; i++) {
    console.log(listofinputs[i].id);
    listofinputs[i].addEventListener("click", function() { increase_stat(confirm('Do you want to spend 1 point to increase this?'), listofinputs[i].id) });
}

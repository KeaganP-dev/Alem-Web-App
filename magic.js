
// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

// Set the request URL and method
var url = window.location.href.replace('magic.html', 'update-csv'); // Updated endpoint
var method = "POST";

// Open the request
xhr.open(method, url, true);

// Set the request headers (if needed)
xhr.setRequestHeader("Content-Type", "application/json");

function increase_stat(confirmed, element) {

    if(confirmed && character.points > 0) {
        var data = {
            'character' : character.name,
            'attribute' : element,
            'reward' : '1'
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

const listofinputs2 = document.getElementsByClassName('inputfield');

console.log(listofinputs2);

for (let i = 0; i < listofinputs2.length; i++) {
    console.log(listofinputs2[i].id);
    listofinputs2[i].addEventListener("keyup", function() { increase_stat(confirm('Do you want to spend 2 points to increase this?'), listofinputs2[i].id) });
}

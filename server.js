
const http = require('http');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const bodyParser = require('body-parser');
var express = require("express");
var app = express();

// Function to read the characters.csv file
function readCharacters(callback) {
    const characters = [];
    fs.createReadStream('characters.csv')
        .pipe(csv())
        .on('data', (data) => {
            characters.push(data);
        })
        .on('end', () => {
            callback(characters);
        });
}

// Function to write data to the characters.csv file
function writeCharacters(data, callback) {
    const csvData = Object.keys(data[0]).join(',') + '\n' + data.map((character) => Object.values(character).join(',')).join('\n');
    fs.writeFile('characters.csv', csvData, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

// Create a server
const server = http.createServer((req, res) => {
    if (req.url === '/characters') {
        if (req.method === 'GET') {
            // Read characters from the characters.csv file
            readCharacters((characters) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(characters));
            });
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                const character = JSON.parse(body);
                // Write character to the characters.csv file
                readCharacters((characters) => {
                    characters.push(character);
                    writeCharacters(characters, (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                        } else {
                            res.statusCode = 201;
                            res.end('Character added successfully');
                        }
                    });
                });
            });
        }
    } else if (req.url === '/update-csv') {
        if (req.method === 'POST') {
            console.log('POST request received');

            var body = '';
            req.on('data', function (data) {
                body += data;
                console.log("Partial body: " + body);
                body = JSON.parse(body);
                console.log("character" + body.character);
                console.log("attribute" + body.attribute);
                console.log("reward" + body.reward)

                // Read characters from the characters.csv file
                readCharacters((characters) => {
                    for (let i = 0; i < characters.length; i++) {
                        if (characters[i].name == body.character) {
                            characters[i][body.attribute.toLowerCase()] = parseInt(characters[i][body.attribute.toLowerCase()]) + parseInt(body.reward);
                            console.log(characters[i][body.attribute.toLowerCase()])
                        }
                    }
                    // console.log(Object.keys(characters[0]).join(','));
                    writeCharacters(characters, (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                        } else {
                            res.statusCode = 200;
                            res.end('Character added successfully');
                        }
                    });
                });

            });
           
        }
    } else if (req.url === '/update-csv-text') {
        if (req.method === 'POST') {
            console.log('POST request received');

            var body = '';
            req.on('data', function (data) {
                body += data;
                console.log("Partial body: " + body);
                body = JSON.parse(body);
                console.log("character" + body.character);
                console.log("attribute" + body.attribute);
                console.log("value" + body.value)

                // Read characters from the characters.csv file
                readCharacters((characters) => {
                    for (let i = 0; i < characters.length; i++) {
                        if (characters[i].name == body.character) {
                            attribute = function () {

                            }
                            characters[i][body.attribute.toLowerCase()] = body.value;
                            console.log(characters[i][body.attribute.toLowerCase()])
                        }
                    }
                    // console.log(Object.keys(characters[0]).join(','));
                    writeCharacters(characters, (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                        } else {
                            res.statusCode = 200;
                            res.end('Character added successfully');
                        }
                    });
                });

            });
           
        }
    } else {
        var filePath = path.join(__dirname, 'sign-in.html');

        if (path.normalize(req.url) != '/') {
            filePath = path.join(__dirname, path.normalize(req.url).split('?')[0]);
          }
        
          const contentType = 'text/html';
          fs.readFile(filePath, (err, content) => {
            if (err) {
              res.writeHead(500);
              res.end(`Error loading ${filePath}`);
            } else {
              res.writeHead(200, { 'Content-Type': contentType });
              res.end(content, 'utf-8');
            }
        });
    }
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


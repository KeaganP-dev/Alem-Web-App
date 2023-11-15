const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
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
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

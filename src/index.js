require("@babel/core");
const http = require('http');
const fs = require('fs');

const savePath = '../test_folder/';

const server = http.createServer((req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Methods, Content-Type');

  // post request made
  if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
    const fileChunks = [];

    req.on('data', (buffer) => {
      console.log('Received upload...');
      fileChunks.push(buffer.toString());
    })

    // buffering, save to system
    req.on('end', () => {
      const fileName = 'test.txt';
      fs.writeFile(`${savePath}${fileName}`, fileChunks.join(''), (err) => {
        if (err) return console.log(err);
        console.log('...saved', fileName);
      })
    })
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});

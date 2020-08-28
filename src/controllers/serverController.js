import http from 'http';
import fs from 'fs';

const savePath = '../test_folder/';

const server = http.createServer((req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Methods, Content-Type');

  // post request made
  if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
    console.log('Received upload...');
    const fileChunks = [];

    req.on('data', (buffer) => {
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

export default server;

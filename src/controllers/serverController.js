import http from 'http';
import fs from 'fs';

const savePath = process.env['SAVE_PATH'];
const acceptedOrigins = process.env['LOCAL_APP_URL'];

const server = http.createServer((req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', acceptedOrigins);
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

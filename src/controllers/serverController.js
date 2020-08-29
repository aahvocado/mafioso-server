import http from 'http';
import fs from 'fs';

import logDatabaseController from 'controllers/logDatabaseController';

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
    });

    // after buffering, save to system
    req.on('end', () => {
      const fullText = fileChunks.join('');
      logDatabaseController.addNewFile(fullText);
    });
  }
});

export default server;

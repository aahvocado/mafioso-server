import http from 'http';
import fs from 'fs';

import logDatabaseController from 'controllers/logDatabaseController';

const savePath = process.env['SAVE_PATH'];
const acceptedOrigins = process.env['LOCAL_APP_URL'];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Origin', acceptedOrigins);
  // res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  // res.setHeader('Access-Control-Allow-Headers', 'Origin, Methods, Content-Type');

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
      logDatabaseController.addNewLog(fullText);
    });
  }

  // display db
  if (req.url === '/shared-database') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    const databaseText = logDatabaseController.export();
    res.end(databaseText);
  }

  // asking for a list of entries
  if (req.url === '/api/getSharedLogs' && req.method.toLowerCase() === 'get') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    const databaseText = logDatabaseController.export();
    res.end(databaseText);
  }
});

export default server;

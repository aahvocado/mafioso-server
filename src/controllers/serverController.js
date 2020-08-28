import http from 'http';
import fs from 'fs';

import LogData from 'classes/LogData';

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
    })

    // after buffering, save to system
    req.on('end', () => {
      const fullText = fileChunks.join('');
      const logData = new LogData(fullText);

      const fileName = `${logData.logHash}.txt`;
      fs.writeFile(`${savePath}${fileName}`, fullText, (err) => {
        if (err) return console.log(err);

        console.log('...saved', fileName);
      });

      // create new entry
      logDatabaseController.addNewEntry(logData);
    })
  }
});

export default server;

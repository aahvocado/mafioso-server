import express from 'express';

import logDatabaseController from 'controllers/logDatabaseController';

const savePath = process.env['SAVE_PATH'];
const acceptedOrigins = process.env['LOCAL_APP_URL'];

const server = express();
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', acceptedOrigins);
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.get('/all-logs', async (req, res) => {
  res.set('Content-Type', 'text/plain');
  const databaseText = await logDatabaseController.toString();
  res.send(`id\tvisibility\tentryDate\tlogHash\tcharName\tpathName\tdifficultyName\tdayCount\tturnCount\n\n${databaseText}`);
})

server.post('/api/upload', (req, res) => {
  console.log('Received upload request...');
  const fileChunks = [];

  req.on('data', (buffer) => {
    fileChunks.push(buffer.toString());
  });

  // after buffering, save to system
  req.on('end', () => {
    const fullText = fileChunks.join('');
    logDatabaseController.addNewLog(fullText);
  });
})

server.get('/api/getSharedLogs', (req, res) => {
  console.log('Received shared logs request...');

  const databaseList = logDatabaseController.getDatabase({isVisible: true});
  const databaseJSON = JSON.stringify(databaseList.map((databaseEntry) => databaseEntry.export()));
  res.send(databaseJSON);
})

server.get('/api/getLog/:logHash', (req, res) => {
  console.log('Received shared logs request...');
  const logText = logDatabaseController.getLogByHash(req.params.logHash);
  res.send(logText);
  console.log('... found and sent!');
})

export default server;

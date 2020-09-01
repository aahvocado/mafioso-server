import express from 'express';

import logDatabaseController from 'controllers/logDatabaseController';

const ACCEPTED_ORIGINS = process.env['ACCEPTED_ORIGINS'];

/**
 * start an express server
 */
const server = express();
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ACCEPTED_ORIGINS);
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/**
 * show all logs
 */
server.get('/all-logs', async (req, res) => {
  res.set('Content-Type', 'text/plain');
  const databaseText = await logDatabaseController.toString();
  res.send(`id\tstatus\tentryDate\tlogHash\tcharName\tpathName\tdifficultyName\tdayCount\tturnCount\n\n${databaseText}`);
})
/**
 * upload a log
 */
server.post('/api/share', (req, res) => {
  console.log('Received log for sharing...');
  const fileChunks = [];

  req.on('data', (buffer) => {
    fileChunks.push(buffer.toString());
  });

  // after buffering, save to system
  req.on('end', async () => {
    try {
      const payloadData = JSON.parse(fileChunks.join(''));
      await logDatabaseController.addNewLog(payloadData);
      res.status(200).send();
      console.log('...accepted log.');

    } catch (err) {
      res.status(409).send(err);
      console.error('...rejected log.', err);
    }
  });
})
/**
 * get all visible logs
 */
server.get('/api/active-logs', (req, res) => {
  console.log('Received shared logs request...');

  const databaseList = logDatabaseController.getDatabase({isActive: true});
  const databaseJSON = JSON.stringify(databaseList.map((databaseEntry) => databaseEntry.export()));
  res.send(databaseJSON);
})
/**
 * get an single log
 */
server.get('/api/log/:logHash', (req, res) => {
  console.log('Received shared logs request...');
  const logText = logDatabaseController.getLogByHash(req.params.logHash);
  res.send(logText);
  console.log('... found and sent!');
})

export default server;

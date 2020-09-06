import express from 'express';

import logDatabaseController from 'controllers/logDatabaseController';

const ACCEPTED_ORIGINS = process.env['ACCEPTED_ORIGINS'];
const ACCEPTED_ROLES = process.env['ACCEPTED_ROLES'];

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
 server.get('/status', async (req, res) => {
  res.send('we good');
})
/**
 * show all logs
 */
server.get('/all-logs', async (req, res) => {
  res.set('Content-Type', 'text/plain');
  const databaseText = await logDatabaseController.toString();
  res.send(`id\tstatus\tentryDate\thashcode\tcharName\tpathName\tdifficultyName\tdayCount\tturnCount\n\n${databaseText}`);
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
 * get list of logs
 */
server.get('/api/logs', (req, res) => {
  console.log('Received shared logs request...');

  const {status} = req.query;
  const databaseList = logDatabaseController.getDatabase({status});
  const databaseJSON = JSON.stringify(databaseList.map((databaseEntry) => databaseEntry.export()));

  res.status(200).send(databaseJSON);

  console.log('...sending list!');
})
/**
 * get an single log
 */
server.get('/api/log/:hashcode', (req, res) => {
  console.log('Received shared logs request...');

  const databaseEntry = logDatabaseController.findEntry(req.params.hashcode);
  const logText = logDatabaseController.findLog(databaseEntry);

  const response = {databaseEntry: databaseEntry.export(), logText};
  res.status(200).send(JSON.stringify(response));

  console.log('...found and sent!');
})
/**
 * modify a log
 */
server.post('/api/update/:hashcode', (req, res) => {
  console.log('Updating database entry...');

  try {
    const {status, role} = req.query;
    if (role !== ACCEPTED_ROLES) {
      res.status(401).send();
      console.error('...rejected.');
      return;
    }

    logDatabaseController.updateEntryStatus(req.params.hashcode, status);
    res.status(200).send();
    console.error('...success.');

  } catch (err) {
    res.status(400).send(err);
    console.error('...failed.');
  }
})

export default server;

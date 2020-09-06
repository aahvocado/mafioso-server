import fs from 'fs';
import https from 'https';

import serverController from 'controllers/serverController';

const SERVER_PATH = process.env['SERVER_PATH'];
const HOST = process.env['HOST'];
const PORT = process.env['PORT'];
const CERT_PATH = process.env['CERT_PATH'];
const CERT_KEY_PATH = process.env['CERT_KEY_PATH'];

// local
if (HOST === 'localhost') {
  serverController.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}${SERVER_PATH}`);
  });

// production
} else {
  const server = https.createServer({
    cert: fs.readFileSync(CERT_PATH),
    key: fs.readFileSync(CERT_KEY_PATH),
  }, serverController);

  server.listen(PORT, HOST, () => {
    console.log(`Server listening on https://${HOST}:${PORT}${SERVER_PATH}`);
  });
}


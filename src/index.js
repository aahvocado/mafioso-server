import serverController from 'controllers/serverController';

const SERVER_PATH = process.env['SERVER_PATH'];
const HOST = process.env['HOST'];
const PORT = process.env['PORT'];
serverController.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}/${SERVER_PATH}`);
});

import serverController from 'controllers/serverController';

const SERVER_PATH = process.env['SERVER_PATH'];
const PORT = process.env['PORT'];
serverController.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/${SERVER_PATH}`);
});

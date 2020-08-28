import serverController from 'controllers/serverController';
import logDatabaseController from 'controllers/logDatabaseController';

const PORT = process.env['PORT'];
serverController.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});

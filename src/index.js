import serverController from 'controllers/serverController';

const PORT = 8080;
serverController.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});

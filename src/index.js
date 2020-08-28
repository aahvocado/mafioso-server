import serverController from 'controllers/serverController';

const PORT = process.env['PORT'];
serverController.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});

import fs from 'fs';

const logDatabasePath = process.env['DB_PATH'];

class logDatabaseController {
  constructor() {
    this.instantiate();
  }
  /**
   *
   */
  instantiate() {
    if (fs.existsSync(logDatabasePath)) {
      console.warn('"log-database.txt" already exists.');
      return;
    }

    fs.writeFile(logDatabasePath, '', (err) => {
     if (err) return console.log(err);

      console.log('Created "log-database.txt".');
    });
  }
}

export default new logDatabaseController();

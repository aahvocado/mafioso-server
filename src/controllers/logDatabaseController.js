import fs from 'fs';

const logDatabasePath = process.env['DB_PATH'];

class logDatabaseController {
  constructor() {
    this.instantiate();
  }
  /**
   * creates the db txt file
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
  /**
   *
   */
  addNewEntry(text) {
    fs.appendFile(logDatabasePath, text, (err) => {
      if (err) return console.log(err);
    })
  }
}

export default new logDatabaseController();

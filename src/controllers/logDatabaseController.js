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
   * @param {LogData} logData
   */
  addNewEntry(logData) {
    const newEntry = `${logData.logHash}\t${logData.charName}`

    fs.appendFile(logDatabasePath, newEntry, (err) => {
      if (err) return console.log(err);
    })
  }
}

export default new logDatabaseController();

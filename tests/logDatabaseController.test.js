import assert from 'assert';
import fs from 'fs';

import DatabaseEntry from 'classes/DatabaseEntry';
import LogData from 'classes/LogData';

import logDatabaseController from 'controllers/logDatabaseController';

const logDatabasePath = process.env['DB_PATH'];
      // const testLog = 'NAME=dextrial\nDIFFICULTY=Hardcore\nPATH=Community Service\nHASH=000000\n<mafioso>\nLog Start: August 4, 2020 - Petember 3\n<mafioso/>';

describe('logDatabaseController.js', () => {
  describe('addEntry()', () => {
    it('properly adds a DatabaseEntry into a empty database log', async () => {
      fs.writeFileSync(logDatabasePath, ''); // empty mock txt

      const dbEntry1 = new DatabaseEntry();
      dbEntry1.import('0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service Hardcore');

      await logDatabaseController.addEntry(dbEntry1);

      assert.equal(logDatabaseController.entriesCount(), 1);
    })

    it('properly adds multiple DatabaseEntry into an existing database log', async () => {
      fs.writeFileSync(logDatabasePath, '0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service Hardcore\n');

      const dbEntry1 = new DatabaseEntry();
      dbEntry1.import('1\tfalse\tFri Aug 28 2020\t111111\tdextrial\tCommunity Service Hardcore\n');
      await logDatabaseController.addEntry(dbEntry1);

      const dbEntry2 = new DatabaseEntry();
      dbEntry2.import('2\tfalse\tFri Aug 28 2020\t222222\tdextrial\tCommunity Service Hardcore\n');
      await logDatabaseController.addEntry(dbEntry2);

      assert.equal(logDatabaseController.entriesCount(), 3);
    })
  })
})

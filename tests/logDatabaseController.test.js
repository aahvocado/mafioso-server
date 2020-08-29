import assert from 'assert';
import fs from 'fs';

import DatabaseEntry from 'classes/DatabaseEntry';
import LogData from 'classes/LogData';

import logDatabaseController from 'controllers/logDatabaseController';

const logDatabasePath = process.env['DB_PATH'];
      // const testLog = 'NAME=dextrial\nDIFFICULTY=Hardcore\nPATH=Community Service\nHASH=000000\n<mafioso>\nLog Start: August 4, 2020 - Petember 3\n<mafioso/>';

describe('logDatabaseController.js', () => {
  describe('addEntry()', () => {
    it('properly adds a DatabaseEntry into a empty database', async () => {
      fs.writeFileSync(logDatabasePath, ''); // empty mock txt

      const dbEntry1 = new DatabaseEntry('0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore');
      await logDatabaseController.addEntry(dbEntry1);

      assert.equal(logDatabaseController.entriesCount(), 1);
    })

    it('properly adds multiple DatabaseEntry into an existing database', async () => {
      fs.writeFileSync(logDatabasePath, '0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n');

      const dbEntry1 = new DatabaseEntry('1\tfalse\tFri Aug 28 2020\t111111\tdextrial\tCommunity Service\tHardcore\n');
      await logDatabaseController.addEntry(dbEntry1);

      const dbEntry2 = new DatabaseEntry('2\tfalse\tFri Aug 28 2020\t222222\tdextrial\tCommunity Service\tHardcore\n');
      await logDatabaseController.addEntry(dbEntry2);

      assert.equal(logDatabaseController.entriesCount(), 3);
    })
  })

  describe('findEntry()', () => {
    it('finds `undefined` in an empty database', () => {
      fs.writeFileSync(logDatabasePath, ''); // empty mock txt

      const foundEntry = logDatabaseController.findEntry('000000');
      assert.equal(foundEntry, undefined);
    });

    it('returns DatabaseEntry based on given hash', async () => {
      fs.writeFileSync(logDatabasePath, '0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n');

      const foundEntry = logDatabaseController.findEntry('000000');
      assert.equal(foundEntry.entryId, '0');
    })
  })

  describe('hasEntry()', () => {
    it('returns false if unable to find hash', () => {
      fs.writeFileSync(logDatabasePath, '0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n');

      const doesItHave = logDatabaseController.hasEntry('123456');
      assert.equal(doesItHave, false);
    });

    it('returns true if found DatabaseEntry', () => {
      fs.writeFileSync(logDatabasePath, '0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n');

      const doesItHave = logDatabaseController.hasEntry('000000');
      assert.equal(doesItHave, true);
    });
  });
})

import assert from 'assert';
import fs from 'fs';

import DatabaseEntry from 'classes/DatabaseEntry';
import LogData from 'classes/LogData';

import logDatabaseController from 'controllers/logDatabaseController';

const logDatabasePath = process.env['DB_PATH'];

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
      fs.writeFileSync(logDatabasePath,
        '0\tfalse\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n' +
        '1\tfalse\tFri Aug 29 2020\t111111\tdextrial\tCommunity Service\tHardcore\n' +
        '2\tfalse\tFri Aug 30 2020\t222222\tdextrial\tCommunity Service\tHardcore\n'
      );

      const doesItHave = logDatabaseController.hasEntry('111111');
      assert.equal(doesItHave, true);
    });
  });

  describe('replaceEntry()', () => {
    it('properly replaces entry of given hash with the new entry', () => {
      fs.writeFileSync(logDatabasePath,
        '0\ttrue\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n' +
        '1\tfalse\tFri Aug 29 2020\t111111\tdextrial\tCommunity Service\tHardcore\n' +
        '2\tfalse\tFri Aug 30 2020\t222222\tdextrial\tCommunity Service\tHardcore\n'
      );

      assert.equal(logDatabaseController.hasEntry('123456'), false); // should not exist

      const newEntry = new DatabaseEntry('1\tfalse\tFri Aug 29 2020\t123456\tdextrial\tCommunity Service\tSoftcore\n');
      logDatabaseController.replaceEntry('111111', newEntry);

      assert.equal(logDatabaseController.hasEntry('123456'), true); // newly replaced
      assert.equal(logDatabaseController.hasEntry('111111'), false); // no longer in the db
    });
  });

  describe('isEntryVisible()', () => {
    it('returns a boolean value of the DatabaseEntrys visibility flag', () => {
      fs.writeFileSync(logDatabasePath,
        '0\ttrue\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n' +
        '1\tfalse\tFri Aug 29 2020\t111111\tdextrial\tCommunity Service\tHardcore\n' +
        '2\tfalse\tFri Aug 30 2020\t222222\tdextrial\tCommunity Service\tHardcore\n'
      );

      assert.equal(logDatabaseController.isEntryVisible('000000'), true);
      assert.equal(logDatabaseController.isEntryVisible('111111'), false);
    });
  });

  describe('toggleEntryVisbility()', () => {
    it('properly updates the visibility flag from "true" to "false" when not given a state', () => {
      fs.writeFileSync(logDatabasePath,
        '0\ttrue\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n' +
        '1\tfalse\tFri Aug 29 2020\t111111\tdextrial\tCommunity Service\tHardcore\n' +
        '2\tfalse\tFri Aug 30 2020\t222222\tdextrial\tCommunity Service\tHardcore\n'
      );

      assert.equal(logDatabaseController.isEntryVisible('000000'), true); // starts as true

      logDatabaseController.toggleEntryVisbility('000000');

      assert.equal(logDatabaseController.isEntryVisible('000000'), false); // now false
    });

    it('properly updates the visibility flag from "false" to "true" when not given a state', () => {
      fs.writeFileSync(logDatabasePath,
        '0\ttrue\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n' +
        '1\tfalse\tFri Aug 29 2020\t111111\tdextrial\tCommunity Service\tHardcore\n' +
        '2\tfalse\tFri Aug 30 2020\t222222\tdextrial\tCommunity Service\tHardcore\n'
      );

      assert.equal(logDatabaseController.isEntryVisible('111111'), false); // starts as false

      logDatabaseController.toggleEntryVisbility('111111');

      assert.equal(logDatabaseController.isEntryVisible('111111'), true); // now true
    });

    it('properly updates the visibility flag to given state regardless of initial value', () => {
      fs.writeFileSync(logDatabasePath,
        '0\ttrue\tFri Aug 28 2020\t000000\tdextrial\tCommunity Service\tHardcore\n' +
        '1\tfalse\tFri Aug 29 2020\t111111\tdextrial\tCommunity Service\tHardcore\n' +
        '2\tfalse\tFri Aug 30 2020\t222222\tdextrial\tCommunity Service\tHardcore\n'
      );

      assert.equal(logDatabaseController.isEntryVisible('111111'), false);

      logDatabaseController.toggleEntryVisbility('111111', false);

      assert.equal(logDatabaseController.isEntryVisible('111111'), false);
    });
  });
})

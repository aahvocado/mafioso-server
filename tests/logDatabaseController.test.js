import assert from 'assert';
import fs from 'fs';

import DatabaseEntry from 'classes/DatabaseEntry';

import DATABASE_ENTRY_STATUS from 'constants/DATABASE_ENTRY_STATUSES';

import logDatabaseController from 'controllers/logDatabaseController';

const DB_PATH = process.env['DB_PATH'];

describe('logDatabaseController.js', () => {
  const originalDatabase = fs.readFileSync(DB_PATH);

  let genericEntry;

  beforeEach(() => {
    genericEntry = new DatabaseEntry({
      hashcode: 'aaaaaa',
      characterName: 'unit-test',
      pathName: 'Community Service',
      difficultyName: 'Hardcore',
      dayCount: '3',
      turnCount: '300',
    }, '000');
  });

  describe('addEntry()', () => {
    it('properly adds a DatabaseEntry into a empty database', async () => {
      fs.writeFileSync(DB_PATH, ''); // empty mock txt

      await logDatabaseController.addEntry(genericEntry);

      assert.equal(logDatabaseController.entriesCount(), 1);
    })

    it('properly adds multiple DatabaseEntry into an existing database', async () => {
      fs.writeFileSync(DB_PATH, genericEntry.toString());

      const entryA = new DatabaseEntry({hashcode: 'bbbbbb'}, '111');
      await logDatabaseController.addEntry(entryA);

      const entryB = new DatabaseEntry({hashcode: 'cccccc'}, '222');
      await logDatabaseController.addEntry(entryB);

      assert.equal(logDatabaseController.entriesCount(), 3);
    })
  })

  describe('findEntry()', () => {
    it('finds `undefined` in an empty database', () => {
      fs.writeFileSync(DB_PATH, ''); // empty mock txt

      const foundEntry = logDatabaseController.findEntry('aaaaaa');
      assert.equal(foundEntry, undefined);
    });

    it('returns DatabaseEntry based on given hashcode', async () => {
      fs.writeFileSync(DB_PATH, genericEntry.toString());

      const foundEntry = logDatabaseController.findEntry('aaaaaa');
      assert.equal(foundEntry.entryId, '000');
    })
  })

  describe('hasEntry()', () => {
    it('returns false if unable to find hashcode', () => {
      fs.writeFileSync(DB_PATH, genericEntry.toString());

      const doesItHave = logDatabaseController.hasEntry('abcdef');
      assert.equal(doesItHave, false);
    });

    it('returns true if found DatabaseEntry', () => {
      const entryB = new DatabaseEntry({hashcode: 'bbbbbb'}, '111');
      const entryC = new DatabaseEntry({hashcode: 'cccccc'}, '222');
      const entryD = new DatabaseEntry({hashcode: 'dddddd'}, '333');
      fs.writeFileSync(DB_PATH, entryB.toString() + entryC.toString() + entryD.toString());

      const doesItHave = logDatabaseController.hasEntry('bbbbbb');
      assert.equal(doesItHave, true);
    });
  });

  describe('replaceEntry()', () => {
    it('properly replaces entry of given hashcode with the new entry', () => {
      const entryB = new DatabaseEntry({hashcode: 'bbbbbb'}, '111');
      const entryC = new DatabaseEntry({hashcode: 'cccccc'}, '222');
      const entryD = new DatabaseEntry({hashcode: 'dddddd'}, '333');
      fs.writeFileSync(DB_PATH, entryB.toString() + entryC.toString() + entryD.toString());

      assert.equal(logDatabaseController.hasEntry('abcdef'), false); // should not exist

      const newEntry = new DatabaseEntry({hashcode: 'abcdef'}, '444');
      logDatabaseController.replaceEntry('bbbbbb', newEntry);

      assert.equal(logDatabaseController.hasEntry('abcdef'), true); // newly replaced
      assert.equal(logDatabaseController.hasEntry('bbbbbb'), false); // no longer in the db
    });
  });

  describe('isEntryActive()', () => {
    it('returns a boolean value of the active state of Database Entry', () => {
      const entryB = new DatabaseEntry({hashcode: 'bbbbbb', status: DATABASE_ENTRY_STATUS.ACTIVE}, '111');
      const entryC = new DatabaseEntry({hashcode: 'cccccc', status: DATABASE_ENTRY_STATUS.INACTIVE}, '222');
      fs.writeFileSync(DB_PATH, entryB.toString() + entryC.toString());

      assert.equal(logDatabaseController.isEntryActive('bbbbbb'), true);
      assert.equal(logDatabaseController.isEntryActive('cccccc'), false);
    });
  });

  describe('updateEntryStatus()', () => {
    it('updates the status flag from "active" to "inactive" when not given a state', () => {
      const entryB = new DatabaseEntry({hashcode: 'bbbbbb', status: DATABASE_ENTRY_STATUS.ACTIVE}, '111');
      const entryC = new DatabaseEntry({hashcode: 'cccccc', status: DATABASE_ENTRY_STATUS.INACTIVE}, '222');
      fs.writeFileSync(DB_PATH, entryB.toString() + entryC.toString());

      assert.equal(logDatabaseController.isEntryActive('bbbbbb'), true); // starts as true

      logDatabaseController.updateEntryStatus('bbbbbb');

      assert.equal(logDatabaseController.isEntryActive('bbbbbb'), false); // now false
    });

    it('updates the status flag from "inactive" to "active" when not given a state', () => {
      const entryB = new DatabaseEntry({hashcode: 'bbbbbb', status: DATABASE_ENTRY_STATUS.ACTIVE}, '111');
      const entryC = new DatabaseEntry({hashcode: 'cccccc', status: DATABASE_ENTRY_STATUS.INACTIVE}, '222');
      fs.writeFileSync(DB_PATH, entryB.toString() + entryC.toString());

      assert.equal(logDatabaseController.isEntryActive('cccccc'), false); // starts as false

      logDatabaseController.updateEntryStatus('cccccc');

      assert.equal(logDatabaseController.isEntryActive('cccccc'), true); // now true
    });

    it('updates the status flag to given state regardless of initial value', () => {
      const entryB = new DatabaseEntry({hashcode: 'bbbbbb', status: DATABASE_ENTRY_STATUS.ACTIVE}, '111');
      const entryC = new DatabaseEntry({hashcode: 'cccccc', status: DATABASE_ENTRY_STATUS.INACTIVE}, '222');
      fs.writeFileSync(DB_PATH, entryB.toString() + entryC.toString());

      assert.equal(logDatabaseController.isEntryActive('cccccc'), false);

      logDatabaseController.updateEntryStatus('cccccc', DATABASE_ENTRY_STATUS.INACTIVE);

      assert.equal(logDatabaseController.isEntryActive('cccccc'), false);
    });
  });

  // clear data after tests
  after(() => {
    fs.writeFileSync(DB_PATH, originalDatabase);
  })
})

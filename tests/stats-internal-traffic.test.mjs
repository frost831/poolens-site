import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';

test('owner aggregate queries exclude explicit internal events without rejecting legacy or malformed metadata', () => {
  const source=readFileSync(new URL('../functions/api/stats.js',import.meta.url),'utf8');
  const filter=source.match(/const EXTERNAL_EVENT_FILTER = `([\s\S]*?)`;/)?.[1];
  assert.ok(filter);
  const db=new DatabaseSync(':memory:');
  try {
    db.exec('CREATE TABLE events (event TEXT, source TEXT, path TEXT, user_agent TEXT, props TEXT)');
    const add=db.prepare("INSERT INTO events VALUES ('checkout_click','app','/','Mozilla/5.0 Chrome/140',?)");
    for(const props of [null,'{}','invalid json',JSON.stringify({traffic_class:'real',is_internal:false})])add.run(props);
    for(const traffic_class of ['qa','bot','server'])add.run(JSON.stringify({traffic_class}));
    for(const flag of ['is_internal','test','synthetic','demo']) {
      add.run(JSON.stringify({[flag]:true}));
      add.run(JSON.stringify({[flag]:'true'}));
    }
    assert.equal(db.prepare(`SELECT COUNT(*) AS total FROM events WHERE 1=1 ${filter}`).get().total,4);
    assert.equal(db.prepare(`SELECT COUNT(*) AS total FROM events WHERE event='checkout_click' ${filter}`).get().total,4);
  } finally {db.close();}
});

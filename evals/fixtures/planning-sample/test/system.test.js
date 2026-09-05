import {test} from 'node:test';
import assert from 'node:assert/strict';
import {run} from '../src/cli.js';
test('last value wins without reordering IDs', () => {
  assert.deepEqual(run([{id:'b',value:1},{id:'a',value:2},{id:'b',value:3}]), {text:'b,3\na,2',metrics:{count:2}});
});

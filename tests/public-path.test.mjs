import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {publicPath} from '../lib/publicPath.js';

test('development static routes stay inside their public directory, including encoded paths',()=>{
 const base=path.resolve('public/projects');
 assert.equal(publicPath(base,'veyra/city.html'),path.join(base,'veyra/city.html'));
 assert.equal(publicPath(base,'sample%20screen.png'),path.join(base,'sample screen.png'));
 for(const value of ['../../package.json','%2e%2e/%2e%2e/package.json','%2fprivate/file','bad%escape','asset%00.png'])assert.equal(publicPath(base,value),null,value);
});

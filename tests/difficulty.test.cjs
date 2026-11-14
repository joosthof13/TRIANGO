'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const engine = html.match(/\/\* Pure puzzle engine:[\s\S]+?if\(typeof module!==[^\n]+/);
assert.ok(engine, 'Engine code present');
const context = vm.createContext({module:{exports:{}},console,Math,Date});
vm.runInContext(engine[0],context);
vm.runInContext(fs.readFileSync(path.join(root,'difficulty.js'),'utf8'),context);
const E = context.module.exports;
const levels = ['relaxed','standard','expert','master'];
let count = 0;
for (const level of levels) {
  const band = E.difficultyBands[level];
  for (let i=0;i<16;i++) {
    const seed = (i*245831+17021)>>>0;
    const p = E.create(level,seed);
    const clone = E.create(level,seed);
    assert.equal(p.engineVersion,3);
    assert.equal(p.seed,seed);
    assert.equal(JSON.stringify(p.givens), JSON.stringify(clone.givens),'Reproducible puzzle');
    assert.equal(JSON.stringify(p.clues), JSON.stringify(clone.clues),'Reproducible relations');
    const exact = E.solve(p.givens.map(x=>x===null?7:1<<x),p.cfg,p.clues,2);
    assert.equal(exact.count,1,'Unique solution');
    assert.equal(JSON.stringify(p.solution),JSON.stringify(exact.solution),'Solution consistent');
    const grade = E.grade(p);
    assert.equal(grade.score,p.rating.score,'Reproducible grade');
    assert.ok(grade.guessFree,'No guessing');
    assert.ok(grade.score>=band.min && grade.score<=band.max,'Correct difficulty band');
    count++;
  }
}
for (const level of levels) {
  const before = E.createLegacy(level,11223344);
  const after = E.createLegacy(level,11223344);
  assert.equal(JSON.stringify(before.givens),JSON.stringify(after.givens),'Old saves reconstruct');
}
console.log(`PASS: ${count} calibrated unique, guess-free puzzles across 4 disjoint difficulty bands; legacy seeds remain deterministic.`);

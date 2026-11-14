/* TRIANGO calibrated puzzle difficulty · v3
   Grades the full *human-style, no-guessing* solving path. A candidate is accepted
   only when it has a unique solution and its logical score belongs to the requested
   level's non-overlapping score band. No search guesses are counted as deductions.
*/
(() => {
  'use strict';
  const BANDS = Object.freeze({
    relaxed:  {min: 0, max: 34, target: 21},
    standard: {min: 35, max: 49, target: 42},
    expert:   {min: 50, max: 66, target: 57},
    master:   {min: 67, max: Infinity, target: 79}
  });
  const previousCreate = Engine.create;
  Engine.createLegacy = previousCreate;
  Engine.difficultyBands = BANDS;

  function grade(puzzle) {
    const board = puzzle.givens.slice();
    const lengths = [];
    const kinds = Object.create(null);
    let solved = 0, maxProof = 0, effort = 0, advanced = 0;

    // Fill only moves for which deduceMoves provides a complete constraint-rule
    // elimination certificate. Choose the shortest available proof each turn.
    while (solved < board.length) {
      const remaining = board.some(x => x === null);
      if (!remaining) break;
      const result = Engine.deduceMoves(board, puzzle.cfg, puzzle.clues);
      if (!result.moves.length) throw Error('Puzzle needs guessing; rejected.');
      const move = result.moves[0];
      if (move.value !== puzzle.solution[move.i]) throw Error('Invalid deduction; rejected.');
      board[move.i] = move.value;
      solved++;
      lengths.push(move.proofLength);
      maxProof = Math.max(maxProof, move.proofLength);
      if (move.proofLength >= 4) advanced++;
      effort += Math.pow(Math.max(0, move.proofLength - 2), 1.5);
      for (const step of move.chain) kinds[step.kind] = (kinds[step.kind] || 0) + 1;
    }
    if (!board.every((v, i) => v === puzzle.solution[i])) throw Error('Incomplete deduction path; rejected.');

    // More required placements + longer proof chains + more repeated multi-step
    // deductions = higher score. Fixed score bands never overlap.
    const score = Math.round(
      lengths.length * 0.65 + 2 * Math.max(0, maxProof - 2) +
      2 * advanced + 0.3 * effort
    );
    return {
      score,
      placements: lengths.length,
      longestProof: maxProof,
      advancedMoves: advanced,
      averageProof: lengths.length ? Number((lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(2)) : 0,
      techniques: kinds,
      guessFree: true
    };
  }

  // Deterministic: identical requested (level, seed) regenerates the same puzzle.
  // This keeps offline save/restore behavior stable across browser restarts.
  Engine.grade = grade;
  Engine.create = function (level, seed = (Math.random() * 0x100000000) >>> 0) {
    const band = BANDS[level];
    if (!band) throw Error('Unknown difficulty level: ' + level);
    seed = seed >>> 0;

    const MAX_ATTEMPTS = 72;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const candidateSeed = (seed + Math.imul(attempt, 0x9e3779b9)) >>> 0;
      let puzzle;
      try {
        puzzle = previousCreate(level, candidateSeed);
        const rating = grade(puzzle);
        if (rating.score < band.min || rating.score > band.max) continue;
        puzzle.seed = seed;                  // user's stable puzzle identifier
        puzzle.engineVersion = 3;
        puzzle.rating = rating;
        puzzle.stat.attempts = attempt + 1;
        puzzle.stat.candidateSeed = candidateSeed;
        return puzzle;
      } catch (error) {
        // Invalid/unsolved candidates are never presented to the player.
        if (attempt === MAX_ATTEMPTS - 1) console.warn('Rejected final puzzle candidate:', error);
      }
    }
    throw Error('Unable to find a puzzle in the selected logic-score range. Retry with a new seed.');
  };
})();

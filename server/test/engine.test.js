// engine.test.js — pins the two generic step-game capabilities this repo leans
// on, using tiny SYNTHETIC games so the guarantees hold for every future
// adapter, not just this repo's content:
//   • VARIABLE-LENGTH CHAPTERS (added for Ratify It!; chapters used to be
//     exactly two steps). You Be the President runs 7 chapters of ONE step.
//   • The `reveal` card + the debrief `trail` (added for You Be the President).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createStepGame } from '../src/games/_stepGame.js';

const CHOICES = [
  { label: 'right', verdict: 'right', effects: { m: 5 }, feedback: 'fb-right' },
  { label: 'partial', verdict: 'partial', effects: {}, feedback: 'fb-partial' },
  { label: 'wrong', verdict: 'wrong', effects: {}, feedback: 'fb-wrong' },
];

function makeGame(chapterShapes, { variants, reveal } = {}) {
  return createStepGame({
    id: 'synthetic',
    title: 'Synthetic',
    sides: ['x'],
    variants,
    modes: ['solo'],
    soloRival: false,
    startMeters: () => ({ m: 50 }),
    phasesFor: (key) => chapterShapes(key).map((n, ci) => ({
      title: `C${ci}`,
      date: `D${ci}`,
      image: null,
      event: `event ${ci}`,
      steps: Array.from({ length: n }, (_, si) => ({
        kind: 'decision',
        prompt: `p${ci}.${si}`,
        ...(reveal ? { reveal: { who: `who${ci}.${si}` } } : {}),
        choices: CHOICES.map((c) => ({ ...c })),
      })),
    })),
    meta: { meters: { m: { name: 'M' } } },
    scoreMeters: (m) => m.m,
    endingFor: (score) => ({ key: 'e', title: 'E', text: 't' }),
    debriefFor: () => 'd',
  });
}

test('chapterOf maps cursors through uneven chapters (1/3/2)', () => {
  const game = makeGame(() => [1, 3, 2]);
  assert.equal(game.totalActions, 6);
  assert.equal(game.chapterCount, 3);
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(game.chapterOf), [0, 1, 1, 1, 2, 2, 3],
    'cursor === TOTAL maps past the last chapter, like floor(TOTAL/2) used to');
});

test('chapterOf matches the old floor(cursor/2) exactly for 2-step games', () => {
  const game = makeGame(() => [2, 2, 2]);
  for (let c = 0; c <= 6; c++) assert.equal(game.chapterOf(c), Math.floor(c / 2));
});

test('chapterDone fires only at real chapter boundaries; prompts carry stepInChapter/chapterSteps', () => {
  const game = makeGame(() => [1, 3, 2]);
  const state = game.initMatch({ mode: 'solo', soloSide: 'x' });

  const expectPos = [ // [stepInChapter, chapterSteps, chapter.index] per step
    [0, 1, 0], [0, 3, 1], [1, 3, 1], [2, 3, 1], [0, 2, 2], [1, 2, 2],
  ];
  const boundaries = [];
  for (let i = 0; i < 6; i++) {
    game.chapterEvent(state, 'x');
    const prompt = game.currentPrompt(state, 'x');
    assert.equal(prompt.stepInChapter, expectPos[i][0], `step ${i} stepInChapter`);
    assert.equal(prompt.chapterSteps, expectPos[i][1], `step ${i} chapterSteps`);
    assert.equal(prompt.chapter.index, expectPos[i][2], `step ${i} chapter index`);
    const res = game.resolve(state, 'x', game.aiMove(state, 'x'));
    if (res.chapterDone) boundaries.push(i);
  }
  assert.deepEqual(boundaries, [0, 3, 5], 'done after steps 1, 4, and 6 — not every 2');
  assert.ok(game.isComplete(state));
});

test('chapter events fire once per chapter, at the uneven boundaries', () => {
  const game = makeGame(() => [1, 3, 2]);
  const state = game.initMatch({ mode: 'solo', soloSide: 'x' });
  const seen = [];
  for (let i = 0; i < 6; i++) {
    const ev = game.chapterEvent(state, 'x');
    if (ev) seen.push(ev.chapter.index);
    game.resolve(state, 'x', game.aiMove(state, 'x'));
  }
  assert.deepEqual(seen, [0, 1, 2], 'each chapter announced exactly once');
});

/* ---- reveal cards + the debrief trail (You Be the President, spec §6/§5.5) ---- */

test('reveal rides on the STEP: same card for every choice, never in the prompt', () => {
  const game = makeGame(() => [1, 1], { reveal: true });
  for (const pick of ['right', 'partial', 'wrong']) {
    const state = game.initMatch({ mode: 'solo', soloSide: 'x' });
    const prompt = game.currentPrompt(state, 'x');
    assert.equal(prompt.reveal, undefined, 'the answer card must not ship with the question');
    assert.deepEqual(prompt.choices.slice().sort(), ['partial', 'right', 'wrong']);
    // Submit whichever presented index maps to this verdict.
    const idx = prompt.choices.indexOf(pick);
    const res = game.resolve(state, 'x', { kind: 'decision', choiceIndex: idx });
    assert.equal(res.verdict, pick);
    assert.deepEqual(res.reveal, { who: 'who0.0' }, `history is told after a ${pick} answer too`);
  }
});

test('reveal is null when a step declares none, including on a timed-out submit', () => {
  const plain = makeGame(() => [1]);
  const s1 = plain.initMatch({ mode: 'solo', soloSide: 'x' });
  assert.equal(plain.resolve(s1, 'x', plain.aiMove(s1, 'x')).reveal, null);

  const withCard = makeGame(() => [1], { reveal: true });
  const s2 = withCard.initMatch({ mode: 'solo', soloSide: 'x' });
  const timedOut = withCard.resolve(s2, 'x', { kind: 'decision', choiceIndex: null });
  assert.equal(timedOut.verdict, 'wrong');
  assert.deepEqual(timedOut.reveal, { who: 'who0.0' }, 'the clock beating you does not erase the history');
});

test('report().trail pairs your call with the real call, in order, per chapter', () => {
  const game = makeGame(() => [1, 1, 1]);
  const state = game.initMatch({ mode: 'solo', soloSide: 'x' });
  const picks = ['wrong', 'right', 'partial'];
  for (const pick of picks) {
    const prompt = game.currentPrompt(state, 'x');
    game.resolve(state, 'x', { kind: 'decision', choiceIndex: prompt.choices.indexOf(pick) });
  }
  const { trail, accuracy } = game.report(state).perSide.x;
  assert.equal(trail.length, 3);
  assert.deepEqual(trail.map((t) => t.chapter), [0, 1, 2]);
  assert.deepEqual(trail.map((t) => t.title), ['C0', 'C1', 'C2']);
  assert.deepEqual(trail.map((t) => t.verdict), picks);
  assert.deepEqual(trail.map((t) => t.yourCall), picks, 'the label you actually chose');
  assert.deepEqual(trail.map((t) => t.realCall), ['right', 'right', 'right'], 'always the right label');
  assert.equal(accuracy, 50, '(0 + 1 + 0.5) / 3 = 50%');
});

test('a timed-out step still lands in the trail, with no call of your own', () => {
  const game = makeGame(() => [1]);
  const state = game.initMatch({ mode: 'solo', soloSide: 'x' });
  game.resolve(state, 'x', { kind: 'decision', choiceIndex: -1 });
  const [row] = game.report(state).perSide.x.trail;
  assert.equal(row.yourCall, null);
  assert.equal(row.realCall, 'right');
  assert.equal(row.verdict, 'wrong');
});

test('variants with mismatched shapes fail loudly at startup', () => {
  assert.throws(
    () => makeGame((key) => (key === 'a' ? [2, 2] : [2, 1]), { variants: ['a', 'b'] }),
    /chapter 1 has 1 steps; expected 2/,
    'a drifted step count is a startup error, not a silent desync'
  );
  assert.throws(
    () => makeGame((key) => (key === 'a' ? [2, 2] : [2]), { variants: ['a', 'b'] }),
    /has 1 chapters; expected 2/,
    'a drifted chapter count too'
  );
});

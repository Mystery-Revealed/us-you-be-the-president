// content.test.js — pins the ANSWER KEY and the spec §10 build checklist.
// These are the tests that would catch a well-meaning copy edit silently
// changing what the game teaches.

import test from 'node:test';
import assert from 'node:assert/strict';
import game, { phasesFor, meterScore, endingFor, START_METERS } from '../src/games/usYouBeThePresident.js';
import { CRISES } from '../src/games/usYouBeThePresident.content.js';
import { COPY } from '../src/games/usYouBeThePresident.copy.js';

const PHASES = phasesFor();
const STEPS = PHASES.flatMap((p) => p.steps);
const rightOf = (step) => step.choices.find((c) => c.verdict === 'right');

/* ---------------- shape + chronology (spec §10) ---------------- */

test('seven crises, one decision each, three choices each', () => {
  assert.equal(game.totalActions, 7, 'seven graded actions');
  assert.equal(game.chapterCount, 7, 'seven chapters');
  assert.deepEqual(PHASES.map((p) => p.steps.length), [1, 1, 1, 1, 1, 1, 1]);
  for (const s of STEPS) {
    assert.equal(s.kind, 'decision');
    assert.equal(s.choices.length, 3);
  }
});

test('chronology is locked 1 → 7, Washington through Jackson', () => {
  assert.deepEqual(PHASES.map((p) => p.date), ['1794', '1797', '1803', '1807', '1812', '1820', '1832']);
  assert.deepEqual(CRISES.map((c) => c.president), [
    'George Washington', 'John Adams', 'Thomas Jefferson', 'Thomas Jefferson',
    'James Madison', 'James Monroe', 'Andrew Jackson',
  ]);
  const years = PHASES.map((p) => Number(p.date));
  for (let i = 1; i < years.length; i++) {
    assert.ok(years[i] > years[i - 1], `crisis ${i + 1} must come after crisis ${i}`);
  }
  // A one-step chapter cannot be reordered by the cursor either.
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map(game.chapterOf), [0, 1, 2, 3, 4, 5, 6, 7]);
});

test('every crisis has exactly one right, one partial, and one wrong choice', () => {
  for (const [i, s] of STEPS.entries()) {
    const verdicts = s.choices.map((c) => c.verdict).sort();
    assert.deepEqual(verdicts, ['partial', 'right', 'wrong'], `crisis ${i + 1}`);
  }
});

/* ---------------- the answer key itself (spec §2 + §4) ---------------- */

test('the right choice in each crisis is what the real president actually did', () => {
  const expected = [
    /militia.*lead it west yourself/i,          // Washington marched, 1794
    /Refuse\. Build a navy/i,                   // Adams refused tribute, built a navy
    /Buy it all/i,                              // Jefferson bought Louisiana
    /Stop ALL American trade/i,                 // Jefferson chose the Embargo
    /declare war on Great Britain/i,            // Madison asked for war
    /Clay's package.*36°30′/i,                  // Monroe signed the compromise
    /Force Bill.*Clay's slow tariff cut/i,      // Jackson did BOTH
  ];
  expected.forEach((re, i) => {
    assert.match(rightOf(STEPS[i]).label, re, `crisis ${i + 1}'s right answer`);
  });
});

test('meter effects match spec §4 exactly, crisis by crisis', () => {
  const byVerdict = (i) => Object.fromEntries(STEPS[i].choices.map((c) => [c.verdict, c.effects]));
  const expect = [
    { right: { union: 15, approval: 5 }, partial: { union: -5, peace: 5 }, wrong: { union: -15, approval: 5 } },
    { right: { peace: 5, union: 10 }, partial: { peace: -15, approval: 10 }, wrong: { approval: -15, union: -10 } },
    { right: { union: 15, approval: 10 }, partial: { union: 5 }, wrong: { approval: -10, union: -10 } },
    { right: { peace: 10, approval: -15 }, partial: { approval: 5 }, wrong: { peace: -20 } },
    { right: { approval: 10, peace: -15 }, partial: { peace: 5, approval: -10 }, wrong: { union: -15 } },
    { right: { union: 15, approval: 5 }, partial: { union: -10, approval: -5 }, wrong: { union: -15 } },
    { right: { union: 20 }, partial: { union: 5, peace: -15 }, wrong: { union: -20 } },
  ];
  expect.forEach((want, i) => assert.deepEqual(byVerdict(i), want, `crisis ${i + 1} effects`));
});

/* ---------------- the reveal card (spec §5.4, §6, §10) ---------------- */

test('every crisis carries a complete "What Really Happened" card', () => {
  CRISES.forEach((c, i) => {
    const r = c.reveal;
    assert.ok(r, `crisis ${i + 1} has a reveal`);
    for (const field of ['president', 'years', 'initials', 'decision', 'reason', 'outcome']) {
      assert.ok(r[field] && r[field].length > 0, `crisis ${i + 1} reveal.${field}`);
    }
    assert.equal(r.president, c.president, 'the card names the president whose chair it is');
  });
});

test('the reveal card ships after EVERY resolution — right, partial, or wrong', () => {
  for (const verdict of ['right', 'partial', 'wrong']) {
    const state = game.initMatch({ mode: 'solo', soloSide: 'president' });
    for (let i = 0; i < game.totalActions; i++) {
      const prompt = game.currentPrompt(state, 'president');
      assert.equal(prompt.reveal, undefined, 'the question never carries the answer card');
      const realIdx = STEPS[i].choices.findIndex((c) => c.verdict === verdict);
      const presented = state.sides.president.shuffles[i].indexOf(realIdx);
      const res = game.resolve(state, 'president', { kind: 'decision', choiceIndex: presented });
      assert.equal(res.verdict, verdict);
      assert.equal(res.reveal.president, CRISES[i].president, `crisis ${i + 1} reveal on a ${verdict} answer`);
      assert.ok(res.reveal.outcome.length > 20);
    }
  }
});

/* ---------------- honest scoring (spec §3, §10) ---------------- */

function runAll(verdict) {
  const state = game.initMatch({ mode: 'solo', soloSide: 'president' });
  for (let i = 0; i < game.totalActions; i++) {
    const realIdx = STEPS[i].choices.findIndex((c) => c.verdict === verdict);
    const presented = state.sides.president.shuffles[i].indexOf(realIdx);
    game.resolve(state, 'president', { kind: 'decision', choiceIndex: presented });
  }
  return game.report(state).perSide.president;
}

test('all-right = 100% and all-wrong = 0%, server-verified', () => {
  assert.equal(runAll('right').accuracy, 100);
  assert.equal(runAll('wrong').accuracy, 0);
  assert.equal(runAll('partial').accuracy, 50, 'seven halves out of seven');
});

test('THE EMBARGO CASE: crisis 4 scores a full point while Approval drops 15', () => {
  const state = game.initMatch({ mode: 'solo', soloSide: 'president' });
  // Skip to crisis 4 by answering the first three correctly.
  for (let i = 0; i < 3; i++) {
    const realIdx = STEPS[i].choices.findIndex((c) => c.verdict === 'right');
    game.resolve(state, 'president', { kind: 'decision', choiceIndex: state.sides.president.shuffles[i].indexOf(realIdx) });
  }
  const before = { ...state.sides.president.meters };
  const realIdx = STEPS[3].choices.findIndex((c) => c.verdict === 'right');
  const res = game.resolve(state, 'president', { kind: 'decision', choiceIndex: state.sides.president.shuffles[3].indexOf(realIdx) });

  assert.equal(res.verdict, 'right', 'matching Jefferson is worth a full point');
  assert.equal(res.effects.approval, -15, 'and it costs 15 Approval');
  assert.equal(res.meters.approval, before.approval - 15, 'the meter really moves down');
  assert.equal(res.meters.peace, before.peace + 10);
  assert.match(res.feedback, /Accurate is not the same as wise/,
    'the game says the divergence out loud rather than hiding it');
  assert.match(res.reveal.note, /not the same as saying he was right/);
});

/* ---------------- endings + debrief (spec §3, §5.5, §11) ---------------- */

test('the three ending tiers are each reachable by real play', () => {
  const start = meterScore(START_METERS);
  assert.equal(start, 150, 'three meters at 50');

  const perfect = runAll('right');
  assert.deepEqual(perfect.meters, { approval: 65, union: 100, peace: 50 });
  assert.equal(perfect.ending.key, 'steady', '215 → A Steady Hand');
  assert.equal(perfect.ending.title, 'A Steady Hand');

  const hedged = runAll('partial');
  assert.deepEqual(hedged.meters, { approval: 50, union: 45, peace: 30 });
  assert.equal(hedged.ending.key, 'survives', '125 → The Republic Survives You');

  const disaster = runAll('wrong');
  assert.deepEqual(disaster.meters, { approval: 30, union: 0, peace: 30 });
  assert.equal(disaster.ending.key, 'rough', '60 → A Rough Term in Office');
});

test('ending thresholds are exactly the spec\'s 180 / 100', () => {
  assert.equal(endingFor(180).key, 'steady');
  assert.equal(endingFor(179).key, 'survives');
  assert.equal(endingFor(100).key, 'survives');
  assert.equal(endingFor(99).key, 'rough');
});

test('the debrief table pairs your call with his call for all seven crises', () => {
  const state = game.initMatch({ mode: 'solo', soloSide: 'president' });
  const picks = ['right', 'wrong', 'partial', 'right', 'right', 'partial', 'wrong'];
  picks.forEach((v, i) => {
    const realIdx = STEPS[i].choices.findIndex((c) => c.verdict === v);
    game.resolve(state, 'president', { kind: 'decision', choiceIndex: state.sides.president.shuffles[i].indexOf(realIdx) });
  });
  const { trail, accuracy } = game.report(state).perSide.president;

  assert.equal(trail.length, 7);
  assert.deepEqual(trail.map((t) => t.title), CRISES.map((c) => c.title));
  assert.deepEqual(trail.map((t) => t.date), CRISES.map((c) => c.date));
  assert.deepEqual(trail.map((t) => t.verdict), picks);
  trail.forEach((row, i) => {
    assert.equal(row.realCall, rightOf(STEPS[i]).label, `crisis ${i + 1} shows HIS call`);
    assert.equal(row.yourCall, STEPS[i].choices.find((c) => c.verdict === picks[i]).label);
    if (picks[i] === 'right') assert.equal(row.yourCall, row.realCall);
    else assert.notEqual(row.yourCall, row.realCall);
  });
  assert.equal(accuracy, 57, '(1+0+0.5+1+1+0.5+0) / 7 → 57%');
});

/* ---------------- sensitivity + reading level (spec §11, Standards §3) ---------------- */

test('Crisis 6 names slavery plainly and refuses to call 36°30′ a happy ending', () => {
  const missouri = CRISES.find((c) => c.id === 'missouri');
  assert.match(COPY.briefs.missouri.text, /enslaved men, women, and children/,
    'the brief names enslaved people as people, not a "balance"');
  assert.match(missouri.reveal.outcome, /Nothing was solved/);
  assert.match(missouri.reveal.note, /not.*a happy ending/i);
  assert.match(missouri.reveal.outcome, /Civil War/, 'the line ends in 1854, not in peace');
});

test('accuracy is not endorsement: the debrief names Indian Removal and does not gamify it', () => {
  assert.match(COPY.debrief.note, /Indian Removal Act/);
  assert.match(COPY.debrief.note, /Cherokee, Muscogee, Choctaw, Chickasaw, and Seminole/);
  assert.match(COPY.debrief.note, /The Trail Where They Cried/);
  assert.match(COPY.debrief.note, /not a decision to play with/i);
  // ...and it is nowhere in the graded content.
  const graded = JSON.stringify(CRISES);
  assert.doesNotMatch(graded, /Indian Removal/, 'removal is never a scored choice');
});

test('Native nations are actors, not scenery (Standards §10.4)', () => {
  assert.match(COPY.briefs.war1812.text, /defending their homelands/);
  const war = CRISES.find((c) => c.id === 'war1812');
  assert.match(war.reveal.note, /Tecumseh/);
});

test('every student-facing sentence stays short (Standards §3: ~20 words)', () => {
  const blocks = [
    ...CRISES.flatMap((c) => [c.prompt, ...c.choices.flatMap((ch) => [ch.label, ch.feedback]),
      c.reveal.decision, c.reveal.reason, c.reveal.outcome, c.reveal.note]),
    ...Object.values(COPY.briefs).flatMap((b) => [b.text, ...b.advisors.map((a) => a.line)]),
    ...Object.values(COPY.endings).map((e) => e.text),
    COPY.debrief.text, COPY.debrief.note,
    ...Object.values(COPY.vocab),
  ].filter(Boolean);

  // A sentence can end inside a quotation ('…tribute!" The Quasi-War…'), so the
  // terminator may be followed by a closing quote before the space. And a
  // free-standing em dash is punctuation, not a word — count only tokens that
  // contain a letter or a digit, so " — " never inflates a sentence's length.
  const sentencesOf = (block) => block.split(/(?<=[.!?…]["'”’»]?)\s+/);
  const wordsOf = (sentence) => sentence.trim().split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t));

  const long = [];
  for (const block of blocks) {
    for (const sentence of sentencesOf(block)) {
      const n = wordsOf(sentence).length;
      if (n > 26) long.push(`${n}w: ${sentence.slice(0, 80)}…`);
    }
  }
  assert.deepEqual(long, [], `sentences over 26 words:\n${long.join('\n')}`);
});

test('the seven vocabulary terms are defined and actually appear in the game', () => {
  const all = JSON.stringify([CRISES, COPY]).toLowerCase();
  for (const [term, def] of Object.entries(COPY.vocab)) {
    assert.ok(def.length > 10, `${term} has a real definition`);
    assert.ok(all.includes(term.toLowerCase()), `"${term}" is actually used somewhere students read`);
  }
  for (const required of ['excise tax', 'tribute', 'embargo', 'impressment', 'nullification']) {
    assert.ok(COPY.vocab[required], `spec §2 requires "${required}"`);
  }
});

/* ---------------- meta the client depends on ---------------- */

test('meta ships one advisor pair per crisis, and no answers', () => {
  assert.equal(game.meta.crises.length, 7);
  game.meta.crises.forEach((c, i) => {
    assert.equal(c.title, CRISES[i].title);
    assert.equal(c.image, CRISES[i].image);
    assert.equal(c.advisors.length, 2, `crisis ${i + 1} has two advisors`);
    for (const a of c.advisors) assert.ok(a.name && a.role && a.line);
  });
  const metaJson = JSON.stringify(game.meta);
  assert.doesNotMatch(metaJson, /"verdict"/, 'meta never carries a verdict');
  assert.doesNotMatch(metaJson, /"reveal"/, 'meta never carries a reveal card');
});

test('one class-wide group: no side pick, no rival', () => {
  assert.deepEqual(game.sides, ['president']);
  assert.equal(game.soloRival, false);
  assert.deepEqual(game.meta.chapters.map((c) => c.title), CRISES.map((c) => c.title));
});

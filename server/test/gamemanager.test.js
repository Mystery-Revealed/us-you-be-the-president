// gamemanager.test.js — drives the manager the way socketHandlers does and
// inspects the emit instructions it returns. No sockets involved.
//
// You Be the President is the simplest shape the engine supports: single-role
// solo, no pick, no variants, no branch, no AI rival. So these focus on the
// solo lifecycle, the ONE class-wide group, the per-CRISIS accuracy row over
// seven one-step chapters, and the live-roster pushes the Command Center needs.

import test from 'node:test';
import assert from 'node:assert/strict';
import { GameManager } from '../src/GameManager.js';
import game, { phasesFor } from '../src/games/usYouBeThePresident.js';

const PIN = '4242';
const SIDE = 'president';
const STEPS = phasesFor().flatMap((p) => p.steps);

function makeSession(manager, { requireApproval = false } = {}) {
  const res = manager.createSession({ pin: PIN, requireApproval });
  assert.ok(res.joinCode, 'session created');
  return res.joinCode;
}

function join(manager, joinCode, nickname) {
  const res = manager.joinStudent({ joinCode, nickname, mode: 'solo' });
  assert.ok(!res.error, `join failed: ${res.error}`);
  return res;
}

const studentEvents = (emits, studentId, name) =>
  emits.filter((e) => e.to.type === 'student' && e.to.studentId === studentId && (!name || e.event === name));
const eventsOf = (emits, name) => emits.filter((e) => e.event === name);

function liveMatch(manager, joinCode, studentId) {
  const session = manager.registry.get(joinCode);
  const student = session.students.get(studentId);
  return session.matches.get(student.matchId);
}

// Submit the choice with the given verdict, mapping the real index through this
// match's shuffle — exactly what a student tapping the right button produces.
function play(manager, joinCode, studentId, verdict) {
  const match = liveMatch(manager, joinCode, studentId);
  const ss = match.gameState.sides[match.side];
  const realIdx = STEPS[ss.cursor].choices.findIndex((c) => c.verdict === verdict);
  const presented = ss.shuffles[ss.cursor].indexOf(realIdx);
  const res = manager.submitMove({ joinCode, studentId, move: { kind: 'decision', choiceIndex: presented } });
  assert.ok(!res.error, `submit failed: ${res.error}`);
  return res;
}

function playAll(manager, joinCode, studentId, verdict) {
  let last;
  for (let i = 0; i < game.totalActions; i++) last = play(manager, joinCode, studentId, verdict);
  return last;
}

test('createSession rejects a bad PIN', () => {
  const manager = new GameManager();
  assert.equal(manager.createSession({ pin: 'abc' }).error, 'bad_pin');
  assert.equal(manager.createSession({ pin: '12345' }).error, 'bad_pin');
});

test('the default game is You Be the President', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.registry.get(joinCode).gameId, 'us-you-be-the-president');
});

test('teacher ops require the right PIN', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.endSession({ joinCode, pin: '9999' }).error, 'bad_pin');
  assert.equal(manager.setApproval({ joinCode, pin: '0000', requireApproval: false }).error, 'bad_pin');
});

test('a student joins with NO pick and the match begins immediately', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');

  const begin = studentEvents(res.emits, res.studentId, 'match:begin');
  assert.equal(begin.length, 1, 'solo match begins on join — nothing to choose first');
  assert.equal(begin[0].payload.side, SIDE);
  assert.equal(begin[0].payload.rivalMeters, null, 'no rival — you sit in the chair alone');
  assert.equal(begin[0].payload.chapterCount, 7, 'seven crises');
  assert.deepEqual(begin[0].payload.meters, { approval: 50, union: 50, peace: 50 });
  assert.equal(begin[0].payload.meta.crises.length, 7, 'advisor data ships with the match');

  const firstEvent = studentEvents(res.emits, res.studentId, 'chapter:event')[0].payload;
  assert.equal(firstEvent.chapter.title, 'The Whiskey Rebellion');
  assert.equal(firstEvent.chapter.date, '1794');
  assert.match(firstEvent.text, /excise tax/, 'the crisis brief ships');

  const turn = studentEvents(res.emits, res.studentId, 'turn:begin')[0].payload;
  assert.equal(turn.kind, 'decision');
  assert.equal(turn.choices.length, 3);
  assert.equal(turn.stepInChapter, 0);
  assert.equal(turn.chapterSteps, 1, 'one decision per crisis');
});

test('all seven right earns 100% and "A Steady Hand", with the trail attached', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');

  const last = playAll(manager, joinCode, res.studentId, 'right');
  const end = studentEvents(last.emits, res.studentId, 'match:end');
  assert.equal(end.length, 1, 'match ends after 7 actions');
  assert.equal(end[0].payload.you.accuracy, 100);
  assert.equal(end[0].payload.you.ending.key, 'steady');
  assert.equal(end[0].payload.rival, null);
  assert.equal(end[0].payload.you.trail.length, 7, 'the debrief table rides on match:end');
  assert.ok(end[0].payload.you.trail.every((t) => t.yourCall === t.realCall));
  assert.match(end[0].payload.you.debrief, /untrodden ground/);

  const roster = manager.roster(manager.registry.get(joinCode));
  assert.equal(roster.students[0].status, 'completed');
  assert.equal(roster.students[0].accuracy, 100);
});

test('all seven wrong earns 0% and "A Rough Term in Office"', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ben');
  const end = studentEvents(playAll(manager, joinCode, res.studentId, 'wrong').emits, res.studentId, 'match:end')[0];
  assert.equal(end.payload.you.accuracy, 0);
  assert.equal(end.payload.you.ending.key, 'rough');
  assert.ok(end.payload.you.trail.every((t) => t.yourCall !== t.realCall));
});

test('the reveal card is on the wire for every resolution the student receives', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Cam');
  const seen = [];
  for (let i = 0; i < game.totalActions; i++) {
    const verdict = ['right', 'partial', 'wrong'][i % 3];
    const r = play(manager, joinCode, res.studentId, verdict);
    const resolution = studentEvents(r.emits, res.studentId, 'turn:resolution')[0].payload;
    assert.ok(resolution.reveal, `crisis ${i + 1} resolution carries a reveal card`);
    assert.ok(resolution.feedback, 'and the clerk\'s feedback line');
    seen.push(resolution.reveal.president);
  }
  assert.deepEqual(seen, [
    'George Washington', 'John Adams', 'Thomas Jefferson', 'Thomas Jefferson',
    'James Madison', 'James Monroe', 'Andrew Jackson',
  ]);
});

test('class accuracy is ONE class-wide group (spec §1: no pick)', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const a = join(manager, joinCode, 'Ana');
  const b = join(manager, joinCode, 'Ben');
  playAll(manager, joinCode, a.studentId, 'right');   // 100%
  playAll(manager, joinCode, b.studentId, 'partial'); // 50%

  const roster = manager.roster(manager.registry.get(joinCode));
  assert.deepEqual(Object.keys(roster.classAccuracy), [SIDE], 'exactly one group');
  assert.equal(roster.classAccuracy[SIDE].count, 2);
  assert.equal(roster.classAccuracy[SIDE].average, 75);
});

test('the per-CRISIS accuracy row ticks live, one bucket per crisis', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Liv');

  const r = play(manager, joinCode, res.studentId, 'right');
  const roster1 = eventsOf(r.emits, 'lobby:update').at(-1).payload;
  assert.equal(roster1.meta.chapters.length, 7);
  assert.equal(roster1.meta.chapters[0].title, 'The Whiskey Rebellion');
  assert.deepEqual(roster1.chapterAccuracy[0], { count: 1, average: 100 },
    'the Whiskey row already reflects the just-graded action');
  assert.deepEqual(roster1.chapterAccuracy[1], { count: 0, average: null });

  play(manager, joinCode, res.studentId, 'wrong');    // XYZ
  play(manager, joinCode, res.studentId, 'partial');  // Louisiana
  const roster2 = manager.roster(manager.registry.get(joinCode));
  assert.deepEqual(roster2.chapterAccuracy[1], { count: 1, average: 0 });
  assert.deepEqual(roster2.chapterAccuracy[2], { count: 1, average: 50 });
  assert.equal(roster2.matches[0].chapter, 4, 'three crises done → on crisis 4');
});

test('two students\' answers pool into the same per-crisis bucket', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const a = join(manager, joinCode, 'Ana');
  const b = join(manager, joinCode, 'Ben');
  play(manager, joinCode, a.studentId, 'right');
  play(manager, joinCode, b.studentId, 'wrong');
  const roster = manager.roster(manager.registry.get(joinCode));
  assert.deepEqual(roster.chapterAccuracy[0], { count: 2, average: 50 },
    'one right + one wrong on crisis 1 reads 50% for the class');
});

test('the teacher\'s very first lobby:update already shows in_progress', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Cam');
  const lobbyUpdates = eventsOf(res.emits, 'lobby:update');
  assert.equal(lobbyUpdates.length, 1, 'join emits exactly one roster snapshot');
  assert.equal(lobbyUpdates[0].payload.students[0].status, 'in_progress');
});

test('approval gate: a solo student waits, then starts on approve', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager, { requireApproval: true });
  const res = join(manager, joinCode, 'Mara');
  assert.equal(res.approved, false);
  assert.equal(studentEvents(res.emits, res.studentId, 'match:begin').length, 0);

  const ok = manager.approveStudent({ joinCode, pin: PIN, studentId: res.studentId });
  assert.equal(studentEvents(ok.emits, res.studentId, 'join:approved').length, 1);
  assert.equal(studentEvents(ok.emits, res.studentId, 'match:begin').length, 1);
});

test('a wrong-kind move is rejected', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');
  const bad = manager.submitMove({ joinCode, studentId: res.studentId, move: { kind: 'multiSelect', choiceIndices: [0] } });
  assert.equal(bad.error, 'wrong_step_kind');
});

test('rejoin returns a full snapshot of the live crisis', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');
  play(manager, joinCode, res.studentId, 'right'); // Whiskey done; XYZ pending

  manager.markDisconnected({ joinCode, studentId: res.studentId });
  const back = manager.rejoinStudent({ joinCode, studentId: res.studentId });
  assert.ok(!back.error);
  assert.equal(back.sync.screen, 'match');
  assert.equal(back.sync.matchBegin.side, SIDE);
  assert.equal(back.sync.chapterEvent.chapter.title, 'The XYZ Affair');
  assert.equal(back.sync.turn.kind, 'decision');
  assert.equal(back.sync.turn.choices.length, 3);
  assert.equal(back.sync.turn.reveal, undefined, 'a reconnect never leaks the answer card');
});

test('a finished student who reconnects gets the result screen back, trail and all', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  const res = join(manager, joinCode, 'Ana');
  playAll(manager, joinCode, res.studentId, 'right');
  const back = manager.rejoinStudent({ joinCode, studentId: res.studentId });
  assert.equal(back.sync.screen, 'result');
  assert.equal(back.sync.matchEnd.you.accuracy, 100);
  assert.equal(back.sync.matchEnd.you.trail.length, 7);
});

test('end_session wipes the session from memory', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  join(manager, joinCode, 'Ana');
  const res = manager.endSession({ joinCode, pin: PIN });
  assert.ok(eventsOf(res.emits, 'session:ended').length >= 2, 'teacher + student notified');
  assert.equal(manager.registry.get(joinCode), undefined);
});

test('students cannot reach teacher data: report requires the PIN', () => {
  const manager = new GameManager();
  const joinCode = makeSession(manager);
  assert.equal(manager.sessionReport({ joinCode, pin: '1111' }).error, 'bad_pin');
  assert.ok(manager.sessionReport({ joinCode, pin: PIN }).report);
});

// usYouBeThePresident.js — Unit 4 U.S. History adapter: "You Be the President"
// (SOLO, single role — NO pick, NO variants, NO branch, NO AI rival). Every
// student sits in the same chair and faces the same seven crises in the same
// order, Washington through Jackson: Whiskey Rebellion (1794) → XYZ Affair
// (1797) → Louisiana (1803) → Embargo (1807) → War (1812) → Missouri (1820) →
// Nullification (1832). One decision each = 7 graded actions (spec §3).
//
// SHAPE NOTE: seven chapters of ONE step each. That only works because the
// step-game factory derives its chapter map from the phase list rather than
// assuming two steps per chapter — the variable-length-chapter capability
// added for Ratify It! (see _stepGame.js, STEP_TO_CHAPTER). Chronology is
// locked by construction: the CRISES array IS the order, and a chapter of one
// step cannot be reordered or skipped.
//
// THE ENGINE OF THE DESIGN (spec §0): a choice is "right" when it matches what
// the real president ACTUALLY DECIDED. After the verdict, a "What Really
// Happened" card reveals his decision, his reasons, and the outcome. That
// two-beat rhythm — your call, then history's call — is the whole game.
//
// HONEST SCORING (spec §3): meters are drama, accuracy is the grade. Right = 1,
// partial = 0.5, wrong = 0, server-side; accuracy = points ÷ 7 × 100. Crisis 4
// is the deliberate proof: the Embargo scores a FULL POINT and costs 15
// Approval, because Jefferson chose it and it was a disaster. The game says so
// out loud rather than hiding the split.
//
// Reading level: 8th-grade content at a 5th-grade reading level (Common
// Standards §3). TEKS 8.5A–H, 8.17B, 8.22A, 8.31B.
//
// SENSITIVITY (spec §11): Crisis 6 names slavery plainly and names enslaved
// people as people, not as a "balance" abstraction; 36°30′ is never presented
// as a happy ending. Accuracy ≠ endorsement — the debrief names Indian Removal
// as the same era's other answer, and points to the unit's Trail app rather
// than gamifying it. War choices are graded soberly, with no glory language.

import { createStepGame } from './_stepGame.js';
import { CRISES } from './usYouBeThePresident.content.js';
import { COPY } from './usYouBeThePresident.copy.js';

// ---------------------------------------------------------------------------
// One side — the chair. No pick, so the Command Center groups the whole class
// together (spec §1: "Pick: None — one class-wide group").
// ---------------------------------------------------------------------------

export const SIDE = 'president';

export const METERS = {
  approval: { name: 'Approval', icon: 'approval', blurb: 'The people\'s mood. Popular is not the same as right.' },
  union: { name: 'Union', icon: 'union', blurb: 'How well the states are holding together as one country.' },
  peace: { name: 'Peace', icon: 'peace', blurb: 'How far you are from war and ruin.' },
};

export const START_METERS = { approval: 50, union: 50, peace: 50 };

// ---------------------------------------------------------------------------
// Compile the answer key into engine phases: one crisis = one chapter = one
// step. The `reveal` rides on the STEP, so every student gets the same history
// card whether they matched the president or missed him entirely.
// ---------------------------------------------------------------------------

export function phasesFor() {
  return CRISES.map((c) => ({
    title: c.title,
    date: c.date,
    image: c.image,
    event: COPY.briefs[c.id].text,
    steps: [{
      kind: 'decision',
      prompt: c.prompt,
      reveal: c.reveal,
      choices: c.choices.map((ch) => ({
        label: ch.label,
        verdict: ch.verdict,
        effects: ch.effects,
        feedback: ch.feedback,
      })),
    }],
  }));
}

// ---------------------------------------------------------------------------
// Endings (spec §3): the SUM of the three meters, which start at 50 each (150).
//
// The tiers are reachable by real play, not just in theory:
//   • every right answer  → Approval 65 + Union 100 (clamped) + Peace 50 = 215
//   • every partial       → 50 + 45 + 30                                 = 125
//   • every wrong answer  → 30 + 0 (clamped) + 30                        =  60
// so a perfect run lands in "A Steady Hand," a hedging run in the middle, and
// a run that misses every president lands in "A Rough Term in Office". The
// content test pins all three.
// ---------------------------------------------------------------------------

export const STEADY_MIN = 180;
export const SURVIVES_MIN = 100;

export function meterScore(meters) {
  return (meters.approval || 0) + (meters.union || 0) + (meters.peace || 0);
}

export function endingFor(score) {
  const tier = score >= STEADY_MIN ? 'steady' : score >= SURVIVES_MIN ? 'survives' : 'rough';
  const e = COPY.endings[tier];
  return { key: tier, title: e.title, text: e.text };
}

export function debriefFor() {
  return COPY.debrief.text;
}

// ---------------------------------------------------------------------------

export default createStepGame({
  id: 'us-you-be-the-president',
  title: 'You Be the President',
  sides: [SIDE],                // one class-wide group — no pick, no variants
  modes: ['solo'],
  soloRival: false,             // you sit in the chair alone; there is no rival
  startMeters: () => ({ ...START_METERS }),
  phasesFor,
  meta: {
    meters: METERS,             // no map layer
    tagline: COPY.tagline,
    // Display-only crisis data the client reads by chapter index: the advisors
    // who whisper on the brief screen, and the president whose chair you are
    // in. Nothing here leaks a verdict — the advisors disagree on purpose, and
    // in five of the seven crises the loudest voice in the room lost.
    crises: CRISES.map((c) => ({
      id: c.id,
      title: c.title,
      date: c.date,
      image: c.image,
      president: c.president,
      advisors: COPY.briefs[c.id].advisors,
    })),
    vocab: COPY.vocab,
    debriefNote: COPY.debrief.note,
    // Command Center per-crisis class accuracy row (spec §9) — which crisis
    // fooled the class is the discussion fuel.
    chapters: CRISES.map((c) => ({ title: c.title, date: c.date })),
  },
  scoreMeters: meterScore,
  endingFor,
  debriefFor,
});

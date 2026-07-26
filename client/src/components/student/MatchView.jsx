// MatchView.jsx — one crisis at a time: crisis brief (date, situation, two
// advisors who disagree on purpose) → three choice buttons → verdict flash +
// feedback → THE REVEAL CARD ("What Really Happened": his decision, his
// reasons, the outcome) → next crisis. That two-beat rhythm — your call, then
// history's call — is the whole game (spec §5). Single-role solo: it's always
// your turn, no side, no map, no rival.

import { useEffect, useRef, useState } from 'react';
import { emitAck, errorText } from '../../services/socket.js';
import { Art } from '../../services/assets.jsx';
import VocabText from './VocabText.jsx';
import PresidentMeters from '../shared/PresidentMeters.jsx';
import PresidentSeal from '../shared/PresidentSeal.jsx';

export default function MatchView({ state, dispatch }) {
  const { match } = state;
  const { begin, eventCard, turn, feedback } = match;
  const crises = begin.meta?.crises || [];

  // The engine batches the next crisis's card+turn together with THIS crisis's
  // last turn:resolution — eventCard AND turn have both already raced ahead by
  // the time this feedback renders (see [[chapter-chip-race-fix]]). Pin the
  // header to the last crisis seen before feedback started.
  const settledRef = useRef(null);
  if (!feedback) settledRef.current = eventCard?.chapter || turn?.chapter || settledRef.current;
  const chapter = feedback ? (settledRef.current || eventCard?.chapter || turn?.chapter) : (eventCard?.chapter || turn?.chapter);
  const crisis = chapter ? crises[chapter.index] : null;

  return (
    <div className="match">
      <header className="match-header">
        {chapter && (
          <div className="chapter-chip">
            Crisis {chapter.index + 1} of {chapter.count} · {chapter.date}
          </div>
        )}
      </header>

      <PresidentMeters meters={match.meters} />

      <div className="match-body single">
        <section className="action-panel" aria-live="polite">
          {feedback ? (
            <FeedbackAndReveal
              key={feedback.stepIndex}
              feedback={feedback}
              matchEnded={!!state.matchEnd}
              onContinue={() => dispatch({ type: 'dismiss-feedback' })}
            />
          ) : eventCard ? (
            <CrisisCard eventCard={eventCard} crisis={crisis} onContinue={() => dispatch({ type: 'dismiss-event' })} />
          ) : turn?.yourTurn && turn.kind === 'decision' ? (
            <DecisionPanel turn={turn} />
          ) : (
            <div className="waiting-panel"><div className="pulse-dot" aria-hidden="true" /><p>Steady…</p></div>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------- the crisis brief: situation + two disagreeing advisors -------- */

function CrisisCard({ eventCard, crisis, onContinue }) {
  const c = eventCard.chapter;
  const advisors = crisis?.advisors || [];
  return (
    <div className="event-card">
      <div className="event-kicker">Crisis {c.index + 1} of {c.count} · {c.date}</div>
      <h2>{c.title}</h2>
      <Art name={c.image} alt={c.title} className="event-art" />
      <p className="event-text"><VocabText text={eventCard.text} /></p>
      {advisors.length > 0 && (
        <div className="advisor-row">
          {advisors.map((a, i) => (
            <div key={i} className="advisor-quote">
              <div className="advisor-name">{a.name}</div>
              <div className="advisor-role">{a.role}</div>
              <p className="advisor-line">“{a.line}”</p>
            </div>
          ))}
        </div>
      )}
      <button className="btn big" onClick={onContinue}>You be the president</button>
    </div>
  );
}

/* -------- the three choice buttons (spec §5: steel-blue buttons) -------- */

function DecisionPanel({ turn }) {
  const [busy, setBusy] = useState(false);
  // Synchronous double-tap lock — see [[double-submit-race-fix]]: the server
  // acks before pushing turn:resolution, so a second tap in the same frame
  // must never slip through on stale state.
  const busyRef = useRef(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    busyRef.current = false;
    setBusy(false);
    setErr('');
  }, [turn.stepIndex]);

  async function choose(choiceIndex) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const res = await emitAck('student:submit_move', { move: { kind: 'decision', choiceIndex } });
    if (!res.ok) { setErr(errorText(res.error)); busyRef.current = false; setBusy(false); }
  }

  return (
    <div className="decision-panel">
      <p className="decision-prompt">{turn.prompt}</p>
      <div className="choice-col" role="group" aria-label="Your call">
        {(turn.choices || []).map((label, i) => (
          <button key={i} type="button" className="choice-btn" disabled={busy} onClick={() => choose(i)}>
            {label}
          </button>
        ))}
      </div>
      <p className="err" role="alert">{err}</p>
    </div>
  );
}

/* -------- verdict → feedback, THEN the reveal card (two beats) -------- */

const VERDICT_UI = {
  right: { label: 'You matched him.', className: 'right', icon: '✅' },
  partial: { label: 'Close, but not quite.', className: 'partial', icon: '⚠️' },
  wrong: { label: 'That is not what he chose.', className: 'wrong', icon: '❌' },
};

function FeedbackAndReveal({ feedback, matchEnded, onContinue }) {
  const [stage, setStage] = useState('verdict'); // 'verdict' | 'reveal'
  const v = VERDICT_UI[feedback.verdict] || VERDICT_UI.partial;

  if (stage === 'verdict') {
    return (
      <div className="feedback-panel">
        <div className={`verdict-badge ${v.className} flash`}>
          <span aria-hidden="true">{v.icon}</span> {v.label}
        </div>
        <p className="feedback-text"><VocabText text={feedback.feedback} /></p>
        <div className="effects-row">
          {Object.entries(feedback.effects || {}).map(([k, val]) => (
            <span key={k} className={`effect-chip ${val > 0 ? 'up' : val < 0 ? 'down' : 'flat'}`}>
              {k === 'approval' ? '📣 Approval' : k === 'union' ? '🏛️ Union' : k === 'peace' ? '🕊️ Peace' : k} {val > 0 ? `+${val}` : val}
            </span>
          ))}
        </div>
        <button className="btn big" onClick={() => setStage('reveal')}>See what really happened</button>
      </div>
    );
  }

  const r = feedback.reveal;
  return (
    <div className="reveal-card">
      <div className="reveal-header">
        <PresidentSeal initials={r.initials} years={r.years} />
        <div className="reveal-header-text">
          <div className="event-kicker">What really happened</div>
          <h2>{r.president}</h2>
        </div>
      </div>
      <div className="reveal-block">
        <h3>His decision</h3>
        <p><VocabText text={r.decision} /></p>
      </div>
      <div className="reveal-block">
        <h3>Why</h3>
        <p><VocabText text={r.reason} /></p>
      </div>
      <div className="reveal-block">
        <h3>What happened next</h3>
        <p><VocabText text={r.outcome} /></p>
      </div>
      {r.note && (
        <div className="reveal-note">
          <span className="reveal-note-tag">One more true thing</span>
          <p><VocabText text={r.note} /></p>
        </div>
      )}
      <button className="btn big" onClick={onContinue}>
        {matchEnded ? 'See how your term ends' : 'Next crisis'}
      </button>
    </div>
  );
}

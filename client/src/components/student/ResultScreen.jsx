// ResultScreen.jsx — the ending, styled as a period front-page headline
// (typography only — Common Standards §2 keeps parchment/newsprint texture
// INSIDE illustrations, never the page's skin). Then: accuracy (the score
// that matters), the three meters' final state (drama), the crisis-by-crisis
// debrief table (spec §5.5 — your call beside his call), the closing debrief,
// and the standing sensitivity note (spec §11.2 / Common Standards §10.3):
// accuracy is not endorsement.

import { Art } from '../../services/assets.jsx';
import VocabText from './VocabText.jsx';

const TIER_CLASS = { steady: 'win', survives: 'mid', rough: 'low' };
const VERDICT_ICON = { right: '✅', partial: '⚠️', wrong: '❌' };

export default function ResultScreen({ state, dispatch }) {
  const end = state.matchEnd;
  const you = end.you;
  const ending = you.ending;
  const tier = TIER_CLASS[ending.key] || 'mid';
  const debriefNote = end.meta?.debriefNote;

  return (
    <div className="card result-screen">
      <div className="event-kicker">Your term in office</div>

      <div className={`front-page ${tier}`}>
        <div className="front-page-dateline">WASHINGTON TO JACKSON · 1789–1837</div>
        <h1 className="front-page-headline">{ending.title}</h1>
        <div className="front-page-rule" />
      </div>

      <Art name="title_hero.webp" alt="A president's writing desk at night by candlelight" className="result-art" />

      <div className={`ending-block ${tier}`}>
        <p>{ending.text}</p>
      </div>

      <div className="meters-final-block" aria-label="Approval, Union, and Peace, final state">
        <div className="meters-final-row">
          <span className="meter-final">📣 Approval, final: <b>{you.meters?.approval ?? 0}</b></span>
          <span className="meter-final">🏛️ Union, final: <b>{you.meters?.union ?? 0}</b></span>
          <span className="meter-final">🕊️ Peace, final: <b>{you.meters?.peace ?? 0}</b></span>
        </div>
      </div>

      <div className="accuracy-block">
        <div className="accuracy-number">{you.accuracy}%</div>
        <div>
          <b>Your accuracy — the score your teacher sees.</b>
          <p>How often your call matched what the real president actually decided. The meters above are drama — accuracy is about knowing the history.</p>
        </div>
      </div>

      <div className="trail-block">
        <h3>Crisis by crisis</h3>
        <div className="table-wrap">
          <table className="trail-table">
            <thead>
              <tr><th>Crisis</th><th></th><th>Your call</th><th>His call</th></tr>
            </thead>
            <tbody>
              {(you.trail || []).map((t) => (
                <tr key={t.stepIndex}>
                  <td>{t.title} <span className="muted">({t.date})</span></td>
                  <td className="trail-verdict" aria-label={t.verdict}>{VERDICT_ICON[t.verdict] || ''}</td>
                  <td>{t.yourCall || <span className="muted">Time ran out</span>}</td>
                  <td>{t.verdict === 'right' ? <span className="muted">Same as yours</span> : t.realCall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="debrief">
        <h3>What this term teaches</h3>
        <p><VocabText text={you.debrief} /></p>
        {debriefNote && (
          <p className="debrief-note"><VocabText text={debriefNote} /></p>
        )}
      </div>

      <div className="btn-col">
        <button className="btn big" onClick={() => dispatch({ type: 'play-again' })}>
          Play again — take the oath once more
        </button>
      </div>
    </div>
  );
}

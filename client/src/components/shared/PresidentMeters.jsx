// PresidentMeters.jsx — the three meters this game ever shows: Approval 📣,
// Union 🏛️, Peace 🕊️ (spec §3). All three are DRAMA, never the grade — the
// Embargo crisis is the proof, where the right answer costs 15 Approval.
// Icon + label + number always ship together (color is never the only signal,
// Common Standards §8); each meter gets its own accent hue purely so three
// bars in a row are easy to tell apart at a glance, not to imply a verdict.

import { useEffect, useRef, useState } from 'react';

const METER_UI = {
  approval: { icon: '📣', label: 'Approval', cls: 'approval' },
  union: { icon: '🏛️', label: 'Union', cls: 'union' },
  peace: { icon: '🕊️', label: 'Peace', cls: 'peace' },
};

function MeterBar({ meterKey, value }) {
  const ui = METER_UI[meterKey];
  const prev = useRef(value);
  const [delta, setDelta] = useState(null);

  useEffect(() => {
    const change = (value ?? 0) - (prev.current ?? value);
    prev.current = value;
    if (change !== 0) {
      setDelta(change);
      const t = setTimeout(() => setDelta(null), 2400);
      return () => clearTimeout(t);
    }
  }, [value]);

  const pct = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className={`meter-row meter-${ui.cls}`}>
      <span className="meter-icon" aria-hidden="true">{ui.icon}</span>
      <span className="meter-name">{ui.label}</span>
      <div className="meter-track" role="meter" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" aria-label={`${ui.label}: ${pct} of 100`}>
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="meter-value">{pct}</span>
      {delta != null && (
        <span className={`meter-delta ${delta > 0 ? 'up' : 'down'}`}>{delta > 0 ? `+${delta}` : delta}</span>
      )}
    </div>
  );
}

export default function PresidentMeters({ meters }) {
  if (!meters) return null;
  return (
    <div className="president-meters">
      <MeterBar meterKey="approval" value={meters.approval} />
      <MeterBar meterKey="union" value={meters.union} />
      <MeterBar meterKey="peace" value={meters.peace} />
    </div>
  );
}

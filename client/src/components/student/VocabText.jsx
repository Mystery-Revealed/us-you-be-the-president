// VocabText.jsx — the tap-for-plain-words vocabulary layer (Common Standards
// §3). Seven terms this game's briefs and reveal cards can't avoid: excise
// tax, tribute, embargo, impressment, nullification, tariff, militia.
//
// It underlines the FIRST occurrence of each distinct term within a given
// block of text (a plain, render-stable rule — no cross-render state to
// glitch). "excise tax" is matched before the bare word patterns so a phrase
// like "an excise tax" never gets a second, redundant bubble from some other
// pattern eating part of it.

import { useState } from 'react';

// Plain-words definitions (spec §2, Fable copy), at a 5th grade reading level.
export const VOCAB = {
  'excise tax': { term: 'excise tax', def: 'A tax on something made right here at home, like whiskey.' },
  tribute: { term: 'tribute', def: 'Money paid to a stronger country so it will leave you alone.' },
  embargo: { term: 'embargo', def: 'A government order that stops trade with other countries.' },
  impressment: { term: 'impressment', def: 'Grabbing sailors off ships and forcing them into another country’s navy.' },
  nullification: { term: 'nullification', def: 'A state claiming it can cancel a federal law inside its own borders.' },
  tariff: { term: 'tariff', def: 'A tax on goods brought in from another country.' },
  militia: { term: 'militia', def: 'Ordinary citizens called up to serve as soldiers for a short time.' },
};

const PATTERNS = [
  { key: 'excise tax', re: /excise tax(?:es)?/i },
  { key: 'tribute', re: /tribute/i },
  { key: 'embargo', re: /embargoe?s?/i },
  { key: 'impressment', re: /impressment/i },
  { key: 'nullification', re: /nullification/i },
  { key: 'tariff', re: /tariffs?/i },
  { key: 'militia', re: /militias?/i },
];

const COMBINED = new RegExp(PATTERNS.map((p) => `(?:${p.re.source})`).join('|'), 'gi');

function keyForMatch(matched) {
  const lower = matched.toLowerCase();
  if (lower.startsWith('excise')) return 'excise tax';
  if (lower.startsWith('tribute')) return 'tribute';
  if (lower.startsWith('embargo')) return 'embargo';
  if (lower.startsWith('impressment')) return 'impressment';
  if (lower.startsWith('nullification')) return 'nullification';
  if (lower.startsWith('tariff')) return 'tariff';
  if (lower.startsWith('militia')) return 'militia';
  return null;
}

export default function VocabText({ text, className }) {
  if (!text) return null;
  const nodes = [];
  const usedKeys = new Set();
  let last = 0;
  let m;
  COMBINED.lastIndex = 0;
  while ((m = COMBINED.exec(text)) !== null) {
    const matched = m[0];
    const key = keyForMatch(matched);
    // Only the first occurrence of each distinct term in this block is a bubble.
    if (key && !usedKeys.has(key)) {
      usedKeys.add(key);
      if (m.index > last) nodes.push(text.slice(last, m.index));
      nodes.push(<VocabBubble key={`${key}-${m.index}`} matched={matched} entry={VOCAB[key]} />);
      last = m.index + matched.length;
    }
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <span className={className}>{nodes}</span>;
}

function VocabBubble({ matched, entry }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="vocab-wrap">
      <button
        type="button"
        className="vocab-term"
        aria-expanded={open}
        title={entry.def}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      >
        {matched}
      </button>
      {open && (
        <span className="vocab-bubble" role="tooltip">
          <b>{entry.term}</b> — {entry.def}
          <button type="button" className="vocab-close" aria-label="Close" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>×</button>
        </span>
      )}
    </span>
  );
}

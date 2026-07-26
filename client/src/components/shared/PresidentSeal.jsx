// PresidentSeal.jsx — the "portrait chip" the reveal card calls for (spec
// §5.4), built as a CSS medallion instead of a generated portrait. Seven
// AI-drawn faces of real, recognizable presidents is seven chances to get a
// likeness or a detail wrong for a classroom; a brass-on-navy seal with
// initials and years carries the same "this was a REAL person" weight without
// that risk, and it reads clearly at 360px.

export default function PresidentSeal({ initials, years }) {
  return (
    <div className="president-seal" aria-hidden="true">
      <div className="president-seal-ring">
        <span className="president-seal-initials">{initials}</span>
      </div>
      <span className="president-seal-years">{years}</span>
    </div>
  );
}

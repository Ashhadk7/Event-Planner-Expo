/**
 * Abstract NYC skyline — deterministic building rects + a few twinkling
 * windows. Pure geometry (no long hand-authored paths), sits low in the hero.
 */
const BUILDINGS = [
  { x: 0, w: 46, h: 120 },
  { x: 40, w: 34, h: 190 },
  { x: 70, w: 40, h: 150 },
  { x: 104, w: 30, h: 250 },
  { x: 130, w: 44, h: 176 },
  { x: 170, w: 26, h: 300 }, // spire-ish
  { x: 192, w: 42, h: 210 },
  { x: 230, w: 36, h: 150 },
  { x: 262, w: 50, h: 260 },
  { x: 308, w: 30, h: 190 },
  { x: 334, w: 44, h: 320 }, // tall centre
  { x: 374, w: 34, h: 220 },
  { x: 404, w: 46, h: 168 },
  { x: 446, w: 30, h: 240 },
  { x: 472, w: 42, h: 150 },
  { x: 510, w: 38, h: 205 },
  { x: 544, w: 48, h: 130 },
  { x: 588, w: 30, h: 235 },
  { x: 614, w: 44, h: 175 },
  { x: 654, w: 34, h: 280 },
  { x: 686, w: 46, h: 160 },
  { x: 728, w: 30, h: 215 },
  { x: 754, w: 46, h: 140 },
]

const WINDOWS = [
  { x: 116, y: 60, d: '0s' },
  { x: 178, y: 40, d: '1.1s' },
  { x: 280, y: 55, d: '0.5s' },
  { x: 348, y: 30, d: '1.6s' },
  { x: 460, y: 60, d: '0.8s' },
  { x: 664, y: 45, d: '2.1s' },
]

export function Skyline({ className = '' }: { className?: string }) {
  const BASE = 340
  return (
    <svg
      viewBox="0 0 800 340"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3080" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000448" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gold horizon */}
      <rect x="0" y={BASE - 1} width="800" height="1" fill="#f8c646" opacity="0.5" />

      {BUILDINGS.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={BASE - b.h}
          width={b.w - 3}
          height={b.h}
          fill="url(#bld)"
          stroke="#5860c0"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
      ))}

      {WINDOWS.map((w, i) => (
        <rect
          key={i}
          className="twinkle"
          x={w.x}
          y={BASE - w.y}
          width="3"
          height="3"
          fill="#f8c646"
          style={{ animationDelay: w.d }}
        />
      ))}
    </svg>
  )
}

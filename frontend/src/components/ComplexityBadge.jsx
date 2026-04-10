function getComplexityPoints(value) {
  const n = [1, 2, 3, 4, 5, 6, 7, 8]
  const curves = {
    'O(1)':      n.map(() => 1),
    'O(log n)':  n.map(x => Math.log2(x) + 0.5),
    'O(n)':      n.map(x => x),
    'O(n log n)':n.map(x => x * Math.log2(x + 1)),
    'O(n²)':     n.map(x => x * x),
  }
  return curves[value] || n.map(x => x)
}

function getComplexityColor(value) {
  if (value === 'O(1)' || value === 'O(log n)') return '#22c55e'
  if (value === 'O(n)' || value === 'O(n log n)') return '#facc15'
  return '#f87171'
}

function MiniChart({ value }) {
  const points = getComplexityPoints(value)
  const color = getComplexityColor(value)
  const max = Math.max(...points)
  const w = 80
  const h = 36

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - (p / max) * h
    return `${x},${y}`
  }).join(' ')

  
  return (
    <svg width={w} height={h} className="mt-2">
      <polyline
        points={coords}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* area fill */}
      <polyline
        points={`0,${h} ${coords} ${w},${h}`}
        fill={color}
        fillOpacity="0.1"
        stroke="none"
      />
    </svg>
  )
}

function ComplexityBadge({ label, value }) {
  const color = getComplexityColor(value)

  return (
    <div
      className="flex flex-col items-center rounded-lg px-4 py-3 min-w-20 shrink-0"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <span className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span
        className="text-sm font-mono font-bold"
        style={{ color }}
      >
        {value}
      </span>
      <MiniChart value={value} />
    </div>
  )
}

export default ComplexityBadge;
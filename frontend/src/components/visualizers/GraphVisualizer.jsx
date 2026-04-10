function GraphVisualizer({ step, slug }) {
  if (!step) return null

  const { nodes = [], edges = [], visited = [], current, visitOrder = [] } = step.state
  const queue = step.state.queue || []
  const stack = step.state.stack || []
  const distances = step.state.distances || []
  const neighbor = step.state.neighbor
  const isDijkstra = slug === 'graph-dijkstra'
  const isBFS = slug === 'graph-bfs'
  const n = nodes.length

  // ── Auto-layout: arrange nodes in a circle ─────────────────
  const cx = 250, cy = 200, radius = 140
  const positions = nodes.map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
  })

  // ── Edge helpers ───────────────────────────────────────────
  const isEdgeOnPath = (u, v) => {
    const idxU = visitOrder.indexOf(u)
    const idxV = visitOrder.indexOf(v)
    return idxU !== -1 && idxV !== -1 && Math.abs(idxU - idxV) === 1
  }

  // ── Node colors ────────────────────────────────────────────
  const getNodeColor = (idx) => {
    if (step.action === 'done' && visited.includes(idx)) return { fill: '#059669', stroke: '#34d399', text: '#ecfdf5' }
    if (idx === neighbor) return { fill: '#7c3aed', stroke: '#a78bfa', text: '#f5f3ff' }
    if (idx === current) return { fill: '#d97706', stroke: '#fbbf24', text: '#fffbeb' }
    if (visited.includes(idx)) return { fill: '#166534', stroke: '#4ade80', text: '#f0fdf4' }
    if (queue.includes(idx) || stack.includes(idx)) return { fill: '#1e40af', stroke: '#60a5fa', text: '#eff6ff' }
    return { fill: '#1e293b', stroke: '#475569', text: '#e2e8f0' }
  }

  // ── Action descriptions ────────────────────────────────────
  const getDescription = () => {
    switch (step.action) {
      case 'init':           return isDijkstra ? `Initialize distances, start = ${nodes[step.state.current ?? 0]}` : `Starting ${isBFS ? 'BFS' : 'DFS'} from node ${nodes[step.state.current ?? 0] ?? nodes[0]}`
      case 'visit':          return `Visiting node ${nodes[current]}`
      case 'pop':            return `Popping ${nodes[current]} from stack`
      case 'checkNeighbor':  return `Checking neighbor ${nodes[neighbor]}`
      case 'enqueue':        return `Enqueue ${nodes[neighbor]} into queue`
      case 'push':           return `Push ${nodes[neighbor]} onto stack`
      case 'alreadyVisited': return `${nodes[neighbor]} already visited — skip`
      case 'selectMin':      return `Select unvisited node with min distance: ${nodes[current]} (d=${step.state.minDist})`
      case 'checkEdge':      return `Check edge ${nodes[current]}→${nodes[neighbor]} (w=${step.state.edgeWeight})`
      case 'relax':          return `Relax: d[${nodes[neighbor]}] = ${step.state.newDist}`
      case 'noImprovement':  return `No improvement for ${nodes[neighbor]}`
      case 'done':           return `${isDijkstra ? 'Dijkstra' : isBFS ? 'BFS' : 'DFS'} complete! 🎉`
      default: return ''
    }
  }

  const getActionColor = () => {
    switch (step.action) {
      case 'visit':
      case 'selectMin':     return 'bg-yellow-500/20 text-yellow-400'
      case 'enqueue':
      case 'push':          return 'bg-blue-500/20 text-blue-400'
      case 'checkNeighbor':
      case 'checkEdge':     return 'bg-violet-500/20 text-violet-400'
      case 'relax':         return 'bg-green-500/20 text-green-400'
      case 'alreadyVisited':
      case 'noImprovement': return 'bg-zinc-500/20 text-zinc-400'
      case 'done':          return 'bg-green-500/20 text-green-400'
      case 'pop':           return 'bg-red-500/20 text-red-400'
      default:              return 'bg-zinc-500/20 text-zinc-400'
    }
  }

  return (
    <div
      className="rounded-xl border p-6 mb-4"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >

      {/* Action label */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${getActionColor()}`}>
          {step.action.toUpperCase()}
        </span>
        <span className="text-zinc-400 text-sm">{getDescription()}</span>
      </div>

      {/* Data structure state (queue/stack) */}
      <div className="flex gap-6 mb-4 flex-wrap">
        {isBFS && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">queue</span>
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/40 text-blue-300 font-mono text-sm">
              [{queue.map(i => nodes[i]).join(', ')}]
            </span>
          </div>
        )}
        {!isBFS && !isDijkstra && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">stack</span>
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/40 text-blue-300 font-mono text-sm">
              [{stack.map(i => nodes[i]).join(', ')}]
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">visited</span>
          <span className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/40 text-green-300 font-mono text-sm">
            [{visitOrder.map(i => nodes[i]).join(', ')}]
          </span>
        </div>
      </div>

      {/* Dijkstra distances table */}
      {isDijkstra && distances.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <table className="text-sm font-mono border border-zinc-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-zinc-800 text-zinc-400 text-xs">
                {nodes.map((label, i) => (
                  <th key={i} className="px-4 py-2 border-r border-zinc-700 font-medium">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                {distances.map((d, i) => (
                  <td key={i} className={`px-4 py-2 border-r border-zinc-700 font-bold ${
                    visited.includes(i) ? 'text-green-300' : d === Infinity ? 'text-zinc-500' : 'text-violet-300'
                  }`}>
                    {d === Infinity ? '∞' : d}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* SVG Graph */}
      <div className="overflow-x-auto pb-2">
        <svg width={500} height={420} viewBox="0 0 500 420" className="mx-auto" style={{ minWidth: 300 }}>
          {/* Edges */}
          {edges.map(([u, v, w], i) => {
            const pu = positions[u], pv = positions[v]
            if (!pu || !pv) return null
            const active = (u === current && v === neighbor) || (v === current && u === neighbor)
            const onPath = isEdgeOnPath(u, v)

            // Weight label midpoint
            const mx = (pu.x + pv.x) / 2
            const my = (pu.y + pv.y) / 2

            return (
              <g key={`edge-${i}`}>
                <line
                  x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y}
                  stroke={active ? '#a78bfa' : onPath ? '#4ade80' : '#334155'}
                  strokeWidth={active ? 3 : onPath ? 2.5 : 1.5}
                  style={{ transition: 'all 0.3s' }}
                />
                {w !== undefined && (
                  <g>
                    <rect x={mx - 10} y={my - 10} width={20} height={16} rx={4}
                      fill="#0f172a" stroke={active ? '#a78bfa' : '#334155'} strokeWidth={0.5} />
                    <text x={mx} y={my + 2} textAnchor="middle" fontSize={10} fontFamily="monospace"
                      fill={active ? '#c4b5fd' : '#94a3b8'} fontWeight="bold">
                      {w}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((label, idx) => {
            const pos = positions[idx]
            if (!pos) return null
            const colors = getNodeColor(idx)

            return (
              <g key={`node-${idx}`}>
                <circle
                  cx={pos.x} cy={pos.y} r={22}
                  fill={colors.fill} stroke={colors.stroke} strokeWidth={2}
                  style={{ transition: 'all 0.3s' }}
                />
                <text
                  x={pos.x} y={pos.y + 5}
                  textAnchor="middle" fontSize={14} fontWeight="bold" fontFamily="monospace"
                  fill={colors.text}
                >
                  {label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-2 text-xs flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#1e293b', border: '1.5px solid #475569' }}/> Unvisited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#d97706' }}/> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#1e40af' }}/> {isBFS ? 'In Queue' : 'In Stack'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#166534' }}/> Visited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#7c3aed' }}/> Neighbor
        </span>
      </div>
    </div>
  )
}

export default GraphVisualizer

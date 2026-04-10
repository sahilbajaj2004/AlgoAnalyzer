function TreeVisualizer({ step }) {
  if (!step) return null

  const { tree = [], current, highlight = [], newNode, path = [] } = step.state

  if (tree.length === 0) return null

  // ── Compute layout positions ───────────────────────────────
  const positions = []
  const computePositions = (idx, x, y, spread) => {
    if (idx === null || idx === undefined || idx >= tree.length) return
    positions[idx] = { x, y }
    if (tree[idx].left !== null) computePositions(tree[idx].left, x - spread, y + 70, spread * 0.55)
    if (tree[idx].right !== null) computePositions(tree[idx].right, x + spread, y + 70, spread * 0.55)
  }
  computePositions(0, 400, 40, 160)

  // Determine SVG bounds
  const xs = positions.filter(Boolean).map(p => p.x)
  const ys = positions.filter(Boolean).map(p => p.y)
  const minX = Math.min(...xs) - 40
  const maxX = Math.max(...xs) + 40
  const maxY = Math.max(...ys) + 40
  const svgWidth = Math.max(maxX - minX, 200)
  const svgHeight = maxY + 20

  // ── Node colors ────────────────────────────────────────────
  const getNodeColor = (idx) => {
    if (step.action === 'done') return { fill: '#059669', stroke: '#34d399', text: '#ecfdf5' }
    if (step.action === 'found' && idx === step.state.found) return { fill: '#059669', stroke: '#34d399', text: '#ecfdf5' }
    if (step.action === 'notFound' && idx === current) return { fill: '#dc2626', stroke: '#f87171', text: '#fef2f2' }
    if ((step.action === 'insertLeft' || step.action === 'insertRight') && idx === current)
      return { fill: '#7c3aed', stroke: '#a78bfa', text: '#f5f3ff' }
    if (idx === current) return { fill: '#d97706', stroke: '#fbbf24', text: '#fffbeb' }
    if (path.includes(idx)) return { fill: '#1e40af', stroke: '#60a5fa', text: '#eff6ff' }
    if (highlight.includes(idx)) return { fill: '#166534', stroke: '#4ade80', text: '#f0fdf4' }
    return { fill: '#1e293b', stroke: '#475569', text: '#e2e8f0' }
  }

  // ── Action descriptions ────────────────────────────────────
  const getDescription = () => {
    switch (step.action) {
      case 'init':        return `Root node ${tree[0]?.value} created`
      case 'insertStart': return `Inserting ${newNode} into the BST`
      case 'compare':     return `Comparing ${newNode} with node ${tree[current]?.value}`
      case 'goLeft':      return `${newNode} < ${tree[current]?.value} — go left`
      case 'goRight':     return `${newNode} > ${tree[current]?.value} — go right`
      case 'insertLeft':  return `Inserted ${tree[current]?.value} as left child`
      case 'insertRight': return `Inserted ${tree[current]?.value} as right child`
      case 'duplicate':   return `${tree[current]?.value} already exists — skipping`
      case 'found':       return `Found ${step.state.target} at node! 🎉`
      case 'notFound':    return `${step.state.target} not found in the BST`
      case 'done':        return `BST construction complete! 🎉`
      default: return ''
    }
  }

  const getActionColor = () => {
    switch (step.action) {
      case 'insertLeft':
      case 'insertRight': return 'bg-violet-500/20 text-violet-400'
      case 'compare':     return 'bg-yellow-500/20 text-yellow-400'
      case 'goLeft':
      case 'goRight':     return 'bg-blue-500/20 text-blue-400'
      case 'found':
      case 'done':        return 'bg-green-500/20 text-green-400'
      case 'notFound':
      case 'duplicate':   return 'bg-red-500/20 text-red-400'
      default:            return 'bg-zinc-500/20 text-zinc-400'
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

      {/* Pending insert badge */}
      {newNode !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-400 font-mono">inserting</span>
          <span className="px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/40 text-violet-300 font-mono font-bold text-sm">
            {newNode}
          </span>
        </div>
      )}

      {/* Target badge for search */}
      {step.state.target !== undefined && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-400 font-mono">target</span>
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm">
            {step.state.target}
          </span>
        </div>
      )}

      {/* SVG Tree */}
      <div className="overflow-x-auto pb-2">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`${minX} 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto"
          style={{ minWidth: 300, maxHeight: 400 }}
        >
          {/* Edges */}
          {tree.map((node, idx) => {
            const pos = positions[idx]
            if (!pos) return null
            return [
              node.left !== null && positions[node.left] && (
                <line
                  key={`edge-l-${idx}`}
                  x1={pos.x} y1={pos.y}
                  x2={positions[node.left].x} y2={positions[node.left].y}
                  stroke={path.includes(idx) && path.includes(node.left) ? '#60a5fa' : '#334155'}
                  strokeWidth={path.includes(idx) && path.includes(node.left) ? 2.5 : 1.5}
                  strokeDasharray={step.action === 'done' ? 'none' : undefined}
                />
              ),
              node.right !== null && positions[node.right] && (
                <line
                  key={`edge-r-${idx}`}
                  x1={pos.x} y1={pos.y}
                  x2={positions[node.right].x} y2={positions[node.right].y}
                  stroke={path.includes(idx) && path.includes(node.right) ? '#60a5fa' : '#334155'}
                  strokeWidth={path.includes(idx) && path.includes(node.right) ? 2.5 : 1.5}
                />
              )
            ]
          })}

          {/* Nodes */}
          {tree.map((node, idx) => {
            const pos = positions[idx]
            if (!pos) return null
            const colors = getNodeColor(idx)
            const isNew = (step.action === 'insertLeft' || step.action === 'insertRight') && idx === current

            return (
              <g key={`node-${idx}`}>
                <circle
                  cx={pos.x} cy={pos.y} r={isNew ? 22 : 20}
                  fill={colors.fill} stroke={colors.stroke} strokeWidth={2}
                  style={{ transition: 'all 0.3s' }}
                />
                <text
                  x={pos.x} y={pos.y + 5}
                  textAnchor="middle" fontSize={13} fontWeight="bold" fontFamily="monospace"
                  fill={colors.text}
                >
                  {node.value}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-4 text-xs flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#1e293b', border: '1.5px solid #475569' }}/> Default
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#d97706' }}/> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#1e40af' }}/> Path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#7c3aed' }}/> Inserted
        </span>
      </div>
    </div>
  )
}

export default TreeVisualizer

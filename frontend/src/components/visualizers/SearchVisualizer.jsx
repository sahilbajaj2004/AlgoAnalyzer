function SearchVisualizer({ step, slug }) {
  if (!step) return null

  const isBinary = slug === 'binary-search'
  const { array, left, right, mid, target, found, current, visited = [] } = step.state

  const getColor = (idx) => {
    if (found !== null && found !== -1 && idx === found)
      return { bg: '#22c55e', text: '#15803d', border: '#16a34a' }

    if (isBinary) {
      if (idx === mid)             return { bg: '#fef08a', text: '#854d0e', border: '#facc15' }
      if (idx < left || idx > right) return { bg: '#f4f4f5', text: '#a1a1aa', border: '#e4e4e7' }
      return                              { bg: '#ede9fe', text: '#5b21b6', border: '#a78bfa' }
    } else {
      // linear search
      if (idx === current)         return { bg: '#fef08a', text: '#854d0e', border: '#facc15' }
      if (visited.includes(idx))   return { bg: '#f4f4f5', text: '#a1a1aa', border: '#e4e4e7' }
      return                              { bg: '#ede9fe', text: '#5b21b6', border: '#a78bfa' }
    }
  }

  return (
    <div
      className="rounded-lg border p-6 mb-4"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >

      {/* Action label */}
      <div className="flex items-center gap-3 mb-8">
        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold
          ${step.action === 'found'    ? 'bg-green-500/20  text-green-500'  :
            step.action === 'notFound' ? 'bg-red-500/20    text-red-400'    :
            step.action === 'goRight'  ? 'bg-blue-500/20   text-blue-500'   :
            step.action === 'goLeft'   ? 'bg-blue-500/20   text-blue-500'   :
            step.action === 'check'    ? 'bg-yellow-500/20 text-yellow-500' :
            step.action === 'skip'     ? 'bg-zinc-100      text-zinc-400'   :
            step.action === 'mid'      ? 'bg-yellow-500/20 text-yellow-500' :
                                         'bg-zinc-100      text-zinc-400'}`}>
          {step.action.toUpperCase()}
        </span>
        <span className="text-zinc-400 text-sm">
          {step.action === 'init'     && `Searching for target ${target}`}
          {step.action === 'mid'      && `Checking mid index ${mid} — value ${array[mid]}`}
          {step.action === 'found'    && `Found ${target} at index ${found} 🎉`}
          {step.action === 'goRight'  && `${array[mid]} < ${target} — move left to ${mid + 1}`}
          {step.action === 'goLeft'   && `${array[mid]} > ${target} — move right to ${mid - 1}`}
          {step.action === 'notFound' && `${target} not found in array`}
          {step.action === 'check'    && `Checking index ${current} — value ${array[current]}`}
          {step.action === 'skip'     && `${array[visited[visited.length - 1]]} ≠ ${target} — moving on`}
        </span>
      </div>

      {/* Target badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-zinc-400 font-mono">target</span>
        <span className="px-3 py-1 rounded-lg bg-violet-500/15 border border-violet-500/60 text-violet-200 font-mono font-bold text-sm">
          {target}
        </span>
      </div>

      {/* Array boxes */}
      <div className="flex items-end gap-1.5 overflow-x-auto pb-2">
        {array.map((val, idx) => {
          const c = getColor(idx)
          const isLeft    = isBinary && idx === left
          const isRight   = isBinary && idx === right
          const isMidIdx  = isBinary && idx === mid
          const isCurrent = !isBinary && idx === current

          return (
            <div key={idx} className="flex flex-col items-center gap-1 shrink-0">

              {/* pointer labels */}
              <div className="flex flex-col items-center h-10 justify-end">
                {isMidIdx  && <span className="text-xs font-mono font-bold text-yellow-500">mid</span>}
                {isLeft    && <span className="text-xs font-mono font-bold text-violet-500">L</span>}
                {isRight   && <span className="text-xs font-mono font-bold text-violet-400">R</span>}
                {isCurrent && <span className="text-xs font-mono font-bold text-yellow-500">i</span>}
                {(isMidIdx || isLeft || isRight || isCurrent) && (
                  <span className="text-xs text-zinc-300">↓</span>
                )}
              </div>

              {/* box */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-sm transition-all duration-300"
                style={{ background: c.bg, color: c.text, borderColor: c.border }}
              >
                {val}
              </div>

              {/* index */}
              <span className="text-xs text-zinc-400 font-mono">{idx}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-6 text-xs flex-wrap">
        {isBinary && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block bg-violet-200 border border-violet-400"/> Active range
          </span>
        )}
        {isBinary && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block bg-yellow-200 border border-yellow-400"/> Mid
          </span>
        )}
        {!isBinary && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block bg-yellow-200 border border-yellow-400"/> Current
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-zinc-100 border border-zinc-300"/>
          {isBinary ? 'Eliminated' : 'Visited'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-green-400 border border-green-500"/> Found
        </span>
      </div>

    </div>
  )
}

export default SearchVisualizer
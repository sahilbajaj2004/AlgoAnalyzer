function ArrayVisualizer({ step }) {
  if (!step) return null

  const { array, comparing = [], sorted = [], minIndex = null, keyIndex = null } = step.state
  const maxVal = Math.max(...array)

  const getColor = (index) => {
    if (sorted.includes(index))     return '#22c55e'  // green — sorted
    if (index === keyIndex)         return '#f97316'  // orange — key (insertion sort)
    if (index === minIndex)         return '#a855f7'  // purple — min (selection sort)
    if (comparing.includes(index))  return step.action === 'swap' || step.action === 'shift' ? '#f87171' : '#facc15'
    return '#3b82f6'                                  // blue — default
  }

  return (
    <div
      className="rounded-lg p-6 mb-4 border"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >

      {/* Action label */}
      <div className="mb-6 flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold
          ${step.action === 'swap'    ? 'bg-red-500/20    text-red-400'    :
            step.action === 'shift'   ? 'bg-red-500/20    text-red-400'    :
            step.action === 'sorted'  ? 'bg-green-500/20  text-green-400'  :
            step.action === 'insert'  ? 'bg-green-500/20  text-green-400'  :
            step.action === 'done'    ? 'bg-blue-500/20   text-blue-400'   :
            step.action === 'newMin'  ? 'bg-purple-500/20 text-purple-400' :
            step.action === 'select'  ? 'bg-purple-500/20 text-purple-400' :
            step.action === 'pick'    ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-yellow-500/20 text-yellow-400'}`}>
          {step.action.toUpperCase()}
        </span>
        <span className="text-zinc-400 text-sm">
          {step.action === 'compare' && `Comparing index ${comparing[0]} (${array[comparing[0]]}) and index ${comparing[1]} (${array[comparing[1]]})`}
          {step.action === 'swap'    && `Swapping ${array[comparing[0]]} and ${array[comparing[1]]}`}
          {step.action === 'sorted'  && `Element placed in correct position`}
          {step.action === 'done'    && `Array fully sorted! 🎉`}
          {step.action === 'select'  && `Starting pass — current minimum is index ${minIndex} (${array[minIndex]})`}
          {step.action === 'newMin'  && `New minimum found — index ${minIndex} (${array[minIndex]})`}
          {step.action === 'pick'    && `Picking key — ${step.state.key} at index ${keyIndex}`}
          {step.action === 'shift'   && `Shifting element to make room for key`}
          {step.action === 'insert'  && `Inserting key ${step.state.key} at index ${keyIndex}`}
        </span>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-center gap-2 h-48 border-b border-l border-zinc-700 px-4 relative">
        <span className="absolute left-0 top-0 text-zinc-500 text-xs">{maxVal}</span>
        <span className="absolute left-0 bottom-2 text-zinc-500 text-xs">0</span>

        {array.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center justify-end gap-1 flex-1 max-w-16 h-full">
            <span
              className="text-xs font-mono font-bold transition-colors duration-300"
              style={{ color: getColor(idx) }}
            >
              {val}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{
                height: `${(val / maxVal) * 150 + 10}px`,
                backgroundColor: getColor(idx),
              }}
            />
          </div>
        ))}
      </div>

      {/* X axis indices */}
      <div className="flex justify-center gap-2 px-4 mt-1">
        {array.map((_, idx) => (
          <div key={idx} className="flex-1 max-w-16 text-center">
            <span className="text-zinc-500 text-xs">{idx}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-4 text-xs flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"/> Default
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block"/> Comparing
        </span>
        {minIndex !== null && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-purple-500 inline-block"/> Min
          </span>
        )}
        {keyIndex !== null && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-orange-500 inline-block"/> Key
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-red-400 inline-block"/> Swapping
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block"/> Sorted
        </span>
      </div>

    </div>
  )
}

export default ArrayVisualizer
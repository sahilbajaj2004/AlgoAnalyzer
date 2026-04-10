function StackVisualizer({ step }) {
  if (!step) return null

  const { stack, top, pushing = null, popping = null, popped = null, peeking = null, isEmpty = null } = step.state

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
          ${step.action === 'push'      ? 'bg-yellow-500/20 text-yellow-400' :
            step.action === 'pop'       ? 'bg-red-500/20    text-red-400'    :
            step.action === 'peek'      ? 'bg-yellow-500/20 text-yellow-400' :
            step.action === 'underflow' ? 'bg-red-500/20    text-red-400'    :
            step.action === 'done'      ? 'bg-green-500/20  text-green-400'  :
                                          'bg-blue-500/20   text-blue-400'}`}>
          {step.action.toUpperCase()}
        </span>
        <span className="text-zinc-400 text-sm">
          {step.action === 'idle'      && 'Current stack state'}
          {step.action === 'push'      && `Pushing ${pushing} onto the stack`}
          {step.action === 'pop'       && `Popping ${popping} from the top`}
          {step.action === 'peek'      && `Peeking — top element is ${peeking}`}
          {step.action === 'underflow' && 'Stack is empty — Stack Underflow'}
          {step.action === 'done'      && (popped !== null
            ? `${popped} popped successfully`
            : isEmpty === true
            ? 'isEmpty → true — stack has no elements'
            : isEmpty === false
            ? `isEmpty → false — stack has ${stack.length} element(s)`
            : peeking !== null
            ? `Top element is ${peeking} — stack unchanged`
            : `${stack[top]} pushed successfully`
          )}
        </span>
      </div>

      {/* Popped value badge */}
      {popped !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-400 font-mono">popped</span>
          <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 font-mono font-bold text-sm">
            {popped}
          </span>
        </div>
      )}

      {/* Peeked value badge */}
      {peeking !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-400 font-mono">peek</span>
          <span className="px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 font-mono font-bold text-sm">
            {peeking}
          </span>
        </div>
      )}

      {/* isEmpty result badge */}
      {isEmpty !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-400 font-mono">isEmpty</span>
          <span className={`px-3 py-1 rounded-lg font-mono font-bold text-sm ${
            isEmpty
              ? 'bg-green-500/10 border border-green-500/40 text-green-300'
              : 'bg-blue-500/10 border border-blue-500/40 text-blue-300'
          }`}>
            {isEmpty ? 'true' : 'false'}
          </span>
        </div>
      )}

      {/* Stack */}
      <div className="flex flex-col-reverse items-center gap-1 min-h-48">
        {stack.length === 0 && popped === null ? (
          <p className="text-zinc-400 text-sm">Stack is empty</p>
        ) : (
          stack.map((val, idx) => {
            const isTop      = idx === top
            const isPopping  = isTop && step.action === 'pop'
            const isPeeking  = isTop && (step.action === 'peek' || (step.action === 'done' && peeking !== null))

            return (
              <div
                key={idx}
                className="w-32 py-2 text-center font-mono font-bold rounded-md border transition-all duration-300"
                style={{
                  background:  isPopping ? '#fef2f2' : isPeeking ? '#fef9c3' : isTop ? '#22c55e1a' : '#3b82f61a',
                  borderColor: isPopping ? '#f87171' : isPeeking ? '#facc15' : isTop ? '#22c55e'   : '#3b82f6',
                  color:       isPopping ? '#ef4444' : isPeeking ? '#854d0e' : isTop ? '#22c55e'   : '#3b82f6',
                }}
              >
                {val}
                {isPopping && <span className="ml-2 text-xs">← POP</span>}
                {isPeeking && <span className="ml-2 text-xs">← PEEK</span>}
                {isTop && !isPopping && !isPeeking && <span className="ml-2 text-xs">← TOP</span>}
              </div>
            )
          })
        )}

        {/* pending push */}
        {pushing !== null && (
          <div className="w-32 py-2 text-center font-mono font-bold rounded-md border border-dashed border-yellow-400 text-yellow-400 animate-bounce">
            {pushing} ↓
          </div>
        )}
      </div>

    </div>
  )
}

export default StackVisualizer
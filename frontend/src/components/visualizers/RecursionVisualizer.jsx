function RecursionVisualizer({ step }) {
  if (!step) return null

  const { callStack = [], inputValue } = step.state

  const getDescription = () => {
    switch (step.action) {
      case 'init':     return `Preparing to compute for input = ${inputValue}`
      case 'call':     return `Calling ${callStack[callStack.length - 1]?.fn}`
      case 'baseCase': return `Reached base case: returns ${step.state.result}`
      case 'return':   return `Returning ${step.state.result} (${step.state.expression})`
      case 'done':     return `Computation complete! Final result = ${step.state.finalResult} 🎉`
      default: return ''
    }
  }

  const getActionColor = () => {
    switch (step.action) {
      case 'init':     return 'bg-zinc-500/20 text-zinc-400'
      case 'call':     return 'bg-blue-500/20 text-blue-400'
      case 'baseCase': return 'bg-yellow-500/20 text-yellow-400'
      case 'return':   return 'bg-violet-500/20 text-violet-400'
      case 'done':     return 'bg-green-500/20 text-green-400'
      default:         return 'bg-zinc-500/20 text-zinc-400'
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

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Call Stack</h3>
        
        {callStack.length === 0 && step.action !== 'done' ? (
          <div className="text-sm text-zinc-500 italic py-4">Stack is empty</div>
        ) : callStack.length === 0 && step.action === 'done' ? (
          <div className="flex justify-center p-4">
             <span className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/40 text-green-300 font-mono font-bold text-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                Result = {step.state.finalResult}
             </span>
          </div>
        ) : (
          <div className="flex flex-col-reverse justify-end min-h-[300px] border-l-2 border-zinc-700 pl-4 space-y-2 space-y-reverse overflow-y-auto max-h-[400px]">
             {callStack.map((frame, idx) => {
               const isActive = idx === callStack.length - 1
               const isReturning = isActive && step.action === 'return'
               const isBaseCase = isActive && step.action === 'baseCase'
               const isCalling = isActive && step.action === 'call'

               let frameBg = 'bg-zinc-800'
               let frameBorder = 'border-zinc-700'
               let textColor = 'text-zinc-300'
               
               if (isCalling) {
                 frameBg = 'bg-blue-500/10'
                 frameBorder = 'border-blue-500/40'
                 textColor = 'text-blue-300'
               } else if (isReturning) {
                 frameBg = 'bg-violet-500/10'
                 frameBorder = 'border-violet-500/40'
                 textColor = 'text-violet-300'
               } else if (isBaseCase) {
                 frameBg = 'bg-yellow-500/10'
                 frameBorder = 'border-yellow-500/40'
                 textColor = 'text-yellow-300'
               } else if (isActive) {
                 frameBg = 'bg-zinc-700'
                 frameBorder = 'border-zinc-500'
                 textColor = 'text-white'
               }

               return (
                 <div
                   key={idx}
                   className={`relative p-3 rounded-lg border ${frameBg} ${frameBorder} transition-all duration-300 transform ${isActive ? 'scale-100 opacity-100 shadow-lg' : 'scale-95 opacity-70'}`}
                   style={{ 
                     marginLeft: `${idx * 16}px`, // Indent based on depth
                   }}
                 >
                   <div className="flex justify-between items-center">
                     <span className={`font-mono font-bold ${textColor}`}>
                       {frame.fn}
                     </span>
                     <span className="text-xs font-mono text-zinc-500">
                       Depth: {idx + 1}
                     </span>
                   </div>
                   
                   {frame.result !== null && (
                     <div className="mt-2 text-sm font-mono text-green-400">
                       → returned {frame.result}
                     </div>
                   )}
                 </div>
               )
             })}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecursionVisualizer

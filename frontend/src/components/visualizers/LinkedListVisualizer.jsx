function LinkedListVisualizer({ step }) {
  if (!step) return null

  const {
    nodes,
    current = null,
    visited = [],
    newNode = null,
    head = 0,
    tail = null,
    prev = null,
    target = null,
    deleted = null,
  } = step.state

  const getNodeStyle = (idx) => {
    if (deleted !== null && idx === deleted)
      return { box: 'border-red-400 bg-red-50', text: 'text-red-600' }
    if (newNode !== null && idx === 0 && (step.action === 'updateHead' || step.action === 'done'))
      return { box: 'border-violet-400 bg-violet-50', text: 'text-violet-600' }
    if (tail !== null && idx === tail && (step.action === 'reachedTail' || step.action === 'linkTail'))
      return { box: 'border-orange-400 bg-orange-50', text: 'text-orange-600' }
    if (step.action === 'done' && newNode !== null && tail !== null && idx === nodes.length - 1)
      return { box: 'border-violet-400 bg-violet-50', text: 'text-violet-600' }
    if (idx === prev)
      return { box: 'border-blue-400 bg-blue-50', text: 'text-blue-600' }
    if (idx === current)
      return { box: 'border-yellow-400 bg-yellow-50', text: 'text-yellow-600' }
    if (visited.includes(idx))
      return { box: 'border-green-400 bg-green-50', text: 'text-green-600' }
    return { box: 'border-zinc-700 bg-zinc-900', text: 'text-zinc-200' }
  }

  const isInsertOp = [
    'createNode', 'linkNext', 'updateHead',
    'traverse', 'reachedTail', 'linkTail'
  ].includes(step.action) || (step.action === 'done' && newNode !== null)

  const isDeleteOp = ['check', 'found', 'move', 'notFound'].includes(step.action) ||
    (step.action === 'done' && target !== null && newNode === null)

  const getActionColor = () => {
    switch (step.action) {
      case 'visit':       return 'bg-yellow-500/20  text-yellow-500'
      case 'move':        return 'bg-blue-500/20    text-blue-500'
      case 'done':        return 'bg-green-500/20   text-green-500'
      case 'null':        return 'bg-red-500/20     text-red-400'
      case 'createNode':  return 'bg-violet-500/20  text-violet-500'
      case 'linkNext':    return 'bg-blue-500/20    text-blue-500'
      case 'updateHead':  return 'bg-violet-500/20  text-violet-500'
      case 'traverse':    return 'bg-blue-500/20    text-blue-500'
      case 'reachedTail': return 'bg-orange-500/20  text-orange-500'
      case 'linkTail':    return 'bg-violet-500/20  text-violet-500'
      case 'check':       return 'bg-yellow-500/20  text-yellow-500'
      case 'found':       return 'bg-red-500/20     text-red-400'
      case 'notFound':    return 'bg-zinc-100       text-zinc-400'
      default:            return 'bg-zinc-100       text-zinc-400'
    }
  }

  const getDescription = () => {
    switch (step.action) {
      case 'init':        return 'Initial linked list'
      case 'start':       return 'temp = head — starting traversal'
      case 'visit':       return `Visiting node — temp.value = ${current !== null ? nodes[current] : ''}`
      case 'move':        return isDeleteOp
        ? `temp.value ${nodes[current]} ≠ ${target} — moving forward`
        : 'temp = temp.next — moving forward'
      case 'null':        return 'temp = null — end of list reached'
      case 'createNode':  return `Creating new node with value ${newNode}`
      case 'linkNext':    return `newNode.next = head — linking to existing list`
      case 'updateHead':  return `head = newNode — ${newNode} is now the head`
      case 'traverse':    return `Traversing — looking for tail`
      case 'reachedTail': return `Reached tail — temp.next is null`
      case 'linkTail':    return `temp.next = newNode — ${newNode} inserted at tail`
      case 'check':       return `Checking node — temp.value = ${current !== null ? nodes[current] : ''} vs target ${target}`
      case 'found':       return `Found ${target} at index ${deleted} — deleting node`
      case 'notFound':    return `${target} not found in list`
      case 'done':
        if (newNode !== null && tail !== null) return `${nodes[nodes.length - 1]} inserted at tail! 🎉`
        if (newNode !== null)                  return `${newNode} inserted at head! 🎉`
        if (target !== null)                   return `${target} deleted successfully! 🎉`
        return 'Done! 🎉'
      default: return ''
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
      <div className="flex items-center gap-3 mb-8">
        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${getActionColor()}`}>
          {step.action.toUpperCase()}
        </span>
        <span className="text-zinc-400 text-sm">{getDescription()}</span>
      </div>

      {/* Target badge — delete op */}
      {isDeleteOp && target !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-400 font-mono">target</span>
          <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 font-mono font-bold text-sm">
            {target}
          </span>
        </div>
      )}

      {/* New node pending — insert op */}
      {isInsertOp && !['updateHead', 'linkTail', 'done'].includes(step.action) && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-400 font-mono">new node</span>
          <div className="flex border-2 border-dashed border-violet-400 rounded-lg overflow-hidden">
            <div className="px-4 py-2 text-sm font-mono font-bold text-violet-600 border-r border-violet-300">
              {newNode}
            </div>
            <div className="px-3 py-2 text-xs font-mono text-violet-400 opacity-60">
              {step.action === 'linkNext' ? '→ head' : 'null'}
            </div>
          </div>
        </div>
      )}

      {/* Linked List */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-8">

        {/* HEAD */}
        <div className="flex flex-col items-center mr-2">
          <span className="text-xs font-mono font-bold text-violet-500">HEAD</span>
          <span className="text-violet-400 text-lg">→</span>
        </div>

        {nodes.length === 0 ? (
                  <span className="text-zinc-500 text-sm font-mono">Empty list</span>
        ) : (
          nodes.map((val, idx) => {
            const style    = getNodeStyle(idx)
            const isTemp   = idx === current
            const isPrev   = idx === prev
            const isDeleted = idx === deleted

            return (
              <div key={idx} className="flex items-center gap-1 shrink-0">
                <div className="flex flex-col items-center gap-1">

                  {/* pointer labels */}
                  <div className="flex gap-1 h-5 items-end">
                    {isTemp && <span className="text-xs font-mono font-bold text-yellow-500">temp</span>}
                    {isPrev && <span className="text-xs font-mono font-bold text-blue-500">prev</span>}
                  </div>
                  <div className="h-3 flex items-center">
                    {(isTemp || isPrev) && <span className="text-xs text-zinc-300">↓</span>}
                  </div>

                  {/* Node */}
                  <div className={`flex border rounded-lg overflow-hidden transition-all duration-300 ${style.box} ${isDeleted ? 'opacity-50 line-through' : ''}`}>
                    <div className={`px-4 py-2 text-sm font-mono font-bold border-r ${style.box} ${style.text}`}>
                      {val}
                    </div>
                    <div className={`px-3 py-2 text-xs font-mono ${style.text} opacity-60`}>
                      {idx < nodes.length - 1 ? '→' : 'null'}
                    </div>
                  </div>

                  <span className="text-xs text-zinc-400 font-mono">{idx}</span>
                </div>

                {idx < nodes.length - 1 && (
                  <span className="text-zinc-300 text-lg mb-4">→</span>
                )}
              </div>
            )
          })
        )}

        {/* NULL */}
        <div className="flex flex-col items-center ml-2 mb-4">
          <span className={`text-xs font-mono font-bold transition-colors duration-300 ${
            step.action === 'null' || step.action === 'done' ? 'text-red-400' : 'text-zinc-300'
          }`}>
            NULL
          </span>
        </div>
      </div>

      {/* temp pointer table — traversal only */}
      {current !== null && !isInsertOp && !isDeleteOp && (
        <div className="mt-2">
          <p className="text-xs text-zinc-400 font-mono mb-2">pointer state</p>
          <table className="text-sm font-mono border border-zinc-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-zinc-900 text-zinc-400 text-xs">
                <th className="px-6 py-2 border-r border-zinc-700 font-medium">temp.value</th>
                <th className="px-6 py-2 font-medium">temp.next</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="px-6 py-2 border-r border-zinc-700 text-yellow-300 font-bold">
                  {nodes[current]}
                </td>
                <td className="px-6 py-2 text-blue-300 font-bold">
                  {current + 1 < nodes.length ? nodes[current + 1] : 'null'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default LinkedListVisualizer
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

// ── Random generators ─────────────────────────────────────────
const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo
const randArray = (len = randInt(5, 10), lo = 1, hi = 99) =>
  Array.from({ length: len }, () => randInt(lo, hi))
const randSortedArray = (len = randInt(5, 10), lo = 1, hi = 99) =>
  randArray(len, lo, hi).sort((a, b) => a - b)

function AlgoInput({ category, slug, onVisualize }) {
  const [val, setVal] = useState('')
  const [value, setValue] = useState('')
  const [stack, setStack] = useState('')
  const [target, setTarget] = useState('')
  const { isDark } = useTheme()

  const inputCls = `flex-1 min-w-0 px-3 py-1.5 rounded-lg text-sm border outline-none transition-colors ${
    isDark
      ? 'border-zinc-700 bg-zinc-900 text-zinc-200 focus:border-violet-400 focus:bg-zinc-900'
      : 'border-zinc-300 bg-white text-zinc-800 focus:border-violet-500 focus:bg-white'
  }`
  const smallInputCls = `w-full sm:w-40 px-3 py-1.5 rounded-lg text-sm border outline-none transition-colors ${
    isDark
      ? 'border-zinc-700 bg-zinc-900 text-zinc-200 focus:border-violet-400 focus:bg-zinc-900'
      : 'border-zinc-300 bg-white text-zinc-800 focus:border-violet-500 focus:bg-white'
  }`
  const btnCls = `px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
    isDark
      ? 'border-violet-500/70 bg-violet-500/15 text-violet-200 hover:bg-violet-500/25 hover:border-violet-400 hover:text-violet-100'
      : 'border-violet-400 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-500'
  }`
  const randBtnCls = `px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
    isDark
      ? 'border-amber-500/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-100'
      : 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-500'
  }`

  // ── binary / linear search — array + target ────────────────
  if (slug === 'binary-search' || slug === 'linear-search') {
    const handleRandom = () => {
      const arr = slug === 'binary-search' ? randSortedArray() : randArray()
      setVal(arr.join(','))
      const t = arr[randInt(0, arr.length - 1)]
      setTarget(String(t))
    }
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input className={inputCls} type="text" placeholder="Enter numbers e.g. 1,3,5,7,9" value={val} onChange={e => setVal(e.target.value)} />
          <input className={smallInputCls} type="text" placeholder="Target e.g. 5" value={target} onChange={e => setTarget(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => onVisualize({ array: val.split(',').map(Number), target: Number(target) })}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  // ── array (sorting) ────────────────────────────────────────
  if (category === 'array') {
    const handleRandom = () => setVal(randArray().join(','))
    return (
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input className={inputCls} type="text" placeholder="Enter numbers e.g. 5,3,8,1" value={val} onChange={e => setVal(e.target.value)} />
        <div className="flex gap-2 justify-end sm:justify-start">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => onVisualize(val.split(',').map(Number))}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  // ── stack-pop, peek, isempty — only need stack ─────────────
  if (['stack-pop', 'stack-peek', 'stack-isempty'].includes(slug)) {
    const handleRandom = () => setStack(randArray(randInt(3, 6), 1, 50).join(','))
    return (
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input className={inputCls} type="text" placeholder="Current stack e.g. 1,2,3" value={stack} onChange={e => setStack(e.target.value)} />
        <div className="flex gap-2 justify-end sm:justify-start">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => onVisualize({ stack: stack ? stack.split(',').map(Number) : [] })}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  // ── stack-push — stack + value ─────────────────────────────
  if (category === 'stack') {
    const handleRandom = () => {
      setStack(randArray(randInt(2, 5), 1, 50).join(','))
      setValue(String(randInt(1, 99)))
    }
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input className={inputCls} type="text" placeholder="Current stack e.g. 1,2,3 (leave empty for empty stack)" value={stack} onChange={e => setStack(e.target.value)} />
          <input className={smallInputCls} type="text" placeholder="Value to push" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => onVisualize({ value: Number(value), stack: stack ? stack.split(',').map(Number) : [] })}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  // ── linked list insert / delete — nodes + value ───────────
  if (slug === 'll-insert-head' || slug === 'll-insert-tail' || slug === 'll-delete-node') {
    const handleRandom = () => {
      const arr = randArray(randInt(3, 6), 1, 50)
      setVal(arr.join(','))
      setValue(slug === 'll-delete-node' ? String(arr[randInt(0, arr.length - 1)]) : String(randInt(1, 99)))
    }
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input className={inputCls} type="text" placeholder="Current list e.g. 10,14,18" value={val} onChange={e => setVal(e.target.value)} />
          <input className={smallInputCls} type="text" placeholder="Value to insert" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => onVisualize({ nodes: val ? val.split(',').map(Number) : [], value: Number(value) })}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  // ── linked list traversal — just nodes ────────────────────
  if (category === 'linked_list') {
    const handleRandom = () => setVal(randArray(randInt(3, 7), 1, 50).join(','))
    return (
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input className={inputCls} type="text" placeholder="Enter nodes e.g. 10,20,30" value={val} onChange={e => setVal(e.target.value)} />
        <div className="flex gap-2 justify-end sm:justify-start">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => onVisualize(val.split(',').map(Number))}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  // ── tree (BST) ──────────────────────────────────────────────
  if (category === 'tree') {
    const handleRandom = () => {
      const arr = randArray(randInt(5, 12), 1, 99)
      setVal(arr.join(','))
      if (slug === 'bst-search') setTarget(String(arr[randInt(0, arr.length - 1)]))
    }
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input className={inputCls} type="text" placeholder="Initial tree values e.g. 50,30,70" value={val} onChange={e => setVal(e.target.value)} />
          {slug === 'bst-search' && (
            <input className={smallInputCls} type="text" placeholder="Target to find" value={target} onChange={e => setTarget(e.target.value)} />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => {
            const values = val.split(',').map(Number).filter(n => !isNaN(n))
            if (slug === 'bst-search') {
              onVisualize({ values, target: Number(target) })
            } else {
              onVisualize({ values })
            }
          }}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  // ── graph (BFS, DFS, Dijkstra) ──────────────────────────────
  if (category === 'graph') {
    const handleRandom = () => {
      // For simplicity, we just use one standard graph shape but shuffle weights if Dijkstra
      // Or we can just build a random connected graph here, but a fixed one is easier for UI testing
      setVal('A,B,C,D,E,F') 
      // Default edges list format: u,v[,w]|u,v[,w]
      if (slug === 'graph-dijkstra') {
        const ew = () => randInt(1, 9)
        setStack(`0,1,${ew()}|0,2,${ew()}|1,3,${ew()}|2,3,${ew()}|3,4,${ew()}|4,5,${ew()}|2,5,${ew()}`)
      } else {
        setStack('0,1|0,2|1,3|2,3|3,4|4,5|2,5')
      }
      setTarget('0')
    }
    
    return (
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Comma separated node labels (e.g. A,B,C,D):</label>
        <input className={inputCls} type="text" placeholder="A,B,C,D,E,F" value={val} onChange={e => setVal(e.target.value)} />
        
        <label className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Edges (pipe separated). Format: {slug === 'graph-dijkstra' ? 'fromIndex,toIndex,weight' : 'fromIndex,toIndex'} :</label>
        <input className={inputCls} type="text" placeholder={slug === 'graph-dijkstra' ? '0,1,5|1,2,3' : '0,1|1,2'} value={stack} onChange={e => setStack(e.target.value)} />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 gap-3">
          <div className="flex gap-2 items-center">
            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Start Node Index:</label>
            <input className={`w-16 px-3 py-1.5 rounded-lg text-sm border outline-none ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-200' : 'border-zinc-300 bg-white text-zinc-800'}`} type="number" min="0" value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className={randBtnCls} onClick={handleRandom}>🎲 Random Graph</button>
            <button className={btnCls} onClick={() => {
              const nodes = val ? val.split(',') : ['A','B','C','D']
              const edges = stack ? stack.split('|').map(e => e.split(',').map(Number)) : [[0,1], [1,2], [2,3]]
              onVisualize({ nodes, edges, start: Number(target || 0) })
            }}>▶ Visualize</button>
          </div>
        </div>
      </div>
    )
  }

  // ── recursion (Factorial, Fibonacci) ────────────────────────
  if (category === 'recursion') {
    const handleRandom = () => setVal(String(randInt(3, slug === 'recursion-fibonacci' ? 6 : 8)))
    return (
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input className={inputCls} type="number" placeholder={`Input n (e.g. ${slug === 'recursion-fibonacci' ? 5 : 4})`} value={val} onChange={e => setVal(e.target.value)} />
        <div className="flex gap-2 justify-end sm:justify-start">
          <button className={randBtnCls} onClick={handleRandom}>🎲 Random</button>
          <button className={btnCls} onClick={() => onVisualize({ value: Number(val) })}>▶ Visualize</button>
        </div>
      </div>
    )
  }

  return null
}

export default AlgoInput
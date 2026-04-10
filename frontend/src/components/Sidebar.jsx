import { useEffect, useState } from 'react'
import { getAllAlgorithms } from '../api/index'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = ['array', 'stack', 'linked_list', 'tree', 'graph', 'recursion']

const CATEGORY_META = {
  array:       { label: 'Arrays',      dot: 'bg-violet-400',  text: 'text-violet-300',  activeBg: 'bg-violet-500/20',  activeText: 'text-violet-200',  hoverBg: 'hover:bg-violet-500/15',  hoverText: 'hover:text-violet-200',  dotLight: 'bg-violet-500',  textLight: 'text-violet-600',  activeBgLight: 'bg-violet-100',  activeTextLight: 'text-violet-700',  hoverBgLight: 'hover:bg-violet-50',  hoverTextLight: 'hover:text-violet-600' },
  stack:       { label: 'Stack',       dot: 'bg-emerald-400', text: 'text-emerald-300', activeBg: 'bg-emerald-500/20', activeText: 'text-emerald-200', hoverBg: 'hover:bg-emerald-500/15', hoverText: 'hover:text-emerald-200', dotLight: 'bg-emerald-500', textLight: 'text-emerald-600', activeBgLight: 'bg-emerald-100', activeTextLight: 'text-emerald-700', hoverBgLight: 'hover:bg-emerald-50', hoverTextLight: 'hover:text-emerald-600' },
  linked_list: { label: 'Linked List', dot: 'bg-orange-400',  text: 'text-orange-300',  activeBg: 'bg-orange-500/20',  activeText: 'text-orange-200',  hoverBg: 'hover:bg-orange-500/15',  hoverText: 'hover:text-orange-200',  dotLight: 'bg-orange-500',  textLight: 'text-orange-600',  activeBgLight: 'bg-orange-100',  activeTextLight: 'text-orange-700',  hoverBgLight: 'hover:bg-orange-50',  hoverTextLight: 'hover:text-orange-600' },
  tree:        { label: 'Trees',       dot: 'bg-yellow-400',  text: 'text-yellow-300',  activeBg: 'bg-yellow-500/20',  activeText: 'text-yellow-200',  hoverBg: 'hover:bg-yellow-500/15',  hoverText: 'hover:text-yellow-200',  dotLight: 'bg-yellow-500',  textLight: 'text-yellow-600',  activeBgLight: 'bg-yellow-100',  activeTextLight: 'text-yellow-700',  hoverBgLight: 'hover:bg-yellow-50',  hoverTextLight: 'hover:text-yellow-600' },
  graph:       { label: 'Graphs',      dot: 'bg-pink-400',    text: 'text-pink-300',    activeBg: 'bg-pink-500/20',    activeText: 'text-pink-200',    hoverBg: 'hover:bg-pink-500/15',    hoverText: 'hover:text-pink-200',    dotLight: 'bg-pink-500',    textLight: 'text-pink-600',    activeBgLight: 'bg-pink-100',    activeTextLight: 'text-pink-700',    hoverBgLight: 'hover:bg-pink-50',    hoverTextLight: 'hover:text-pink-600' },
  recursion:   { label: 'Recursion',   dot: 'bg-cyan-400',    text: 'text-cyan-300',    activeBg: 'bg-cyan-500/20',    activeText: 'text-cyan-200',    hoverBg: 'hover:bg-cyan-500/15',    hoverText: 'hover:text-cyan-200',    dotLight: 'bg-cyan-500',    textLight: 'text-cyan-600',    activeBgLight: 'bg-cyan-100',    activeTextLight: 'text-cyan-700',    hoverBgLight: 'hover:bg-cyan-50',    hoverTextLight: 'hover:text-cyan-600' },
}

function AlgoButton({ algo, isActive, onClick, meta, isDark }) {
  const activeBg = isDark ? meta.activeBg : meta.activeBgLight
  const activeText = isDark ? meta.activeText : meta.activeTextLight
  const hoverBg = isDark ? meta.hoverBg : meta.hoverBgLight
  const hoverText = isDark ? meta.hoverText : meta.hoverTextLight
  const dot = isDark ? meta.dot : meta.dotLight

  return (
    <button
      onClick={() => onClick(algo)}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors font-sans
        ${isActive
          ? `${activeBg} ${activeText} font-medium`
          : `${isDark ? 'text-zinc-300' : 'text-zinc-600'} ${hoverBg} ${hoverText}`
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? dot : (isDark ? 'bg-zinc-600' : 'bg-zinc-300')}`} />
      {algo.name}
    </button>
  )
}

function Sidebar({ onSelect, selectedSlug, onClose }) {
  const [algorithms, setAlgorithms] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDark } = useTheme()

  useEffect(() => {
    getAllAlgorithms()
      .then(res => setAlgorithms(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <aside
      className="w-68 h-screen flex flex-col border-r"
      style={{
        background: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >

      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>AlgoAnalyzer</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="transition-colors p-1 rounded-md text-lg leading-none"
              style={{ color: 'var(--text-dimmed)' }}
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-xs pl-9" style={{ color: 'var(--text-muted)' }}>Select an algorithm to visualize</p>
      </div>

      <div className="h-px mx-4" style={{ background: 'var(--border)' }} />

      {/* Algorithm list */}
      <div className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto no-scrollbar">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-8 rounded-lg animate-pulse" style={{ background: 'var(--border)' }} />
          ))
        ) : (
          CATEGORIES.map((cat, i) => {
            const meta = CATEGORY_META[cat]
            const algos = algorithms.filter(a => a.category === cat)
            return (
              <div key={cat}>
                {i > 0 && <div className="h-px mb-4" style={{ background: 'var(--border)' }} />}

                {/* Category label */}
                <div className="flex items-center gap-2 px-2 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? meta.dot : meta.dotLight}`} />
                  <span className={`text-xs font-semibold uppercase tracking-widest ${isDark ? meta.text : meta.textLight}`}>
                    {meta.label}
                  </span>
                </div>

                {/* Algo buttons */}
                {algos.map(a => (
                  <AlgoButton
                    key={a.slug}
                    algo={a}
                    isActive={selectedSlug === a.slug}
                    onClick={onSelect}
                    meta={meta}
                    isDark={isDark}
                  />
                ))}
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}

export default Sidebar
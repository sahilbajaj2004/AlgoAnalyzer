import { useState, useEffect } from 'react'
import { getAllAlgorithms } from '../api/index'
import Navbar from '../components/Navbar'
import ComplexityBadge from '../components/ComplexityBadge'
import CodePanel from '../components/CodePanel'
import Controls from '../components/Controls'
import VISUALIZER_MAP from '../components/visualizers'
import useVisualizer from '../hooks/useVisualizer'
import useUrlState from '../hooks/useUrlState'
import AlgoInput from '../components/AlgoInput'
import { useTheme } from '../context/ThemeContext'

/* ── Share button with copy feedback ─────────────────────────── */
function ShareButton({ onShare }) {
  const [copied, setCopied] = useState(false)
  const handleClick = async () => {
    const ok = await onShare()
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer"
      style={{
        borderColor: copied ? 'var(--success-border)' : 'var(--border)',
        background: copied ? 'var(--success-bg)' : 'var(--bg-card)',
        color: copied ? 'var(--success-text)' : 'var(--text-muted)',
      }}
    >
      {copied ? '✓ Copied!' : '🔗 Share'}
    </button>
  )
}

/* ── Single algorithm side panel ─────────────────────────────── */
function AlgoSide({ algo, visualizer }) {
  if (!algo) return (
    <div
      className="flex-1 flex items-center justify-center text-sm border border-dashed rounded-2xl min-h-64"
      style={{
        color: 'var(--text-muted)',
        borderColor: 'var(--border)',
        background: 'var(--bg-card)',
      }}
    >
      Select an algorithm
    </div>
  )

  const VisualizerComponent = VISUALIZER_MAP[algo.slug] || VISUALIZER_MAP[algo.category] || null

  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{algo.name}</h2>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{algo.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <ComplexityBadge label="Best"    value={algo.time_best} />
        <ComplexityBadge label="Average" value={algo.time_avg} />
        <ComplexityBadge label="Worst"   value={algo.time_worst} />
        <ComplexityBadge label="Space"   value={algo.space_complexity} />
      </div>

      {VisualizerComponent && visualizer.steps.length > 0 && (
        <VisualizerComponent step={visualizer.step} slug={algo.slug} />
      )}

      {visualizer.steps.length > 0 && (
        <Controls
          onPrev={visualizer.prev}
          onNext={visualizer.next}
          onPlay={visualizer.play}
          onReset={visualizer.reset}
          currentStep={visualizer.currentStep}
          totalSteps={visualizer.totalSteps}
          isPlaying={visualizer.isPlaying}
          speed={visualizer.speed}
          onSpeedChange={visualizer.setSpeed}
        />
      )}

      {visualizer.error && (
        <p className="text-red-400 text-sm mb-4">{visualizer.error}</p>
      )}

      <CodePanel slug={algo.slug} currentStep={visualizer.step} />
    </div>
  )
}

/* ── Category labels ─────────────────────────────────────────── */
const CATEGORY_LABELS = {
  array:       'Arrays',
  stack:       'Stacks',
  linked_list: 'Linked Lists',
  tree:        'Trees',
  graph:       'Graphs',
  recursion:   'Recursion',
}

/* ── Grouped select ──────────────────────────────────────────── */
function GroupedSelect({ algorithms, value, onChange, label }) {
  const groups = algorithms.reduce((acc, algo) => {
    const cat = algo.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(algo)
    return acc
  }, {})

  return (
    <div className="flex-1 min-w-0">
      <label className="text-xs font-medium uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-input)',
          color: 'var(--text-secondary)',
        }}
      >
        <option value="">Select algorithm</option>
        {Object.entries(groups).map(([cat, algos]) => (
          <optgroup key={cat} label={CATEGORY_LABELS[cat] || cat}>
            {algos.map(a => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

/* ── ComparisonSummary ───────────────────────────────────────── */
function ComparisonSummary({ algoA, algoB, vizA, vizB }) {
  if (!algoA || !algoB || vizA.totalSteps === 0 || vizB.totalSteps === 0) return null
  const aFinished = vizA.currentStep === vizA.totalSteps - 1
  const bFinished = vizB.currentStep === vizB.totalSteps - 1

  if (!aFinished && !bFinished) return null

  return (
    <div
      className="rounded-xl p-4 mb-6 border"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📊 Comparison Summary</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 rounded-lg p-3" style={{ background: 'var(--accent-bg-light)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{algoA.name}</div>
          <div className="text-lg font-bold" style={{ color: 'var(--accent-text-2)' }}>{vizA.totalSteps} steps</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-dimmed)' }}>
            {aFinished ? '✓ Completed' : `Step ${vizA.currentStep + 1} / ${vizA.totalSteps}`}
          </div>
        </div>
        <div className="flex-1 rounded-lg p-3" style={{ background: 'var(--accent-bg-light)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{algoB.name}</div>
          <div className="text-lg font-bold" style={{ color: 'var(--accent-text-2)' }}>{vizB.totalSteps} steps</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-dimmed)' }}>
            {bFinished ? '✓ Completed' : `Step ${vizB.currentStep + 1} / ${vizB.totalSteps}`}
          </div>
        </div>
      </div>
      {aFinished && bFinished && (
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          {vizA.totalSteps < vizB.totalSteps
            ? `🏆 ${algoA.name} was more efficient by ${vizB.totalSteps - vizA.totalSteps} steps`
            : vizB.totalSteps < vizA.totalSteps
              ? `🏆 ${algoB.name} was more efficient by ${vizA.totalSteps - vizB.totalSteps} steps`
              : '🤝 Both algorithms completed in the same number of steps'}
        </p>
      )}
    </div>
  )
}

/* ── Main Compare page ───────────────────────────────────────── */
function Compare() {
  const [algorithms, setAlgorithms] = useState([])
  const [algoA, setAlgoA] = useState(null)
  const [algoB, setAlgoB] = useState(null)

  const vizA = useVisualizer()
  const vizB = useVisualizer()
  const urlState = useUrlState()
  const { isDark } = useTheme()

  useEffect(() => {
    getAllAlgorithms()
      .then(res => {
        const algos = res.data.data
        setAlgorithms(algos)

        // Restore from URL
        const slugA = urlState.getAlgoSlug()
        const slugB = urlState.getAlgoSlugB()
        if (slugA) {
          const found = algos.find(a => a.slug === slugA)
          if (found) setAlgoA(found)
        }
        if (slugB) {
          const found = algos.find(a => a.slug === slugB)
          if (found) setAlgoB(found)
        }
      })
      .catch(err => console.error(err))
  }, [])

  const handleCompare = (input) => {
    if (!algoA || !algoB) return
    vizA.generate(algoA.slug, input)
    vizB.generate(algoB.slug, input)
    urlState.setUrlState({ algo: algoA.slug, algoB: algoB.slug, input })
  }

  const handleSelectA = (slug) => {
    setAlgoA(algorithms.find(a => a.slug === slug) || null)
    vizA.clear()
    urlState.setUrlState({ algo: slug || null })
  }

  const handleSelectB = (slug) => {
    setAlgoB(algorithms.find(a => a.slug === slug) || null)
    vizB.clear()
    urlState.setUrlState({ algoB: slug || null })
  }

  const handlePlayBoth = () => {
    vizA.reset()
    vizB.reset()
    setTimeout(() => {
      vizA.play()
      vizB.play()
    }, 50)
  }

  const handleResetBoth = () => {
    vizA.reset()
    vizB.reset()
  }

  const handleShare = () => {
    urlState.setUrlState({ algo: algoA?.slug, algoB: algoB?.slug })
    return urlState.copyShareUrl()
  }

  const categoryMismatch = algoA && algoB && algoA.category !== algoB.category
  const bothHaveSteps = vizA.totalSteps > 0 && vizB.totalSteps > 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Compare Algorithms</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Same input, two algorithms — see how they differ step by step</p>
          </div>
          <ShareButton onShare={handleShare} />
        </div>

        {/* Algorithm selectors */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-end">
          <GroupedSelect algorithms={algorithms} value={algoA?.slug || ''} onChange={handleSelectA} label="Algorithm A" />
          {/* VS badge with pulse animation */}
          <div
            className="px-4 py-2 rounded-full text-xs font-bold self-center shrink-0"
            style={{
              background: 'var(--accent-bg-light)',
              color: 'var(--accent-text)',
              border: '1px solid var(--accent)',
              boxShadow: '0 0 12px var(--accent-bg-light)',
            }}
          >
            VS
          </div>
          <GroupedSelect algorithms={algorithms} value={algoB?.slug || ''} onChange={handleSelectB} label="Algorithm B" />
        </div>

        {/* Warn if categories don't match */}
        {categoryMismatch && (
          <div className="mb-6 p-3 rounded-lg" style={{
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
          }}>
            <p className="text-sm" style={{ color: 'var(--warning-text)' }}>
              These algorithms use different data structures — comparing them may not be meaningful. Try picking two from the same category.
            </p>
          </div>
        )}

        {/* Input — only when both selected and same category */}
        {algoA && algoB && !categoryMismatch && (
          <div className="mb-8">
            <label className="text-xs font-medium uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Input — same data fed to both
            </label>
            <AlgoInput
              category={algoA.category}
              slug={algoA.slug}
              onVisualize={handleCompare}
            />
          </div>
        )}

        {/* Play Both / Reset Both controls */}
        {bothHaveSteps && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handlePlayBoth}
              disabled={vizA.isPlaying || vizB.isPlaying}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: (vizA.isPlaying || vizB.isPlaying) ? 'var(--accent-bg)' : 'var(--accent)',
                color: 'var(--accent-text)',
                border: '1px solid var(--accent)',
                opacity: (vizA.isPlaying || vizB.isPlaying) ? 0.5 : 1,
              }}
            >
              ▶ Play Both
            </button>
            <button
              onClick={handleResetBoth}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: 'var(--btn-bg)',
                color: 'var(--btn-text)',
                border: '1px solid var(--btn-border)',
              }}
            >
              ↺ Reset Both
            </button>
          </div>
        )}

        {/* Comparison Summary */}
        <ComparisonSummary algoA={algoA} algoB={algoB} vizA={vizA} vizB={vizB} />

        {/* Side-by-side panels */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <AlgoSide algo={algoA} visualizer={vizA} />
          <div className="w-full md:w-px self-stretch hidden md:block" style={{ background: 'var(--border)' }} />
          <div className="h-px md:hidden" style={{ background: 'var(--border)' }} />
          <AlgoSide algo={algoB} visualizer={vizB} />
        </div>

      </main>
    </div>
  )
}

export default Compare
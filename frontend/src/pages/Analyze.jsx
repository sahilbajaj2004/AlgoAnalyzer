import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Controls from '../components/Controls'
import CodePanel from '../components/CodePanel'
import ComplexityBadge from '../components/ComplexityBadge'
import AlgoInput from '../components/AlgoInput'
import useVisualizer from '../hooks/useVisualizer'
import VISUALIZER_MAP from '../components/visualizers'
import { analyzeCode } from '../api'
import Prism from 'prismjs'
import 'prismjs/components/prism-java'


// Load Prism for Java syntax highlighting
// We import the CSS in index.css or main.jsx — see note at bottom of file
// let Prism = null
// if (typeof window !== 'undefined') {
//   import('prismjs').then(p => {
//     Prism = p.default
//     import('prismjs/components/prism-java')
//   })
// }

const SLUG_TO_CATEGORY = {
  'bubble-sort':    'array',
  'selection-sort': 'array',
  'insertion-sort': 'array',
  'binary-search':  'binary-search',
  'linear-search':  'linear-search',
  'stack-push':     'stack',
  'stack-pop':      'stack',
  'stack-peek':     'stack',
  'll-traversal':   'linked_list',
  'll-insert-head': 'linked_list',
  'll-insert-tail': 'linked_list',
  'll-delete-node': 'linked_list',
}

const CONFIDENCE_COLOR = (c) => {
  if (c >= 0.85) return 'text-green-400 bg-green-400/10 border-green-400/20'
  if (c >= 0.65) return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
  return 'text-red-400 bg-red-400/10 border-red-400/20'
}

const MATCH_COLOR = (score) => {
  if (score >= 90) return { bar: 'bg-green-500',  text: 'text-green-300',  label: 'Logically identical' }
  if (score >= 70) return { bar: 'bg-green-400',  text: 'text-green-300',  label: 'Correct, minor differences' }
  if (score >= 50) return { bar: 'bg-amber-500',  text: 'text-amber-300',  label: 'Correct, missing edge cases' }
  if (score >= 30) return { bar: 'bg-orange-500', text: 'text-orange-300', label: 'Partially correct' }
  return              { bar: 'bg-red-500',    text: 'text-red-300',    label: 'Significant issues' }
}

function MatchBar({ score }) {
  const { bar, text, label } = MATCH_COLOR(score)
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-zinc-400 font-medium uppercase tracking-wide">Semantic match</span>
        <span className={`text-sm font-semibold ${text}`}>{score}% — {label}</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${bar}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function FeedbackItem({ item }) {
  const icons = { correct: '✓', improvement: '△', wrong: '✕' }
  const colors = {
    correct:     'text-green-200 bg-green-500/10 border-green-500/30',
    improvement: 'text-amber-200 bg-amber-500/10 border-amber-500/30',
    wrong:       'text-red-200 bg-red-500/10 border-red-500/30',
  }
  const type = item.type || 'improvement'
  return (
    <div className={`flex gap-3 p-3 rounded-lg border text-sm ${colors[type]}`}>
      <span className="font-bold mt-0.5 shrink-0">{icons[type]}</span>
      <p className="leading-relaxed">{item.message}</p>
    </div>
  )
}

// ─── Syntax-highlighted code editor ──────────────────────────────────────────
// Pattern: transparent textarea sits on top of a highlighted <pre>
// They share identical font/size/padding so text aligns perfectly
function CodeEditor({ value, onChange }) {
  const textareaRef    = useRef(null)
  const preRef         = useRef(null)
  const [highlighted, setHighlighted] = useState('')

  const lines     = value ? value.split('\n') : ['']
  const lineCount = Math.max(lines.length, 8)

  // Re-highlight whenever value changes
  useEffect(() => {
  try {
    const html = Prism.highlight(value || '', Prism.languages.java, 'java')
    setHighlighted(html + '\n')
  } catch {
    setHighlighted(
      (value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') + '\n'
    )
  }
}, [value])

  const syncScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop  = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end   = e.target.selectionEnd
      const newVal = value.substring(0, start) + '    ' + value.substring(end)
      onChange(newVal)
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4
          textareaRef.current.selectionEnd   = start + 4
        }
      })
    }
  }

  const editorFont = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace"
  const editorStyle = {
    fontFamily:   editorFont,
    fontSize:     '13px',
    lineHeight:   '21px',
    padding:      '12px 16px',
    margin:       0,
    border:       'none',
    outline:      'none',
    whiteSpace:   'pre',
    wordBreak:    'normal',
    overflowWrap: 'normal',
    tabSize:      4,
  }

  const containerHeight = `${lineCount * 21 + 24}px`

  return (
    <div
      className="rounded-xl border border-zinc-200 overflow-hidden"
      style={{ fontFamily: editorFont, background: '#1e1e2e' }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: '#181825', borderColor: '#313244' }}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs font-medium" style={{ color: '#6c7086' }}>Java</span>
        <button
          onClick={() => onChange('')}
          className="text-xs transition-colors"
          style={{ color: '#6c7086' }}
          onMouseEnter={e => e.target.style.color = '#cdd6f4'}
          onMouseLeave={e => e.target.style.color = '#6c7086'}
        >
          Clear
        </button>
      </div>

      {/* Editor body: line numbers + highlight layer + textarea */}
      <div className="flex" style={{ minHeight: '200px', maxHeight: '480px', overflow: 'auto' }}>

        {/* Line numbers */}
        <div
          className="select-none shrink-0 text-right"
          style={{
            width: '48px',
            background: '#181825',
            borderRight: '1px solid #313244',
            paddingTop: '12px',
            paddingBottom: '12px',
            fontFamily: editorFont,
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              style={{ height: '21px', lineHeight: '21px', paddingRight: '10px', fontSize: '12px', color: '#45475a' }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Highlight + textarea overlay */}
        <div className="relative flex-1" style={{ minWidth: 0 }}>

          {/* Highlighted pre — purely visual, pointer-events none */}
          <pre
            ref={preRef}
            aria-hidden="true"
            style={{
              ...editorStyle,
              position:       'absolute',
              top:            0,
              left:           0,
              right:          0,
              bottom:         0,
              pointerEvents:  'none',
              overflow:       'hidden',
              color:          '#cdd6f4',
              background:     'transparent',
              height:         containerHeight,
              minHeight:      '192px',
            }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />

          {/* Transparent textarea — captures all input */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            placeholder="// Paste your Java algorithm here..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            style={{
              ...editorStyle,
              position:    'relative',
              display:     'block',
              width:       '100%',
              resize:      'none',
              background:  'transparent',
              color:       'transparent',
              caretColor:  '#cdd6f4',  // visible cursor
              height:      containerHeight,
              minHeight:   '192px',
              overflow:    'auto',
              zIndex:      1,
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Analyze() {
  const [code, setCode]         = useState('')
  const [inputVal, setInputVal] = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const visualizer = useVisualizer()

  const detectedCategory    = result ? SLUG_TO_CATEGORY[result.slug] : null
  const VisualizerComponent = result
    ? VISUALIZER_MAP[detectedCategory] || VISUALIZER_MAP[result.slug]
    : null

  const parseArrayInput = (raw) => {
    if (!raw.trim()) return [5, 3, 8, 1, 9, 2]
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return raw.split(',').map(s => {
        const n = Number(s.trim())
        return isNaN(n) ? s.trim() : n
      }).filter(v => v !== '')
    }
  }

  const handleAnalyze = async () => {
    if (!code.trim()) return
    const input = parseArrayInput(inputVal)
    setLoading(true)
    setResult(null)
    setError('')
    visualizer.clear()
    try {
      const res  = await analyzeCode({ code, language: 'java', input })
      const data = res.data.data
      setResult(data)
      setError('')
      if (data.steps?.length) visualizer.setSteps(data.steps)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please check your code and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReVisualize = (input) => {
    visualizer.generate(result.slug, input)
  }

  const feedbackItems = result?.feedback_items ?? (
    result?.feedback ? [{ type: 'improvement', message: result.feedback }] : []
  )

  const isNonArrayAlgo = detectedCategory && detectedCategory !== 'array'

  return (
    <div className="flex h-screen overflow-hidden bg-[#090f1f] text-zinc-100">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-6 pt-20">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-100 mb-1">AI Code Analyzer</h1>
            <p className="text-sm text-zinc-400">Paste your algorithm — we'll detect it, compare it to the reference, and visualize it</p>
          </div>

          <div className="mb-5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2 block">Your code</label>
            <CodeEditor value={code} onChange={setCode} />
          </div>

          {!result && (
            <div className="flex gap-3 mb-8 items-end">
              <div className="flex-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2 block">
                  Test input <span className="normal-case text-zinc-500">(comma-separated, e.g. 5,3,8,1)</span>
                </label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="5, 3, 8, 1, 9, 2"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-200 outline-none focus:border-violet-400 transition-colors"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!code.trim() || loading}
                className="px-6 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          )}

          {result && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => { setResult(null); visualizer.clear(); setError('') }}
                className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
              >
                ← Analyze new code
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/60 text-sm text-violet-200 hover:bg-violet-500/25 transition-colors"
              >
                ↺ Re-analyze
              </button>
            </div>
          )}

          {error && !result && (
            <p className="text-red-300 text-sm mb-6 p-3 bg-red-500/10 border border-red-500/40 rounded-lg">{error}</p>
          )}

          {loading && (
            <div className="space-y-3 mb-8 animate-pulse">
              <div className="h-16 bg-zinc-800 rounded-xl" />
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
              <div className="h-4 bg-zinc-800 rounded w-1/2" />
            </div>
          )}

          {result && !loading && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">{result.name || result.slug}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{result.slug}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CONFIDENCE_COLOR(result.confidence)}`}>
                  {Math.round((result.confidence ?? 1) * 100)}% confident
                </span>
              </div>

              <div className="flex gap-3 mb-6 flex-wrap">
                {result.time_best        && <ComplexityBadge label="Best"    value={result.time_best} />}
                {result.time_avg         && <ComplexityBadge label="Average" value={result.time_avg} />}
                {result.time_worst       && <ComplexityBadge label="Worst"   value={result.time_worst} />}
                {result.space_complexity && <ComplexityBadge label="Space"   value={result.space_complexity} />}
              </div>

              {result.match_score !== null && result.match_score !== undefined && (
                <MatchBar score={result.match_score} />
              )}

              {feedbackItems.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Feedback</p>
                  <div className="space-y-2">
                    {feedbackItems.map((item, i) => <FeedbackItem key={i} item={item} />)}
                  </div>
                </div>
              )}

              {isNonArrayAlgo && (
                <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl">
                  <p className="text-xs font-medium text-amber-300 mb-3 uppercase tracking-wide">
                    {detectedCategory === 'stack' ? '📚 Stack input' : '🔗 Linked list input'} — enter correct format to visualize
                  </p>
                  <AlgoInput
                    category={detectedCategory}
                    slug={result.slug}
                    onVisualize={handleReVisualize}
                  />
                </div>
              )}

              {VisualizerComponent && visualizer.steps.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Visualization of the {result.name || result.slug}</p>
                  <VisualizerComponent step={visualizer.step} slug={result.slug} />
                </div>
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
                <p className="text-red-500 text-sm mt-2 mb-4">{visualizer.error}</p>
              )}

              {/* <div className="mt-6">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Reference implementation</p>
                <CodePanel slug={result.slug} currentStep={visualizer.step} />
              </div> */}
            </>
          )}

        </div>
      </main>
    </div>
  )
}

/*
  SETUP REQUIRED — add ONE of these to your main.jsx or index.css:

  Option A — in main.jsx:
    import 'prismjs/themes/prism-tomorrow.css'   // dark theme matches editor bg

  Option B — in index.css:
    @import 'prismjs/themes/prism-tomorrow.css';

  Then install if not already:
    npm install prismjs
*/
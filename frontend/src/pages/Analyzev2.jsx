import { useState, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import Navbar from '../components/Navbar'
import ComplexityBadge from '../components/ComplexityBadge'
import { analyzeV2Code } from '../api'

// ─── Code Editor ──────────────────────────────────────────────────────────────
function CodeEditor({ value, onChange }) {
    const textareaRef = useRef(null)
    const preRef      = useRef(null)

    const lines     = value ? value.split('\n') : ['']
    const lineCount = Math.max(lines.length, 10)

    const highlight = (val) => {
        try {
            return Prism.highlight(val || '', Prism.languages.java, 'java') + '\n'
        } catch {
            return (val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n'
        }
    }

    const syncScroll = () => {
        if (preRef.current && textareaRef.current) {
            preRef.current.scrollTop  = textareaRef.current.scrollTop
            preRef.current.scrollLeft = textareaRef.current.scrollLeft
        }
    }

    const handleKeyDown = (e) => {
        const ta    = textareaRef.current
        const start = ta.selectionStart
        const end   = ta.selectionEnd
        const val   = value

        // Tab → 4 spaces
        if (e.key === 'Tab') {
            e.preventDefault()
            const newVal = val.substring(0, start) + '    ' + val.substring(end)
            onChange(newVal)
            requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 4
            })
            return
        }

        // Enter → auto-indent to match current line + extra indent after {
        if (e.key === 'Enter') {
            e.preventDefault()
            const lineStart = val.lastIndexOf('\n', start - 1) + 1
            const currentLine = val.substring(lineStart, start)
            const indent = currentLine.match(/^(\s*)/)[1]
            const charBefore = val[start - 1]
            const charAfter  = val[start]

            // { → add extra indent and close }
            if (charBefore === '{' && charAfter === '}') {
                const newVal = val.substring(0, start) + '\n' + indent + '    ' + '\n' + indent + val.substring(end)
                onChange(newVal)
                requestAnimationFrame(() => {
                    ta.selectionStart = ta.selectionEnd = start + 1 + indent.length + 4
                })
                return
            }

            const extra = charBefore === '{' ? '    ' : ''
            const newVal = val.substring(0, start) + '\n' + indent + extra + val.substring(end)
            onChange(newVal)
            requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 1 + indent.length + extra.length
            })
            return
        }

        // Auto-close brackets and quotes
        const pairs = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" }
        if (pairs[e.key] && start === end) {
            e.preventDefault()
            const newVal = val.substring(0, start) + e.key + pairs[e.key] + val.substring(end)
            onChange(newVal)
            requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 1
            })
            return
        }

        // Skip over closing bracket if already there
        const closers = new Set(['}', ')', ']', '"', "'"])
        if (closers.has(e.key) && val[start] === e.key && start === end) {
            e.preventDefault()
            requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 1
            })
            return
        }

        // Backspace — delete pair if both chars are a pair
        if (e.key === 'Backspace' && start === end && start > 0) {
            const openPairs = { '}': '{', ')': '(', ']': '[' }
            const prev = val[start - 1]
            const next = val[start]
            if (pairs[prev] === next) {
                e.preventDefault()
                const newVal = val.substring(0, start - 1) + val.substring(start + 1)
                onChange(newVal)
                requestAnimationFrame(() => {
                    ta.selectionStart = ta.selectionEnd = start - 1
                })
            }
        }
    }

    const font   = "'JetBrains Mono','Fira Code','Cascadia Code','Consolas',monospace"
    const shared = {
        fontFamily:   font,
        fontSize:     '13px',
        lineHeight:   '21px',
        padding:      '12px 16px',
        whiteSpace:   'pre',
        wordBreak:    'normal',
        overflowWrap: 'normal',
        tabSize:      4,
    }

    return (
        <div className="rounded-xl overflow-hidden" style={{ background: '#1e1e2e', fontFamily: font, border: '1px solid #313244' }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: '#181825', borderColor: '#313244' }}>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: '#6c7086' }}>Java</span>
                    <span style={{ color: '#313244', fontSize: '12px' }}>|</span>
                    <span className="text-xs" style={{ color: '#6c7086' }}>{lines.length} lines</span>
                </div>
                <button
                    onClick={() => onChange('')}
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{ color: '#6c7086', background: 'transparent' }}
                    onMouseEnter={e => { e.target.style.color = '#cdd6f4'; e.target.style.background = '#313244' }}
                    onMouseLeave={e => { e.target.style.color = '#6c7086'; e.target.style.background = 'transparent' }}
                >
                    Clear
                </button>
            </div>

            {/* Editor body */}
            <div className="flex" style={{ minHeight: '240px', maxHeight: '520px', overflow: 'auto' }}>
                {/* Line numbers */}
                <div
                    className="select-none shrink-0"
                    style={{
                        width: '52px',
                        background: '#181825',
                        borderRight: '1px solid #313244',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        fontFamily: font,
                    }}
                >
                    {Array.from({ length: lineCount }, (_, i) => {
                        // Highlight the current line number
                        const currentLine = value.substring(0, textareaRef.current?.selectionStart || 0).split('\n').length - 1
                        const isActive = i === currentLine
                        return (
                            <div
                                key={i}
                                style={{
                                    height: '21px',
                                    lineHeight: '21px',
                                    textAlign: 'right',
                                    paddingRight: '12px',
                                    fontSize: '12px',
                                    color: isActive ? '#cdd6f4' : '#45475a',
                                    fontWeight: isActive ? '500' : '400',
                                }}
                            >
                                {i + 1}
                            </div>
                        )
                    })}
                </div>

                {/* Highlight layer + textarea */}
                <div className="relative flex-1" style={{ minWidth: 0 }}>
                    <pre
                        ref={preRef}
                        aria-hidden="true"
                        style={{
                            ...shared,
                            position:      'absolute',
                            top:           0, left: 0, right: 0, bottom: 0,
                            pointerEvents: 'none',
                            overflow:      'hidden',
                            color:         '#cdd6f4',
                            background:    'transparent',
                            height:        `${lineCount * 21 + 24}px`,
                            minHeight:     '240px',
                            margin:        0,
                        }}
                        dangerouslySetInnerHTML={{ __html: highlight(value) }}
                    />
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onScroll={syncScroll}
                        onKeyDown={handleKeyDown}
                        placeholder="// Write your Java algorithm here...&#10;// Just the method, or a full class with main()"
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        style={{
                            ...shared,
                            position:   'relative',
                            display:    'block',
                            width:      '100%',
                            resize:     'none',
                            background: 'transparent',
                            color:      'transparent',
                            caretColor: '#cdd6f4',
                            height:     `${lineCount * 21 + 24}px`,
                            minHeight:  '240px',
                            overflow:   'auto',
                            border:     'none',
                            outline:    'none',
                            zIndex:     1,
                        }}
                    />
                </div>
            </div>

            {/* Status bar */}
            <div
                className="flex items-center justify-between px-4 py-1.5 border-t"
                style={{ background: '#181825', borderColor: '#313244' }}
            >
                <span className="text-xs" style={{ color: '#45475a' }}>
                    {value.trim() ? `${value.trim().split('\n').length} lines · ${value.length} chars` : 'Empty'}
                </span>
                <span className="text-xs" style={{ color: '#45475a' }}>
                    {value.includes('public static void main') ? 'Full class ✓' : 'Method mode'}
                </span>
            </div>
        </div>
    )
}

// ─── Execution stats ──────────────────────────────────────────────────────────
function ExecutionStats({ execution }) {
    const success = execution.status === 'Accepted'
    return (
        <div className={`flex flex-wrap gap-3 p-4 rounded-xl border mb-6 ${success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${success ? 'text-green-300' : 'text-red-300'}`}>{execution.status}</span>
            </div>
            {execution.output && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Output</span>
                    <code className="text-xs bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-zinc-200">{execution.output}</code>
                </div>
            )}
            {execution.execution_time_ms && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Time</span>
                    <span className="text-xs font-mono font-medium text-zinc-200">{execution.execution_time_ms.toFixed(2)} ms</span>
                </div>
            )}
            {execution.memory_kb && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Memory</span>
                    <span className="text-xs font-mono font-medium text-zinc-200">{(execution.memory_kb / 1024).toFixed(1)} MB</span>
                </div>
            )}
            {execution.stderr && (
                <p className="w-full text-xs text-red-600 font-mono mt-1">{execution.stderr}</p>
            )}
        </div>
    )
}

// ─── Suggestion card ──────────────────────────────────────────────────────────
function SuggestionCard({ suggestion }) {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        navigator.clipboard.writeText(suggestion.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="border border-zinc-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-700">
                <p className="text-sm font-medium text-zinc-100">{suggestion.title}</p>
            </div>
            <div className="px-4 py-3">
                <p className="text-sm text-zinc-400 mb-3">{suggestion.description}</p>
                {suggestion.code && (
                    <div className="relative">
                        <pre className="text-xs bg-zinc-950 text-zinc-200 border border-zinc-700 p-3 rounded-lg overflow-x-auto font-mono">{suggestion.code}</pre>
                        <button onClick={copy} className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors">
                            {copied ? '✓' : 'Copy'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Optimized code ───────────────────────────────────────────────────────────
function OptimizedCode({ code }) {
    const [show, setShow]     = useState(false)
    const [copied, setCopied] = useState(false)
    const copy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="border border-violet-500/40 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-violet-500/15 border-b border-violet-500/40 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-violet-200">Optimized version</p>
                    <p className="text-xs text-violet-300 mt-0.5">AI-generated improvement</p>
                </div>
                <button onClick={() => setShow(!show)} className="text-xs px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                    {show ? 'Hide' : 'Show code'}
                </button>
            </div>
            {show && (
                <div className="relative">
                    <pre className="text-xs bg-zinc-950 text-zinc-200 border-t border-zinc-700 p-4 overflow-x-auto font-mono leading-relaxed">{code}</pre>
                    <button onClick={copy} className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors">
                        {copied ? '✓' : 'Copy'}
                    </button>
                </div>
            )}
        </div>
    )
}

// ─── Bug card ─────────────────────────────────────────────────────────────────
function BugCard({ bug }) {
    return (
        <div className="border border-red-500/40 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/40">
                <p className="text-sm font-medium text-red-300">Bug found</p>
            </div>
            <div className="px-4 py-3 space-y-2">
                <div>
                    <p className="text-xs text-zinc-400 mb-1">Line</p>
                    <code className="text-xs bg-zinc-900 px-2 py-1 rounded font-mono text-zinc-200 border border-zinc-700">{bug.line}</code>
                </div>
                <div>
                    <p className="text-xs text-zinc-400 mb-1">Issue</p>
                    <p className="text-sm text-zinc-200">{bug.issue}</p>
                </div>
                {bug.fix && bug.fix !== 'N/A' && (
                    <div>
                        <p className="text-xs text-zinc-400 mb-1">Fix</p>
                        <code className="text-xs bg-green-500/10 border border-green-500/40 px-2 py-1 rounded font-mono text-green-300">{bug.fix}</code>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AnalyzeV2() {
    const [code, setCode]         = useState('')
    const [inputVal, setInputVal] = useState('')
    const [result, setResult]     = useState(null)
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')
    const [competitive, setCompetitive] = useState(false)

    const parseInput = (raw) => {
        if (!raw.trim()) return [5, 3, 8, 1, 9, 2]
        try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [p] }
        catch { return raw.split(',').map(s => Number(s.trim())).filter(v => !isNaN(v)) }
    }

    const handleAnalyze = async () => {
        if (!code.trim()) return
        setLoading(true)
        setResult(null)
        setError('')
        try {
            const res = await analyzeV2Code({ code, language: 'java', input: parseInput(inputVal) })
            setResult(res.data.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Check your code and try again.')
        } finally {
            setLoading(false)
        }
    }

    const realBugs = result?.bugs?.filter(b => b.fix && b.fix !== 'N/A') || []

    return (
        <div className="flex h-screen overflow-hidden bg-[#090f1f] text-zinc-100">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6 pt-20">
                <div className="max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-zinc-100">Code Analyzer</h1>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-200 border border-violet-500/60">v2</span>
                            </div>
                            <p className="text-sm text-zinc-400">Write your algorithm — we'll run it, measure it, and tell you exactly how to improve it</p>
                        </div>

                        {/* Competitive mode toggle — fixed UI */}
                        <button
                            onClick={() => setCompetitive(!competitive)}
                            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                                competitive
                                    ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                                        : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-violet-500/80 hover:text-violet-200'
                            }`}
                        >
                            <span>{competitive ? '⚔️' : '🎯'}</span>
                            <span>Competitive mode</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${competitive ? 'bg-white' : 'bg-zinc-300'}`} />
                        </button>
                    </div>

                    {/* Competitive mode banner */}
                    {competitive && (
                        <div className="mb-5 p-3 bg-violet-500/15 border border-violet-500/50 rounded-xl flex items-center gap-3">
                            <span className="text-sm">⚔️</span>
                            <p className="text-sm text-violet-200">Competitive mode on — suggestions and optimized code are hidden. You get one hint.</p>
                        </div>
                    )}

                    {/* Editor */}
                    <div className="mb-5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2 block">Your code</label>
                        <CodeEditor value={code} onChange={setCode} />
                    </div>

                    {/* Input + Analyze */}
                    {!result && (
                        <div className="flex gap-3 mb-8 items-end">
                            <div className="flex-1">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2 block">
                                    Test input <span className="normal-case text-zinc-500">(comma-separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                                    placeholder="5, 3, 8, 1, 9, 2"
                                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-200 outline-none focus:border-violet-400 transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={!code.trim() || loading}
                                className="px-6 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                            >
                                {loading ? 'Running...' : 'Run & Analyze'}
                            </button>
                        </div>
                    )}

                    {/* Action buttons */}
                    {result && (
                        <div className="flex gap-3 mb-6">
                            <button onClick={() => { setResult(null); setError('') }} className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors">
                                ← New code
                            </button>
                            <button onClick={handleAnalyze} disabled={loading} className="px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/60 text-sm text-violet-200 hover:bg-violet-500/25 transition-colors">
                                ↺ Re-run
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-red-300 text-sm mb-6 p-3 bg-red-500/10 border border-red-500/40 rounded-lg">{error}</p>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-700">
                                <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin shrink-0" />
                                <div>
                                    <p className="text-sm text-zinc-200 font-medium">Running your code...</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">Executing → measuring → analyzing</p>
                                </div>
                            </div>
                            <div className="animate-pulse space-y-2">
                                <div className="h-14 bg-zinc-800 rounded-xl" />
                                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                <div className="h-4 bg-zinc-800 rounded w-1/2" />
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {result && !loading && (
                        <>
                            <ExecutionStats execution={result.execution} />

                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-zinc-100">{result.algorithm}</h2>
                            </div>

                            <div className="flex gap-3 mb-6 flex-wrap">
                                {result.time_complexity  && <ComplexityBadge label="Time"  value={result.time_complexity.value} />}
                                {result.space_complexity && <ComplexityBadge label="Space" value={result.space_complexity.value} />}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                {result.time_complexity?.explanation && (
                                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                                        <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Why {result.time_complexity.value}</p>
                                        <p className="text-sm text-zinc-300">{result.time_complexity.explanation}</p>
                                    </div>
                                )}
                                {result.space_complexity?.explanation && (
                                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                                        <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Why {result.space_complexity.value}</p>
                                        <p className="text-sm text-zinc-300">{result.space_complexity.explanation}</p>
                                    </div>
                                )}
                            </div>

                            {/* Bugs — always show */}
                            {realBugs.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Bugs found</p>
                                    <div className="space-y-3">
                                        {realBugs.map((bug, i) => <BugCard key={i} bug={bug} />)}
                                    </div>
                                </div>
                            )}

                            {/* Competitive hint — only in competitive mode */}
                            {competitive && result.competitive_hint && (
                                <div className="mb-6 p-4 bg-violet-500/15 border border-violet-500/50 rounded-xl">
                                    <p className="text-xs font-medium text-violet-300 uppercase tracking-wide mb-2">Your hint</p>
                                    <p className="text-sm text-violet-200">{result.competitive_hint}</p>
                                </div>
                            )}

                            {/* Suggestions — hidden in competitive mode */}
                            {!competitive && result.suggestions?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Suggestions</p>
                                    <div className="space-y-3">
                                        {result.suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
                                    </div>
                                </div>
                            )}

                            {/* Optimized code — hidden in competitive mode */}
                            {!competitive && result.optimized_code && (
                                <div className="mb-6">
                                    <OptimizedCode code={result.optimized_code} />
                                </div>
                            )}

                            {/* Give up button — competitive mode only */}
                            {competitive && (
                                <button
                                    onClick={() => setCompetitive(false)}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-zinc-700 text-sm text-zinc-400 hover:border-violet-500/80 hover:text-violet-300 transition-colors mb-6"
                                >
                                    Give up - show me the solution
                                </button>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
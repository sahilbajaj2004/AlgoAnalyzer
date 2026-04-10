import { useState, useEffect } from 'react'
import { getAlgorithmCode, getAllAlgorithms } from '../api/index'
import Sidebar from '../components/Sidebar'
import ComplexityBadge from '../components/ComplexityBadge'
import CodePanel from '../components/CodePanel'
import Controls from '../components/Controls'
import useVisualizer from '../hooks/useVisualizer'
import useUrlState from '../hooks/useUrlState'
import VISUALIZER_MAP from '../components/visualizers'
import AlgoInput from '../components/AlgoInput'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'

function ShareButton({ onShare }) {
    const [copied, setCopied] = useState(false)

    const handleClick = async () => {
        const ok = await onShare()
        if (ok) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
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

function Home() {
    const [selectedAlgo, setSelectedAlgo] = useState(null)
    const [algorithms, setAlgorithms] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const visualizer = useVisualizer()
    const urlState = useUrlState()
    const { isDark } = useTheme()
    const [highlightMap, setHighlightMap] = useState(null)
    const [lastInput, setLastInput] = useState(null)
    const VisualizerComponent = selectedAlgo
        ? (VISUALIZER_MAP[selectedAlgo.slug] || VISUALIZER_MAP[selectedAlgo.category])
        : null

    // Load algorithms list
    useEffect(() => {
        getAllAlgorithms()
            .then(res => {
                const algos = res.data.data
                setAlgorithms(algos)

                // Restore from URL on first load
                const urlSlug = urlState.getAlgoSlug()
                if (urlSlug && algos.length > 0) {
                    const found = algos.find(a => a.slug === urlSlug)
                    if (found) {
                        setSelectedAlgo(found)
                        const urlInput = urlState.getInput()
                        if (urlInput) {
                            setLastInput(urlInput)
                            visualizer.generate(found.slug, urlInput)
                        }
                    }
                }
            })
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        if (!selectedAlgo) return
        getAlgorithmCode(selectedAlgo.slug, 'java')
            .then(res => setHighlightMap(res.data.data.highlight_map))
    }, [selectedAlgo])

    const handleSelect = (algo) => {
        setSelectedAlgo(algo)
        visualizer.clear()
        setSidebarOpen(false)
        urlState.setUrlState({ algo: algo.slug, input: null, step: null })
    }

    const handleVisualize = (input) => {
        setLastInput(input)
        visualizer.generate(selectedAlgo.slug, input)
        urlState.setUrlState({ algo: selectedAlgo.slug, input })
    }

    const handleShare = () => {
        if (selectedAlgo) {
            urlState.setUrlState({
                algo: selectedAlgo.slug,
                input: lastInput,
                step: visualizer.currentStep,
            })
        }
        return urlState.copyShareUrl()
    }

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

            <Navbar onMenuClick={() => setSidebarOpen(true)} />

            {/* Sidebar overlay backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 backdrop-blur-sm"
                    style={{ background: 'var(--bg-overlay)' }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onSelect={handleSelect} selectedSlug={selectedAlgo?.slug} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <main
                className="flex-1 overflow-y-auto p-4 sm:p-6 pt-20"
                style={{
                    background: isDark
                        ? 'linear-gradient(to bottom, #090f1f, #0f172a)'
                        : 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                }}
            >
                {!selectedAlgo ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4">
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-secondary)' }}>No algorithm selected</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Open the menu to pick an algorithm</p>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                                background: 'var(--accent-bg-light)',
                                color: 'var(--accent-text)',
                                border: '1px solid var(--accent)',
                            }}
                        >
                            ☰ Browse Algorithms
                        </button>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">

                        {/* Title + Description + Share */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedAlgo.name}</h1>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{selectedAlgo.description}</p>
                            </div>
                            <ShareButton onShare={handleShare} />
                        </div>

                        {/* Complexity Badges — horizontal scroll on mobile */}
                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
                            <ComplexityBadge label="Best" value={selectedAlgo.time_best} />
                            <ComplexityBadge label="Average" value={selectedAlgo.time_avg} />
                            <ComplexityBadge label="Worst" value={selectedAlgo.time_worst} />
                            <ComplexityBadge label="Space" value={selectedAlgo.space_complexity} />
                        </div>

                        {/* Input + Visualize */}
                        <AlgoInput
                            category={selectedAlgo.category}
                            slug={selectedAlgo.slug}
                            onVisualize={handleVisualize}
                        />

                        {/* Error */}
                        {visualizer.error && (
                            <p className="text-red-400 text-sm mb-4">{visualizer.error}</p>
                        )}

                        {VisualizerComponent && (
                            <VisualizerComponent step={visualizer.step} slug={selectedAlgo.slug} />
                        )}
                        {/* Controls */}
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

                        {/* Code Panel */}
                        <CodePanel
                            slug={selectedAlgo.slug}
                            currentStep={visualizer.step}
                            highlightMap={highlightMap}
                        />

                    </div>
                )}
            </main>
        </div>
    )
}

export default Home
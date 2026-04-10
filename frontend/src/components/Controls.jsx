const SPEED_LABELS = { 1200: '0.5×', 900: '0.75×', 600: '1×', 400: '1.5×', 200: '2×', 100: '3×' }

function Controls({ onPrev, onNext, onPlay, onReset, currentStep, totalSteps, isPlaying, speed, onSpeedChange }) {
  const pct = totalSteps > 1 ? ((currentStep) / (totalSteps - 1)) * 100 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>

      {/* Step Progress Bar */}
      <div style={{ position: 'relative', height: 6, background: 'var(--border-light)', borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
            borderRadius: 999,
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      {/* Controls row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 14px',
        background: 'var(--bg-tertiary)',
        border: '0.5px solid var(--border)',
        borderRadius: 12, width: 'fit-content',
        flexWrap: 'wrap',
        maxWidth: '100%',
      }}>

        <button onClick={onReset} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
          borderRadius: 8, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
          border: '0.5px solid var(--btn-border)', background: 'var(--btn-bg)', color: 'var(--btn-text)',
          transition: 'all 0.12s', fontWeight: 400,
        }}>
          ↺ Reset
        </button>

        <div style={{ width: 0.5, height: 20, background: 'var(--border)', margin: '0 2px' }} />

        <button onClick={onPrev} disabled={currentStep === 0} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
          borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
          border: '0.5px solid var(--btn-border)', background: 'var(--btn-bg)', color: 'var(--btn-text)',
          transition: 'all 0.12s', fontWeight: 400,
          opacity: currentStep === 0 ? 0.3 : 1,
          cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
        }}>
          ← Prev
        </button>

        <button
          onClick={onPlay}
          disabled={isPlaying || currentStep === totalSteps - 1}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
            borderRadius: 8, fontSize: 13, fontFamily: 'inherit', fontWeight: 500,
            border: '0.5px solid var(--accent)',
            background: isPlaying ? 'var(--accent-bg)' : 'var(--accent)',
            color: 'var(--accent-text)',
            transition: 'all 0.12s',
            opacity: (isPlaying || currentStep === totalSteps - 1) ? 0.3 : 1,
            cursor: (isPlaying || currentStep === totalSteps - 1) ? 'not-allowed' : 'pointer',
          }}
        >
          {isPlaying ? '● Playing...' : '▶ Play'}
        </button>

        <button onClick={onNext} disabled={currentStep === totalSteps - 1} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
          borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
          border: '0.5px solid var(--btn-border)', background: 'var(--btn-bg)', color: 'var(--btn-text)',
          transition: 'all 0.12s', fontWeight: 400,
          opacity: currentStep === totalSteps - 1 ? 0.3 : 1,
          cursor: currentStep === totalSteps - 1 ? 'not-allowed' : 'pointer',
        }}>
          Next →
        </button>

        <div style={{ width: 0.5, height: 20, background: 'var(--border)', margin: '0 2px' }} />

        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4, whiteSpace: 'nowrap' }}>
          Step <b style={{ color: 'var(--accent-text-2)', fontWeight: 500 }}>{currentStep + 1}</b> / <b style={{ color: 'var(--accent-text-2)', fontWeight: 500 }}>{totalSteps}</b>
        </span>

        {/* Completion badge */}
        <span style={{
          fontSize: 11, fontWeight: 500, fontFamily: 'monospace',
          padding: '2px 8px', borderRadius: 6, marginLeft: 4,
          background: pct >= 100 ? 'var(--success-bg)' : 'var(--accent-bg)',
          color: pct >= 100 ? 'var(--success-text)' : 'var(--accent-light)',
          border: `0.5px solid ${pct >= 100 ? 'var(--success-border)' : 'var(--accent-hover)'}`,
        }}>
          {Math.round(pct)}%
        </span>

        {/* Speed control */}
        {onSpeedChange && (
          <>
            <div style={{ width: 0.5, height: 20, background: 'var(--border)', margin: '0 6px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-dimmed)', whiteSpace: 'nowrap' }}>Speed</span>
              <input
                type="range"
                min={100}
                max={1200}
                step={100}
                value={1300 - speed}
                onChange={e => onSpeedChange(1300 - Number(e.target.value))}
                style={{
                  width: 80, height: 4, cursor: 'pointer',
                  accentColor: '#8b5cf6',
                }}
              />
              <span style={{
                fontSize: 11, fontWeight: 500, fontFamily: 'monospace',
                color: 'var(--accent-text-2)', minWidth: 32, textAlign: 'center',
              }}>
                {SPEED_LABELS[speed] || `${(600 / speed).toFixed(1)}×`}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Controls
import { useState, useEffect, useRef } from "react"
import { getAlgorithmCode } from "../api"

const LANGS = ['java', 'cpp']

function CodePanel({ slug, currentStep }) {
  const [lang, setLang] = useState('java')
  const [codeData, setCodeData] = useState(null)
  const activeLineRef = useRef(null)

  useEffect(() => {
    if (!slug) return

    getAlgorithmCode(slug, lang)
      .then(res => setCodeData(res.data.data))
      .catch(err => {
        console.error(err)
        setCodeData({ code: '', highlight_map: {} })
      })
  }, [slug, lang])

  const loading = Boolean(slug) && codeData === null

  const lines = codeData?.code?.split('\n') || []
  const highlighted = codeData?.highlight_map?.[currentStep?.action] || []

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [highlighted])

  return (
    <div style={{
      background: 'var(--code-bg)',
      border: '0.5px solid var(--code-border)',
      borderRadius: 12, overflow: 'hidden', fontFamily: 'sans-serif',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '0.5px solid var(--border-light)',
        background: 'var(--bg-tertiary)', flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Code</span>
          {currentStep?.label && (
            <span style={{
              fontSize: 11,
              background: 'var(--accent-bg)',
              color: 'var(--accent-text)',
              padding: '3px 10px', borderRadius: 999, fontWeight: 500,
            }}>
              {currentStep.label}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {LANGS.map(l => {
            const active = lang === l
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace', cursor: 'pointer',
                  border: `0.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-bg)' : 'var(--btn-bg)',
                  color: active ? 'var(--accent-text)' : 'var(--text-muted)',
                  fontWeight: active ? 500 : 400,
                  transition: 'all 0.12s',
                }}
              >
                {l}
              </button>
            )
          })}
        </div>
      </div>


      {/* Code body */}
      <div style={{ padding: '12px 0', overflowX: 'auto', overflowY: 'auto', maxHeight: '400px', background: 'var(--code-bg)' }}>
        {loading ? (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ height: 18, background: 'var(--border-light)', borderRadius: 4, width: `${60 + (i % 4) * 10}%` }} />
            ))}
          </div>
        ) : (
          lines.map((line, idx) => {
            const lineNum = idx + 1
            const isLit = highlighted.includes(lineNum)
            return (
              <div
                key={idx}
                ref={isLit ? activeLineRef : null}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: 16,
                  padding: isLit ? '1px 16px 1px 14px' : '1px 16px',
                  background: isLit ? 'var(--code-line-bg)' : 'transparent',
                  borderLeft: isLit ? '2px solid var(--code-line-border)' : '2px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{
                  fontSize: 12, fontFamily: 'monospace',
                  color: isLit ? 'var(--accent-text-2)' : 'var(--text-dimmed)',
                  width: 20, textAlign: 'right', flexShrink: 0, userSelect: 'none',
                }}>
                  {lineNum}
                </span>
                <span style={{
                  fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre',
                  color: isLit ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontWeight: isLit ? 500 : 400,
                }}>
                  {line}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default CodePanel
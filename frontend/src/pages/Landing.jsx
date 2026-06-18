import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DISPLAY = "'Bricolage Grotesque','Outfit',sans-serif"

const ALGORITHMS = [
  { label: 'Bubble Sort',    cat: 'Sorting',     color: 'violet'  },
  { label: 'Selection Sort', cat: 'Sorting',     color: 'violet'  },
  { label: 'Insertion Sort', cat: 'Sorting',     color: 'violet'  },
  { label: 'Binary Search',  cat: 'Searching',   color: 'blue'    },
  { label: 'Linear Search',  cat: 'Searching',   color: 'blue'    },
  { label: 'Stack Push',     cat: 'Stack',       color: 'emerald' },
  { label: 'Stack Pop',      cat: 'Stack',       color: 'emerald' },
  { label: 'Stack Peek',     cat: 'Stack',       color: 'emerald' },
  { label: 'LL Traversal',   cat: 'Linked List', color: 'orange'  },
  { label: 'LL Insert Head', cat: 'Linked List', color: 'orange'  },
  { label: 'LL Insert Tail', cat: 'Linked List', color: 'orange'  },
  { label: 'LL Delete Node', cat: 'Linked List', color: 'orange'  },
]

const COLOR_MAP_DARK = {
  violet:  { bg: '#24153f', border: '#4c1d95', text: '#c4b5fd', dot: '#a78bfa' },
  blue:    { bg: '#10243d', border: '#1d4ed8', text: '#93c5fd', dot: '#60a5fa' },
  emerald: { bg: '#0f2d28', border: '#047857', text: '#6ee7b7', dot: '#34d399' },
  orange:  { bg: '#3a2611', border: '#c2410c', text: '#fdba74', dot: '#fb923c' },
}
const COLOR_MAP_LIGHT = {
  violet:  { bg: '#f5f3ff', border: '#c4b5fd', text: '#6d28d9', dot: '#7c3aed' },
  blue:    { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', dot: '#3b82f6' },
  emerald: { bg: '#ecfdf5', border: '#6ee7b7', text: '#047857', dot: '#10b981' },
  orange:  { bg: '#fff7ed', border: '#fdba74', text: '#c2410c', dot: '#f97316' },
}

/* ── Custom line icons (replaces emoji) ───────────────────────────── */
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
const Ico = {
  tree: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="4.5" r="2.2" /><circle cx="6" cy="15" r="2.2" /><circle cx="18" cy="15" r="2.2" />
      <path d="M12 6.7v3.3M12 10l-5 3M12 10l5 3" />
    </svg>
  ),
  graph: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <circle cx="5" cy="6" r="2" /><circle cx="19" cy="8" r="2" /><circle cx="9" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
      <path d="M6.7 7L17.3 7.6M6.4 7.6l2 8.6M10.9 17.6l5.4-0.2M17.6 9.8l-7 6.4" />
    </svg>
  ),
  code: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M9 9l-2.5 3L9 15M15 9l2.5 3L15 15" />
    </svg>
  ),
  race: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M5 4v16" /><path d="M5 5h12l-2 3 2 3H5" /><path d="M9 5v6M13 5.5v6" />
    </svg>
  ),
  random: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none" /><circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none" /><circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  theme: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3a9 9 0 109 9 7 7 0 01-9-9z" />
    </svg>
  ),
}

const COMING_SOON = [
  { icon: Ico.tree,   title: 'Trees',           desc: 'BST insert, delete, search. Inorder, preorder, postorder traversals with pointer animation.' },
  { icon: Ico.graph,  title: 'Graphs',          desc: 'BFS and DFS with live node coloring, queue/stack state, and visited tracking.' },
  { icon: Ico.code,   title: 'Paste Your Code', desc: 'Paste any sorting or searching function and watch AlgoAnalyzer generate a visualization automatically.' },
  { icon: Ico.race,   title: 'Race Mode',       desc: 'Run multiple algorithms on the same input simultaneously and watch them compete in real time.' },
  { icon: Ico.random, title: 'Random Input',    desc: 'One-click random array generator with size and range controls.' },
  { icon: Ico.theme,  title: 'Light / Dark',    desc: 'Toggle between dark and light themes across all visualizers, code panels, and pages.' },
]

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="8" height="8" rx="2" fill="#8b5cf6" opacity="0.2"/>
        <rect x="2" y="2" width="8" height="8" rx="2" stroke="#8b5cf6" strokeWidth="1.5"/>
        <path d="M6 5.5v3M7.5 7H4.5" stroke="#8b5cf6" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="12" y="2" width="8" height="8" rx="2" fill="#8b5cf6" opacity="0.08"/>
        <rect x="12" y="2" width="8" height="8" rx="2" stroke="#c4b5fd" strokeWidth="1.5"/>
        <rect x="2" y="12" width="8" height="8" rx="2" fill="#8b5cf6" opacity="0.08"/>
        <rect x="2" y="12" width="8" height="8" rx="2" stroke="#c4b5fd" strokeWidth="1.5"/>
        <rect x="12" y="12" width="8" height="8" rx="2" fill="#8b5cf6" opacity="0.08"/>
        <rect x="12" y="12" width="8" height="8" rx="2" stroke="#c4b5fd" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Step by Step',
    desc: 'Go forward, backward, or auto-play through every operation at your own pace.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="3" width="18" height="14" rx="2.5" stroke="#10b981" strokeWidth="1.5"/>
        <path d="M6 8h4M6 11h6M6 14h3" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
        <rect x="11" y="7" width="7" height="2.5" rx="1" fill="#10b981" opacity="0.25"/>
        <rect x="11" y="11" width="5" height="2.5" rx="1" fill="#10b981" opacity="0.5"/>
        <path d="M5 19h12" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    title: 'Live Code Sync',
    desc: 'Watch the exact line highlight as each step executes — in Java and C++.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="1" y="4" width="9" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="12" y="4" width="9" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5"/>
        <path d="M5 8h1M5 11h3M5 14h2" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M16 8h1M16 11h3M16 14h2" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: 'Compare Side by Side',
    desc: 'Run two algorithms on the same input and watch them work simultaneously.',
  },
]

const STATS = [
  { to: 12, suffix: '+', label: 'Algorithms', color: '#7c3aed' },
  { to: 4,  suffix: '',  label: 'Categories', color: '#10b981' },
  { to: 2,  suffix: '',  label: 'Languages',  color: '#3b82f6' },
]

/* ── Small brand glyph that sits beside section headings ──────────── */
function BarsMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="1"  y="7"  width="3.4" height="9"  rx="1.2" fill="#7c3aed" opacity="0.55" />
      <rect x="7"  y="2"  width="3.4" height="14" rx="1.2" fill="#7c3aed" />
      <rect x="13" y="9"  width="3.4" height="7"  rx="1.2" fill="#7c3aed" opacity="0.4" />
    </svg>
  )
}

/* ── Count-up stat (renders final value by default; animates in view) */
function Stat({ to, suffix, label, color, reduced }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return
    const obj = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: node, start: 'top 92%', once: true,
      onEnter: () => gsap.to(obj, {
        v: to, duration: 1.1, ease: 'power2.out',
        onUpdate: () => { node.textContent = Math.round(obj.v) + suffix },
      }),
    })
    return () => st.kill()
  }, [to, suffix, reduced])
  return (
    <div>
      <div ref={ref} style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 800, color, letterSpacing: '-0.03em', fontFamily: DISPLAY }}>
        {to}{suffix}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

/* ── Animated SVG graphic ─────────────────────────────────────────── */
function HeroGraphic({ reduced }) {
  const svgRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.bar-el', { scaleY: 0, transformOrigin: 'bottom', duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 0.4 })
      gsap.from('.line-el', { strokeDashoffset: 200, duration: 1, ease: 'power2.out', stagger: 0.1, delay: 0.6 })
      gsap.from('.node-el', { scale: 0, transformOrigin: 'center', duration: 0.5, ease: 'back.out(2)', stagger: 0.08, delay: 0.7 })
      gsap.to('.node-el', { y: -5, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.25, from: 'random' } })
      gsap.to('.bar-active', { opacity: 0.45, duration: 0.6, ease: 'power1.inOut', yoyo: true, repeat: -1, repeatDelay: 0.3 })
    }, svgRef)
    return () => ctx.revert()
  }, [reduced])

  const bars = [55, 28, 88, 42, 72, 52, 78, 33]
  const gridLine = isDark ? '#334155' : '#e2e8f0'
  const barColor = isDark ? '#c4b5fd' : '#a78bfa'
  const labelColor = isDark ? '#94a3b8' : '#64748b'

  return (
    <svg ref={svgRef} viewBox="0 0 300 220" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 380 }}>
      {[0,1,2,3].map(i => (
        <line key={i} x1="16" y1={38+i*42} x2="284" y2={38+i*42} stroke={gridLine} strokeWidth="0.6" strokeDasharray="4 4" />
      ))}
      {bars.map((h, i) => (
        <rect key={i} className={`bar-el${i===2||i===4?' bar-active':''}`}
          x={20+i*32} y={172-h} width={24} height={h} rx={5}
          fill={i===2||i===4 ? '#7c3aed' : barColor} opacity={i===2||i===4 ? 1 : 0.55} />
      ))}
      {[[62,28,140,16],[140,16,218,28],[140,16,140,50],[218,28,258,52]].map(([x1,y1,x2,y2],i) => (
        <line key={i} className="line-el" x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={barColor} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="0" />
      ))}
      {[[62,28,'#8b5cf6',7],[140,16,'#7c3aed',10],[218,28,'#8b5cf6',7],[140,50,'#a78bfa',6],[258,52,'#ddd6fe',5]].map(([cx,cy,f,r],i) => (
        <circle key={i} className="node-el" cx={cx} cy={cy} r={r} fill={f} />
      ))}
      <text x="150" y="210" textAnchor="middle" fontSize="10" fill={labelColor} fontFamily="monospace">bubble sort · step 4 of 12</text>
    </svg>
  )
}

/* ── Section heading (brand glyph + title + lead) — no eyebrow ─────── */
function SectionHead({ title, lead, accent }) {
  return (
    <div className="reveal" style={{ marginBottom: 48, maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <BarsMark />
        <h2 style={{
          fontSize: 'clamp(24px,3.4vw,34px)', fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: DISPLAY, letterSpacing: '-0.025em', margin: 0, textWrap: 'balance',
        }}>{title}</h2>
      </div>
      {lead && (
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 12, marginBottom: 0, textWrap: 'pretty' }}>
          {lead} {accent && <span style={{ color: '#a78bfa', fontWeight: 600 }}>{accent}</span>}
        </p>
      )}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────── */
function Landing() {
  const navigate = useNavigate()
  const pageRef  = useRef(null)
  const { isDark } = useTheme()
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Hero entrance
        gsap.from('.hero-stagger', { opacity: 0, y: 26, duration: 0.6, ease: 'power3.out', stagger: 0.09, delay: 0.1 })
        // Hero underline draws in
        gsap.fromTo('.underline-draw',
          { strokeDashoffset: 240 },
          { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', delay: 0.7 })

        // Base fade-up for section heads
        gsap.utils.toArray('.reveal').forEach(el => {
          gsap.from(el, {
            opacity: 0, y: 28, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          })
        })

        // Feature cards — staggered lift
        gsap.from('.feature-card', {
          opacity: 0, y: 34, duration: 0.55, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.feature-grid', start: 'top 82%', once: true },
        })

        // Algorithm chips — pop per group
        gsap.utils.toArray('.algo-group').forEach(group => {
          gsap.from(group.querySelectorAll('.algo-chip'), {
            opacity: 0, y: 12, scale: 0.94, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.04,
            scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          })
        })

        // Roadmap items
        gsap.from('.roadmap-item', {
          opacity: 0, y: 24, duration: 0.5, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: '.roadmap-grid', start: 'top 84%', once: true },
        })

        // CTA panel
        gsap.from('.cta-panel', {
          opacity: 0, scale: 0.96, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.cta-panel', start: 'top 88%', once: true },
        })

        // Slow drifting glow behind hero
        gsap.to('.hero-glow', { x: 30, y: -20, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const COLOR_MAP = isDark ? COLOR_MAP_DARK : COLOR_MAP_LIGHT

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: "'Outfit','Segoe UI',sans-serif" }}>
      <Navbar theme={isDark ? 'dark' : 'light'} />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
        minHeight: 'calc(100svh - 88px)', alignItems: 'center',
        marginTop: 88, /* clears fixed announcement (24) + navbar (~64) */
      }}>
        {/* Backdrop: dot grid + drifting glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(${isDark ? 'rgba(148,163,184,0.10)' : 'rgba(100,116,139,0.12)'} 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 30% 40%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 30% 40%, #000 30%, transparent 80%)',
        }} />
        <div className="hero-glow" aria-hidden="true" style={{
          position: 'absolute', top: '-6%', left: '12%', width: 520, height: 520, borderRadius: '50%',
          background: isDark ? 'radial-gradient(circle, rgba(124,58,237,0.28), transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.14), transparent 70%)',
          filter: 'blur(56px)', pointerEvents: 'none',
        }} />

        {/* Left */}
        <div style={{ position: 'relative', padding: 'clamp(32px, 5vw, 64px) clamp(20px, 5vw, 72px)' }}>
          <div className="hero-stagger" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px', borderRadius: 20,
            background: isDark ? '#0f2d28' : '#ecfdf5',
            border: `1px solid ${isDark ? '#047857' : '#6ee7b7'}`,
            fontSize: 12, fontWeight: 600, color: isDark ? '#6ee7b7' : '#047857',
            letterSpacing: '0.04em', marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? '#34d399' : '#10b981', animation: reduced ? 'none' : 'livePulse 1.8s ease-in-out infinite' }} />
            Learn algorithms visually
          </div>

          <h1 className="hero-stagger" style={{
            fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.02,
            letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 24, fontFamily: DISPLAY,
            textWrap: 'balance',
          }}>
            Understand algorithms,{' '}
            <span style={{ position: 'relative', color: '#7c3aed', whiteSpace: 'nowrap' }}>
              step by step
              <svg style={{ position: 'absolute', left: 0, bottom: '-0.16em', width: '100%', height: '0.3em', overflow: 'visible' }}
                viewBox="0 0 240 16" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path className="underline-draw" d="M3 11 C 60 4, 120 4, 178 9 S 232 13, 237 7"
                  stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" strokeDasharray="240" strokeDashoffset="0" />
              </svg>
            </span>
          </h1>

          <p className="hero-stagger" style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 36, maxWidth: 460 }}>
            Watch sorting, searching, stacks and linked lists come to life — with the exact line of
            code highlighted at every step.
          </p>

          <div className="hero-stagger" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/visualize')}
              style={{
                padding: '13px 28px', borderRadius: 12, background: '#7c3aed', color: '#fff',
                fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 18px rgba(124,58,237,0.32)', transition: 'transform 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(124,58,237,0.46)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 18px rgba(124,58,237,0.32)' }}
            >
              Start Visualizing →
            </button>
            <button onClick={() => navigate('/compare')}
              style={{
                padding: '13px 24px', borderRadius: 12,
                background: isDark ? '#111827' : '#f8fafc', color: 'var(--text-secondary)',
                fontSize: 15, fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#a78bfa'; e.currentTarget.style.color='#7c3aed'; e.currentTarget.style.background=isDark?'#1e1b4b':'#f5f3ff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.background=isDark?'#111827':'#f8fafc' }}
            >
              Compare Algorithms
            </button>
          </div>

          <div className="hero-stagger" style={{ display: 'flex', gap: 'clamp(24px,5vw,44px)', marginTop: 48, flexWrap: 'wrap' }}>
            {STATS.map(s => <Stat key={s.label} {...s} reduced={reduced} />)}
          </div>
        </div>

        {/* Right */}
        <div style={{
          position: 'relative', alignSelf: 'stretch',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(32px, 5vw, 72px) clamp(20px, 5vw, 72px)',
          background: isDark
            ? 'linear-gradient(140deg,#111827 0%,#1e1b4b 55%,#0f172a 100%)'
            : 'linear-gradient(140deg,#f8fafc 0%,#ede9fe 55%,#f1f5f9 100%)',
          minHeight: 'min(50vh, 420px)',
        }}>
          <div className="hero-stagger" style={{
            background: isDark ? '#0f172a' : '#ffffff', borderRadius: 28, padding: '34px 30px',
            boxShadow: isDark ? '0 24px 64px rgba(2,6,23,0.6),0 1px 3px rgba(0,0,0,0.45)' : '0 24px 64px rgba(76,29,149,0.14),0 1px 3px rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, width: '100%', maxWidth: 440,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:600, color:'#7c3aed' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#7c3aed', display:'inline-block', animation: reduced ? 'none' : 'livePulse 1.8s ease-in-out infinite' }} />
                Live Preview
              </div>
              <div style={{ display:'flex', gap:5 }}>
                {['#fb7185','#fbbf24','#34d399'].map(c => <span key={c} style={{ width:9, height:9, borderRadius:'50%', background:c, opacity:0.7 }} />)}
              </div>
            </div>
            <HeroGraphic reduced={reduced} />
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 104px) 24px', background: isDark ? '#0b1220' : '#ffffff' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <SectionHead
            title="Everything you need to truly understand algorithms"
            lead="Built for the moment a concept finally clicks —"
            accent="not just to memorize it."
          />
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {FEATURES.map(({ icon, title, desc }, i) => (
              <div key={title} className="feature-card" style={{
                padding: '30px 26px', borderRadius: 18, border: '1px solid var(--border)',
                background: isDark ? '#0f172a' : '#f8fafc', transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 14px 36px rgba(124,58,237,0.12)'; e.currentTarget.style.borderColor = isDark ? '#4c1d95' : '#c4b5fd' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: isDark ? '#0b1220' : '#ffffff',
                    border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0,
                  }}>{icon}</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dimmed)', fontFamily: DISPLAY, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 18, marginBottom: 8, fontFamily: DISPLAY, letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALGORITHMS ───────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(56px, 8vw, 104px) 24px',
        background: isDark ? 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)' : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
      }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <SectionHead
            title="What you can explore today"
            lead="Twelve algorithms across four categories, with more landing every week."
          />
          {['Sorting','Searching','Stack','Linked List'].map(cat => {
            const group = ALGORITHMS.filter(a => a.cat === cat)
            const c = COLOR_MAP[group[0].color]
            return (
              <div key={cat} className="algo-group" style={{ marginBottom: 22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <span style={{
                    fontSize:12, fontWeight:700, color: c.text, background: c.bg, border:`1px solid ${c.border}`,
                    padding:'3px 11px', borderRadius:20,
                  }}>{cat}</span>
                  <div style={{ flex:1, height:1, background:'var(--border)' }} />
                  <span style={{ fontSize:12, color:'var(--text-dimmed)', fontVariantNumeric:'tabular-nums' }}>{group.length}</span>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {group.map(({ label, color }) => {
                    const col = COLOR_MAP[color]
                    return (
                      <div key={label} className="algo-chip"
                        onClick={() => navigate('/visualize')}
                        style={{
                          display:'inline-flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:10,
                          background: col.bg, border:`1px solid ${col.border}`, color: col.text, fontSize:14, fontWeight:500,
                          cursor:'pointer', transition:'transform 0.14s, box-shadow 0.14s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 4px 14px ${col.dot}40` }}
                        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                      >
                        <span style={{ width:6, height:6, borderRadius:'50%', background:col.dot, flexShrink:0 }} />
                        {label}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 104px) 24px', background: 'var(--bg-primary)', borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <SectionHead
            title="What's coming next"
            lead="AlgoAnalyzer is actively being built. Here's what's on the horizon."
          />
          <div className="roadmap-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            {COMING_SOON.map(({ icon, title, desc }) => (
              <div key={title} className="roadmap-item" style={{
                display:'flex', gap:16, padding:'22px 20px', borderRadius:16, border:'1px solid var(--border)',
                background: isDark ? '#0f172a' : '#ffffff', transition:'border-color 0.2s, background 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? '#4c1d95' : '#c4b5fd'; e.currentTarget.style.background = isDark ? '#15132e' : '#f5f3ff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = isDark ? '#0f172a' : '#ffffff'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{
                  width:42, height:42, borderRadius:11, background: isDark ? '#1e1b4b' : '#f5f3ff',
                  border:`1px solid ${isDark ? '#4c1d95' : '#e9d5ff'}`, color:'#a78bfa',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>{icon}</div>
                <div>
                  <h3 style={{ fontWeight:700, color:'var(--text-primary)', fontSize:15, marginBottom:5, fontFamily: DISPLAY }}>{title}</h3>
                  <p style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.65, margin:0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(64px,8vw,96px) 24px', background: isDark ? '#0f172a' : '#f8fafc', borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}` }}>
        <div className="cta-panel" style={{
          maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden',
          padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px)', borderRadius: 28,
          background: 'linear-gradient(140deg,#7c3aed 0%,#5b21b6 100%)',
        }}>
          {/* dotted grid overlay instead of decorative blobs */}
          <div aria-hidden="true" style={{
            position:'absolute', inset:0, pointerEvents:'none',
            backgroundImage:'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)', backgroundSize:'22px 22px',
            maskImage:'radial-gradient(ellipse 70% 100% at 50% 0%, #000, transparent 75%)',
            WebkitMaskImage:'radial-gradient(ellipse 70% 100% at 50% 0%, #000, transparent 75%)',
          }} />
          <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: DISPLAY, letterSpacing: '-0.025em', position: 'relative', textWrap: 'balance' }}>
            Ready to see it in motion?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', marginBottom: 32, lineHeight: 1.65, position:'relative' }}>
            Pick an algorithm, enter your input, and watch every step unfold.
          </p>
          <button onClick={() => navigate('/visualize')}
            style={{
              padding: '14px 36px', borderRadius: 12, background: '#fff', color: '#7c3aed',
              fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)', transition: 'transform 0.18s, box-shadow 0.18s', position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(0,0,0,0.26)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.18)' }}
          >
            Start Visualizing →
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`, background: 'var(--bg-primary)' }}>
        <div style={{
          maxWidth: 1040, margin: '0 auto', padding: '44px 24px 28px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: 280, flex: '1 1 220px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'#7c3aed', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="4" width="3" height="8" rx="1" fill="white" opacity="0.8"/>
                  <rect x="5.5" y="2" width="3" height="10" rx="1" fill="white"/>
                  <rect x="10" y="5" width="3" height="7" rx="1" fill="white" opacity="0.6"/>
                </svg>
              </div>
              <span style={{ fontWeight:700, fontSize:16, color:'var(--text-primary)', letterSpacing:'-0.01em', fontFamily: DISPLAY }}>AlgoAnalyzer</span>
            </div>
            <p style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.65, margin:0 }}>
              An algorithm visualizer built to make DSA concepts truly click — step by step.
            </p>
          </div>

          <div>
            <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>Explore</p>
            {[['Visualizer','/visualize'],['Compare','/compare']].map(([label, path]) => (
              <div key={label} onClick={() => navigate(path)}
                style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:8, cursor:'pointer', transition:'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color='#7c3aed'}
                onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}
              >{label}</div>
            ))}
          </div>

          <div style={{ padding:'20px 22px', borderRadius:16, border:'1px solid var(--border)', background: isDark ? '#0f172a' : '#ffffff', minWidth:220, flex: '0 1 auto' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'var(--accent-text-2)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>Developer</p>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{
                width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#10b981)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', flexShrink:0,
              }}>SB</div>
              <div>
                <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:14 }}>Sahil Bajaj</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>Software Developer</div>
              </div>
            </div>
            <a href="https://sahilbajaj.me" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#7c3aed', textDecoration:'none', transition:'gap 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.gap='9px'}
              onMouseLeave={e => e.currentTarget.style.gap='6px'}
            >
              sahilbajaj.me
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        <div style={{
          borderTop:`1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`, padding:'16px 24px',
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8,
        }}>
          <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>
            © {new Date().getFullYear()} AlgoAnalyzer — built to make algorithms click
          </p>
          <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>
            Made with ♥ by{' '}
            <a href="https://sahilbajaj.me" target="_blank" rel="noopener noreferrer" style={{ color:'#7c3aed', textDecoration:'none', fontWeight:600 }}>Sahil Bajaj</a>
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes livePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(1.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-stagger, .reveal, .feature-card, .algo-chip, .roadmap-item, .cta-panel { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  )
}

export default Landing

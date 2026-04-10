import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

const COMING_SOON = [
  { icon: '🌳', title: 'Trees',           desc: 'BST insert, delete, search. Inorder, preorder, postorder traversals with pointer animation.' },
  { icon: '🕸️', title: 'Graphs',          desc: 'BFS and DFS with live node coloring, queue/stack state, and visited tracking.' },
  { icon: '⚡', title: 'Paste Your Code', desc: 'Paste any sorting or searching function and watch AlgoAnalyzer generate a visualization automatically.' },
  { icon: '🏁', title: 'Race Mode',       desc: 'Run multiple algorithms on the same input simultaneously and watch them compete in real time.' },
  { icon: '🎲', title: 'Random Input',    desc: 'One-click random array generator with size and range controls.' },
  { icon: '🌙', title: 'Light/Dark Mode', desc: 'Toggle between dark and light themes across all visualizers, code panels, and pages.' },
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

/* ── Animated SVG graphic ─────────────────────────────────────────── */
function HeroGraphic() {
  const svgRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bar-el', {
        scaleY: 0, transformOrigin: 'bottom',
        duration: 0.9, ease: 'elastic.out(1,0.6)',
        stagger: 0.07, delay: 0.4,
      })
      gsap.from('.line-el', {
        strokeDashoffset: 200,
        duration: 1, ease: 'power2.out',
        stagger: 0.1, delay: 0.6,
      })
      gsap.from('.node-el', {
        scale: 0, transformOrigin: 'center',
        duration: 0.5, ease: 'back.out(2)',
        stagger: 0.08, delay: 0.7,
      })
      gsap.to('.node-el', {
        y: -5, duration: 2, ease: 'sine.inOut',
        yoyo: true, repeat: -1,
        stagger: { each: 0.25, from: 'random' },
      })
      gsap.to('.bar-active', {
        opacity: 0.45, duration: 0.6, ease: 'power1.inOut',
        yoyo: true, repeat: -1, repeatDelay: 0.3,
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])

  const bars = [55, 28, 88, 42, 72, 52, 78, 33]
  const gridLine = isDark ? '#334155' : '#e2e8f0'
  const barColor = isDark ? '#c4b5fd' : '#a78bfa'
  const labelColor = isDark ? '#94a3b8' : '#64748b'

  return (
    <svg ref={svgRef} viewBox="0 0 300 220" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 320 }}>
      {[0,1,2,3].map(i => (
        <line key={i} x1="16" y1={38+i*42} x2="284" y2={38+i*42}
          stroke={gridLine} strokeWidth="0.6" strokeDasharray="4 4" />
      ))}
      {bars.map((h, i) => (
        <rect key={i} className={`bar-el${i===2||i===4?' bar-active':''}`}
          x={20+i*32} y={172-h} width={24} height={h} rx={5}
          fill={i===2||i===4 ? '#7c3aed' : barColor}
          opacity={i===2||i===4 ? 1 : 0.55}
        />
      ))}
      {[[62,28,140,16],[140,16,218,28],[140,16,140,50],[218,28,258,52]].map(([x1,y1,x2,y2],i) => (
        <line key={i} className="line-el"
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={barColor} strokeWidth="1.8" strokeLinecap="round"
          strokeDasharray="200" strokeDashoffset="0"
        />
      ))}
      {[[62,28,'#8b5cf6',7],[140,16,'#7c3aed',10],[218,28,'#8b5cf6',7],[140,50,'#a78bfa',6],[258,52,'#ddd6fe',5]].map(([cx,cy,f,r],i) => (
        <circle key={i} className="node-el" cx={cx} cy={cy} r={r} fill={f} />
      ))}
      <text x="150" y="210" textAnchor="middle" fontSize="10"
        fill={labelColor} fontFamily="monospace">bubble sort - step 4 of 12</text>
    </svg>
  )
}

/* ── Main ─────────────────────────────────────────────────────────── */
function Landing() {
  const navigate = useNavigate()
  const pageRef  = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        opacity: 0, y: 28,
        duration: 0.6, ease: 'power2.out',
        stagger: 0.1, delay: 0.1,
      })
      gsap.utils.toArray('.scroll-reveal').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0,
            duration: 0.55, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        minHeight: 'calc(100vh - 64px)', alignItems: 'center', paddingTop: 64,
      }}>
        {/* Left */}
        <div style={{ padding: 'clamp(32px, 5vw, 64px) clamp(20px, 5vw, 72px)' }}>
          <div className="hero-stagger" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 20,
            background: isDark ? '#0f2d28' : '#ecfdf5',
            border: `1px solid ${isDark ? '#047857' : '#6ee7b7'}`,
            fontSize: 12, fontWeight: 600,
            color: isDark ? '#6ee7b7' : '#047857',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 22,
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background: isDark ? '#34d399' : '#10b981' }} />
            Learn algorithms visually
          </div>

          <h1 className="hero-stagger" style={{
            fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 700,
            lineHeight: 1.13, letterSpacing: '-0.03em',
            color: 'var(--text-primary)', marginBottom: 16,
            fontFamily: "'Bricolage Grotesque','Outfit',sans-serif",
          }}>
            Understand algorithms{' '}
            <span style={{ backgroundImage: 'linear-gradient(90deg,#7c3aed,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              step by step
            </span>
          </h1>

          <p className="hero-stagger" style={{
            fontSize: 16, color: 'var(--text-muted)',
            lineHeight: 1.75, marginBottom: 34, maxWidth: 380,
          }}>
            Watch sorting, searching, stacks and linked lists come to life —
            with live code highlighting at every step.
          </p>

          <div className="hero-stagger" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/visualize')}
              style={{
                padding: '12px 28px', borderRadius: 12,
                background: '#7c3aed', color: '#fff',
                fontSize: 15, fontWeight: 600, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 18px rgba(124,58,237,0.32)',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(124,58,237,0.44)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 18px rgba(124,58,237,0.32)' }}
            >
              Start Visualizing →
            </button>
            <button onClick={() => navigate('/compare')}
              style={{
                padding: '12px 24px', borderRadius: 12,
                background: isDark ? '#111827' : '#f8fafc',
                color: 'var(--text-secondary)',
                fontSize: 15, fontWeight: 600,
                border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#a78bfa'; e.currentTarget.style.color='#7c3aed'; e.currentTarget.style.background=isDark?'#1e1b4b':'#f5f3ff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.background=isDark?'#111827':'#f8fafc' }}
            >
              Compare Algorithms
            </button>
          </div>

          <div className="hero-stagger" style={{ display: 'flex', gap: 32, marginTop: 44, flexWrap: 'wrap' }}>
            {[['12+','Algorithms'],['3','Data Structures'],['2','Languages']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#7c3aed' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(32px, 5vw, 64px) clamp(20px, 5vw, 72px)',
          background: isDark
            ? 'linear-gradient(140deg,#111827 0%,#1e1b4b 55%,#0f172a 100%)'
            : 'linear-gradient(140deg,#f8fafc 0%,#ede9fe 55%,#f1f5f9 100%)',
          minHeight: 'min(50vh, 400px)',
        }}>
          <div style={{
            background: isDark ? '#0f172a' : '#ffffff',
            borderRadius: 24, padding: '28px 24px',
            boxShadow: isDark
              ? '0 10px 36px rgba(2,6,23,0.55),0 1px 3px rgba(0,0,0,0.45)'
              : '0 10px 36px rgba(0,0,0,0.08),0 1px 3px rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            width: '100%', maxWidth: 360,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'#7c3aed', marginBottom:16 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#7c3aed', display:'inline-block',
                animation: 'livePulse 1.8s ease-in-out infinite' }} />
              Live Preview
            </div>
            <HeroGraphic />
          </div>
        </div>
      </section>

      {/* ── STATS TICKER ─────────────────────────────────────────── */}
      <section className="scroll-reveal" style={{
        padding: '0',
        borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
        borderBottom: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
        background: isDark ? '#0f172a' : '#f8fafc', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
          {[['12+','Algorithms','#7c3aed'],['3','Data Structures','#10b981'],['2','Languages','#3b82f6']].map(([v,l,c], i) => (
            <div key={l} style={{
              flex: '1 1 120px', padding: '32px 24px', textAlign: 'center',
              borderRight: i < 2 ? `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}` : 'none',
            }}>
              <p style={{ fontSize: 36, fontWeight: 800, color: c, margin: 0, letterSpacing: '-0.03em',
                fontFamily: "'Bricolage Grotesque','Outfit',sans-serif" }}>{v}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, marginBottom: 0 }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="scroll-reveal" style={{ padding: 'clamp(48px, 8vw, 96px) 24px', background: isDark ? '#0b1220' : '#ffffff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ height: 1, width: 40, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Why AlgoAnalyzer</span>
            <div style={{ height: 1, width: 40, background: 'var(--border)' }} />
          </div>
          <h2 style={{
            fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 56,
            fontFamily: "'Bricolage Grotesque','Outfit',sans-serif", letterSpacing: '-0.02em',
          }}>
            Everything you need to <span style={{ color: '#7c3aed' }}>truly understand</span> algorithms
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} style={{
                padding: '32px 28px', borderRadius: 20,
                border: `1px solid var(--border)`,
                background: isDark ? '#0f172a' : '#f8fafc',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(124,58,237,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: isDark ? '#0f172a' : '#ffffff',
                  border: `1px solid var(--border)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, boxShadow: 'var(--shadow-sm)',
                }}>
                  {icon}
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: 17, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALGORITHMS ───────────────────────────────────────────── */}
      <section className="scroll-reveal" style={{
        padding: 'clamp(48px, 8vw, 96px) 24px',
        background: isDark
          ? 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:14 }}>
            <div style={{ height:1, width:40, background:'var(--border)' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Explore</span>
            <div style={{ height:1, width:40, background:'var(--border)' }} />
          </div>
          <h2 style={{
            fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8,
            fontFamily: "'Bricolage Grotesque','Outfit',sans-serif", letterSpacing: '-0.02em',
          }}>
            What you can explore
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 40 }}>
            12 algorithms across 4 categories — more coming soon
          </p>

          {/* Group by category */}
          {['Sorting','Searching','Stack','Linked List'].map(cat => {
            const group = ALGORITHMS.filter(a => a.cat === cat)
            const c = COLOR_MAP[group[0].color]
            return (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <span style={{
                    fontSize:11, fontWeight:700, color: c.text,
                    background: c.bg, border:`1px solid ${c.border}`,
                    padding:'2px 10px', borderRadius:20, letterSpacing:'0.06em', textTransform:'uppercase',
                  }}>{cat}</span>
                  <div style={{ flex:1, height:1, background:'var(--border)' }} />
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {group.map(({ label, color }) => {
                    const col = COLOR_MAP[color]
                    return (
                      <div key={label}
                        onClick={() => navigate('/visualize')}
                        style={{
                          display:'inline-flex', alignItems:'center', gap:7,
                          padding:'8px 16px', borderRadius:10,
                          background: col.bg, border:`1px solid ${col.border}`,
                          color: col.text, fontSize:14, fontWeight:500,
                          cursor:'pointer', transition:'transform 0.14s, box-shadow 0.14s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow=`0 3px 12px ${col.dot}33` }}
                        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none' }}
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
      <section className="scroll-reveal" style={{
        padding: 'clamp(48px, 8vw, 96px) 24px',
        background: 'var(--bg-primary)',
        borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              display:'inline-block', padding:'4px 14px', borderRadius:20,
              background: isDark ? '#1e1b4b' : '#ede9fe',
              border: `1px solid ${isDark ? '#4c1d95' : '#c4b5fd'}`,
              fontSize:11, fontWeight:700,
              color: isDark ? '#c4b5fd' : '#6d28d9',
              letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14,
            }}>Roadmap</span>
            <h2 style={{
              fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8,
              fontFamily: "'Bricolage Grotesque','Outfit',sans-serif", letterSpacing: '-0.02em',
            }}>What's coming next</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>AlgoAnalyzer is actively being built - here's what's on the horizon</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:16 }}>
            {COMING_SOON.map(({ icon, title, desc }) => (
              <div key={title}
                style={{
                  display:'flex', gap:16, padding:'22px 20px',
                  borderRadius:16, border:`1px solid var(--border)`,
                  background: isDark ? '#0f172a' : '#ffffff',
                  transition:'border-color 0.18s, background 0.18s, transform 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = isDark ? '#4c1d95' : '#c4b5fd'
                  e.currentTarget.style.background = isDark ? '#1e1b4b' : '#f5f3ff'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = isDark ? '#0f172a' : '#ffffff'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width:40, height:40, borderRadius:10,
                  background: isDark ? '#0b1220' : '#f8fafc',
                  border:`1px solid var(--border)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:20, flexShrink:0,
                }}>{icon}</div>
                <div>
                  <h3 style={{ fontWeight:700, color:'var(--text-primary)', fontSize:14, marginBottom:5 }}>{title}</h3>
                  <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.65, margin:0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="scroll-reveal" style={{
        padding: '80px 24px',
        background: isDark ? '#0f172a' : '#f8fafc',
        borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
      }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
          padding: 'clamp(36px, 5vw, 60px) clamp(24px, 4vw, 48px)',
          borderRadius: 28,
          background: 'linear-gradient(140deg,#7c3aed 0%,#5b21b6 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative blobs */}
          <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute', bottom:-30, left:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#fff', marginBottom: 12,
            fontFamily: "'Bricolage Grotesque','Outfit',sans-serif", letterSpacing: '-0.02em',
            position: 'relative',
          }}>
            Ready to visualize?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 32, lineHeight: 1.65, position:'relative' }}>
            Pick an algorithm, enter your input, and watch every step unfold.
          </p>
          <button onClick={() => navigate('/visualize')}
            style={{
              padding: '13px 36px', borderRadius: 12,
              background: '#fff', color: '#7c3aed',
              fontSize: 15, fontWeight: 700, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.18s, box-shadow 0.18s',
              position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.15)' }}
          >
            Start Visualizing →
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`, background: 'var(--bg-primary)' }}>
        {/* Top row */}
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          padding: '40px 24px 28px',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
        }}>
          {/* Brand */}
          <div style={{ maxWidth: 260, flex: '1 1 200px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{
                width:28, height:28, borderRadius:8,
                background:'linear-gradient(135deg,#7c3aed,#10b981)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="4" width="3" height="8" rx="1" fill="white" opacity="0.8"/>
                  <rect x="5.5" y="2" width="3" height="10" rx="1" fill="white"/>
                  <rect x="10" y="5" width="3" height="7" rx="1" fill="white" opacity="0.6"/>
                </svg>
              </div>
              <span style={{ fontWeight:700, fontSize:16, color:'var(--text-primary)', letterSpacing:'-0.01em' }}>AlgoAnalyzer</span>
            </div>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.65, margin:0 }}>
              An algorithm visualizer built to make DSA concepts truly click — step by step.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>Explore</p>
            {[['Visualizer','/visualize'],['Compare','/compare']].map(([label, path]) => (
              <div key={label}
                onClick={() => navigate(path)}
                style={{
                  fontSize:14, color:'var(--text-secondary)', marginBottom:8, cursor:'pointer',
                  transition:'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color='#7c3aed'}
                onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}
              >{label}</div>
            ))}
          </div>

          {/* Developer card */}
          <div style={{
            padding:'20px 22px', borderRadius:16,
            border:`1px solid var(--border)`,
            background: isDark ? '#0f172a' : '#ffffff',
            minWidth:220, flex: '0 1 auto',
          }}>
            <p style={{ fontSize:11, fontWeight:700, color:'var(--accent-text-2)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>Developer</p>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{
                width:38, height:38, borderRadius:10,
                background:'linear-gradient(135deg,#7c3aed,#10b981)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14, fontWeight:700, color:'#fff', flexShrink:0,
              }}>SB</div>
              <div>
                <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:14 }}>Sahil Bajaj</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>Software Developer</div>
              </div>
            </div>
            <a href="https://sahilbajaj.me" target="_blank" rel="noopener noreferrer"
              style={{
                display:'inline-flex', alignItems:'center', gap:6,
                fontSize:13, fontWeight:600, color:'#7c3aed',
                textDecoration:'none', transition:'gap 0.15s',
              }}
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

        {/* Bottom bar */}
        <div style={{
          borderTop:`1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
          padding:'16px 24px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:8,
        }}>
          <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>
            © {new Date().getFullYear()} AlgoAnalyzer — built to make algorithms click
          </p>
          <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>
            Made with ♥ by{' '}
            <a href="https://sahilbajaj.me" target="_blank" rel="noopener noreferrer"
              style={{ color:'#7c3aed', textDecoration:'none', fontWeight:600 }}>
              Sahil Bajaj
            </a>
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes livePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(1.3); }
        }
      `}</style>
    </div>
  )
}

export default Landing
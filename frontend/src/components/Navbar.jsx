import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-colors"
      style={{
        background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)',
        color: isDark ? '#c4b5fd' : '#7c3aed',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon */}
      <svg
        className="w-[18px] h-[18px] transition-all duration-300"
        style={{
          position: isDark ? 'absolute' : 'relative',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(-90deg) scale(0.6)' : 'rotate(0) scale(1)',
          top: isDark ? 8 : undefined,
          left: isDark ? 8 : undefined,
        }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="12" cy="12" r="5" />
        <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Moon icon */}
      <svg
        className="w-[18px] h-[18px] transition-all duration-300"
        style={{
          position: isDark ? 'relative' : 'absolute',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0.6)',
          top: isDark ? undefined : 8,
          left: isDark ? undefined : 8,
        }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  )
}

function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { isDark } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getLinkStyle = (path) => {
    const isActive = pathname === path
    const baseClasses = "text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200"
    const inactiveClasses = isDark
      ? 'text-zinc-300 hover:bg-violet-500/15 hover:text-violet-200'
      : 'text-zinc-600 hover:bg-violet-50 hover:text-violet-700'
    return isActive
      ? `${baseClasses} bg-violet-600 text-white shadow-sm`
      : `${baseClasses} ${inactiveClasses}`
  }

  const navLinks = (
    <>
      <Link to="/" className={getLinkStyle('/')} onClick={() => setMobileMenuOpen(false)}>Home</Link>
      <Link to="/visualize" className={getLinkStyle('/visualize')} onClick={() => setMobileMenuOpen(false)}>Visualize</Link>
      <Link to="/compare" className={getLinkStyle('/compare')} onClick={() => setMobileMenuOpen(false)}>Compare</Link>
      <Link to="/analyze-v2" className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
        pathname === '/analyze-v2'
          ? 'bg-violet-600 text-white shadow-sm'
          : isDark
            ? 'text-zinc-300 hover:bg-violet-500/15 hover:text-violet-200'
            : 'text-zinc-600 hover:bg-violet-50 hover:text-violet-700'
      }`} onClick={() => setMobileMenuOpen(false)}>
        Analyze
      </Link>
    </>
  )

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        background: isDark ? 'rgba(3,7,18,0.75)' : 'rgba(255,255,255,0.82)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:bg-violet-700 transition-colors">
            S
          </span>
          <span className="font-bold tracking-tight text-lg" style={{ color: 'var(--text-primary)' }}>AlgoAnalyzer</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks}

          {pathname === '/visualize' && (
            <div className="flex items-center ml-2 pl-2 border-l" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          )}

          <div className="ml-2 pl-2 border-l" style={{ borderColor: 'var(--border)' }}>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden flex flex-col gap-1 px-4 pb-4 border-t"
          style={{
            background: isDark ? 'rgba(3,7,18,0.95)' : 'rgba(255,255,255,0.97)',
            borderColor: 'var(--border)',
          }}
        >
          {navLinks}
          {pathname === '/visualize' && onMenuClick && (
            <button
              onClick={() => { onMenuClick(); setMobileMenuOpen(false) }}
              className="text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 text-left"
              style={{ color: 'var(--text-muted)' }}
            >
              ☰ Algorithm Sidebar
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
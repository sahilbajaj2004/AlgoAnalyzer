import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

/**
 * Hook to encode/decode algorithm state into URL search params.
 * Supports: algo slug, input (JSON → base64), step index.
 */
function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Read from URL ────────────────────────────────────────────
  const getAlgoSlug = () => searchParams.get('algo') || null
  const getAlgoSlugB = () => searchParams.get('algoB') || null

  const getInput = () => {
    const raw = searchParams.get('input')
    if (!raw) return null
    try {
      return JSON.parse(atob(raw))
    } catch {
      return null
    }
  }

  const getStep = () => {
    const s = searchParams.get('step')
    return s !== null ? Number(s) : null
  }

  // ── Write to URL (replaces current params) ───────────────────
  const setUrlState = useCallback((params) => {
    const next = new URLSearchParams(searchParams)

    if (params.algo !== undefined) {
      if (params.algo) next.set('algo', params.algo)
      else next.delete('algo')
    }

    if (params.algoB !== undefined) {
      if (params.algoB) next.set('algoB', params.algoB)
      else next.delete('algoB')
    }

    if (params.input !== undefined) {
      if (params.input !== null && params.input !== undefined) {
        next.set('input', btoa(JSON.stringify(params.input)))
      } else {
        next.delete('input')
      }
    }

    if (params.step !== undefined) {
      if (params.step !== null) next.set('step', String(params.step))
      else next.delete('step')
    }

    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  // ── Build a full shareable URL ─────────────────────────────
  const getShareableUrl = () => {
    return `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`
  }

  const copyShareUrl = async () => {
    const url = getShareableUrl()
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }

  return {
    getAlgoSlug,
    getAlgoSlugB,
    getInput,
    getStep,
    setUrlState,
    getShareableUrl,
    copyShareUrl,
    searchParams,
  }
}

export default useUrlState

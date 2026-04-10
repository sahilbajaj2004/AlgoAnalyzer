import { useState, useRef, useCallback } from 'react'
import { visualizeAlgorithm } from '../api/index'

function useVisualizer() {
  const [steps, setStepsState] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [speed, setSpeed] = useState(600) // ms between steps
  const intervalRef = useRef(null)

  const generate = async (slug, input) => {
    setLoading(true)
    setError(null)
    stop()
    try {
      const res = await visualizeAlgorithm(slug, input)
      setStepsState(res.data.data.steps)
      setCurrentStep(0)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // For cases where steps come from outside (e.g. analyzeCode response)
  const setSteps = (newSteps) => {
    setStepsState(newSteps)
    setCurrentStep(0)
    stop()
  }

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const reset = () => { setCurrentStep(0); stop() }

  const clear = () => {
    setStepsState([])
    setCurrentStep(0)
    stop()
    setError(null)
  }

  const play = () => {
    stop() // clear any existing interval
    setIsPlaying(true)
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, speed)
  }

  return {
    steps,
    currentStep,
    step: steps[currentStep] || null,
    isPlaying,
    loading,
    error,
    speed,
    setSpeed,
    generate,
    setSteps,
    next,
    prev,
    reset,
    clear,
    play,
    totalSteps: steps.length
  }
}

export default useVisualizer
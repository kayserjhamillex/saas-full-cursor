import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_PROGRESS = 'demo-tour-progress'
const STORAGE_ACTIVE = 'demo-tour-active'

const DEFAULT_PROGRESS = { patient: false, agenda: false, modules: false, ia: false }

export const TOUR_STEPS = [
  { id: 'patient', path: '/paciente', label: 'Paciente' },
  { id: 'agenda', path: '/agenda', label: 'Agenda' },
  { id: 'modules', path: '/modulos', label: 'Modulos' },
  { id: 'ia', path: '/ia', label: 'IA' },
]

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESS)
    if (!raw) return { ...DEFAULT_PROGRESS }
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(p))
}

function loadActive() {
  return localStorage.getItem(STORAGE_ACTIVE) === '1'
}

function saveActive(v) {
  localStorage.setItem(STORAGE_ACTIVE, v ? '1' : '0')
}

export function computeNextStep(progress) {
  return TOUR_STEPS.find((s) => !progress[s.id]) ?? null
}

export function allStepsDone(progress) {
  return TOUR_STEPS.every((s) => Boolean(progress[s.id]))
}

const DemoTourContext = createContext(null)

export function DemoTourProvider({ children }) {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(loadProgress)
  const [tourActive, setTourActiveState] = useState(loadActive)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_PROGRESS && e.newValue) {
        try {
          setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(e.newValue) })
        } catch {
          /* ignore */
        }
      }
      if (e.key === STORAGE_ACTIVE) setTourActiveState(e.newValue === '1')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const markStepComplete = useCallback((stepId) => {
    setProgress((prev) => {
      if (prev[stepId]) return prev
      const next = { ...prev, [stepId]: true }
      saveProgress(next)
      return next
    })
  }, [])

  const startGuidedTour = useCallback(() => {
    const fresh = { ...DEFAULT_PROGRESS }
    setProgress(fresh)
    saveProgress(fresh)
    setTourActiveState(true)
    saveActive(true)
    navigate('/paciente')
  }, [navigate])

  const resumeGuidedTour = useCallback(() => {
    setTourActiveState(true)
    saveActive(true)
    const p = loadProgress()
    const next = computeNextStep(p)
    navigate(next ? next.path : '/registro')
  }, [navigate])

  const dismissTour = useCallback(() => {
    setTourActiveState(false)
    saveActive(false)
  }, [])

  const resetTourProgress = useCallback(() => {
    const fresh = { ...DEFAULT_PROGRESS }
    setProgress(fresh)
    saveProgress(fresh)
  }, [])

  const value = useMemo(
    () => ({
      progress,
      tourActive,
      markStepComplete,
      startGuidedTour,
      resumeGuidedTour,
      dismissTour,
      resetTourProgress,
    }),
    [progress, tourActive, markStepComplete, startGuidedTour, resumeGuidedTour, dismissTour, resetTourProgress],
  )

  return <DemoTourContext.Provider value={value}>{children}</DemoTourContext.Provider>
}

export function useDemoTour() {
  const ctx = useContext(DemoTourContext)
  if (!ctx) {
    throw new Error('useDemoTour debe usarse dentro de DemoTourProvider')
  }
  return ctx
}

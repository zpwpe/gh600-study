import { useEffect, useMemo, useState } from 'react'
import { loadState, saveState } from './lib/storage'
import type { AppState } from './types'
import Sidebar from './components/Sidebar'
import HomePage from './components/HomePage'
import PlanPage from './components/PlanPage'
import DomainsPage from './components/DomainsPage'
import CheatsheetPage from './components/CheatsheetPage'
import PracticePage from './components/PracticePage'
import MockExamPage from './components/MockExamPage'
import ProgressPage from './components/ProgressPage'
import LabsPage from './components/LabsPage'

export type Route =
  | 'home'
  | 'plan'
  | 'domains'
  | 'cheatsheet'
  | 'labs'
  | 'practice'
  | 'mock'
  | 'progress'

function App() {
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash.replace('#', '')
    if (['home', 'plan', 'domains', 'cheatsheet', 'labs', 'practice', 'mock', 'progress'].includes(hash)) {
      return hash as Route
    }
    return 'home'
  })

  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    window.location.hash = route
  }, [route])

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '')
      if (['home', 'plan', 'domains', 'cheatsheet', 'labs', 'practice', 'mock', 'progress'].includes(h)) {
        setRoute(h as Route)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const view = useMemo(() => {
    switch (route) {
      case 'plan':
        return <PlanPage state={state} setState={setState} />
      case 'domains':
        return <DomainsPage />
      case 'cheatsheet':
        return <CheatsheetPage />
      case 'labs':
        return <LabsPage state={state} setState={setState} />
      case 'practice':
        return <PracticePage state={state} setState={setState} />
      case 'mock':
        return <MockExamPage state={state} setState={setState} />
      case 'progress':
        return <ProgressPage state={state} setState={setState} />
      case 'home':
      default:
        return <HomePage onGo={setRoute} />
    }
  }, [route, state])

  return (
    <div className="min-h-screen flex bg-bg text-ink">
      <Sidebar route={route} setRoute={setRoute} />
      <main className="flex-1 px-6 lg:px-10 py-8 scroll-thin overflow-x-hidden max-w-[1280px] mx-auto w-full">
        {view}
      </main>
    </div>
  )
}

export default App

import type { Route } from '../App'
import { EXAM_DATE, EXAM_LOCATION_LABEL } from '../config'

interface SidebarProps {
  route: Route
  setRoute: (r: Route) => void
}

interface Item {
  id: Route
  label: string
  hint: string
  icon: string
}

const ITEMS: Item[] = [
  { id: 'home', label: 'Inicio', hint: 'Que es el GH-600', icon: '◐' },
  { id: 'plan', label: 'Plan 2 dias', hint: 'Cronograma intensivo', icon: '◴' },
  { id: 'domains', label: 'Dominios', hint: '6 areas con peso', icon: '◳' },
  { id: 'cheatsheet', label: 'Cheatsheet', hint: 'Gotchas + glossary', icon: '✦' },
  { id: 'labs', label: 'Lab artefactos', hint: 'Lee snippets reales', icon: '▣' },
  { id: 'practice', label: 'Practica', hint: 'Preguntas por dominio', icon: '◰' },
  { id: 'mock', label: 'Examen Mock', hint: '50 preguntas, 120 min', icon: '◉' },
  { id: 'progress', label: 'Mi progreso', hint: 'Que dominas', icon: '◆' },
]

function daysUntilExam(): number {
  const exam = new Date(EXAM_DATE)
  const now = new Date()
  return Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function formatExamDate(): string {
  const exam = new Date(EXAM_DATE)
  const date = exam.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = exam.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false })
  return EXAM_LOCATION_LABEL ? `${date} · ${time} ${EXAM_LOCATION_LABEL}` : `${date} · ${time}`
}

export default function Sidebar({ route, setRoute }: SidebarProps) {
  const days = daysUntilExam()

  return (
    <aside className="sticky top-0 h-screen w-72 shrink-0 border-r border-line bg-bg-1/60 backdrop-blur px-5 py-6 hidden lg:flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-2 grid place-items-center text-bg font-black">
          GH
        </div>
        <div>
          <div className="font-semibold text-ink text-base leading-tight">GH-600 Cram</div>
          <div className="text-xs text-ink-mute leading-tight">Agentic AI Developer</div>
        </div>
      </div>

      <div className="card mt-6 p-3 px-4 flex items-center gap-3">
        <div className="text-3xl font-display font-black text-accent leading-none">
          {days > 0 ? days : 0}
        </div>
        <div className="text-xs">
          <div className="text-ink font-medium">
            {days > 0 ? `dias para el examen` : days === 0 ? 'Examen hoy' : 'Examen pasado'}
          </div>
          <div className="text-ink-mute">{formatExamDate()}</div>
        </div>
      </div>

      <nav className="mt-6 flex-1 flex flex-col gap-1">
        {ITEMS.map((it) => (
          <button
            key={it.id}
            onClick={() => setRoute(it.id)}
            className={`text-left px-3 py-2.5 rounded-lg border transition flex items-start gap-3 ${
              route === it.id
                ? 'bg-bg-3 border-line-strong'
                : 'bg-transparent border-transparent hover:bg-bg-2 hover:border-line'
            }`}
          >
            <div
              className={`mt-0.5 w-6 text-center font-mono text-sm ${
                route === it.id ? 'text-accent' : 'text-ink-mute'
              }`}
            >
              {it.icon}
            </div>
            <div className="flex-1">
              <div
                className={`text-sm font-medium ${
                  route === it.id ? 'text-ink' : 'text-ink-dim'
                }`}
              >
                {it.label}
              </div>
              <div className="text-[11px] text-ink-mute">{it.hint}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="text-[11px] text-ink-mute pt-3 border-t border-line">
        <div className="mb-1">Examen: 40–60 Q · 120 min · 700/1000 para pasar</div>
        <div>Tu progreso se guarda en este navegador.</div>
      </div>
    </aside>
  )
}

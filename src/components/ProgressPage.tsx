import type { Dispatch, SetStateAction } from 'react'
import type { AppState } from '../types'
import { ALL_QUESTIONS, DOMAINS, META, QUESTIONS_BY_DOMAIN } from '../lib/exam'
import { resetState } from '../lib/storage'

interface ProgressPageProps {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
}

export default function ProgressPage({ state, setState }: ProgressPageProps) {
  const totalQ = ALL_QUESTIONS.length
  const seen = Object.keys(state.questionAttempts).length
  const correctLast = Object.values(state.questionAttempts).filter(
    (atts) => atts[atts.length - 1]?.correct,
  ).length
  const flaggedCount = Object.keys(state.flagged).length
  const lastMock = state.mockRuns.slice(-1)[0]

  const byDomain = DOMAINS.map((d) => {
    const pool = QUESTIONS_BY_DOMAIN[d.domain_id] ?? []
    const seenIds = pool.filter((q) => state.questionAttempts[q.id]?.length)
    const correct = seenIds.filter(
      (q) => state.questionAttempts[q.id].slice(-1)[0].correct,
    )
    return {
      domain: d,
      total: pool.length,
      seen: seenIds.length,
      correct: correct.length,
      pct: seenIds.length ? Math.round((correct.length / seenIds.length) * 100) : 0,
    }
  })

  const wrongQuestions = ALL_QUESTIONS.filter((q) => {
    const last = state.questionAttempts[q.id]?.slice(-1)[0]
    return last && !last.correct
  })

  const reset = () => {
    if (!confirm('Borrar TODO tu progreso? Esto no se puede deshacer.')) return
    resetState()
    setState({
      planChecks: {},
      reviewed: {},
      questionAttempts: {},
      flagged: {},
      mockRuns: [],
    })
  }

  return (
    <div className="space-y-6 fade-up">
      <header>
        <div className="chip chip-purple mb-2">MI PROGRESO</div>
        <h1 className="text-3xl font-display font-semibold text-ink">
          Que dominas y que falta
        </h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          Aqui te muestro donde estas fuerte y donde flojo. Foco en lo flojo.
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard kpi={`${seen}/${totalQ}`} label="Preguntas vistas" />
        <KpiCard kpi={`${correctLast}`} label="Correctas (ultima vez)" />
        <KpiCard kpi={`${flaggedCount}`} label="Marcadas para repasar" />
        <KpiCard
          kpi={lastMock?.score !== undefined ? `${lastMock.score}` : '—'}
          label="Score mock mas reciente"
          subtle={
            lastMock?.score !== undefined
              ? lastMock.score >= META.passing_score
                ? 'PASARIAS'
                : 'TODAVIA NO'
              : 'aun no hiciste mock'
          }
        />
      </section>

      <section className="card p-5">
        <h2 className="font-display font-semibold text-ink mb-3">Rendimiento por dominio</h2>
        <div className="space-y-3">
          {byDomain.map((b) => {
            const pct = b.pct
            const barColor = pct >= 70 ? 'bg-good' : pct >= 50 ? 'bg-warn' : 'bg-bad'
            return (
              <div key={b.domain.domain_id}>
                <div className="flex justify-between text-xs text-ink-dim mb-1">
                  <span>
                    D{b.domain.domain_id}: {b.domain.title}{' '}
                    <span className="text-ink-mute">({b.domain.weight_pct})</span>
                  </span>
                  <span>
                    {b.correct} / {b.seen} vistas · {b.total} totales · {pct}%
                  </span>
                </div>
                <div className="h-2 bg-bg-3 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {wrongQuestions.length > 0 && (
        <section className="card p-5">
          <h2 className="font-display font-semibold text-ink mb-3">
            Tus errores recientes ({wrongQuestions.length})
          </h2>
          <p className="text-sm text-ink-dim mb-3">
            Estas son las preguntas que fallaste en tu ultimo intento. Ve a la pestana <em>Practica</em>
            con el modo "Falladas" para reforzarlas.
          </p>
          <ul className="space-y-2 text-sm">
            {wrongQuestions.slice(0, 20).map((q) => (
              <li key={q.id} className="border border-bad/30 rounded-lg p-3 bg-bad/5">
                <div className="text-[11px] font-mono text-ink-mute">
                  D{q.domainId} · {q.objectiveId}
                </div>
                <div className="text-ink leading-snug">{q.stem.split('\n')[0]}</div>
              </li>
            ))}
            {wrongQuestions.length > 20 && (
              <li className="text-xs text-ink-mute">
                ...y {wrongQuestions.length - 20} mas. Ve a <em>Practica</em> con modo Falladas.
              </li>
            )}
          </ul>
        </section>
      )}

      <section className="card p-5">
        <h2 className="font-display font-semibold text-ink mb-3">
          Historial de mocks ({state.mockRuns.length})
        </h2>
        {state.mockRuns.length === 0 ? (
          <p className="text-sm text-ink-dim">Aun no completaste ningun mock exam.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {state.mockRuns
              .slice()
              .reverse()
              .map((r, i) => (
                <li
                  key={r.startedAt}
                  className="border border-line rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-ink font-mono">
                      Mock #{state.mockRuns.length - i}
                    </div>
                    <div className="text-xs text-ink-mute">
                      {new Date(r.startedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div
                      className={`chip ${
                        (r.score ?? 0) >= META.passing_score ? 'chip-good' : 'chip-bad'
                      }`}
                    >
                      {r.score} / 1000
                    </div>
                    <div className="chip">
                      {(r.score ?? 0) >= META.passing_score ? 'PASARIA' : 'NO PASARIA'}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="card p-5 border-bad/30">
        <h2 className="font-display font-semibold text-ink mb-1">Reset progreso</h2>
        <p className="text-xs text-ink-mute mb-3">
          Borra todas tus respuestas, marcas y mocks. No se puede deshacer.
        </p>
        <button onClick={reset} className="btn btn-danger text-xs">
          Borrar todo mi progreso
        </button>
      </section>
    </div>
  )
}

function KpiCard({
  kpi,
  label,
  subtle,
}: {
  kpi: string
  label: string
  subtle?: string
}) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-display font-bold text-ink">{kpi}</div>
      <div className="text-xs text-ink-dim">{label}</div>
      {subtle && <div className="text-[11px] text-ink-mute mt-0.5">{subtle}</div>}
    </div>
  )
}

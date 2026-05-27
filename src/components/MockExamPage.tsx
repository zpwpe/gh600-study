import { useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { AppState, MockExamRun } from '../types'
import { ALL_QUESTIONS, buildMockSet, isCorrect, META } from '../lib/exam'
import QuestionCard from './QuestionCard'

interface MockExamPageProps {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
}

const QUESTIONS_PER_MOCK = 50

export default function MockExamPage({ state, setState }: MockExamPageProps) {
  const active = state.activeMock
  const [idx, setIdx] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!active || active.finishedAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [active])

  const questions = useMemo(() => {
    if (!active) return []
    const byId = new Map(ALL_QUESTIONS.map((q) => [q.id, q]))
    return active.questionIds.map((id) => byId.get(id)!).filter(Boolean)
  }, [active])

  const startMock = () => {
    const set = buildMockSet(QUESTIONS_PER_MOCK)
    const run: MockExamRun = {
      startedAt: Date.now(),
      questionIds: set.map((q) => q.id),
      answers: {},
    }
    setIdx(0)
    setState((prev) => ({ ...prev, activeMock: run }))
  }

  const abandonMock = () => {
    if (!confirm('Abandon this mock? It will not be saved as completed.')) return
    setState((prev) => ({ ...prev, activeMock: undefined }))
  }

  const submitAnswer = (qid: string, given: string) => {
    setState((prev) => {
      if (!prev.activeMock) return prev
      return {
        ...prev,
        activeMock: {
          ...prev.activeMock,
          answers: { ...prev.activeMock.answers, [qid]: given },
        },
      }
    })
  }

  const finishMock = () => {
    if (!active) return
    let correct = 0
    const byDomain: Record<number, { correct: number; total: number }> = {}
    for (const q of questions) {
      const given = active.answers[q.id]
      const c = given ? isCorrect(q, given) : false
      if (c) correct += 1
      byDomain[q.domainId] = byDomain[q.domainId] ?? { correct: 0, total: 0 }
      byDomain[q.domainId].total += 1
      if (c) byDomain[q.domainId].correct += 1
    }
    const score = Math.round((correct / questions.length) * 1000)
    const finished: MockExamRun = {
      ...active,
      finishedAt: Date.now(),
      score,
      byDomain,
    }
    setState((prev) => ({
      ...prev,
      activeMock: undefined,
      mockRuns: [...prev.mockRuns, finished],
    }))
  }

  // Pre-mock screen
  if (!active) {
    const lastRun = state.mockRuns.slice(-1)[0]
    return (
      <div className="space-y-6 fade-up">
        <header>
          <div className="chip chip-accent mb-2">MOCK EXAM · SIMULATE THE REAL THING</div>
          <h1 className="text-3xl font-display font-semibold text-ink">
            {QUESTIONS_PER_MOCK} questions · 120 min · 700 / 1000 to pass
          </h1>
          <p className="text-ink-dim mt-1 max-w-2xl">
            Per-domain weights identical to the real exam. Timed. No explanations until you submit.
            When you finish you get the total score plus a per-domain breakdown so you know where
            to drill next.
          </p>
        </header>

        <div className="card p-6 border-accent/30">
          <h2 className="text-lg font-display font-semibold text-ink mb-3">
            Before you start, read this:
          </h2>
          <ul className="space-y-2 text-sm text-ink-dim leading-relaxed">
            <li>▸ Close Notion, Slack, WhatsApp. Run the mock like the real thing.</li>
            <li>▸ One attempt per day. Re-run it later with different questions (the bank rotates randomly each time).</li>
            <li>▸ If you finish early, do NOT review your answers — use the time to revisit the ones you flagged with ⚑.</li>
            <li>▸ After you submit you see what you missed with the explanation per error.</li>
          </ul>
          <div className="mt-5">
            <button onClick={startMock} className="btn btn-primary">
              Start the mock now
            </button>
          </div>
        </div>

        {lastRun?.score !== undefined && (
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-ink-mute font-mono">LATEST MOCK</div>
                <div className="text-2xl font-display font-bold text-ink">
                  Score: {lastRun.score} / 1000
                </div>
                <div className="text-xs text-ink-mute mt-0.5">
                  {new Date(lastRun.finishedAt!).toLocaleString()}
                </div>
              </div>
              <div
                className={`chip ${
                  (lastRun.score ?? 0) >= META.passing_score ? 'chip-good' : 'chip-bad'
                }`}
              >
                {(lastRun.score ?? 0) >= META.passing_score ? 'WOULD PASS' : 'WOULD NOT PASS'}
              </div>
            </div>
            {lastRun.byDomain && (
              <div className="grid lg:grid-cols-3 gap-2 mt-4">
                {Object.entries(lastRun.byDomain).map(([d, r]) => {
                  const pct = Math.round((r.correct / r.total) * 100)
                  return (
                    <div key={d} className="border border-line rounded-lg p-2">
                      <div className="text-xs font-mono text-ink-mute">Domain {d}</div>
                      <div className="text-sm text-ink">{r.correct}/{r.total} · {pct}%</div>
                      <div className="h-1.5 bg-bg-3 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${pct >= 70 ? 'bg-good' : pct >= 50 ? 'bg-warn' : 'bg-bad'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Active mock
  const totalMs = META.duration_minutes * 60 * 1000
  const elapsed = now - active.startedAt
  const remaining = Math.max(0, totalMs - elapsed)
  const mm = Math.floor(remaining / 60000)
  const ss = Math.floor((remaining % 60000) / 1000)
  const isLast = idx === questions.length - 1
  const answered = Object.keys(active.answers).length

  if (remaining <= 0) {
    setTimeout(finishMock, 0)
  }

  const current = questions[idx]

  return (
    <div className="space-y-5 fade-up">
      <div className="card p-4 flex items-center justify-between sticky top-2 z-10 backdrop-blur bg-bg-1/80">
        <div>
          <div className="text-xs text-ink-mute font-mono">MOCK IN PROGRESS</div>
          <div className="text-sm text-ink">
            Question {idx + 1} / {questions.length} · Answered:{' '}
            <span className="text-good">{answered}</span>
          </div>
        </div>
        <div className={`text-2xl font-mono font-bold ${remaining < 10 * 60 * 1000 ? 'text-bad pulse' : 'text-ink'}`}>
          {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </div>
        <button onClick={abandonMock} className="btn btn-danger text-xs">
          Abandon
        </button>
      </div>

      {current && (
        <QuestionCard
          key={current.id}
          question={current}
          index={idx}
          total={questions.length}
          mode="mock"
          initialAnswer={active.answers[current.id]}
          onAnswer={(qid, given) => submitAnswer(qid, given)}
          onNext={() => setIdx((i) => Math.min(i + 1, questions.length - 1))}
          onPrev={() => setIdx((i) => Math.max(i - 1, 0))}
          canPrev={idx > 0}
        />
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <div className="text-xs text-ink-mute">Jump:</div>
        {questions.map((q, i) => {
          const isAnswered = !!active.answers[q.id]
          return (
            <button
              key={q.id}
              onClick={() => setIdx(i)}
              className={`w-8 h-8 rounded-md text-xs font-mono ${
                i === idx
                  ? 'bg-accent text-bg'
                  : isAnswered
                  ? 'bg-good/30 text-good border border-good/40'
                  : 'bg-bg-2 text-ink-dim border border-line'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {isLast && (
        <div className="card p-5 border-accent/40">
          <h2 className="font-display font-semibold text-ink">Ready to submit?</h2>
          <p className="text-sm text-ink-dim mt-1">
            You have answered {answered} of {questions.length}. Unanswered questions count as
            incorrect.
          </p>
          <button onClick={finishMock} className="btn btn-primary mt-3">
            Submit and see score
          </button>
        </div>
      )}
    </div>
  )
}

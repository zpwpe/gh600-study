import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { AppState, FlatQuestion } from '../types'
import { ALL_QUESTIONS, DOMAINS, shuffle } from '../lib/exam'
import QuestionCard from './QuestionCard'

interface PracticePageProps {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
}

type DomainFilter = 'all' | number
type ModeFilter = 'all' | 'unseen' | 'wrong' | 'flagged'

export default function PracticePage({ state, setState }: PracticePageProps) {
  const [domain, setDomain] = useState<DomainFilter>('all')
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all')
  const [shuffled, setShuffled] = useState(false)
  const [idx, setIdx] = useState(0)

  const pool: FlatQuestion[] = useMemo(() => {
    let p = ALL_QUESTIONS
    if (domain !== 'all') p = p.filter((q) => q.domainId === domain)
    if (modeFilter === 'unseen') {
      p = p.filter((q) => !state.questionAttempts[q.id]?.length)
    } else if (modeFilter === 'wrong') {
      p = p.filter((q) => {
        const last = state.questionAttempts[q.id]?.slice(-1)[0]
        return last && !last.correct
      })
    } else if (modeFilter === 'flagged') {
      p = p.filter((q) => state.flagged[q.id])
    }
    return shuffled ? shuffle(p) : p
  }, [domain, modeFilter, shuffled, state.questionAttempts, state.flagged])

  const current = pool[idx]

  const recordAnswer = (qid: string, given: string, correct: boolean) => {
    setState((prev) => ({
      ...prev,
      questionAttempts: {
        ...prev.questionAttempts,
        [qid]: [
          ...(prev.questionAttempts[qid] ?? []),
          { id: qid, given, correct, ts: Date.now() },
        ],
      },
    }))
  }

  const toggleFlag = (qid: string) => {
    setState((prev) => {
      const newFlagged = { ...prev.flagged }
      if (newFlagged[qid]) delete newFlagged[qid]
      else newFlagged[qid] = true
      return { ...prev, flagged: newFlagged }
    })
  }

  const seen = Object.keys(state.questionAttempts).length
  const correctCount = Object.values(state.questionAttempts).filter(
    (atts) => atts[atts.length - 1]?.correct,
  ).length

  return (
    <div className="space-y-5 fade-up">
      <header>
        <div className="chip chip-purple mb-2">PRACTICE · LEARN BY MISSING</div>
        <h1 className="text-3xl font-display font-semibold text-ink">
          {ALL_QUESTIONS.length} exam-style scenario questions
        </h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          Every question ships with an explanation. Filter by domain or by what you missed to drill
          the weak spots. Progress saves automatically.
        </p>
      </header>

      <div className="card p-4 grid lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] uppercase font-semibold tracking-wider text-ink-mute mb-2">
            Domain
          </label>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={domain === 'all'} onClick={() => { setDomain('all'); setIdx(0) }}>
              All
            </FilterPill>
            {DOMAINS.map((d) => (
              <FilterPill
                key={d.domain_id}
                active={domain === d.domain_id}
                onClick={() => { setDomain(d.domain_id); setIdx(0) }}
              >
                D{d.domain_id}
              </FilterPill>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[11px] uppercase font-semibold tracking-wider text-ink-mute mb-2">
            Mode
          </label>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={modeFilter === 'all'} onClick={() => { setModeFilter('all'); setIdx(0) }}>
              All
            </FilterPill>
            <FilterPill active={modeFilter === 'unseen'} onClick={() => { setModeFilter('unseen'); setIdx(0) }}>
              Unseen
            </FilterPill>
            <FilterPill active={modeFilter === 'wrong'} onClick={() => { setModeFilter('wrong'); setIdx(0) }}>
              Missed
            </FilterPill>
            <FilterPill active={modeFilter === 'flagged'} onClick={() => { setModeFilter('flagged'); setIdx(0) }}>
              ⚑ Flagged
            </FilterPill>
          </div>
        </div>
        <div>
          <label className="block text-[11px] uppercase font-semibold tracking-wider text-ink-mute mb-2">
            Order
          </label>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={!shuffled} onClick={() => { setShuffled(false); setIdx(0) }}>
              By domain
            </FilterPill>
            <FilterPill active={shuffled} onClick={() => { setShuffled(true); setIdx(0) }}>
              Shuffle
            </FilterPill>
          </div>
          <div className="text-[11px] text-ink-mute mt-3">
            Seen: <span className="text-ink">{seen}</span> · Correct:{' '}
            <span className="text-good">{correctCount}</span> · Current pool:{' '}
            <span className="text-ink">{pool.length}</span>
          </div>
        </div>
      </div>

      {current ? (
        <QuestionCard
          key={current.id}
          question={current}
          index={idx}
          total={pool.length}
          mode="study"
          onAnswer={recordAnswer}
          onNext={() => setIdx((i) => Math.min(i + 1, pool.length - 1))}
          onPrev={() => setIdx((i) => Math.max(i - 1, 0))}
          canPrev={idx > 0}
          onFlag={toggleFlag}
          flagged={!!state.flagged[current.id]}
        />
      ) : (
        <div className="card p-8 text-center">
          <h2 className="font-display font-semibold text-ink">No questions match this filter</h2>
          <p className="text-ink-dim text-sm mt-1">
            Try a different domain or mode (for example "All") to see more.
          </p>
        </div>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-xs transition ${
        active
          ? 'border-accent bg-accent/10 text-ink'
          : 'border-line bg-bg-2 text-ink-dim hover:border-line-strong'
      }`}
    >
      {children}
    </button>
  )
}

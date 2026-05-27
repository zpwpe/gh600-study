import { useEffect, useMemo, useState } from 'react'
import type { FlatQuestion } from '../types'
import { isCorrect } from '../lib/exam'

interface QuestionCardProps {
  question: FlatQuestion
  index: number
  total: number
  mode: 'study' | 'mock'
  initialAnswer?: string
  showSolutionInitially?: boolean
  onAnswer?: (qid: string, given: string, correct: boolean) => void
  onNext?: () => void
  onPrev?: () => void
  onFlag?: (qid: string) => void
  flagged?: boolean
  canPrev?: boolean
}

const DIFF_LABEL: Record<string, string> = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
}

const TYPE_LABEL: Record<string, string> = {
  multiple_choice: 'Single answer',
  multi_select: 'Multi-select (count is in the question)',
  drag_drop_order: 'Order the steps',
  fill_blank: 'Fill in the blank',
  match_pairs: 'Match pairs',
  case_study: 'Case study (check context above)',
}

export default function QuestionCard({
  question,
  index,
  total,
  mode,
  initialAnswer,
  showSolutionInitially,
  onAnswer,
  onNext,
  onPrev,
  onFlag,
  flagged,
  canPrev,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState<string>(initialAnswer ?? '')
  const [revealed, setRevealed] = useState<boolean>(!!showSolutionInitially)

  useEffect(() => {
    setAnswer(initialAnswer ?? '')
    setRevealed(!!showSolutionInitially)
  }, [question.id, initialAnswer, showSolutionInitially])

  const correct = useMemo(
    () => (answer ? isCorrect(question, answer) : false),
    [answer, question],
  )

  const submit = () => {
    if (!answer) return
    setRevealed(true)
    onAnswer?.(question.id, answer, correct)
  }

  const optionLetter = (i: number) => String.fromCharCode(65 + i)
  const isLetter = (raw: string, letter: string) => {
    if (question.type === 'multi_select') {
      const set = new Set(raw.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean))
      return set.has(letter)
    }
    return raw.trim().toUpperCase() === letter
  }

  const toggleLetter = (letter: string) => {
    if (revealed && mode === 'study') return
    if (question.type === 'multi_select') {
      const set = new Set(answer.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean))
      if (set.has(letter)) set.delete(letter)
      else set.add(letter)
      setAnswer(Array.from(set).sort().join(','))
    } else {
      setAnswer(letter)
    }
  }

  const correctLetters = (question.correct || '')
    .split(',')
    .map((s) => s.trim().toUpperCase())

  return (
    <article className="card p-6 fade-up">
      <header className="flex flex-wrap items-center gap-2 mb-4">
        <div className="chip chip-accent">
          {index + 1} / {total}
        </div>
        <div className="chip">D{question.domainId} · {question.objectiveId}</div>
        <div className="chip">{TYPE_LABEL[question.type] ?? question.type}</div>
        {question.difficulty && (
          <div
            className={`chip ${
              question.difficulty === 'easy'
                ? 'chip-good'
                : question.difficulty === 'medium'
                ? 'chip-warn'
                : 'chip-bad'
            }`}
          >
            {DIFF_LABEL[question.difficulty] ?? question.difficulty}
          </div>
        )}
        <div className="flex-1" />
        {onFlag && (
          <button
            onClick={() => onFlag(question.id)}
            className={`btn btn-ghost text-xs ${flagged ? 'text-accent' : ''}`}
            title="Flag to review later"
          >
            {flagged ? '⚑ Flagged' : '⚐ Flag'}
          </button>
        )}
      </header>

      <h2 className="text-lg font-display text-ink leading-relaxed whitespace-pre-line mb-4">
        {question.stem}
      </h2>

      {/* Multiple choice & multi_select & case_study sub option list */}
      {(question.type === 'multiple_choice' ||
        question.type === 'multi_select' ||
        (question.type === 'case_study' && question.options)) && question.options && (
        <ul className="space-y-2">
          {question.options.map((opt, i) => {
            const letter = optionLetter(i)
            const labelMatch = opt.match(/^([A-Z])\.\s*/)
            const usedLetter = labelMatch ? labelMatch[1] : letter
            const isPicked = isLetter(answer, usedLetter)
            const isCorrectOpt = correctLetters.includes(usedLetter)
            const showState = revealed
            const tone = showState
              ? isCorrectOpt
                ? 'border-good/60 bg-good/10'
                : isPicked
                ? 'border-bad/60 bg-bad/10'
                : 'border-line'
              : isPicked
              ? 'border-accent bg-accent/10'
              : 'border-line hover:border-line-strong'
            return (
              <li key={i}>
                <button
                  onClick={() => toggleLetter(usedLetter)}
                  className={`w-full text-left border rounded-lg p-3 flex gap-3 transition ${tone}`}
                  disabled={revealed && mode === 'mock'}
                >
                  <div
                    className={`shrink-0 w-7 h-7 rounded-md font-mono font-semibold grid place-items-center text-sm ${
                      isPicked
                        ? 'bg-accent text-bg'
                        : 'bg-bg-3 text-ink-dim border border-line-strong'
                    }`}
                  >
                    {usedLetter}
                  </div>
                  <div className="text-sm text-ink-dim leading-relaxed">{opt.replace(/^[A-Z]\.\s*/, '')}</div>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {question.type === 'drag_drop_order' && question.options && (
        <DragDropOrder
          options={question.options}
          value={answer}
          revealed={revealed}
          correct={question.correct}
          onChange={setAnswer}
        />
      )}

      {question.type === 'fill_blank' && (
        <div>
          <input
            type="text"
            placeholder="Type your answer…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={revealed && mode === 'mock'}
            className="w-full font-mono"
          />
          {revealed && (
            <div className="mt-2 text-sm">
              <span className="text-ink-mute">Correct answer: </span>
              <code className="text-good">{question.correct}</code>
            </div>
          )}
        </div>
      )}

      {question.type === 'match_pairs' && question.pairs && (
        <MatchPairs
          pairs={question.pairs}
          revealed={revealed}
          onSelfMark={(matched) => {
            setAnswer(matched ? 'self-correct' : 'self-wrong')
          }}
        />
      )}

      <footer className="mt-5 flex flex-wrap items-center gap-2">
        {!revealed && mode === 'study' && (
          <button onClick={submit} className="btn btn-primary" disabled={!answer}>
            Check answer
          </button>
        )}
        {!revealed && mode === 'mock' && (
          <button onClick={submit} className="btn" disabled={!answer}>
            Save and continue
          </button>
        )}
        {revealed && mode === 'study' && (
          <div className={`chip ${correct ? 'chip-good' : 'chip-bad'}`}>
            {correct ? '✓ Correct' : '✕ Incorrect'}
          </div>
        )}
        {canPrev && onPrev && (
          <button onClick={onPrev} className="btn btn-ghost">
            ◂ Previous
          </button>
        )}
        {onNext && (
          <button onClick={onNext} className="btn btn-ghost">
            Next ▸
          </button>
        )}
      </footer>

      {revealed && question.explanation && (
        <div className="mt-4 border-t border-line pt-4">
          <div className="text-xs uppercase tracking-wider text-ink-mute font-semibold mb-1">
            Explanation
          </div>
          <p className="text-sm text-ink-dim leading-relaxed whitespace-pre-line">
            {question.explanation}
          </p>
        </div>
      )}
    </article>
  )
}

function DragDropOrder({
  options,
  value,
  revealed,
  correct,
  onChange,
}: {
  options: string[]
  value: string
  revealed: boolean
  correct?: string
  onChange: (v: string) => void
}) {
  const order = useMemo<string[]>(() => {
    if (value) {
      return value.split(' -> ').map((s) => s.trim())
    }
    return [...options]
  }, [value, options])

  const move = (idx: number, dir: -1 | 1) => {
    const newOrder = [...order]
    const j = idx + dir
    if (j < 0 || j >= newOrder.length) return
    ;[newOrder[idx], newOrder[j]] = [newOrder[j], newOrder[idx]]
    onChange(newOrder.join(' -> '))
  }

  const correctOrder = correct?.split(' -> ').map((s) => s.trim()) ?? []

  return (
    <ol className="space-y-2">
      {order.map((opt, i) => {
        const correctHere = revealed && correctOrder[i] === opt
        const wrongHere = revealed && !correctHere
        return (
          <li
            key={`${opt}-${i}`}
            className={`flex items-center gap-3 border rounded-lg p-3 ${
              revealed
                ? correctHere
                  ? 'border-good/60 bg-good/10'
                  : wrongHere
                  ? 'border-bad/60 bg-bad/10'
                  : 'border-line'
                : 'border-line'
            }`}
          >
            <div className="shrink-0 w-7 h-7 grid place-items-center rounded-md bg-bg-3 border border-line text-xs font-mono">
              {i + 1}
            </div>
            <div className="flex-1 text-sm text-ink-dim">{opt}</div>
            {!revealed && (
              <div className="flex gap-1">
                <button onClick={() => move(i, -1)} className="btn btn-ghost text-xs px-2">
                  ▴
                </button>
                <button onClick={() => move(i, 1)} className="btn btn-ghost text-xs px-2">
                  ▾
                </button>
              </div>
            )}
          </li>
        )
      })}
      {revealed && correct && (
        <li className="text-xs text-ink-mute pt-2">
          <span className="font-semibold">Correct order:</span>{' '}
          <span className="font-mono">{correct}</span>
        </li>
      )}
    </ol>
  )
}

function MatchPairs({
  pairs,
  revealed,
  onSelfMark,
}: {
  pairs: { left: string; right: string }[]
  revealed: boolean
  onSelfMark: (matched: boolean) => void
}) {
  return (
    <div>
      {!revealed && (
        <p className="text-xs text-ink-mute mb-3">
          Match-pairs item. Read each left-hand side and think the answer before revealing.
        </p>
      )}
      <div className="grid lg:grid-cols-2 gap-2">
        {pairs.map((p, i) => (
          <div key={i} className="border border-line rounded-lg p-3 text-sm">
            <div className="text-ink font-medium">{p.left}</div>
            <div
              className={`mt-1 text-ink-dim leading-snug ${
                revealed ? '' : 'blur-sm select-none'
              }`}
            >
              ➜ {p.right}
            </div>
          </div>
        ))}
      </div>
      {!revealed && (
        <div className="mt-3 flex gap-2">
          <button onClick={() => onSelfMark(true)} className="btn btn-primary text-xs">
            I got it
          </button>
          <button onClick={() => onSelfMark(false)} className="btn btn-danger text-xs">
            I missed
          </button>
        </div>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { AppState } from '../types'
import { LABS } from '../data/labs'
import type { Lab } from '../data/labs'

interface LabsPageProps {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
}

const TYPE_LABEL: Record<Lab['type'], string> = {
  'yaml-agent': 'YAML · Custom Agent',
  'json-mcp': 'JSON · MCP config',
  'yaml-actions': 'YAML · GitHub Actions',
  'log': 'Log · Session / Output',
  'audit': 'Audit log event',
  'policy': 'Policy · Branch / Ruleset',
  'hook': 'Hook JSON',
  'cli': 'CLI command',
}

const TYPE_COLOR: Record<Lab['type'], string> = {
  'yaml-agent': 'chip-purple',
  'json-mcp': 'chip-accent',
  'yaml-actions': 'chip',
  'log': 'chip',
  'audit': 'chip-warn',
  'policy': 'chip-good',
  'hook': 'chip-purple',
  'cli': 'chip-accent',
}

export default function LabsPage({ state, setState }: LabsPageProps) {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [domainFilter, setDomainFilter] = useState<number | 'all'>('all')

  const filteredLabs = useMemo(() => {
    if (domainFilter === 'all') return LABS
    return LABS.filter((l) => l.domain === domainFilter)
  }, [domainFilter])

  const current = filteredLabs[idx] ?? filteredLabs[0]
  const isRevealed = current ? !!revealed[current.id] : false
  const isMarkedDone = current ? !!state.reviewed[`lab-${current.id}`] : false

  const toggleReveal = () => {
    if (!current) return
    setRevealed((r) => ({ ...r, [current.id]: !r[current.id] }))
  }

  const markDone = () => {
    if (!current) return
    setState((prev) => ({
      ...prev,
      reviewed: { ...prev.reviewed, [`lab-${current.id}`]: !isMarkedDone },
    }))
  }

  const doneCount = LABS.filter((l) => state.reviewed[`lab-${l.id}`]).length

  return (
    <div className="space-y-5 fade-up">
      <header>
        <div className="chip chip-accent mb-2">ARTIFACT LAB · THE HIGHEST-YIELD SECTION</div>
        <h1 className="text-3xl font-display font-semibold text-ink">
          Read real snippets and explain what each one does
        </h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          Every public source agrees: the exam does NOT ask you to memorize definitions. It hands
          you YAML / JSON / logs and asks what they do or what is wrong. Here are {LABS.length}{' '}
          exam-style snippets with the explanation one click away.
        </p>
      </header>

      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="text-xs text-ink-mute font-semibold uppercase tracking-wider">Domain</div>
        <FilterPill active={domainFilter === 'all'} onClick={() => { setDomainFilter('all'); setIdx(0) }}>
          All
        </FilterPill>
        {[1, 2, 3, 4, 5, 6].map((d) => (
          <FilterPill key={d} active={domainFilter === d} onClick={() => { setDomainFilter(d); setIdx(0) }}>
            D{d}
          </FilterPill>
        ))}
        <div className="flex-1" />
        <div className="text-xs text-ink-mute">
          Reviewed: <span className="text-good">{doneCount}</span> / {LABS.length}
        </div>
      </div>

      {current && (
        <article className="card p-6 fade-up" key={current.id}>
          <header className="flex flex-wrap items-center gap-2 mb-4">
            <div className="chip chip-accent">{idx + 1} / {filteredLabs.length}</div>
            <div className={`chip ${TYPE_COLOR[current.type]}`}>{TYPE_LABEL[current.type]}</div>
            <div className="chip">D{current.domain}</div>
            <div className="flex-1" />
            <button
              onClick={markDone}
              className={`btn btn-ghost text-xs ${isMarkedDone ? 'text-good' : ''}`}
            >
              {isMarkedDone ? '✓ Reviewed' : '○ Mark reviewed'}
            </button>
          </header>

          <h2 className="text-lg font-display font-semibold text-ink mb-3 leading-snug">
            {current.title}
          </h2>

          <pre className="mono text-[13px] bg-bg-3 border border-line rounded-lg p-4 overflow-x-auto scroll-thin leading-relaxed">
            <code>{current.snippet}</code>
          </pre>

          <div className="mt-4 border-l-4 border-info/60 bg-info/5 p-3 rounded-r-lg">
            <div className="text-xs text-info uppercase font-semibold tracking-wider mb-1">
              Question
            </div>
            <div className="text-ink-dim text-sm">{current.question}</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={toggleReveal} className="btn btn-primary">
              {isRevealed ? 'Hide explanation' : 'Show explanation'}
            </button>
            {idx > 0 && (
              <button onClick={() => { setIdx((i) => i - 1); }} className="btn btn-ghost">
                ◂ Previous
              </button>
            )}
            {idx < filteredLabs.length - 1 && (
              <button onClick={() => { setIdx((i) => i + 1); }} className="btn btn-ghost">
                Next ▸
              </button>
            )}
          </div>

          {isRevealed && (
            <div className="mt-4 fade-up space-y-3">
              <div className="border border-good/30 bg-good/5 p-4 rounded-lg">
                <div className="text-xs text-good uppercase font-semibold tracking-wider mb-1">
                  Explanation
                </div>
                <div className="text-ink-dim text-sm leading-relaxed">
                  {renderRich(current.answer)}
                </div>
              </div>
              <div className="border border-warn/30 bg-warn/5 p-4 rounded-lg">
                <div className="text-xs text-warn uppercase font-semibold tracking-wider mb-1">
                  Why it matters
                </div>
                <div className="text-ink-dim text-sm leading-relaxed">{current.whyItMatters}</div>
              </div>
            </div>
          )}
        </article>
      )}

      <div className="card p-4">
        <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-mute mb-3">
          Jump to another lab
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {filteredLabs.map((l, i) => {
            const done = !!state.reviewed[`lab-${l.id}`]
            return (
              <button
                key={l.id}
                onClick={() => setIdx(i)}
                className={`text-left px-3 py-2 rounded-lg text-xs border transition ${
                  i === idx
                    ? 'border-accent bg-accent/10'
                    : done
                    ? 'border-good/30 bg-good/5 text-good'
                    : 'border-line bg-bg-2 text-ink-dim hover:border-line-strong'
                }`}
              >
                <div className="font-mono text-[10px] text-ink-mute mb-0.5">
                  D{l.domain} · {i + 1}
                </div>
                <div className="leading-tight line-clamp-2">{l.title}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function renderRich(text: string): React.ReactNode {
  // Safely tokenize **bold** and `code` segments without HTML injection.
  const tokens: Array<{ kind: 'text' | 'bold' | 'code'; value: string }> = []
  const regex = /\*\*(.+?)\*\*|`(.+?)`/g
  let cursor = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > cursor) tokens.push({ kind: 'text', value: text.slice(cursor, m.index) })
    if (m[1] !== undefined) tokens.push({ kind: 'bold', value: m[1] })
    else if (m[2] !== undefined) tokens.push({ kind: 'code', value: m[2] })
    cursor = m.index + m[0].length
  }
  if (cursor < text.length) tokens.push({ kind: 'text', value: text.slice(cursor) })
  return tokens.map((t, i) => {
    if (t.kind === 'bold') return <strong key={i} className="text-ink">{t.value}</strong>
    if (t.kind === 'code')
      return (
        <code key={i} className="bg-bg-3 px-1 rounded text-accent mono text-[12px]">
          {t.value}
        </code>
      )
    return <span key={i}>{t.value}</span>
  })
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

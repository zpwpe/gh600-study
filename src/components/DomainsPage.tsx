import { useState } from 'react'
import { DOMAINS } from '../lib/exam'

const DOMAIN_ACCENTS = ['amber', 'violet', 'sky', 'emerald', 'rose', 'cyan'] as const

export default function DomainsPage() {
  const [active, setActive] = useState<number>(DOMAINS[0].domain_id)
  const dom = DOMAINS.find((d) => d.domain_id === active)!
  const accent = DOMAIN_ACCENTS[active - 1]

  const totalQ = dom.objectives.reduce((a, o) => a + (o.questions?.length ?? 0), 0)

  return (
    <div className="space-y-6 fade-up">
      <header>
        <div className="chip chip-purple mb-2">DOMINIOS DEL EXAMEN · CHEATSHEETS</div>
        <h1 className="text-3xl font-display font-semibold text-ink">
          Los 6 dominios: que cae en cada uno
        </h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          Cada dominio tiene conceptos clave (lo que MAS cae), terminologia (vocabulario que debes
          dominar) y pitfalls (las trampas tipicas del examen).
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((d) => (
          <button
            key={d.domain_id}
            onClick={() => setActive(d.domain_id)}
            className={`text-left px-3 py-2 rounded-lg border text-xs transition ${
              d.domain_id === active
                ? 'border-accent bg-accent/10 text-ink'
                : 'border-line bg-bg-2 text-ink-dim hover:border-line-strong'
            }`}
          >
            <span className="font-mono">D{d.domain_id}</span>
            <span className="ml-2">{d.title}</span>
            <span className="ml-2 text-ink-mute">{d.weight_pct}</span>
          </button>
        ))}
      </div>

      <section className="card p-6 border-l-4" style={{ borderLeftColor: `var(--color-${accent}-500, var(--color-accent))` }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-display font-semibold text-ink">
            Dominio {dom.domain_id}: {dom.title}
          </h2>
          <div className="flex gap-2">
            <div className="chip chip-accent">{dom.weight_pct}</div>
            <div className="chip">{totalQ} preguntas</div>
          </div>
        </div>

        <p className="text-ink-dim text-sm">
          {dom.objectives.length} objetivos · cada uno con sus conceptos clave, vocabulario y trampas.
        </p>

        {dom.objectives.map((o) => (
          <article key={o.id} className="mt-6 pt-6 border-t border-line">
            <div className="flex items-center gap-2 mb-3">
              <div className="font-mono text-xs text-accent">{o.id}</div>
              <h3 className="font-display font-semibold text-ink">{o.title}</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {o.key_concepts && (
                <Block title="Conceptos clave (lo que mas cae)" tone="good">
                  <ul className="space-y-1.5">
                    {o.key_concepts.map((c, i) => (
                      <li key={i} className="text-sm text-ink-dim leading-snug flex gap-2">
                        <span className="text-good mt-0.5">▸</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {o.key_terminology && (
                <Block title="Vocabulario que DEBES saber" tone="info">
                  <div className="flex flex-wrap gap-1.5">
                    {o.key_terminology.map((t, i) => (
                      <code
                        key={i}
                        className="text-[12px] font-mono px-2 py-0.5 rounded bg-bg-3 text-info border border-line"
                      >
                        {t}
                      </code>
                    ))}
                  </div>
                </Block>
              )}

              {o.common_pitfalls && (
                <Block title="Pitfalls (trampas tipicas del examen)" tone="bad">
                  <ul className="space-y-1.5">
                    {o.common_pitfalls.map((c, i) => (
                      <li key={i} className="text-sm text-ink-dim leading-snug flex gap-2">
                        <span className="text-bad mt-0.5">✕</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {o.github_features_tested && (
                <Block title="Features de GitHub que evaluan" tone="warn">
                  <div className="flex flex-wrap gap-1.5">
                    {o.github_features_tested.map((t, i) => (
                      <code
                        key={i}
                        className="text-[12px] font-mono px-2 py-0.5 rounded bg-bg-3 text-warn border border-line"
                      >
                        {t}
                      </code>
                    ))}
                  </div>
                </Block>
              )}
            </div>

            {o.subtopics && (
              <details className="mt-4 group">
                <summary className="cursor-pointer text-xs text-ink-mute hover:text-ink-dim">
                  ▸ Lo que la guia oficial pide en este objetivo
                </summary>
                <ul className="mt-2 space-y-1 pl-4 text-xs text-ink-dim list-disc list-inside">
                  {o.subtopics.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </details>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}

function Block({
  title,
  tone,
  children,
}: {
  title: string
  tone: 'good' | 'bad' | 'warn' | 'info'
  children: React.ReactNode
}) {
  const toneCls = {
    good: 'border-good/30 bg-good/5',
    bad: 'border-bad/30 bg-bad/5',
    warn: 'border-warn/30 bg-warn/5',
    info: 'border-info/30 bg-info/5',
  }[tone]
  return (
    <div className={`border ${toneCls} rounded-lg p-3.5`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-dim mb-2">
        {title}
      </div>
      {children}
    </div>
  )
}

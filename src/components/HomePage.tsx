import type { Route } from '../App'
import { DOMAINS, META } from '../lib/exam'
import { EXAM_HEADER_LABEL } from '../config'

interface HomePageProps {
  onGo: (r: Route) => void
}

const DOMAIN_COLORS = [
  'from-amber-400/30 to-amber-600/10',
  'from-violet-400/30 to-violet-600/10',
  'from-sky-400/30 to-sky-600/10',
  'from-emerald-400/30 to-emerald-600/10',
  'from-rose-400/30 to-rose-600/10',
  'from-cyan-400/30 to-cyan-600/10',
]

export default function HomePage({ onGo }: HomePageProps) {
  return (
    <div className="space-y-8 fade-up">
      <section>
        {EXAM_HEADER_LABEL && (
          <div className="chip chip-accent mb-3">{EXAM_HEADER_LABEL}</div>
        )}
        <h1 className="text-4xl lg:text-5xl font-display font-semibold tracking-tight text-ink">
          {META.exam_code}: {META.exam_title}
        </h1>
        <p className="mt-3 text-ink-dim max-w-3xl leading-relaxed">
          Tu objetivo: sacar el maximo score en el {META.exam_code} ({META.credential}). Esta app
          es tu mochila de cram para los proximos 2 dias. Lenguaje simple, sin floro, con todo lo
          que sale en el examen segun la guia oficial de Microsoft, GitHub Docs, y los que ya lo
          dieron.
        </p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard kpi={`${META.duration_minutes} min`} label="Duracion" hint="Cronometro real" />
        <StatCard kpi="40–60" label="Preguntas" hint="Scenario-based" />
        <StatCard kpi="700" label="Score minimo" hint="/1000 para aprobar" />
        <StatCard kpi="6" label="Dominios" hint="Ver pesos abajo" />
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-display font-semibold text-ink mb-1">
          Que es el GH-600 en una linea
        </h2>
        <p className="text-ink-dim leading-relaxed">
          Es el primer certificado de GitHub para gente que <strong className="text-ink">opera,
          supervisa y gobierna agentes de IA</strong> (tipo Copilot cloud agent + CLI + custom
          agents) dentro del ciclo de vida de software, usando GitHub como sistema de control. No
          es un examen de codear; es un examen de <em>como configurar, evaluar y poner barandas</em>
          a agentes que escriben codigo por ti.
        </p>
        <div className="mt-4 grid lg:grid-cols-2 gap-3 text-sm">
          <Bullet good>Vas a ver preguntas de YAML de custom-agents, MCP servers, allowlists del firewall, CODEOWNERS, environments con required reviewers.</Bullet>
          <Bullet good>Casi todo es <strong>scenario-based</strong>: te dan un contexto, te piden la MEJOR opcion, no la unica posible.</Bullet>
          <Bullet bad>Casi NO vas a ver: trivia memoristica de Copilot Chat, comandos basicos de git, sintaxis de actions sin agentes.</Bullet>
          <Bullet bad>Trampa clasica: confundir <code className="text-accent">--no-ask-user</code> con <code className="text-accent">--autopilot</code>, o asumir que el firewall cubre MCP servers (no lo hace).</Bullet>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-display font-semibold text-ink">Los 6 dominios y su peso</h2>
          <button onClick={() => onGo('domains')} className="btn btn-ghost text-xs">
            Ver cheatsheets ▸
          </button>
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          {DOMAINS.map((d, idx) => (
            <button
              key={d.domain_id}
              onClick={() => onGo('domains')}
              className={`card card-hover p-4 text-left bg-gradient-to-br ${DOMAIN_COLORS[idx]}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-mono text-ink-mute">D{d.domain_id}</div>
                <div className="chip">{d.weight_pct}</div>
              </div>
              <div className="font-display text-ink font-medium leading-snug">{d.title}</div>
              <div className="text-xs text-ink-mute mt-1">
                {d.objectives.length} objetivos · {d.objectives.reduce(
                  (a, o) => a + (o.questions?.length ?? 0),
                  0,
                )}{' '}
                preguntas tipo examen
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-3">
        <ActionCard
          title="Empieza por el plan"
          desc="Cronograma intensivo 2 dias. Marca cada bloque cuando lo termines."
          cta="Ver plan ▸"
          onClick={() => onGo('plan')}
        />
        <ActionCard
          title="Lee el cheatsheet"
          desc="Glossary + los 15 gotchas que SIEMPRE caen. Memorizalos."
          cta="Ver cheatsheet ▸"
          onClick={() => onGo('cheatsheet')}
        />
        <ActionCard
          title="Drilling de preguntas"
          desc="70+ preguntas reales con explicacion. Filtra por dominio para reforzar lo flojo."
          cta="Practicar ▸"
          onClick={() => onGo('practice')}
        />
      </section>

      <section className="grid lg:grid-cols-2 gap-3">
        <article className="card p-5">
          <div className="chip chip-warn mb-2">LOGISTICA DEL EXAMEN</div>
          <h2 className="text-lg font-display font-semibold text-ink mb-3">
            Cosas no obvias que importan el dia del examen
          </h2>
          <ul className="space-y-2 text-sm text-ink-dim leading-relaxed">
            <li className="flex gap-2"><span className="text-warn mt-0.5">▸</span><span><strong className="text-ink">NO tienes acceso a Microsoft Learn</strong> durante el examen. Llega con paths, comandos y diferencias de keys ya memorizadas.</span></li>
            <li className="flex gap-2"><span className="text-warn mt-0.5">▸</span><span><strong className="text-ink">Examen solo en INGLES.</strong> Si no es tu primer idioma, Microsoft permite pedir <strong>+30 min extra</strong> al agendar. Para ti: 120+30 = 150 min.</span></li>
            <li className="flex gap-2"><span className="text-warn mt-0.5">▸</span><span><strong className="text-ink">Beta hasta 31 may 2026</strong>, GA en julio. Codigo de 80% off para los primeros 100: <code className="text-accent mono">GH600Flanders</code>.</span></li>
            <li className="flex gap-2"><span className="text-warn mt-0.5">▸</span><span>NO disponible en Turkey, Pakistan, India, China. Resultados beta tardan <strong>8-12 semanas</strong>.</span></li>
            <li className="flex gap-2"><span className="text-warn mt-0.5">▸</span><span>Sandbox para conocer la UI antes: <code className="text-accent mono text-[11px]">ghcertdemo.starttest.com</code></span></li>
            <li className="flex gap-2"><span className="text-warn mt-0.5">▸</span><span>NO existe Practice Assessment oficial. Por eso esta app y el mock de jtur671 son lo unico para drill.</span></li>
          </ul>
        </article>

        <article className="card p-5">
          <div className="chip chip-purple mb-2">TESTIMONIOS BETA · MAY 2026</div>
          <h2 className="text-lg font-display font-semibold text-ink mb-3">
            Lo que dicen los que YA lo dieron
          </h2>
          <div className="space-y-4">
            <div className="border-l-2 border-accent/60 pl-3">
              <div className="text-xs text-ink-mute font-mono mb-1">Reasonable_East_3023 · autor de la guia Gist</div>
              <p className="text-sm text-ink-dim leading-relaxed italic">
                "This exam kicks ass. Mucho mas duro que GH-300. Microsoft Learn es solo un mapa de alto nivel. El examen es muy practico: YAML, JSON de MCP, logs, workflows con needs y artifacts, hooks, CLI de Copilot. Trata la guia como workbook."
              </p>
            </div>
            <div className="border-l-2 border-accent-2/60 pl-3">
              <div className="text-xs text-ink-mute font-mono mb-1">Luciano_DZ · tomo el mismo dia que el autor</div>
              <p className="text-sm text-ink-dim leading-relaxed italic">
                "56 preguntas + 2 case studies. Muchisimo enfasis en GitHub Actions workflows para agentes y Copilot CLI. Domina los comandos basicos del CLI y como escribir archivos de agentes en .github/. No hay acceso a Microsoft Learn durante el examen."
              </p>
            </div>
            <div className="border-l-2 border-info/60 pl-3">
              <div className="text-xs text-ink-mute font-mono mb-1">Otro beta · formato mezclado</div>
              <p className="text-sm text-ink-dim leading-relaxed italic">
                "No todo es multiple choice. Hay drag-and-drop y fill-blanks con opciones predeterminadas. Lee con calma; te muestran snippets reales."
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="card p-6 border-accent/30">
        <h2 className="text-lg font-display font-semibold text-ink mb-2">
          Recomendacion para 2 dias (intensivo)
        </h2>
        <ol className="space-y-2 text-sm text-ink-dim leading-relaxed list-decimal list-inside">
          <li>
            <strong className="text-ink">Hoy (Mar):</strong> lee el cheatsheet completo + dominios
            1, 2 y 6 (los mas pesados para guardrails). Practica 30 preguntas filtrando esos
            dominios.
          </li>
          <li>
            <strong className="text-ink">Manana (Mie):</strong> dominios 3, 4 y 5. Practica las 70+
            preguntas en orden. Repasa lo que fallaste.
          </li>
          <li>
            <strong className="text-ink">Vie en la manana:</strong> 1 mock exam completo (50 Q, 120
            min). Revisa los errores. Llega al centro 30 min antes con DNI.
          </li>
        </ol>
        <div className="mt-3 text-xs text-ink-mute">
          Sigue el plan paso a paso en la pestana <em>Plan 2 dias</em>.
        </div>
      </section>
    </div>
  )
}

function StatCard({ kpi, label, hint }: { kpi: string; label: string; hint: string }) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-display font-bold text-ink">{kpi}</div>
      <div className="text-sm text-ink-dim">{label}</div>
      <div className="text-[11px] text-ink-mute mt-0.5">{hint}</div>
    </div>
  )
}

function Bullet({ children, good, bad }: { children: React.ReactNode; good?: boolean; bad?: boolean }) {
  const dot = good ? 'bg-good' : bad ? 'bg-bad' : 'bg-ink-mute'
  return (
    <div className="flex gap-2 text-ink-dim leading-relaxed">
      <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <div>{children}</div>
    </div>
  )
}

function ActionCard({
  title,
  desc,
  cta,
  onClick,
}: {
  title: string
  desc: string
  cta: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="card card-hover p-5 text-left group">
      <div className="font-display font-semibold text-ink">{title}</div>
      <div className="text-sm text-ink-dim mt-1 leading-relaxed">{desc}</div>
      <div className="text-xs text-accent mt-3 group-hover:underline">{cta}</div>
    </button>
  )
}

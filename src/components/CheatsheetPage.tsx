import { useMemo, useState } from 'react'
import { META } from '../lib/exam'

interface Gotcha {
  title: string
  detail: string
  why: string
}

const GOTCHAS: Gotcha[] = [
  {
    title: 'El firewall del Copilot SOLO cubre procesos lanzados por Bash',
    detail: 'NO cubre MCP servers ni copilot-setup-steps.yml',
    why: 'Esta es la trampa numero uno. Si la pregunta dice "como aseguras egress en todas las herramientas del agente", el firewall no te alcanza solo: tienes que combinar con scoping de MCP y permisos del setup-steps.',
  },
  {
    title: '--no-ask-user NO es lo mismo que --autopilot',
    detail: '--no-ask-user suprime preguntas. --autopilot habilita continuacion multi-step.',
    why: 'Casi todos los examenes meten esta distincion. Si la pregunta pide "modo donde el agente continua solo varios pasos", la respuesta es --autopilot. Para limitarlo usas --max-autopilot-continues.',
  },
  {
    title: 'Custom agents viven en `.github/agents/*.agent.md`',
    detail: 'Para repos. Para org: `/agents/*.agent.md` dentro del repo `.github-private`.',
    why: 'Cae en fill-blank. Memoriza la extension exacta `.agent.md` y el path.',
  },
  {
    title: 'Copilot Memory expira a los 28 dias sin uso',
    detail: 'No 7, no 14, no 30. EXACTAMENTE 28 dias. Se resetea con validacion exitosa.',
    why: 'Hay una pregunta directa sobre el numero. Si dudas, la respuesta es 28.',
  },
  {
    title: 'Cloud agent NO soporta OAuth en remote MCP servers',
    detail: 'Tienes que usar PAT u otro token-based auth.',
    why: 'Pregunta tipica de "cual statement es correcto". OAuth no funciona en cloud agent para remote MCP.',
  },
  {
    title: 'Secrets de MCP necesitan prefijo `COPILOT_MCP_`',
    detail: 'En la config JSON: `$COPILOT_MCP_NOMBRE_DEL_SECRETO`',
    why: 'Cae como fill-blank o como detect-the-bad-config. Si veo `env: {TOKEN: "$TOKEN"}` ese hard-coded esta MAL. La forma correcta es referenciar via `$COPILOT_MCP_*`.',
  },
  {
    title: 'Precedencia en custom agents y MCP: repo > org > enterprise',
    detail: '"Lowest Level Wins". El scope mas cercano al codigo gana.',
    why: 'Si una pregunta dice "ambos definidos a nivel repo y org, cual gana", responde REPO.',
  },
  {
    title: 'El job en copilot-setup-steps.yml DEBE llamarse `copilot-setup-steps`',
    detail: 'Si lo nombras distinto, Copilot lo ignora completamente.',
    why: 'Pregunta fill-blank casi garantizada. Tambien aparece como detect-the-bug.',
  },
  {
    title: 'MCP registry: base URL SIN /v0.1/servers al final',
    detail: 'El cliente construye el path. Si pones la url completa, falla.',
    why: 'El endpoint que se pide es GET /v0.1/servers. Tu pones solo la base.',
  },
  {
    title: 'Cloud agent soporta SOLO Ubuntu x64 y Windows 64-bit',
    detail: 'NO macOS, NO ARM64. GitHub-hosted o self-hosted EPHEMERAL.',
    why: 'Multi-select clasico. Las opciones macOS y ARM64 son distractoras.',
  },
  {
    title: 'Cloud agent solo consume TOOLS de MCP, no resources ni prompts',
    detail: 'MCP spec define tools/resources/prompts. Cloud agent ignora resources y prompts.',
    why: 'Aparece como statement-true/false. Si la pregunta dice "cloud agent usa resources del MCP", es FALSO.',
  },
  {
    title: '5 eventos del lifecycle de sub-agent',
    detail: 'subagent.selected, .started, .completed, .failed, .deselected',
    why: 'Multi-select. Memoriza los 5 nombres exactos.',
  },
  {
    title: '`disable-model-invocation: true` reemplaza al viejo `infer`',
    detail: 'Bloquea seleccion automatica del agente por el modelo (manual aun funciona).',
    why: 'Si una opcion menciona `infer: false`, es la propiedad retirada. La buena es disable-model-invocation.',
  },
  {
    title: 'Workflows de Actions estan BLOQUEADOS en PRs de Copilot por default',
    detail: 'Necesitan "Approve and run workflows" de un user con write access.',
    why: 'Esto es safety by design para evitar que el agente dispare CI con permisos elevados. Apparece como "que pasa por default".',
  },
  {
    title: 'Custom allowlist: domain (cubre subdominios) vs URL (scheme + path)',
    detail: 'Domain `contoso.corp` cubre `*.contoso.corp`. URL `https://...` es scheme y path scoped.',
    why: 'Multi-select tipica. Wildcards tipo `*.contoso.corp` NO son formato valido (es domain).',
  },
  {
    title: 'Repo facts vs user preferences en Copilot Memory',
    detail: 'Repo facts = convenciones del proyecto, con citaciones. User prefs = preferencias personales, atraviesan repos.',
    why: 'Code review usa SOLO repo facts, no user prefs. Si una pregunta dice "Copilot code review uso mis user prefs", esta MAL.',
  },
  {
    title: 'Eyes-on emoji (👀) = Copilot ack y procesando',
    detail: 'No es un "like". Es senal de que el agente reconocio el comentario.',
    why: 'Aparece en match-pairs de observability. No confundir con verified badge ni con session logs.',
  },
  {
    title: 'mcp-servers (YAML agent) vs mcpServers (JSON .mcp.json)',
    detail: 'En frontmatter del .agent.md va con guion. En el archivo de config .mcp.json va camelCase.',
    why: 'El error mas reportado por candidatos beta. El examen te pone snippet con la key incorrecta y te pregunta que esta mal. Memoriza: agente=kebab, config=camel.',
  },
  {
    title: 'description es el campo OBLIGATORIO del frontmatter, no name',
    detail: 'name es opcional. description es necesaria. user-invocable, target, tools son opcionales.',
    why: 'Pregunta directa de la guia: cual es el campo obligatorio del frontmatter YAML de un agent. La trampa es elegir name.',
  },
  {
    title: 'search (codebase) vs web (URLs externas)',
    detail: 'search = grep/glob sobre el repo. web = WebSearch y WebFetch a URLs externas.',
    why: 'Multi-select tipica. La trampa es decir que search hace busqueda web. NO. Son tools distintas.',
  },
  {
    title: 'Controles: branch protection = preventive, CodeQL = detective, revert PR = corrective',
    detail: 'Preventive bloquea antes. Detective encuentra despues. Corrective arregla lo ya merged.',
    why: 'Pregunta directa: ordena estos tres como preventive/detective/corrective. Respuesta: A (en ese orden).',
  },
  {
    title: '$GITHUB_OUTPUT NO es variable de entorno',
    detail: 'Escribir `echo "X=y" >> "$GITHUB_OUTPUT"` crea output del STEP, no env global.',
    why: 'La trampa de la pregunta: A) crea env global, B) crea step output, C) escribe en summary, D) modifica needs. Respuesta: B.',
  },
  {
    title: 'artifact.destroy en audit log = eliminacion MANUAL de un artifact',
    detail: 'No es creacion. No es disable. Es destroy manual con actor identificado.',
    why: 'Pregunta de leer un audit log entry e identificar que paso. Memoriza los events principales del audit log.',
  },
  {
    title: '~/.copilot/session-state/<id>/ es donde vive el estado para resume',
    detail: 'events.jsonl + metadata. `resume=true` en log indica sesion reanudada (no nueva).',
    why: 'Pregunta de log reading. Si ves `resume=true` y carga desde session-state, es sesion reanudada. Tipica trampa: decir "MCP deshabilitado" o "PR auto-creado".',
  },
  {
    title: 'NO hay acceso a Microsoft Learn durante el examen GH-600',
    detail: 'Tampoco hay docs de GitHub. Es proctored, ingles only.',
    why: 'No te puedes recostar en "buscarlo en vivo". Llega con paths, comandos y diferencias de keys YA memorizadas.',
  },
  {
    title: 'Si tu idioma no esta, pide 30 min extra',
    detail: 'GH-600 esta solo en ingles. Microsoft permite +30 min para no-anglo.',
    why: 'Politica logistica oficial. Pide la accommodation cuando agendas. Para ti es 120 + 30 = 150 min.',
  },
]

interface GlossaryEntry {
  term: string
  def: string
}

function getGlossary(): GlossaryEntry[] {
  return Object.entries(META.glossary).map(([term, def]) => ({ term, def }))
}

interface PathRef {
  path: string
  desc: string
}
interface CommandRef {
  command: string
  desc: string
}

const PATHS: PathRef[] = [
  { path: '.github/agents/*.agent.md', desc: 'Custom agents (scope repo). Frontmatter YAML + cuerpo Markdown.' },
  { path: '/agents/*.agent.md (en .github-private)', desc: 'Custom agents a nivel ORG. Repo `.github-private` lo carga toda la org.' },
  { path: '.github/copilot-instructions.md', desc: 'Instrucciones generales a nivel repo, consumidas por Copilot en todas las superficies.' },
  { path: '.github/instructions/**/*.instructions.md', desc: 'Instrucciones especificas por path (glob). Mas granulares.' },
  { path: '.github/hooks/*.json', desc: 'Hooks preToolUse / postToolUse para bloquear o auditar herramientas.' },
  { path: '.github/workflows/copilot-setup-steps.yml', desc: 'Pre-provision del entorno ephemeral del Copilot cloud agent.' },
  { path: '.mcp.json', desc: 'Config de MCP servers a nivel proyecto/IDE. Key: mcpServers (camelCase).' },
  { path: 'AGENTS.md', desc: 'Instrucciones de agente para Copilot CLI. COPILOT_CUSTOM_INSTRUCTIONS_DIRS extiende paths.' },
  { path: '~/.copilot/session-state/<id>/events.jsonl', desc: 'Estado durable de sesion. Permite resume.' },
  { path: '$GITHUB_OUTPUT', desc: 'Archivo de outputs del step. `echo "k=v" >> "$GITHUB_OUTPUT"`.' },
  { path: '$GITHUB_STEP_SUMMARY', desc: 'Archivo de markdown que se muestra en la UI del job. NO es output de step.' },
  { path: 'copilot/* (branch)', desc: 'Branch creada por el cloud agent para sus PRs (no puede tocar default).' },
]

const COMMANDS: CommandRef[] = [
  { command: 'copilot --autopilot', desc: 'Modo multi-step autonomo. Continua sin pedir el siguiente paso.' },
  { command: '--max-autopilot-continues N', desc: 'Limita cuantas continuaciones autonomas hace autopilot.' },
  { command: '--no-ask-user', desc: 'Suprime preguntas clarificadoras pero NO es multi-step.' },
  { command: '--yolo / --allow-all', desc: 'Permite todos los tools/paths/URLs sin pedir permiso. No toggleable.' },
  { command: '--resume <id>', desc: 'Reanuda una sesion previa cargando estado desde ~/.copilot/session-state/.' },
  { command: '/agent <name>', desc: 'Cambia el custom agent activo en la sesion CLI.' },
  { command: '/delegate <name>', desc: 'Delega una sub-tarea a otro agente. Emite eventos subagent.* .' },
  { command: '/fleet <pattern>', desc: 'Ejecuta multiples sub-agents en paralelo a partir del plan decompuesto.' },
  { command: '/allow-all, /yolo (slash)', desc: 'Equivalentes en sesion a las flags --allow-all/--yolo. No revertibles.' },
  { command: 'concurrency.cancel-in-progress: true', desc: 'En Actions: cancela el run en curso con la misma key cuando llega uno nuevo.' },
  { command: 'needs: [job]', desc: 'En Actions: declara dependencia entre jobs. Habilita needs.<job>.outputs.*' },
  { command: 'permissions: contents: read', desc: 'Minimo para clonar en copilot-setup-steps. Nunca dar write a setup.' },
]

export default function CheatsheetPage() {
  const [tab, setTab] = useState<'gotchas' | 'glossary' | 'paths' | 'style'>('gotchas')
  const [q, setQ] = useState('')
  const glossary = useMemo(getGlossary, [])
  const glossaryFiltered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return glossary
    return glossary.filter(
      (g) => g.term.toLowerCase().includes(needle) || g.def.toLowerCase().includes(needle),
    )
  }, [glossary, q])

  return (
    <div className="space-y-6 fade-up">
      <header>
        <div className="chip chip-accent mb-2">CHEATSHEET · DESPUES DE LEER ESTO YA SABES EL 50%</div>
        <h1 className="text-3xl font-display font-semibold text-ink">
          Gotchas, glossary y estilo del examen
        </h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          Esto es lo que diferencia entre aprobar y morir. Memoriza los gotchas. Reconoce los
          terminos. Acostumbrate al estilo de pregunta.
        </p>
      </header>

      <div className="flex gap-1 border-b border-line">
        {[
          { id: 'gotchas', label: `Gotchas (${GOTCHAS.length})` },
          { id: 'glossary', label: `Glossary (${glossary.length})` },
          { id: 'paths', label: `Paths y comandos (${PATHS.length + COMMANDS.length})` },
          { id: 'style', label: 'Estilo de pregunta' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              tab === t.id
                ? 'border-accent text-ink'
                : 'border-transparent text-ink-dim hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'gotchas' && (
        <div className="grid lg:grid-cols-2 gap-3">
          {GOTCHAS.map((g, i) => (
            <article key={i} className="card p-4 border-l-2 border-l-accent/60">
              <div className="text-[11px] font-mono text-ink-mute mb-1">GOTCHA {i + 1}</div>
              <h3 className="font-display font-semibold text-ink leading-snug">{g.title}</h3>
              <div className="text-sm text-accent mt-2 leading-relaxed font-medium">
                {g.detail}
              </div>
              <div className="text-xs text-ink-dim mt-2 leading-relaxed">
                <span className="text-ink-mute uppercase tracking-wider text-[10px] font-semibold mr-1">
                  porque:
                </span>
                {g.why}
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'glossary' && (
        <div>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca un termino… (MCP, autopilot, COPILOT_MCP_, firewall…)"
            className="w-full mb-4"
          />
          <div className="grid lg:grid-cols-2 gap-3">
            {glossaryFiltered.map((g) => (
              <article key={g.term} className="card p-3.5">
                <div className="font-display font-semibold text-ink text-sm">{g.term}</div>
                <div className="text-sm text-ink-dim mt-1 leading-relaxed">{g.def}</div>
              </article>
            ))}
            {glossaryFiltered.length === 0 && (
              <div className="text-ink-mute text-sm">No hay terminos que coincidan.</div>
            )}
          </div>
        </div>
      )}

      {tab === 'paths' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <section>
            <h2 className="text-sm font-display font-semibold text-ink mb-3 flex items-center gap-2">
              <span className="chip chip-purple">PATHS</span> Rutas que memorizar
            </h2>
            <ul className="space-y-2">
              {PATHS.map((p) => (
                <li key={p.path} className="card p-3">
                  <code className="text-accent mono text-[12px] break-all">{p.path}</code>
                  <div className="text-xs text-ink-dim mt-1 leading-relaxed">{p.desc}</div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-sm font-display font-semibold text-ink mb-3 flex items-center gap-2">
              <span className="chip chip-accent">COMANDOS</span> CLI y sintaxis clave
            </h2>
            <ul className="space-y-2">
              {COMMANDS.map((c) => (
                <li key={c.command} className="card p-3">
                  <code className="text-accent mono text-[12px] break-all">{c.command}</code>
                  <div className="text-xs text-ink-dim mt-1 leading-relaxed">{c.desc}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === 'style' && (
        <div className="grid lg:grid-cols-2 gap-3">
          {META.question_style_notes.map((n, i) => (
            <article key={i} className="card p-4">
              <div className="text-xs text-ink-mute font-mono mb-1">REGLA {i + 1}</div>
              <p className="text-sm text-ink leading-relaxed">{n}</p>
            </article>
          ))}
          <article className="card p-4 lg:col-span-2 border-accent/40 bg-accent/5">
            <h3 className="font-display font-semibold text-ink mb-2">Estrategia el dia del examen</h3>
            <ul className="text-sm text-ink-dim space-y-1.5">
              <li>▸ Lee cada pregunta DOS veces antes de elegir.</li>
              <li>▸ Si la pregunta dice "Select 2" o "Select 3", cuenta antes de enviar. Es error tipico.</li>
              <li>▸ "BEST" o "MOST-APPROPRIATE" significa que varias respuestas son tecnicamente validas. Elige la que mejor sigue las practicas de GitHub.</li>
              <li>▸ Si no sabes, marca la pregunta para review, salta, y vuelve. NO te quedes 5 min en una.</li>
              <li>▸ En case-studies, lee el contexto completo PRIMERO, despues las preguntas. El contexto es la pista.</li>
              <li>▸ Distractores plausibles: estan disenados para sonar bien pero violan un best-practice especifico (CODEOWNERS, scope minimo, autorizacion humana en accion irreversible…).</li>
            </ul>
          </article>
        </div>
      )}
    </div>
  )
}

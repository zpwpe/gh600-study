import type { Dispatch, SetStateAction } from 'react'
import type { AppState } from '../types'

interface PlanPageProps {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
}

interface Block {
  id: string
  time: string
  title: string
  desc: string
  duration: string
}

interface Day {
  id: string
  label: string
  date: string
  blocks: Block[]
}

const PLAN: Day[] = [
  {
    id: 'day-1',
    label: 'HOY · Martes 27 may · ventana 17:00-23:00 (6h)',
    date: '2026-05-27',
    blocks: [
      {
        id: '1-1',
        time: '30 min',
        duration: '30 min',
        title: '1. Lee Inicio + tarjeta "Logistica del examen"',
        desc: 'No Microsoft Learn durante examen. Solo ingles. Pide +30 min extra al agendar (150 min total). 56 Q + 2 case studies tipico. Sandbox: ghcertdemo.starttest.com.',
      },
      {
        id: '1-2',
        time: '45 min',
        duration: '45 min',
        title: '2. Lee Cheatsheet completo (gotchas + paths + comandos + style)',
        desc: '27 gotchas + paths/comandos + estilo de pregunta. Esto solo te da ~40% del examen. Memoriza: mcp-servers vs mcpServers, description obligatorio, $GITHUB_OUTPUT, artifact.destroy, preventive/detective/corrective.',
      },
      {
        id: '1-3',
        time: '45 min',
        duration: '45 min',
        title: '3. Dominio 2 cheatsheet (Tool Use + MCP, 22%) — EL MAS GRANDE',
        desc: 'Custom agent YAML, MCP types (local/stdio/http/sse), copilot-setup-steps.yml job name, COPILOT_MCP_ prefix para secrets. Mira los 5 labs de D2 en pestana Lab.',
      },
      {
        id: '1-4',
        time: '60 min',
        duration: '60 min',
        title: '4. Practica 20 preguntas filtrando D2 (modo Todas → Aleatorio)',
        desc: 'Lee cada explicacion. Si fallas algo, marca con ⚑ para repasar despues. Foco: detect-the-bug en YAML/JSON.',
      },
      {
        id: '1-5',
        time: '30 min',
        duration: '30 min',
        title: '5. Cena / descanso',
        desc: 'Come bien, despeja la cabeza. No estudies con hambre, baja rendimiento.',
      },
      {
        id: '1-6',
        time: '45 min',
        duration: '45 min',
        title: '6. Dominio 6 cheatsheet (Guardrails, 12%) + 3 labs',
        desc: 'Comparte vocabulario con D2: allowlist, CODEOWNERS, environments, hooks. preventive/detective/corrective. Cloud agent NO puede mergear ni pushar a default.',
      },
      {
        id: '1-7',
        time: '45 min',
        duration: '45 min',
        title: '7. Practica 12 preguntas D6',
        desc: 'Foco en multi-select de Responsible AI y en case-studies de seguridad.',
      },
      {
        id: '1-8',
        time: '20 min',
        duration: '20 min',
        title: '8. Cierre del dia: repaso flash gotchas + dormir',
        desc: 'Relee gotchas #1, #2, #4, #5, #18, #19 (los criticos). Duerme 7-8h, NO acortes sueno. El cerebro consolida mientras duerme.',
      },
    ],
  },
  {
    id: 'day-2',
    label: 'MANANA · Miercoles 28 may · 8:00-22:30 (la jornada completa)',
    date: '2026-05-28',
    blocks: [
      {
        id: '2-1',
        time: '60 min',
        duration: '60 min',
        title: '1. Desayuno y arranque · Dominio 5 cheatsheet (Multi-agent, 17%)',
        desc: 'EL "SLIPPERY". Los beta dicen que aqui falla mas gente. 5 eventos del lifecycle: subagent.selected/.started/.completed/.failed/.deselected. /fleet vs /delegate vs --autopilot. needs+artifacts entre jobs.',
      },
      {
        id: '2-2',
        time: '45 min',
        duration: '45 min',
        title: '2. Labs D5 (Lab pestana, 3 snippets) + practica 12 preguntas D5',
        desc: 'Lee con calma los snippets de outputs entre jobs, /delegate /fleet, matrix agents. Despues drill 12 preguntas D5.',
      },
      {
        id: '2-3',
        time: '30 min',
        duration: '30 min',
        title: '3. Pausa cafe',
        desc: 'Levantate, camina 5 min. La mente cansa.',
      },
      {
        id: '2-4',
        time: '60 min',
        duration: '60 min',
        title: '4. Dominio 1 cheatsheet (SDLC, 17%) + 1 lab + 10 preguntas D1',
        desc: 'Plan-Act-Evaluate. Contributor model. Implementation Planner. Autonomy levels (Low/Med/High). Que tareas SI/NO dar a un agente.',
      },
      {
        id: '2-5',
        time: '60 min',
        duration: '60 min',
        title: '5. Almuerzo',
        desc: 'Sin pantallas. Salir a comer si puedes. 1h completa de descanso del cerebro.',
      },
      {
        id: '2-6',
        time: '60 min',
        duration: '60 min',
        title: '6. Dominio 4 cheatsheet (Evaluacion, 17%) + 2 labs + 10 preguntas D4',
        desc: 'Root cause classification (reasoning / tool / context / environment). CodeQL/Secret scanning/Advisory DB en cloud agent. Tuning levers: instructions vs tools vs setup vs memory.',
      },
      {
        id: '2-7',
        time: '45 min',
        duration: '45 min',
        title: '7. Dominio 3 cheatsheet (Memoria, 12%) + 1 lab + 8 preguntas D3',
        desc: 'El mas chico (12%). 28 dias expiracion. Repo facts vs user preferences. Citation validation. ~/.copilot/session-state/ para resume.',
      },
      {
        id: '2-8',
        time: '30 min',
        duration: '30 min',
        title: '8. Pausa + snack',
        desc: 'Otra pausa. No comprimas, te quema el output.',
      },
      {
        id: '2-9',
        time: '30 min',
        duration: '30 min',
        title: '9. Lab completo: relee los 12 snippets seguidos',
        desc: 'En la pestana Lab, ve los 12 snippets uno tras otro. Debes reconocerlos al instante. Esto vale el 30% del examen.',
      },
      {
        id: '2-10',
        time: '60 min',
        duration: '60 min',
        title: '10. Cena',
        desc: 'Cena ligera, no pesada. Descanso real antes del mock.',
      },
      {
        id: '2-11',
        time: '120 min',
        duration: '120 min',
        title: '11. MOCK EXAM 1 cronometrado (50 Q, 120 min) — SIN ayuda',
        desc: 'Como si fuera el real. Cierra todo, sin telefono. Si dudas marca y pasa. Cuenta antes de enviar multi-select.',
      },
      {
        id: '2-12',
        time: '45 min',
        duration: '45 min',
        title: '12. Revisa errores del mock + repaso flash + dormir',
        desc: 'Lee la explicacion de TODO lo que fallaste. Anota mentalmente los 3 patrones de error que mas repetiste (tool misuse, ruta incorrecta, etc.). DORMIR 7-8h ES PARTE DE LA PREPARACION.',
      },
    ],
  },
  {
    id: 'day-3',
    label: 'DIA DEL EXAMEN · maniana hasta la hora del examen',
    date: '2026-05-29',
    blocks: [
      {
        id: '3-1',
        time: '60 min',
        duration: '60 min',
        title: '1. 8:00 · MOCK EXAM 2 (preguntas distintas, el banco rota)',
        desc: 'Hazlo cronometrado. Si sacas >35/50 (~70%) estas listo. Si menos: lee el cheatsheet completo otra vez foco en gotchas.',
      },
      {
        id: '3-2',
        time: '30 min',
        duration: '30 min',
        title: '2. Revisa errores del mock 2',
        desc: 'Solo los que fallaste. NO estudies cosas nuevas hoy, no hay tiempo de fijar nada nuevo. Solo reforzar.',
      },
      {
        id: '3-3',
        time: '30 min',
        duration: '30 min',
        title: '3. Repaso final: gotchas + paths + comandos + lab snippets',
        desc: 'Ve a Cheatsheet > Gotchas, Paths y comandos. Releelo ULTIMA VEZ. Debe ser mecanico. Y mira los 12 snippets del Lab uno por uno.',
      },
      {
        id: '3-4',
        time: '30 min',
        duration: '30 min',
        title: '4. Almuerzo ligero · sale al centro',
        desc: 'Come ligero. NO bebida fuerte. Sale al centro de examen con 30+ min de buffer. Lleva ID original (NO fotocopia) y el order number.',
      },
      {
        id: '3-5',
        time: '120 min',
        duration: '120 min',
        title: '5. 14:30 · El examen (120 min + posible +30 si pediste)',
        desc: 'Lee cada pregunta DOS veces. Si dudas, marca para review y pasa. Cuenta los seleccionados en multi-select. BEST = "el mejor segun GitHub best practices", no "la unica posible". Confia en lo entrenado.',
      },
    ],
  },
]

export default function PlanPage({ state, setState }: PlanPageProps) {
  const toggle = (id: string) => {
    setState((prev) => ({
      ...prev,
      planChecks: { ...prev.planChecks, [id]: !prev.planChecks[id] },
    }))
  }

  const total = PLAN.reduce((a, d) => a + d.blocks.length, 0)
  const done = PLAN.reduce(
    (a, d) => a + d.blocks.filter((b) => state.planChecks[b.id]).length,
    0,
  )
  const pct = Math.round((done / total) * 100)

  return (
    <div className="space-y-6 fade-up">
      <header>
        <div className="chip chip-purple mb-2">PLAN INTENSIVO 2 DIAS</div>
        <h1 className="text-3xl font-display font-semibold text-ink">
          Tu cronograma de cram
        </h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          Marca cada bloque cuando lo termines. Cada bloque dice cuanto tiempo invertir y exactamente
          que hacer. No mejora la nota leer mas; mejora HACER preguntas y revisar errores.
        </p>
      </header>

      <div className="card p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-ink-dim mb-1">
            <span>Progreso del plan</span>
            <span>
              {done} / {total} bloques · {pct}%
            </span>
          </div>
          <div className="h-2 bg-bg-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <button
          className="btn btn-ghost text-xs"
          onClick={() =>
            setState((prev) => ({
              ...prev,
              planChecks: {},
            }))
          }
        >
          Reset
        </button>
      </div>

      {PLAN.map((day) => {
        const dayDone = day.blocks.filter((b) => state.planChecks[b.id]).length
        return (
          <section key={day.id} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-ink-mute font-mono">{day.date}</div>
                <h2 className="text-lg font-display font-semibold text-ink">{day.label}</h2>
              </div>
              <div className="chip">
                {dayDone}/{day.blocks.length}
              </div>
            </div>
            <ul className="space-y-2">
              {day.blocks.map((b) => {
                const checked = !!state.planChecks[b.id]
                return (
                  <li
                    key={b.id}
                    className={`border rounded-lg p-3 flex gap-3 cursor-pointer transition ${
                      checked
                        ? 'border-good/40 bg-good/5'
                        : 'border-line bg-bg-2 hover:border-line-strong'
                    }`}
                    onClick={() => toggle(b.id)}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 grid place-items-center text-xs ${
                        checked ? 'border-good bg-good/30 text-good' : 'border-line-strong text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-display font-medium ${
                            checked ? 'text-ink-dim line-through' : 'text-ink'
                          }`}
                        >
                          {b.title}
                        </span>
                        <span className="chip">{b.duration}</span>
                      </div>
                      <div className="text-sm text-ink-dim mt-1 leading-relaxed">{b.desc}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

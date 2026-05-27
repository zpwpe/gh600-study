import type { Dispatch, SetStateAction } from 'react'
import type { AppState } from '../types'

interface PlanPageProps {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
}

interface Block {
  id: string
  duration: string
  title: string
  desc: string
}

interface Day {
  id: string
  label: string
  hours: string
  blocks: Block[]
}

const PLAN: Day[] = [
  {
    id: 'day-1',
    label: 'DAY 1 · the evening before the cram weekend',
    hours: 'about 5 hours of net study',
    blocks: [
      {
        id: '1-1',
        duration: '30 min',
        title: '1. Read Home + the "Exam logistics" card',
        desc: 'No Microsoft Learn during the exam. English only. Ask for +30 min at booking if English is not your first language (you get 150 min total). 56 Q + 2 case studies is the typical beta report. Sandbox: ghcertdemo.starttest.com.',
      },
      {
        id: '1-2',
        duration: '45 min',
        title: '2. Read the full Cheatsheet (gotchas + paths + commands + question style)',
        desc: '27 gotchas + paths + CLI commands + question style. Doing this alone gets you ~40% of the exam. Lock in: mcp-servers vs mcpServers, description is mandatory, $GITHUB_OUTPUT, artifact.destroy, preventive/detective/corrective.',
      },
      {
        id: '1-3',
        duration: '45 min',
        title: '3. Domain 2 cheatsheet (Tool Use + MCP, 20–25%) — THE BIG ONE',
        desc: 'Custom agent YAML, MCP types (local/stdio/http/sse), copilot-setup-steps.yml job name, COPILOT_MCP_ prefix for secrets. Then run the 5 D2 labs in the Artifact lab tab.',
      },
      {
        id: '1-4',
        duration: '60 min',
        title: '4. Drill 20 questions filtered to D2 (mode: All → Shuffle)',
        desc: 'Read every explanation. Anything you miss, flag with ⚑ to revisit later. Focus: spot-the-bug in YAML/JSON.',
      },
      {
        id: '1-5',
        duration: '30 min',
        title: '5. Dinner / break',
        desc: 'Eat properly, clear your head. Studying hungry tanks output.',
      },
      {
        id: '1-6',
        duration: '45 min',
        title: '6. Domain 6 cheatsheet (Guardrails, 10–15%) + 3 labs',
        desc: 'Shares vocabulary with D2: allowlists, CODEOWNERS, environments, hooks. preventive/detective/corrective. Cloud agent cannot merge or push to default branch.',
      },
      {
        id: '1-7',
        duration: '45 min',
        title: '7. Drill 12 questions on D6',
        desc: 'Focus on multi-select Responsible AI questions and on security case studies.',
      },
      {
        id: '1-8',
        duration: '20 min',
        title: '8. Wrap: flash review of the critical gotchas + sleep',
        desc: 'Reread gotchas 1, 2, 4, 5, 18, 19. Sleep 7–8 hours. Do not cut sleep. Your brain consolidates while you sleep.',
      },
    ],
  },
  {
    id: 'day-2',
    label: 'DAY 2 · the full cram day',
    hours: 'about 9 hours of net study',
    blocks: [
      {
        id: '2-1',
        duration: '60 min',
        title: '1. Breakfast and launch · Domain 5 cheatsheet (Multi-agent, 15–20%)',
        desc: 'The slippery one. Betas say this is where most people miss points. 5 sub-agent lifecycle events: subagent.selected / .started / .completed / .failed / .deselected. /fleet vs /delegate vs --autopilot. needs + artifacts between jobs.',
      },
      {
        id: '2-2',
        duration: '45 min',
        title: '2. D5 labs (3 snippets) + drill 12 D5 questions',
        desc: 'Walk through the snippets on outputs between jobs, /delegate / /fleet, and matrix agents. Then drill 12 D5 questions.',
      },
      {
        id: '2-3',
        duration: '30 min',
        title: '3. Coffee break',
        desc: 'Stand up, walk 5 minutes. Your brain needs the reset.',
      },
      {
        id: '2-4',
        duration: '60 min',
        title: '4. Domain 1 cheatsheet (SDLC, 15–20%) + 1 lab + 10 D1 questions',
        desc: 'Plan-Act-Evaluate. Contributor model. Implementation Planner. Autonomy levels (Low / Med / High). When to give a task to an agent and when not to.',
      },
      {
        id: '2-5',
        duration: '60 min',
        title: '5. Lunch',
        desc: 'No screens. Step outside if you can. One full hour of brain rest.',
      },
      {
        id: '2-6',
        duration: '60 min',
        title: '6. Domain 4 cheatsheet (Evaluation, 15–20%) + 2 labs + 10 D4 questions',
        desc: 'Root-cause classification (reasoning / tool / context / environment). CodeQL / secret scanning / Advisory DB on the cloud agent. Tuning levers: instructions vs tools vs setup vs memory.',
      },
      {
        id: '2-7',
        duration: '45 min',
        title: '7. Domain 3 cheatsheet (Memory, 10–15%) + 1 lab + 8 D3 questions',
        desc: 'The smallest domain (10–15%). 28-day expiry. Repo facts vs user preferences. Citation validation. ~/.copilot/session-state/ for resume.',
      },
      {
        id: '2-8',
        duration: '30 min',
        title: '8. Break + snack',
        desc: 'Another pause. Compressing more here burns your output.',
      },
      {
        id: '2-9',
        duration: '30 min',
        title: '9. Full lab pass: reread the 12 snippets back to back',
        desc: 'In the Artifact lab tab, walk all 12 snippets in sequence. You should recognize them instantly. This alone is worth ~30% of the exam.',
      },
      {
        id: '2-10',
        duration: '60 min',
        title: '10. Dinner',
        desc: 'Light dinner, not heavy. Real rest before the mock.',
      },
      {
        id: '2-11',
        duration: '120 min',
        title: '11. MOCK EXAM 1 — timed (50 Q, 120 min) — no support',
        desc: 'Like the real thing. Close everything, no phone. Flag and skip if you stall. Count selections on multi-select before submitting.',
      },
      {
        id: '2-12',
        duration: '45 min',
        title: '12. Review the mock + flash recap + sleep',
        desc: 'Read the explanation on every miss. Note the 3 error patterns you repeated most (tool misuse, wrong path, etc.). SLEEPING 7–8 HOURS IS PART OF PREP.',
      },
    ],
  },
  {
    id: 'day-3',
    label: 'DAY 3 · exam day, morning before the exam',
    hours: 'about 3 hours of light review',
    blocks: [
      {
        id: '3-1',
        duration: '60 min',
        title: '1. Morning: MOCK EXAM 2 (questions rotate, the bank reshuffles)',
        desc: 'Run it timed. If you hit >35/50 (~70%), you are ready. If less, reread the full cheatsheet with focus on the gotchas.',
      },
      {
        id: '3-2',
        duration: '30 min',
        title: '2. Review the mock 2 misses',
        desc: 'Only the ones you missed. Do NOT study anything new today — there is no time to lock it in. Only reinforce.',
      },
      {
        id: '3-3',
        duration: '30 min',
        title: '3. Final flash review: gotchas + paths + commands + lab snippets',
        desc: 'Open Cheatsheet > Gotchas, then > Paths & commands. Read it one last time; it should feel mechanical. Then look at the 12 lab snippets one by one.',
      },
      {
        id: '3-4',
        duration: '30 min',
        title: '4. Light lunch + leave for the test center',
        desc: 'Eat light. No heavy drinks. Leave for the test center with a 30+ min buffer. Bring your ID (original, not a copy) and the order number.',
      },
      {
        id: '3-5',
        duration: '120 min',
        title: '5. The exam (120 min, plus 30 if you booked the accommodation)',
        desc: 'Read every question TWICE before picking. Flag and skip if you stall. Count selections on multi-select. "BEST" means "the best per GitHub guidance", not "the only possible one". Trust what you trained.',
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
        <div className="chip chip-purple mb-2">3-DAY INTENSIVE CRAM PLAN</div>
        <h1 className="text-3xl font-display font-semibold text-ink">Your cram schedule</h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          Check each block as you finish it. Each block tells you how long to invest and exactly
          what to do. More reading does NOT improve your score; drilling questions and reviewing
          the misses does.
        </p>
      </header>

      <div className="card p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-ink-dim mb-1">
            <span>Plan progress</span>
            <span>
              {done} / {total} blocks · {pct}%
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
          onClick={() => setState((prev) => ({ ...prev, planChecks: {} }))}
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
                <div className="text-xs text-ink-mute font-mono">{day.hours}</div>
                <h2 className="text-lg font-display font-semibold text-ink">{day.label}</h2>
              </div>
              <div className="chip">{dayDone}/{day.blocks.length}</div>
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

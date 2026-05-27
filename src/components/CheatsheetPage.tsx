import { useMemo, useState } from 'react'
import { META } from '../lib/exam'

interface Gotcha {
  title: string
  detail: string
  why: string
}

const GOTCHAS: Gotcha[] = [
  {
    title: 'The Copilot firewall ONLY covers Bash-launched processes',
    detail: 'It does NOT cover MCP servers or copilot-setup-steps.yml.',
    why: 'Trap #1. If the question asks "how do you secure egress across all agent tools", the firewall alone is not enough: you have to combine it with MCP scoping and setup-steps permissions.',
  },
  {
    title: '--no-ask-user is NOT the same as --autopilot',
    detail: '--no-ask-user suppresses clarifying questions. --autopilot enables multi-step continuation.',
    why: 'Almost every exam embeds this distinction. If the question asks "the mode where the agent continues several steps on its own", the answer is --autopilot. To bound it you use --max-autopilot-continues.',
  },
  {
    title: 'Custom agents live at `.github/agents/*.agent.md`',
    detail: 'Repo scope. Org scope: `/agents/*.agent.md` inside the `.github-private` repo.',
    why: 'Shows up as fill-blank. Memorize the exact `.agent.md` extension and the path.',
  },
  {
    title: 'Copilot Memory entries expire after 28 days of non-use',
    detail: 'Not 7, not 14, not 30. EXACTLY 28 days. Successful validation resets the timer.',
    why: 'There is a direct question about the number. If you hesitate, the answer is 28.',
  },
  {
    title: 'Cloud agent does NOT support OAuth on remote MCP servers',
    detail: 'Use PAT or another token-based auth.',
    why: 'Classic "which statement is correct" question. OAuth does not work on the cloud agent for remote MCP.',
  },
  {
    title: 'MCP secrets need the `COPILOT_MCP_` prefix',
    detail: 'In JSON config: `$COPILOT_MCP_SECRET_NAME`.',
    why: 'Fill-blank or detect-the-bad-config. If you see `env: {TOKEN: "$TOKEN"}` that hard-coded form is WRONG. The correct form references `$COPILOT_MCP_*`.',
  },
  {
    title: 'Precedence for custom agents and MCP: repo > org > enterprise',
    detail: '"Lowest level wins". The scope closest to the code wins.',
    why: 'If a question says "both defined at repo and org level — which wins", answer REPO.',
  },
  {
    title: 'The job in copilot-setup-steps.yml MUST be named `copilot-setup-steps`',
    detail: 'If you name it anything else, Copilot ignores it entirely.',
    why: 'Near-guaranteed fill-blank. Also shows up as detect-the-bug.',
  },
  {
    title: 'MCP registry: base URL only, no /v0.1/servers suffix',
    detail: 'The client builds the path. If you paste the full URL, it fails.',
    why: 'The endpoint the client requests is GET /v0.1/servers. You provide only the base.',
  },
  {
    title: 'Cloud agent supports ONLY Ubuntu x64 and Windows 64-bit',
    detail: 'No macOS, no ARM64. GitHub-hosted or self-hosted EPHEMERAL.',
    why: 'Classic multi-select. macOS and ARM64 are distractors.',
  },
  {
    title: 'Cloud agent only consumes MCP TOOLS, not resources or prompts',
    detail: 'MCP spec defines tools/resources/prompts. The cloud agent ignores resources and prompts.',
    why: 'Shows up as statement-true/false. If the question says "cloud agent uses MCP resources", that is FALSE.',
  },
  {
    title: 'The 5 sub-agent lifecycle events',
    detail: 'subagent.selected, .started, .completed, .failed, .deselected.',
    why: 'Multi-select. Memorize the exact 5 names.',
  },
  {
    title: '`disable-model-invocation: true` replaces the old `infer`',
    detail: 'Blocks automatic selection of the agent by the model. Manual selection still works.',
    why: 'If an option mentions `infer: false`, that is the retired property. The correct one is disable-model-invocation.',
  },
  {
    title: 'Actions workflows are BLOCKED on Copilot PRs by default',
    detail: 'They need "Approve and run workflows" from a user with write access.',
    why: 'Safety by design — prevents the agent from triggering CI with elevated permissions. Often phrased as "what happens by default".',
  },
  {
    title: 'Custom allowlist: domain (covers subdomains) vs URL (scheme + path)',
    detail: 'Domain `contoso.corp` covers `*.contoso.corp`. URL `https://...` is scheme-and-path scoped.',
    why: 'Typical multi-select. Glob wildcards like `*.contoso.corp` are NOT valid format (use domain).',
  },
  {
    title: 'Repo facts vs user preferences in Copilot Memory',
    detail: 'Repo facts = project conventions with citations. User preferences = personal preferences that cross repos.',
    why: 'Code review uses ONLY repo facts, never user preferences. A question claiming "Copilot code review uses my user prefs" is WRONG.',
  },
  {
    title: 'The Eyes-on emoji (👀) = Copilot has acknowledged + is processing',
    detail: 'Not a "like" reaction. It signals the agent has seen the comment.',
    why: 'Shows up in observability match-pairs. Do not confuse with the verified badge or session logs.',
  },
  {
    title: 'mcp-servers (YAML agent frontmatter) vs mcpServers (JSON .mcp.json)',
    detail: 'In the .agent.md frontmatter the key is kebab-case. In the .mcp.json config file it is camelCase.',
    why: 'Most-reported confusion from beta candidates. The exam shows a snippet with the wrong key and asks what is wrong. Memorize: agent = kebab, config = camel.',
  },
  {
    title: '`description` is the REQUIRED frontmatter field, not `name`',
    detail: '`name` is optional. `description` is required. `user-invocable`, `target`, `tools` are optional.',
    why: 'Direct question from the guide: which field is required in the custom-agent YAML frontmatter? The trap is to pick `name`.',
  },
  {
    title: '`search` (codebase) vs `web` (external URLs)',
    detail: '`search` = grep/glob over the repo. `web` = WebSearch and WebFetch on external URLs.',
    why: 'Typical multi-select. Trap is claiming `search` does web search. It does NOT. Two different tools.',
  },
  {
    title: 'Controls: branch protection = preventive, CodeQL = detective, revert PR = corrective',
    detail: 'Preventive blocks before. Detective finds after. Corrective fixes what was already merged.',
    why: 'Direct question: order these three as preventive/detective/corrective. Answer: A, in that order.',
  },
  {
    title: '$GITHUB_OUTPUT is NOT an environment variable',
    detail: 'Writing `echo "X=y" >> "$GITHUB_OUTPUT"` creates a STEP output, not a global env.',
    why: 'The trap options: A) global env, B) step output, C) writes to summary, D) modifies needs. Answer: B.',
  },
  {
    title: 'artifact.destroy in the audit log = MANUAL artifact deletion',
    detail: 'Not creation. Not disable. It is a manual destroy with the actor identified.',
    why: 'Read-the-audit-log question. Memorize the main audit log events.',
  },
  {
    title: '~/.copilot/session-state/<id>/ is where state lives for resume',
    detail: 'events.jsonl + metadata. `resume=true` in the log means resumed session, not new.',
    why: 'Log-reading question. If you see `resume=true` and a load from session-state, that is a resumed session. Trap distractors: "MCP disabled" or "PR auto-created".',
  },
  {
    title: 'No access to Microsoft Learn during the GH-600 exam',
    detail: 'No GitHub Docs either. Proctored, English-only.',
    why: 'You cannot lean on "look it up live". Walk in with paths, commands, and key differences already memorized.',
  },
  {
    title: 'If your language is not offered, request +30 min extra',
    detail: 'GH-600 is English-only. Microsoft allows +30 min for non-native English speakers.',
    why: 'Official accommodation policy. Request it at booking time. That makes it 120 + 30 = 150 min.',
  },
  {
    title: '`concurrency.cancel-in-progress: true` cancels in-progress runs with the same key',
    detail: 'Top-level `concurrency.group` defines the key, `cancel-in-progress: true` enforces the cancel.',
    why: 'Multi-select / scenario question. Trap distractors: "runs everything in parallel" or "retries failed runs".',
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
  { path: '.github/agents/*.agent.md', desc: 'Custom agents (repo scope). Frontmatter YAML + Markdown body.' },
  { path: '/agents/*.agent.md (inside .github-private)', desc: 'Custom agents at ORG scope. The `.github-private` repo distributes them org-wide.' },
  { path: '.github/copilot-instructions.md', desc: 'Repository-wide instructions consumed by Copilot across all surfaces.' },
  { path: '.github/instructions/**/*.instructions.md', desc: 'Path-specific instructions (glob). More granular than the repo-wide file.' },
  { path: '.github/hooks/*.json', desc: 'Hooks (preToolUse / postToolUse) to block or audit tool calls.' },
  { path: '.github/workflows/copilot-setup-steps.yml', desc: 'Pre-provisions the Copilot cloud agent ephemeral environment.' },
  { path: '.mcp.json', desc: 'Project/IDE-level MCP server config. Key: `mcpServers` (camelCase).' },
  { path: 'AGENTS.md', desc: 'Agent-style instructions consumed by the Copilot CLI. COPILOT_CUSTOM_INSTRUCTIONS_DIRS extends the lookup paths.' },
  { path: '~/.copilot/session-state/<id>/events.jsonl', desc: 'Durable session state. Enables --resume.' },
  { path: '$GITHUB_OUTPUT', desc: 'Step outputs file. `echo "k=v" >> "$GITHUB_OUTPUT"`.' },
  { path: '$GITHUB_STEP_SUMMARY', desc: 'Markdown file rendered in the job UI. NOT a step output.' },
  { path: 'copilot/* (branch)', desc: 'Branch the cloud agent creates for its PRs. It cannot touch the default branch.' },
]

const COMMANDS: CommandRef[] = [
  { command: 'copilot --autopilot', desc: 'Multi-step autonomous mode. Continues without asking for the next step.' },
  { command: '--max-autopilot-continues N', desc: 'Bounds how many autonomous continuations autopilot can make.' },
  { command: '--no-ask-user', desc: 'Suppresses clarifying questions but is NOT multi-step.' },
  { command: '--yolo / --allow-all', desc: 'Permits all tools / paths / URLs without prompting. Non-toggleable.' },
  { command: '--resume <id>', desc: 'Resumes a previous named session by loading ~/.copilot/session-state/.' },
  { command: '--continue', desc: 'Continues the most recent session.' },
  { command: '/agent <name>', desc: 'Switches the active custom agent in a CLI session.' },
  { command: '/delegate <name>', desc: 'Delegates a sub-task to another agent. Emits subagent.* events.' },
  { command: '/fleet <pattern>', desc: 'Runs multiple sub-agents in parallel based on a decomposed plan.' },
  { command: '/allow-all, /yolo (slash)', desc: 'In-session equivalents to the --allow-all / --yolo flags. Non-reversible.' },
  { command: 'concurrency.cancel-in-progress: true', desc: 'In Actions: cancels the in-progress run with the same key when a new one arrives.' },
  { command: 'needs: [job]', desc: 'In Actions: declares a dependency between jobs. Enables needs.<job>.outputs.*.' },
  { command: 'permissions: contents: read', desc: 'Minimum permission to clone in copilot-setup-steps. Never grant write to setup.' },
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
        <div className="chip chip-accent mb-2">CHEATSHEET · READ THIS AND YOU ALREADY KNOW ~50%</div>
        <h1 className="text-3xl font-display font-semibold text-ink">
          Gotchas, glossary, and exam style
        </h1>
        <p className="text-ink-dim mt-1 max-w-2xl">
          This is what separates pass from fail. Memorize the gotchas. Recognize the terms. Get
          used to how questions are phrased.
        </p>
      </header>

      <div className="flex gap-1 border-b border-line">
        {[
          { id: 'gotchas', label: `Gotchas (${GOTCHAS.length})` },
          { id: 'glossary', label: `Glossary (${glossary.length})` },
          { id: 'paths', label: `Paths & commands (${PATHS.length + COMMANDS.length})` },
          { id: 'style', label: 'Question style' },
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
              <div className="text-sm text-accent mt-2 leading-relaxed font-medium">{g.detail}</div>
              <div className="text-xs text-ink-dim mt-2 leading-relaxed">
                <span className="text-ink-mute uppercase tracking-wider text-[10px] font-semibold mr-1">
                  why:
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
            placeholder="Search a term… (MCP, autopilot, COPILOT_MCP_, firewall…)"
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
              <div className="text-ink-mute text-sm">No matching terms.</div>
            )}
          </div>
        </div>
      )}

      {tab === 'paths' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <section>
            <h2 className="text-sm font-display font-semibold text-ink mb-3 flex items-center gap-2">
              <span className="chip chip-purple">PATHS</span> Paths to memorize
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
              <span className="chip chip-accent">COMMANDS</span> CLI flags &amp; key syntax
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
              <div className="text-xs text-ink-mute font-mono mb-1">RULE {i + 1}</div>
              <p className="text-sm text-ink leading-relaxed">{n}</p>
            </article>
          ))}
          <article className="card p-4 lg:col-span-2 border-accent/40 bg-accent/5">
            <h3 className="font-display font-semibold text-ink mb-2">Exam-day strategy</h3>
            <ul className="text-sm text-ink-dim space-y-1.5">
              <li>▸ Read every question TWICE before picking.</li>
              <li>▸ When it says "Select 2" or "Select 3", count your selections before submitting. Common error.</li>
              <li>▸ "BEST" or "MOST APPROPRIATE" means several answers may be technically valid. Pick the one closest to GitHub guidance.</li>
              <li>▸ If you don't know, flag for review, skip, and come back. Do NOT burn 5 minutes on one question.</li>
              <li>▸ On case studies, read the full context FIRST, then the questions. The context is the hint.</li>
              <li>▸ Plausible distractors are written to sound right but violate a specific best practice (CODEOWNERS, least scope, human approval on irreversible actions, etc.).</li>
            </ul>
          </article>
        </div>
      )}
    </div>
  )
}

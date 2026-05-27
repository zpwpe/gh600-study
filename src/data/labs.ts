export type LabType = 'yaml-agent' | 'json-mcp' | 'yaml-actions' | 'log' | 'audit' | 'policy' | 'hook' | 'cli'

export interface Lab {
  id: string
  type: LabType
  domain: number
  title: string
  snippet: string
  question: string
  answer: string
  whyItMatters: string
}

export const LABS: Lab[] = [
  {
    id: 'lab-1',
    type: 'yaml-agent',
    domain: 2,
    title: 'Minimal custom agent: which fields are required?',
    snippet: `---
name: reviewer
description: Reviews pull requests for security and test risk.
tools:
  - read
  - search
mcp-servers:
  github/security:
    tools:
      - code-scanning/*
---
Return findings with severity, file path, and rationale.`,
    question: 'What is the required frontmatter field, and what can / cannot this agent do?',
    answer: '**description** is the only required field per the custom-agents-configuration reference (name is optional). The agent can READ and SEARCH (tools: read, search), but cannot edit or execute. It also gets access to the `github/security` MCP server scoped to `code-scanning/*`. Note: in agent frontmatter the key is `mcp-servers` (with a hyphen).',
    whyItMatters: 'A direct exam question asks exactly which frontmatter field is required. Options are A: name, B: description, C: target, D: user-invocable. The answer is B.',
  },
  {
    id: 'lab-2',
    type: 'json-mcp',
    domain: 2,
    title: 'mcp-servers (YAML agent) vs mcpServers (JSON .mcp.json)',
    snippet: `// .mcp.json (project config)
{
  "mcpServers": {
    "local-docs": { "command": "node", "args": ["server.js"] },
    "remote-index": { "url": "https://mcp.example.com/sse" }
  }
}`,
    question: 'How does this key differ from the one you used in lab 1?',
    answer: 'In `.mcp.json` (project / IDE config) the key is **mcpServers** (camelCase, no hyphen). In agent frontmatter YAML the key is **mcp-servers** (kebab-case with hyphen). They are NOT interchangeable. `command + args` = local / stdio transport. `url` with `/sse` = remote SSE. For plain HTTP you would just use `url` without `/sse`.',
    whyItMatters: 'The most reported confusion from beta candidates. The exam shows a snippet with the wrong key and asks "what is wrong here". Swap the two and you fail.',
  },
  {
    id: 'lab-3',
    type: 'yaml-actions',
    domain: 5,
    title: 'Outputs between jobs in GitHub Actions',
    snippet: `jobs:
  plan:
    outputs:
      artifact_name: \${{ steps.pack.outputs.name }}
    steps:
      - id: pack
        run: echo "name=agent-plan" >> "$GITHUB_OUTPUT"
  review:
    needs: plan
    steps:
      - run: echo "reviewing \${{ needs.plan.outputs.artifact_name }}"`,
    question: 'How does data flow between these two jobs?',
    answer: 'The `pack` step writes to `$GITHUB_OUTPUT` (a file, not an environment variable). The `plan` job then exposes that as `outputs.artifact_name`, pointing at `steps.pack.outputs.name`. The `review` job declares `needs: plan` and reads it via `needs.plan.outputs.artifact_name`. It is NOT a global env var, NOT a step summary, NOT a runner context.',
    whyItMatters: 'Common fill-blank or multiple-choice. The trap is to claim it is a global env var. It is a step output.',
  },
  {
    id: 'lab-4',
    type: 'yaml-actions',
    domain: 6,
    title: 'concurrency with cancel-in-progress',
    snippet: `concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh`,
    question: 'What happens when a new run with the same key arrives while one is already in progress?',
    answer: 'GitHub Actions cancels the in-progress run. `concurrency.group` defines the key (here: workflow + ref, so each branch has its own bucket). `cancel-in-progress: true` means "if a new one arrives with the same key, kill the previous". Useful for continuous CI: only the latest commit runs. NOT parallel, NOT only for strategy.matrix, NOT retrying failures.',
    whyItMatters: 'Typical multiple-choice. Trap distractors: "runs everything in parallel" or "retries failed runs". The exact answer is "cancels in-progress runs with the same key".',
  },
  {
    id: 'lab-5',
    type: 'log',
    domain: 3,
    title: 'Resumed agent session',
    snippet: `[copilot.cli]
session.id=abc123
loaded ~/.copilot/session-state/abc123/events.jsonl
resume=true
last_plan=edit deploy.yml
current_branch=feature/agent-fix`,
    question: 'What is happening in this log, and how do you prevent drift?',
    answer: 'The agent is resuming a previous session by loading local state from `~/.copilot/session-state/<id>/`. `resume=true` confirms this is NOT a new session. `last_plan` and `current_branch` are durable artifacts that survive across sessions. To avoid drift: re-validate Copilot Memory citations against the current branch before reusing them (repo memories expire after 28 days and are validated on every reuse).',
    whyItMatters: 'Typical log-reading question. Options often include "new session", "resumed session", "MCP disabled", "PR auto-created". The answer here is the resumed session.',
  },
  {
    id: 'lab-6',
    type: 'audit',
    domain: 6,
    title: 'Audit log with artifact.destroy',
    snippet: `action=artifact.destroy
actor=octocat
repo=org/app
created_at=2026-05-24T09:14:22Z
artifact_id=987654`,
    question: 'What does this entry tell you, and when is it logged?',
    answer: 'A user (`octocat`) MANUALLY deleted a workflow artifact from `org/app`. The `artifact.destroy` event is logged when someone with permission deletes an artifact via UI or API. It is NOT creation (that is `artifact.create`), NOT a workflow disable, NOT a secret deletion. The `actor` field tells you who did it — useful for auditing.',
    whyItMatters: 'The exam includes audit-log knowledge. Memorize the main events: `artifact.create`, `artifact.destroy`, `workflow_run.*`, `repo.add_topic`, etc. The trap is to claim it is creation.',
  },
  {
    id: 'lab-7',
    type: 'yaml-actions',
    domain: 2,
    title: 'copilot-setup-steps.yml with the wrong job name',
    snippet: `name: Copilot environment setup
on:
  workflow_dispatch:

jobs:
  prepare-environment:        # <-- THIS
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22`,
    question: 'What is wrong here from the Copilot cloud agent point of view?',
    answer: 'The job is named `prepare-environment`. For Copilot to use it as setup steps, the job MUST be named exactly `copilot-setup-steps`. If not, Copilot ignores it entirely and the agent boots without your setup. The file itself is conventionally `.github/workflows/copilot-setup-steps.yml`, but the file name is NOT the critical bit; the job name IS.',
    whyItMatters: 'Typical fill-blank: "the job in copilot-setup-steps.yml must be named ______". Also appears as detect-the-bug. Big payoff for nailing this detail.',
  },
  {
    id: 'lab-8',
    type: 'hook',
    domain: 6,
    title: 'Copilot preToolUse hook',
    snippet: `// .github/hooks/pre-tool-use.json
{
  "event": "preToolUse",
  "match": { "tool": "execute" },
  "action": "deny",
  "reason": "Shell access requires approval. Open an issue and request escalation."
}`,
    question: 'What does this hook do and how is it used?',
    answer: 'Before the agent runs the `execute` tool (shell), the hook fires and denies the action with a reason. It is a preventive guardrail: the agent never actually runs the shell command. Hooks live under `.github/hooks/*.json`. Common events: `preToolUse` (before the tool) and `postToolUse` (after). Useful to enforce plan-first behavior or to block destructive actions.',
    whyItMatters: 'Match-pairs or multi-select: identify what each hook type does and where it lives. The path `.github/hooks/` and the events `preToolUse / postToolUse` are fill-blank candidates.',
  },
  {
    id: 'lab-9',
    type: 'cli',
    domain: 6,
    title: '--no-ask-user vs --autopilot (Copilot CLI)',
    snippet: `# Case A
copilot --no-ask-user "Refactor the payment service"

# Case B
copilot --autopilot --max-autopilot-continues 5 "Refactor the payment service"`,
    question: 'What is the practical difference between these two commands?',
    answer: '`--no-ask-user` (Case A): the agent does NOT ask clarifying questions, but does NOT continue multi-step on its own. If it needs another model step it stops. `--autopilot` (Case B): the agent continues autonomously step by step, up to 5 continuations (`--max-autopilot-continues 5`). True multi-step. Combining them is not redundant: autopilot gives you the loop, max-continues gives you the bound. `--yolo` would permit all tools / paths / URLs with no prompt.',
    whyItMatters: 'Cheatsheet gotcha #2. Almost every exam embeds this distinction. If the question asks "the mode where the agent continues several steps on its own", it is `--autopilot`. If it asks "suppress clarifying questions", it is `--no-ask-user`.',
  },
  {
    id: 'lab-10',
    type: 'cli',
    domain: 5,
    title: '/delegate and /fleet in the Copilot CLI',
    snippet: `# Interactive session
> /agent reviewer
> Review PR #42 for security issues.

> /delegate planner
> Break the migration into 3 phases.

> /fleet matrix
> Run reviewer, auditor and consolidator on PR #42.`,
    question: 'What does each slash command do?',
    answer: '`/agent <name>`: switches to the custom agent named <name>. `/delegate <name>`: delegates a sub-task to another agent (the sub-agent emits subagent.selected / .started / .completed / .failed / .deselected events). `/fleet <pattern>`: runs multiple sub-agents in parallel based on the decomposed plan. `/fleet` is the workhorse for multi-agent in the CLI.',
    whyItMatters: 'Several sources confirm the CLI is heavily tested. Multi-select asking which are delegation slash commands. The trap is to include `/yolo` (exists, but it is for permissions, not delegation) or `/allow-all`.',
  },
  {
    id: 'lab-11',
    type: 'policy',
    domain: 6,
    title: 'Branch protection + ruleset (preventive/detective/corrective)',
    snippet: `# Settings -> Rules -> Rulesets
- Name: "Protect main"
  Enforcement: Active
  Target: branch
  Branch ruleset:
    - Require a pull request before merging
    - Require approval from a second user with write permissions
    - Require status checks: [ci, codeql-analysis]
    - Block force pushes`,
    question: 'Classify branch protection, CodeQL and "revert PR" as preventive, detective, or corrective controls.',
    answer: '**Branch protection = preventive**: it stops bad code from reaching main in the first place. **CodeQL = detective**: it runs after push/PR and DETECTS vulnerabilities; it does not block by itself unless you wire it as a required status check. **Revert PR = corrective**: when something bad has already been merged, you revert it. The three layers complement each other: prevent, detect, correct.',
    whyItMatters: 'Direct question from the public sources: order these three as preventive / detective / corrective. The answer is A (preventive, detective, corrective).',
  },
  {
    id: 'lab-12',
    type: 'yaml-actions',
    domain: 6,
    title: 'Copilot PR waiting for human approval',
    snippet: `pull_request:
  author: github-copilot[bot]
  changed_files:
    - .github/workflows/deploy.yml
status: waiting_for_approval
message: "Approve and run workflows to start CI"`,
    question: 'Why is this Copilot PR blocked, and how do you unblock it?',
    answer: 'By default, Actions workflows are BLOCKED on PRs opened by the Copilot cloud agent. It needs someone with write access to click "Approve and run workflows" on the PR Actions tab. This is safety by design: it prevents the agent from triggering CI with elevated permissions without human review. If the PR also touches `.github/workflows/*`, that path is usually under CODEOWNERS and/or additional rulesets — double gate.',
    whyItMatters: 'Cheatsheet gotcha #14. Typical question: "what happens by default to workflows on Copilot PRs". Answer: "blocked until Approve and run workflows".',
  },
]

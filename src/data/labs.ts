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
    title: 'Custom agent minimo: que campos son obligatorios',
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
    question: 'Cual es el campo obligatorio del frontmatter y que puede/no puede hacer este agente?',
    answer: '**description** es el unico campo obligatorio segun la referencia oficial (name es opcional). El agente puede LEER y BUSCAR (tools: read, search), pero NO puede editar ni ejecutar. Tambien tiene acceso al MCP `github/security` con tools scoped a `code-scanning/*`. Ojo: en frontmatter de agente la clave es `mcp-servers` (con guion).',
    whyItMatters: 'GPT Pro reporta que una pregunta del examen pide exactamente que campo del frontmatter es obligatorio. Es A:name B:description C:target D:user-invocable. La respuesta es B.',
  },
  {
    id: 'lab-2',
    type: 'json-mcp',
    domain: 2,
    title: 'mcp-servers (YAML agent) vs mcpServers (JSON .mcp.json)',
    snippet: `// archivo .mcp.json (config de proyecto)
{
  "mcpServers": {
    "local-docs": { "command": "node", "args": ["server.js"] },
    "remote-index": { "url": "https://mcp.example.com/sse" }
  }
}`,
    question: 'Cual es la diferencia entre esta clave y la que usaste en el lab 1?',
    answer: 'En `.mcp.json` (config del proyecto/IDE) la clave es **mcpServers** (camelCase, sin guion). En frontmatter YAML del agente la clave es **mcp-servers** (kebab-case con guion). NO son intercambiables. `command + args` = transporte local/stdio. `url` con `/sse` = remoto SSE. Para HTTP normal pondrias solo `url` sin `/sse`.',
    whyItMatters: 'Es el error mas reportado por candidatos beta. El examen pone snippets con la clave incorrecta y te pregunta "que esta mal". Si confundes los dos, fallas.',
  },
  {
    id: 'lab-3',
    type: 'yaml-actions',
    domain: 5,
    title: 'Outputs entre jobs en GitHub Actions',
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
    question: 'Como viaja el dato entre los dos jobs?',
    answer: 'El step `pack` escribe en `$GITHUB_OUTPUT` (archivo, no variable de entorno). El job `plan` expone ese output con `outputs.artifact_name` que apunta a `steps.pack.outputs.name`. El job `review` declara `needs: plan` y lo lee con `needs.plan.outputs.artifact_name`. **NO** es variable global, **NO** es step summary, **NO** es contexto del runner.',
    whyItMatters: 'Pregunta tipica fill-blank o multiple-choice: que afirmacion es correcta sobre `echo "X=y" >> "$GITHUB_OUTPUT"`. La trampa es decir que es env global. Es output del step.',
  },
  {
    id: 'lab-4',
    type: 'yaml-actions',
    domain: 6,
    title: 'concurrency con cancel-in-progress',
    snippet: `concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh`,
    question: 'Que pasa si llega un nuevo run con la misma key mientras hay uno corriendo?',
    answer: 'GitHub Actions cancela el run en curso. `concurrency.group` define la clave (aqui: workflow+ref, asi que cada branch tiene su propio cubo). `cancel-in-progress: true` significa "si llega uno nuevo con la misma key, mata el anterior". Util para CI continuo: solo el ultimo commit corre. **NO** es paralelo, **NO** afecta solo a strategy.matrix, **NO** reintenta fallidos.',
    whyItMatters: 'Multiple-choice clasica. La trampa es decir "ejecuta todos en paralelo" o "reintenta fallidos". La respuesta exacta es "cancela runs en curso con la misma key".',
  },
  {
    id: 'lab-5',
    type: 'log',
    domain: 3,
    title: 'Sesion del agente reanudada',
    snippet: `[copilot.cli]
session.id=abc123
loaded ~/.copilot/session-state/abc123/events.jsonl
resume=true
last_plan=edit deploy.yml
current_branch=feature/agent-fix`,
    question: 'Que esta pasando en este log y como prevenir drift?',
    answer: 'El agente esta reanudando una sesion previa cargando estado local desde `~/.copilot/session-state/<id>/`. `resume=true` confirma que NO es sesion nueva. El `last_plan` y `current_branch` son artefactos durables que sobreviven entre sesiones. Para evitar drift: revalidar las citaciones de Copilot Memory contra el branch actual antes de reusarlas (las memorias de repo expiran a los 28 dias y se validan en cada uso).',
    whyItMatters: 'Pregunta tipica: leer este log e identificar (A) sesion nueva (B) sesion reanudada (C) MCP deshabilitado (D) PR auto-creado. Respuesta: B.',
  },
  {
    id: 'lab-6',
    type: 'audit',
    domain: 6,
    title: 'Audit log con artifact.destroy',
    snippet: `action=artifact.destroy
actor=octocat
repo=org/app
created_at=2026-05-24T09:14:22Z
artifact_id=987654`,
    question: 'Que concluyes de esta entrada y cuando ocurre?',
    answer: 'Un usuario (`octocat`) elimino MANUALMENTE un artefacto de workflow del repo `org/app`. La event `artifact.destroy` se registra cuando alguien con permiso borra un artifact desde la UI o API. **NO** indica creacion (eso seria `artifact.create`), **NO** es deshabilitar workflow, **NO** es eliminar secret. El `actor` te dice quien fue, util para auditoria.',
    whyItMatters: 'GitHub examen incluye conocimiento de events del audit log. Memorizar los principales: `artifact.create`, `artifact.destroy`, `workflow_run.*`, `repo.add_topic`, etc. La trampa es decir que es creacion.',
  },
  {
    id: 'lab-7',
    type: 'yaml-actions',
    domain: 2,
    title: 'copilot-setup-steps.yml mal nombrado',
    snippet: `name: Copilot environment setup
on:
  workflow_dispatch:

jobs:
  prepare-environment:        # <-- ESTO
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22`,
    question: 'Que tiene de malo este workflow desde el punto de vista del Copilot cloud agent?',
    answer: 'El job se llama `prepare-environment`. Para que Copilot lo use como setup-steps, el job DEBE llamarse exactamente `copilot-setup-steps`. Si no, Copilot lo ignora completamente y el agente arranca sin tu setup. El archivo conventionalmente debe ser `.github/workflows/copilot-setup-steps.yml` pero el nombre del archivo NO es lo critico; el nombre del job SI lo es.',
    whyItMatters: 'Fill-blank tipica: "el job en copilot-setup-steps.yml debe llamarse: ______". Tambien aparece como detect-the-bug. Premio mayor por dominar este detalle.',
  },
  {
    id: 'lab-8',
    type: 'hook',
    domain: 6,
    title: 'Hook preToolUse de Copilot',
    snippet: `// .github/hooks/pre-tool-use.json
{
  "event": "preToolUse",
  "match": { "tool": "execute" },
  "action": "deny",
  "reason": "Shell access requires approval. Open an issue and request escalation."
}`,
    question: 'Que hace este hook y como se usa?',
    answer: 'Antes de que el agente ejecute la herramienta `execute` (shell), el hook se dispara y deniega la accion con un mensaje. Es un guardrail preventivo: el agente NUNCA llega a correr el shell command. Los hooks viven en `.github/hooks/*.json`. Los eventos comunes: `preToolUse` (antes de la herramienta) y `postToolUse` (despues). Util para forzar plan-first o bloquear acciones destructivas.',
    whyItMatters: 'Match-pairs o multi-select: identificar para que sirve cada tipo de hook y donde van. La ruta `.github/hooks/` y los eventos `preToolUse/postToolUse` son fill-blank candidates.',
  },
  {
    id: 'lab-9',
    type: 'cli',
    domain: 6,
    title: '--no-ask-user vs --autopilot (Copilot CLI)',
    snippet: `# Caso A
copilot --no-ask-user "Refactor the payment service"

# Caso B
copilot --autopilot --max-autopilot-continues 5 "Refactor the payment service"`,
    question: 'Cual es la diferencia practica entre los dos comandos?',
    answer: '`--no-ask-user` (Caso A): el agente NO te hace preguntas clarificadoras, pero NO continua multi-paso por si solo. Si necesita siguiente paso del modelo, se detiene. `--autopilot` (Caso B): el agente continua autonomamente paso a paso, hasta 5 continuaciones (`--max-autopilot-continues 5`). Es multi-step real. Combinarlos no es redundante: autopilot te da el loop, max-continues te da la barandilla. `--yolo` permitiria todo acceso a tools/paths/URLs sin pedir permisos.',
    whyItMatters: 'GOTCHA #2 del cheatsheet. Casi todos los examenes meten esta distincion. Si la pregunta pide "modo donde continua solo varios pasos", es `--autopilot`. Si pide "supresion de preguntas", es `--no-ask-user`.',
  },
  {
    id: 'lab-10',
    type: 'cli',
    domain: 5,
    title: '/delegate y /fleet en Copilot CLI',
    snippet: `# Sesion interactiva
> /agent reviewer
> Review the PR #42 for security issues.

> /delegate planner
> Break the migration into 3 phases.

> /fleet matrix
> Run reviewer, auditor and consolidator on PR #42.`,
    question: 'Que hace cada slash command?',
    answer: '`/agent <name>`: cambia al custom agent llamado <name>. `/delegate <name>`: delega un sub-task a otro agent (sub-agent emite eventos subagent.selected/.started/.completed/.failed/.deselected). `/fleet <pattern>`: ejecuta multiples sub-agents en paralelo segun el plan decompuesto. `/fleet` es el caballo de batalla para multi-agent en CLI.',
    whyItMatters: 'GPT Pro y Grok ambos confirman que CLI cae mucho. Multi-select pidiendo cuales son slash commands de delegacion. La trampa es incluir `/yolo` (existe pero es para permisos, no delegacion) o `/allow-all`.',
  },
  {
    id: 'lab-11',
    type: 'policy',
    domain: 6,
    title: 'Branch protection + ruleset (clasificacion preventive/detective/corrective)',
    snippet: `# Settings -> Rules -> Rulesets
- Name: "Protect main"
  Enforcement: Active
  Target: branch
  Branch ruleset:
    - Require a pull request before merging
    - Require approval from a second user with write permissions
    - Require status checks: [ci, codeql-analysis]
    - Block force pushes`,
    question: 'Clasifica branch protection, CodeQL y "revert PR" como control preventive, detective o corrective.',
    answer: '**Branch protection = preventive**: impide que codigo malo llegue a main en primer lugar. **CodeQL = detective**: corre despues del push/PR y DETECTA vulnerabilidades, pero no las bloquea por si solo (a menos que lo metas como required status check). **Revert PR = corrective**: cuando ya algo se merged y resulto malo, lo revierte. Los tres se complementan: prevenir, detectar, corregir.',
    whyItMatters: 'Pregunta directa del PDF de GPT Pro: ordenar los tres en preventive/detective/corrective. Respuesta: A (preventive, detective, corrective).',
  },
  {
    id: 'lab-12',
    type: 'yaml-actions',
    domain: 6,
    title: 'Workflow del agente esperando aprobacion humana',
    snippet: `pull_request:
  author: github-copilot[bot]
  changed_files:
    - .github/workflows/deploy.yml
status: waiting_for_approval
message: "Approve and run workflows to start CI"`,
    question: 'Por que esta el PR de Copilot bloqueado y como lo desbloqueas?',
    answer: 'Por default, los workflows de Actions estan BLOQUEADOS en PRs creados por Copilot cloud agent. Necesita que un usuario con write access haga click en "Approve and run workflows" en la pestana Actions del PR. Esto es safety by design: previene que el agente dispare CI con permisos elevados sin revision humana. Si el PR ademas toca `.github/workflows/*`, doble candado: ese path normalmente esta bajo CODEOWNERS y/o rulesets adicionales.',
    whyItMatters: 'Gotcha del cheatsheet (#14). Pregunta tipica: "que pasa por default con los workflows en PRs de Copilot". La respuesta es "bloqueados hasta Approve and run workflows".',
  },
]

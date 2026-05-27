# GH-600 Cram

App de estudio intensivo para el examen **GitHub Certified: Agentic AI Developer (GH-600)**.
Construida para 2 dias de cram con foco en lo que MAS cae en el examen real.

## Que contiene

- **Inicio**: explicacion simple del examen (que es, formato, score minimo, pesos).
- **Plan 2 dias**: cronograma intensivo Mar 27 → Vie 29 con bloques marcables.
- **Dominios**: cheatsheet por dominio con conceptos clave, vocabulario, pitfalls y features de GitHub que evaluan.
- **Cheatsheet**: 17 gotchas que SIEMPRE caen + glossary completo + estilo de preguntas del examen.
- **Practica**: 80 preguntas reales tipo examen con explicacion al instante. Filtra por dominio, por las que fallaste o por marcadas.
- **Mock Exam**: 50 preguntas cronometradas (120 min) con pesos por dominio identicos al real. Score + desglose por dominio.
- **Mi progreso**: KPIs + rendimiento por dominio + historial de mocks.

Progreso 100% local en `localStorage`. Sin backend. Funciona offline.

## Como correr

```bash
cd Y:/work/gh600-cram
npm install        # solo la primera vez
npm run dev        # abre http://localhost:5273
```

Build de produccion:

```bash
npm run build
npm run preview
```

## Stack

- Vite 8 + React 19 + TypeScript 6
- Tailwind v4 (via @tailwindcss/vite)
- 0 dependencias runtime extra

## Fuentes

Data y blueprint del examen sale de:

- Guia oficial Microsoft Learn: <https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600>
- GitHub Docs (Copilot, custom agents, MCP, firewall, memory, guardrails)
- Repo publico de jtur671: <https://github.com/jtur671/gh-600-study-guide>
- Cloud Factory analisis del examen
- Experiencias de candidatos en DEV.to y blogs especializados

Las preguntas y explicaciones vienen del JSON `src/data.json` (originado en
`Y:/work/gh600-trainer-research/domains-questions.json`).

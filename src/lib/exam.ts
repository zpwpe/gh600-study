import dataRaw from '../data.json'
import { EXTRA_QUESTIONS } from '../data/extra-questions'
import type { DataShape, Domain, FlatQuestion, Question } from '../types'

export const data = dataRaw as unknown as DataShape

export const META = data.meta
export const DOMAINS: Domain[] = data.domains

export function flattenQuestions(domains: Domain[] = DOMAINS): FlatQuestion[] {
  const flat: FlatQuestion[] = []
  let counter = 0
  for (const dom of domains) {
    for (const obj of dom.objectives) {
      for (const q of obj.questions ?? []) {
        counter += 1
        flat.push({
          ...q,
          id: `d${dom.domain_id}-${obj.id}-${counter}`,
          domainId: dom.domain_id,
          domainTitle: dom.title,
          objectiveId: obj.id,
          objectiveTitle: obj.title,
        })
        if (q.type === 'case_study' && q.sub_questions) {
          q.sub_questions.forEach((sq, idx) => {
            counter += 1
            flat.push({
              ...sq,
              id: `d${dom.domain_id}-${obj.id}-${counter}-sub${idx}`,
              domain: q.domain,
              stem: `[Case study context] ${q.stem}\n\n${sq.stem}`,
              domainId: dom.domain_id,
              domainTitle: dom.title,
              objectiveId: obj.id,
              objectiveTitle: obj.title,
            })
          })
        }
      }
    }
  }
  return flat
}

export const ALL_QUESTIONS: FlatQuestion[] = [...flattenQuestions(), ...EXTRA_QUESTIONS]

export const QUESTIONS_BY_DOMAIN: Record<number, FlatQuestion[]> = ALL_QUESTIONS.reduce(
  (acc, q) => {
    ;(acc[q.domainId] ||= []).push(q)
    return acc
  },
  {} as Record<number, FlatQuestion[]>,
)

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildMockSet(count: number): FlatQuestion[] {
  // Roughly weight by domain weight midpoint so the exam feels real.
  const weights: Record<number, number> = {
    1: 0.175, // 15-20
    2: 0.225, // 20-25
    3: 0.125, // 10-15
    4: 0.175, // 15-20
    5: 0.175, // 15-20
    6: 0.125, // 10-15
  }
  const picks: FlatQuestion[] = []
  for (const dom of DOMAINS) {
    const target = Math.max(2, Math.round(count * (weights[dom.domain_id] ?? 0.17)))
    const pool = shuffle(QUESTIONS_BY_DOMAIN[dom.domain_id] ?? [])
    picks.push(...pool.slice(0, target))
  }
  return shuffle(picks).slice(0, count)
}

export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function isCorrect(q: Question, given: string): boolean {
  if (!q.correct) return false
  if (q.type === 'multi_select') {
    const a = new Set(given.split(',').map((x) => x.trim().toUpperCase()))
    const b = new Set((q.correct ?? '').split(',').map((x) => x.trim().toUpperCase()))
    if (a.size !== b.size) return false
    for (const v of a) if (!b.has(v)) return false
    return true
  }
  if (q.type === 'fill_blank') {
    return normalizeAnswer(given) === normalizeAnswer(q.correct)
  }
  if (q.type === 'drag_drop_order') {
    return normalizeAnswer(given) === normalizeAnswer(q.correct)
  }
  if (q.type === 'match_pairs') {
    // Auto-graded as "see pairs" — we let user self-mark via a toggle.
    return given === 'self-correct'
  }
  return given.trim().toUpperCase() === (q.correct || '').trim().toUpperCase()
}

export function questionLetterOptions(q: Question): string[] {
  return q.options ?? []
}

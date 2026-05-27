import type { AppState } from '../types'

const KEY = 'gh600-cram-v1'

const defaultState: AppState = {
  planChecks: {},
  reviewed: {},
  questionAttempts: {},
  flagged: {},
  mockRuns: [],
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as Partial<AppState>
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* swallow quota errors */
  }
}

export function resetState(): void {
  localStorage.removeItem(KEY)
}

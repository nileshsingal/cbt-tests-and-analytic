import type { Attempt } from '../types/exam'
import { transition } from '../utils/exam'
import type { Action } from '../utils/exam'

export const attemptKey = 'mpsc.attempts.v1'
export function readAttempts(storage: Storage = localStorage): Attempt[] {
  try {
    const values: unknown = JSON.parse(storage.getItem(attemptKey) ?? '[]')
    return Array.isArray(values) ? values : []
  } catch {
    return []
  }
}
export function saveAttempt(attempt: Attempt, storage: Storage = localStorage) {
  const attempts = readAttempts(storage)
  const existing = attempts.find(value => value.id === attempt.id)
  if (existing?.submittedAt !== undefined) return existing
  storage.setItem(attemptKey, JSON.stringify([attempt, ...attempts.filter(value => value.id !== attempt.id)]))
  window.dispatchEvent(new Event(attemptKey))
  return attempt
}
export function updateAttempt(id: string, action: Action) {
  const attempt = readAttempts().find(value => value.id === id)
  if (attempt) return saveAttempt(transition(attempt, action))
}

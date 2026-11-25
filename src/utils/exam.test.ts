import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { questions, test } from '../data/test'
import { readAttempts, saveAttempt } from '../services/attempts'
import { createAttempt, evaluate, secondsLeft, status, transition } from './exam'

describe('demo exam', () => {
  const now = 1000
  const [first, second] = test.questionIds
  it('grades saved answers including review, applies penalties and ignores drafts', () => {
    let attempt = createAttempt(now)
    attempt = transition(attempt, { type: 'select', option: 'C' }, now)
    attempt = transition(attempt, { type: 'review' }, now)
    attempt = transition(attempt, { type: 'select', option: 'A' }, now)
    attempt = transition(attempt, { type: 'save' }, now)
    attempt = transition(attempt, { type: 'select', option: 'C' }, now)
    attempt = transition(attempt, { type: 'submit' }, now + 5000)
    const { items, ...metrics } = evaluate(attempt, questions)
    assert.equal(items.length, test.questionIds.length)
    assert.deepEqual(metrics, { score: 1.5, maximum: 10, percentage: 15, correct: 1, incorrect: 1, unattempted: 3, accuracy: 50, deducted: .5, elapsed: 5 })
  })

  it('updates every palette status and keeps drafts when navigating', () => {
    let attempt = createAttempt(now)
    assert.equal(status(attempt.responses[first]), 'unanswered')
    assert.equal(status(attempt.responses[second]), 'unvisited')
    attempt = transition(attempt, { type: 'review' }, now)
    assert.equal(status(attempt.responses[first]), 'review')
    attempt = transition(attempt, { type: 'go', index: 0 }, now)
    attempt = transition(attempt, { type: 'select', option: 'C' }, now)
    attempt = transition(attempt, { type: 'go', index: 1 }, now)
    assert.equal(attempt.responses[first].selected, 'C')
    attempt = transition(attempt, { type: 'go', index: 0 }, now)
    attempt = transition(attempt, { type: 'review' }, now)
    assert.equal(status(attempt.responses[first]), 'answeredReview')
    attempt = transition(attempt, { type: 'go', index: 0 }, now)
    attempt = transition(attempt, { type: 'save' }, now)
    assert.equal(status(attempt.responses[first]), 'answered')
    attempt = transition(attempt, { type: 'go', index: 0 }, now)
    attempt = transition(attempt, { type: 'clear' }, now)
    assert.equal(status(attempt.responses[first]), 'unanswered')
  })

  it('expires at the absolute deadline and prevents duplicate submission', () => {
    const attempt = createAttempt(now)
    assert.equal(secondsLeft(attempt, now), test.durationSeconds)
    assert.equal(secondsLeft(attempt, attempt.deadline), 0)
    const completed = transition(attempt, { type: 'select', option: 'C' }, attempt.deadline + 500)
    assert.equal(completed.submittedAt, attempt.deadline)
    assert.equal(completed.responses[first].selected, undefined)
    assert.equal(transition(completed, { type: 'submit' }, attempt.deadline + 900), completed)
  })

  it('restores the deadline and drafts and keeps submitted attempts immutable', () => {
    const values = new Map<string, string>()
    const storage: Storage = {
      get length() { return values.size },
      key: index => Array.from(values.keys())[index] ?? null,
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => { values.set(key, value) },
      removeItem: key => { values.delete(key) },
      clear: () => values.clear(),
    }
    Object.defineProperty(globalThis, 'window', { value: new EventTarget(), configurable: true })
    try {
      const attempt = transition(createAttempt(now), { type: 'select', option: 'C' }, now)
      saveAttempt(attempt, storage)
      const [restored] = readAttempts(storage)
      assert.deepEqual(restored, attempt)
      const completed = transition(restored, { type: 'submit' }, now + 2000)
      saveAttempt(completed, storage)
      saveAttempt(attempt, storage)
      assert.deepEqual(readAttempts(storage), [completed])
    } finally {
      Reflect.deleteProperty(globalThis, 'window')
    }
  })
})
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { demoTest as test, paper2025 } from '../data/test'
import { readAttempts, saveAttempt } from '../services/attempts'
import { createAttempt, evaluate, secondsLeft, status, summary, transition } from './exam'

describe('demo exam', () => {
  const now = 1000
  const [first, second] = test.questionIds
  it('grades saved answers including review, applies penalties and ignores drafts', () => {
    let attempt = createAttempt(test, now)
    attempt = transition(attempt, { type: 'select', option: 'C' }, now)
    attempt = transition(attempt, { type: 'review' }, now)
    attempt = transition(attempt, { type: 'select', option: 'A' }, now)
    attempt = transition(attempt, { type: 'save' }, now)
    attempt = transition(attempt, { type: 'select', option: 'C' }, now)
    attempt = transition(attempt, { type: 'submit' }, now + 5000)
    const { items, ...metrics } = evaluate(attempt, test)
    assert.equal(items.length, test.questionIds.length)
    assert.deepEqual(metrics, { score: 1.5, maximum: 10, percentage: 15, correct: 1, incorrect: 1, unattempted: 3, cancelled: 0, accuracy: 50, deducted: .5, elapsed: 5 })
  })

  it('updates every palette status and keeps drafts when navigating', () => {
    let attempt = createAttempt(test, now)
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
    const attempt = createAttempt(test, now)
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
      const attempt = transition(createAttempt(test, now), { type: 'select', option: 'C' }, now)
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
describe('2025 Paper 1, Series A', () => {
  const now = 1000

  it('imports the 100 questions and the Series A final key in paper order', () => {
    const key = [
      '2411112333223421222333114',
      '2421322441211221423224#33',
      '4421212133113434344443413',
      '42132341112#3244313111413',
    ].join('')
    assert.equal(paper2025.questions.length, 100)
    assert.equal(paper2025.maximumMarks, 200)
    assert.equal(paper2025.scorableMarks, 196)
    assert.equal(paper2025.questions.map(question => question.correctOptionId ?? '#').join(''), key)
    assert.equal(new Set(paper2025.questionIds).size, 100)
    assert.ok(paper2025.questions.every(question => question.options.map(option => option.id).join('') === '1234'))
    assert.equal(paper2025.questions.filter(question => question.table).length, 10)
    assert.ok(paper2025.questions[51].figure)
  })

  it('navigates the full paper and grades it independently of the demo', () => {
    let attempt = createAttempt(paper2025, now)
    assert.equal(secondsLeft(attempt, now), 7200)
    assert.equal(summary(attempt).unvisited, 99)
    for (const [index, option] of [[0, '2'], [1, '1'], [47, '1'], [86, '4'], [99, '3']] as const) {
      attempt = transition(attempt, { type: 'go', index }, now)
      attempt = transition(attempt, { type: 'select', option }, now)
      attempt = transition(attempt, { type: 'save' }, now)
    }
    assert.equal(attempt.current, 99)
    assert.equal(summary(attempt).answered, 5)
    assert.equal(summary(createAttempt(test, now)).unvisited, 4)
    attempt = transition(attempt, { type: 'submit' }, now + 5000)
    const result = evaluate(attempt, paper2025)
    assert.equal(result.score, 3.5)
    assert.equal(result.maximum, 196)
    assert.equal(result.correct, 2)
    assert.equal(result.incorrect, 1)
    assert.equal(result.unattempted, 95)
    assert.equal(result.cancelled, 2)
    assert.equal(result.deducted, 0.5)
    assert.deepEqual(result.items.filter(item => item.outcome === 'cancelled').map(item => [item.index + 1, item.selected, item.marks]), [[48, '1', 0], [87, '4', 0]])
  })
})

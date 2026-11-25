import type { Attempt, QuestionStatus, Response } from '../types/exam'
import { getTest } from '../data/test'
import type { TestDefinition } from '../data/test'

export const statuses: Record<QuestionStatus, string> = {
  unvisited: 'Not Visited', unanswered: 'Not Answered', answered: 'Answered',
  review: 'Marked for Review', answeredReview: 'Answered and Marked for Review',
}
export function status(response?: Response): QuestionStatus {
  if (!response?.visited) return 'unvisited'
  if (response.review) return response.saved ? 'answeredReview' : 'review'
  return response.saved ? 'answered' : 'unanswered'
}
export function summary(attempt: Attempt) {
  const counts = { unvisited: 0, unanswered: 0, answered: 0, review: 0, answeredReview: 0 }
  for (const id of getTest(attempt.testId)?.questionIds ?? []) counts[status(attempt.responses[id])]++
  return counts
}
export function createAttempt(test: TestDefinition, now = Date.now()): Attempt {
  return { id: crypto.randomUUID(), testId: test.id, startedAt: now,
    deadline: now + test.durationSeconds * 1000, current: 0,
    responses: { [test.questionIds[0]]: { visited: true } } }
}
export function secondsLeft(attempt: Attempt, now = Date.now()) {
  return Math.max(0, Math.ceil((attempt.deadline - now) / 1000))
}
export function clock(seconds: number) {
  return [Math.floor(seconds / 60), seconds % 60].map(value => String(value).padStart(2, '0')).join(':')
}
export type Action =
  | { type: 'go'; index: number }
  | { type: 'select'; option: string }
  | { type: 'clear' | 'save' | 'review' | 'submit' }

export function transition(attempt: Attempt, action: Action, now = Date.now()): Attempt {
  if (attempt.submittedAt !== undefined) return attempt
  if (now >= attempt.deadline || action.type === 'submit') {
    return { ...attempt, submittedAt: Math.min(now, attempt.deadline) }
  }
  const test = getTest(attempt.testId)
  if (!test) return attempt
  const id = test.questionIds[attempt.current]
  const response = attempt.responses[id]
  const responses = { ...attempt.responses }
  let current = attempt.current
  switch (action.type) {
    case 'go':
      current = Math.min(Math.max(0, action.index), test.questionIds.length - 1)
      break
    case 'select':
      responses[id] = { ...response, selected: action.option }
      break
    case 'clear':
      responses[id] = { visited: true, review: response.review }
      break
    case 'save':
    case 'review':
      responses[id] = { ...response, saved: response.selected, review: action.type === 'review' }
      current = Math.min(current + 1, test.questionIds.length - 1)
      break
  }
  const destination = test.questionIds[current]
  responses[destination] = { ...responses[destination], visited: true }
  return { ...attempt, current, responses }
}
export function evaluate(attempt: Attempt, test: TestDefinition) {
  const items = test.questions.map((question, index) => {
    const response = attempt.responses[question.id]
    const selected = response?.saved
    const outcome = question.correctOptionId === null ? 'cancelled'
      : !selected ? 'unattempted' : selected === question.correctOptionId ? 'correct' : 'incorrect'
    const marks = outcome === 'correct' ? question.positiveMarks : outcome === 'incorrect' ? -question.negativeMarks : 0
    return { question, index, selected, outcome, marks, review: !!response?.review }
  })
  const correct = items.filter(item => item.outcome === 'correct').length
  const incorrect = items.filter(item => item.outcome === 'incorrect').length
  const cancelled = items.filter(item => item.outcome === 'cancelled').length
  const maximum = test.scorableMarks
  const score = items.reduce((total, item) => total + item.marks, 0)
  return {
    items, correct, incorrect, score, maximum,
    cancelled, unattempted: items.length - correct - incorrect - cancelled,
    accuracy: correct + incorrect ? 100 * correct / (correct + incorrect) : 0,
    percentage: maximum ? 100 * score / maximum : 0,
    deducted: items.reduce((total, item) => total + Math.max(0, -item.marks), 0),
    elapsed: Math.floor(((attempt.submittedAt ?? attempt.startedAt) - attempt.startedAt) / 1000),
  }
}

import demoBank from './questions.json'
import paperBank from './mpsc-2025-paper-1-a.json'
import type { Question } from '../types/exam'

export const candidate = 'Demo Candidate'

function defineTest(config: {
  id: string
  name: string
  description: string
  durationSeconds: number
  questions: Question[]
}) {
  const first = config.questions[0]
  return {
    ...config,
    paper: first.paper,
    questionIds: config.questions.map(question => question.id),
    maximumMarks: config.questions.reduce((sum, question) => sum + question.positiveMarks, 0),
    scorableMarks: config.questions.reduce((sum, question) => sum + (question.correctOptionId === null ? 0 : question.positiveMarks), 0),
    positiveMarks: first.positiveMarks,
    negativeMarks: first.negativeMarks,
  }
}

export const demoTest = defineTest({
  id: 'rajyaseva-demo-01',
  name: 'MPSC Rajyaseva Prelims – Demo Mock Test 01',
  description: 'Demonstration questions',
  durationSeconds: 300,
  questions: demoBank,
})

const circuitDiagram = new URL('../assets/mpsc-2025-paper-1-q52-circuit.png', import.meta.url).href
export const paper2025 = defineTest({
  id: 'mpsc-2025-paper-1-a',
  name: 'MPSC Prelims 2025 – Paper 1, Series A',
  description: 'Previous year paper · English',
  durationSeconds: 120 * 60,
  questions: paperBank.map(question => question.id === 'mpsc-2025-paper-1-a-52'
    ? { ...question, figure: { src: circuitDiagram, alt: 'A 2 V battery across a resistor network. The middle path has 2 Ω, 3 Ω and 2 Ω resistors in series. A 1 Ω branch bypasses the first two resistors, and a 4 Ω branch bypasses the last two.' } }
    : question),
})

export type TestDefinition = ReturnType<typeof defineTest>
export const tests = [demoTest, paper2025]

export function getTest(id: string) {
  return tests.find(test => test.id === id)
}

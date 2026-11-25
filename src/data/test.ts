import bank from './questions.json'
import type { Question } from '../types/exam'

export const questions: Question[] = bank
export const test = {
  id: 'rajyaseva-demo-01',
  name: 'MPSC Rajyaseva Prelims – Demo Mock Test 01',
  paper: 'General Studies Paper I',
  candidate: 'Demo Candidate',
  durationSeconds: 300,
  questionIds: questions.map(question => question.id),
  maximumMarks: questions.reduce((sum, question) => sum + question.positiveMarks, 0),
  positiveMarks: 2,
  negativeMarks: 0.5,
}

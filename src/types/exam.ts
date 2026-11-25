export interface Question {
  id: string
  examType: string
  examYear: number | null
  paper: string
  subject: string
  topic: string
  subtopic: string
  difficulty: string
  questionText: string
  options: { id: string; text: string }[]
  correctOptionId: string
  explanation: string
  positiveMarks: number
  negativeMarks: number
  source: string
  isPYQ: boolean
  language: string
}
export interface Response {
  visited: boolean
  selected?: string
  saved?: string
  review?: boolean
}
export interface Attempt {
  id: string
  testId: string
  startedAt: number
  deadline: number
  submittedAt?: number
  current: number
  responses: Record<string, Response>
}
export type QuestionStatus = 'unvisited' | 'unanswered' | 'answered' | 'review' | 'answeredReview'

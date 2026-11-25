import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ExamHeader } from '../components/exam/ExamHeader'
import { QuestionCard } from '../components/exam/QuestionCard'
import { QuestionNavigation } from '../components/exam/QuestionNavigation'
import { QuestionPalette } from '../components/exam/QuestionPalette'
import { SubmitConfirmationModal } from '../components/exam/SubmitConfirmationModal'
import { getTest } from '../data/test'
import type { TestDefinition } from '../data/test'
import { useAttempts } from '../hooks/useAttempts'
import { useExamTimer } from '../hooks/useExamTimer'
import { updateAttempt } from '../services/attempts'
import type { Attempt } from '../types/exam'
import type { Action } from '../utils/exam'

export function Exam() {
  const { id } = useParams()
  const attempt = useAttempts().find(item => item.id === id)
  const test = attempt && getTest(attempt.testId)
  if (!attempt || !test) return <Navigate to="/" replace />
  if (attempt.submittedAt !== undefined) return <Navigate to={'/result/' + id} replace />
  return <ActiveExam key={attempt.id} attempt={attempt} test={test} />
}
function ActiveExam({ attempt, test }: { attempt: Attempt; test: TestDefinition }) {
  const [confirming, setConfirming] = useState(false)
  const seconds = useExamTimer(attempt)
  const index = attempt.current
  const question = test.questions[index]
  const dispatch = (action: Action) => updateAttempt(attempt.id, action)
  useEffect(() => { document.getElementById('question-heading')?.focus() }, [index])
  return <><ExamHeader test={test} seconds={seconds} submit={() => setConfirming(true)} /><main className="exam-layout">
    <section className="panel question-panel"><QuestionCard question={question} response={attempt.responses[question.id]} index={index} total={test.questionIds.length} select={option => dispatch({ type: 'select', option })} />
      <QuestionNavigation index={index} last={index === test.questionIds.length - 1} dispatch={dispatch} /></section>
    <QuestionPalette test={test} attempt={attempt} go={target => dispatch({ type: 'go', index: target })} />
  </main>{confirming && <SubmitConfirmationModal test={test} attempt={attempt} seconds={seconds} close={() => setConfirming(false)} confirm={() => dispatch({ type: 'submit' })} />}</>
}
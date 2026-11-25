import { useState } from 'react'
import { ArrowLeft, ArrowRight, ClipboardList } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { Legend } from '../components/exam/QuestionPalette'
import { demoTest, getTest } from '../data/test'
import type { TestDefinition } from '../data/test'
import { createAttempt } from '../utils/exam'
import { saveAttempt } from '../services/attempts'

export function Instructions() {
  const { testId } = useParams()
  const test = testId ? getTest(testId) : demoTest
  return test ? <TestInstructions key={test.id} test={test} /> : <Navigate to="/" replace />
}

function TestInstructions({ test }: { test: TestDefinition }) {
  const [accepted, setAccepted] = useState(false)
  const navigate = useNavigate()
  return <><header className="topbar"><Brand /></header><main className="page narrow">
    <Link className="back" to="/"><ArrowLeft size={17} /> Back to Dashboard</Link>
    <div className="panel content"><span className="tile-icon"><ClipboardList size={23} /></span><h1>Examination Instructions</h1><p>{test.name}</p>
      <div className="metrics">{[['Questions', test.questionIds.length], ['Duration', test.durationSeconds / 60 + ' minutes'], ['Maximum marks', test.maximumMarks]].map(([label, value]) => <div className="metric tinted" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
      <h2>Marking and navigation</h2><ul className="instructions">
        <li>Correct answers earn +{test.positiveMarks} marks. Incorrect answers deduct {test.negativeMarks} marks. Unattempted questions earn 0 marks.</li>
        {test.scorableMarks < test.maximumMarks && <li>Questions cancelled in the final answer key are excluded from scoring. The practice result is out of {test.scorableMarks} marks.</li>}
        <li>Use Previous or the question palette to move directly between questions. Draft selections are kept when you navigate or refresh.</li>
        <li>Choose Save &amp; Next to record your selection and remove any review mark. Choose Mark for Review &amp; Next to record your selection and flag the question. Saved answers flagged for review count toward your score.</li>
        <li>Clear Response removes both the draft and saved answer. At submission, each question is graded using its last saved response.</li>
        <li>The timer starts when you begin and continues during a refresh. The test submits automatically when time expires.</li>
      </ul><h2>Question palette</h2><Legend />
      <label className="ack"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} /> I have read and understood all the examination instructions.</label>
      <button className="button primary" disabled={!accepted} onClick={() => navigate('/exam/' + saveAttempt(createAttempt(test)).id, { replace: true })}>Start Examination <ArrowRight size={16} /></button>
    </div>
  </main></>
}

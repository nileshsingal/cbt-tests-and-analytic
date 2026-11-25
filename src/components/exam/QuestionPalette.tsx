import { candidate } from '../../data/test'
import type { TestDefinition } from '../../data/test'
import type { Attempt } from '../../types/exam'
import { statuses, status, summary } from '../../utils/exam'

export function Legend({ attempt }: { attempt?: Attempt }) {
  const counts = attempt && summary(attempt)
  return <ul className="legend">{Object.entries(statuses).map(([key, name]) => <li key={key}><span className={'status-token ' + key} aria-hidden="true" />{name}{counts && <strong>{counts[key as keyof typeof counts]}</strong>}</li>)}</ul>
}
export function QuestionPalette({ test, attempt, go }: { test: TestDefinition; attempt: Attempt; go: (index: number) => void }) {
  const counts = summary(attempt)
  const answered = counts.answered + counts.answeredReview
  return <aside className="panel palette"><div className="profile"><span className="avatar">DC</span><div><strong>{candidate}</strong><small>{test.paper}</small></div></div>
    <div className="palette-body"><h2>Exam Progress</h2><p>{answered} of {test.questionIds.length} answered</p><progress aria-label="Questions answered" value={answered} max={test.questionIds.length} />
      <h2>Question Palette</h2><div className="palette-grid">{test.questionIds.map((id, index) => {
        const state = status(attempt.responses[id])
        const current = attempt.current === index
        return <button key={id} className={'status-token ' + state + (current ? ' current' : '')} aria-current={current ? 'step' : undefined} aria-label={'Question ' + (index + 1) + ', ' + statuses[state]} onClick={() => go(index)}>{index + 1}</button>
      })}</div><Legend attempt={attempt} /></div>
  </aside>
}
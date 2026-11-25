import { ArrowRight, Clock3, ListChecks, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TestDefinition } from '../../data/test'
import type { Attempt } from '../../types/exam'

export function TestCard({ test, active }: { test: TestDefinition; active?: Attempt }) {
  return <article className="panel test-card">
    <span className="chip blue">AVAILABLE NOW</span>
    <h3>{test.name}</h3><p>{test.paper} · {test.description}</p>
    <div className="test-meta"><span><ListChecks /> {test.questionIds.length} questions</span><span><Clock3 /> {test.durationSeconds / 60} minutes</span><span><Target /> {test.maximumMarks} marks</span></div>
    <Link className="button primary" to={active ? '/exam/' + active.id : '/instructions/' + test.id}
      aria-label={(active ? 'Resume Test: ' : 'Start Test: ') + test.name}>{active ? 'Resume Test' : 'Start Test'}<ArrowRight size={16} /></Link>
  </article>
}

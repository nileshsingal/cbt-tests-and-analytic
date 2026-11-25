import { ArrowRight, Clock3, ListChecks, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { test } from '../../data/test'
import type { Attempt } from '../../types/exam'

export function TestCard({ active }: { active?: Attempt }) {
  return <article className="panel test-card">
    <span className="chip blue">AVAILABLE NOW</span>
    <h3>{test.name}</h3><p>{test.paper} · Demonstration questions</p>
    <div className="test-meta"><span><ListChecks /> {test.questionIds.length} questions</span><span><Clock3 /> {test.durationSeconds / 60} minutes</span><span><Target /> {test.maximumMarks} marks</span></div>
    <Link className="button primary" to={active ? '/exam/' + active.id : '/instructions'}>{active ? 'Resume Test' : 'Start Test'}<ArrowRight size={16} /></Link>
  </article>
}

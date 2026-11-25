import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { PerformanceChart } from '../components/results/PerformanceChart'
import { ResultSummary } from '../components/results/ResultSummary'
import { SolutionCard } from '../components/results/SolutionCard'
import { questions, test } from '../data/test'
import { useAttempts } from '../hooks/useAttempts'
import { evaluate } from '../utils/exam'

const filters = [['all', 'All Questions'], ['correct', 'Correct'], ['incorrect', 'Incorrect'], ['unattempted', 'Unattempted'], ['review', 'Marked for Review']] as const
export function Results({ solutions = false }: { solutions?: boolean }) {
  const { id } = useParams()
  const [filter, setFilter] = useState('all')
  const attempt = useAttempts().find(item => item.id === id)
  if (!attempt) return <Navigate to="/" replace />
  if (attempt.submittedAt === undefined) return <Navigate to={'/exam/' + id} replace />
  const result = evaluate(attempt, questions)
  const items = result.items.filter(item => filter === 'all' || (filter === 'review' ? item.review : item.outcome === filter))
  const subjects = Array.from(new Set(result.items.map(item => item.question.subject)))
  return <><header className="topbar"><Brand /></header><main className="page results">
    <Link className="back" to={solutions ? '/result/' + id : '/'}><ArrowLeft size={16} /> {solutions ? 'Back to Results' : 'Back to Dashboard'}</Link>
    <div className="page-title"><h1>{solutions ? 'Detailed Solutions' : 'Test Results'}</h1><p>{test.name}</p></div>
    {solutions ? <><div className="filters" aria-label="Filter solutions">{filters.map(([value, label]) => <button key={value} className={'button ' + (filter === value ? 'primary' : '')} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
      {items.length ? items.map(item => <SolutionCard key={item.question.id} item={item} />) : <div className="panel content">No questions match this filter.</div>}</> : <>
      <ResultSummary result={result} /><div className="analysis-grid"><PerformanceChart result={result} /><section className="panel content"><h2>Subject-Wise Performance</h2><div className="table-wrap"><table><thead><tr><th scope="col">Subject</th><th scope="col">Correct</th><th scope="col">Marks</th></tr></thead><tbody>{subjects.map(subject => {
        const group = result.items.filter(item => item.question.subject === subject)
        return <tr key={subject}><th scope="row">{subject}</th><td>{group.filter(item => item.outcome === 'correct').length}/{group.length}</td><td>{group.reduce((sum, item) => sum + item.marks, 0)}</td></tr>
      })}</tbody></table></div></section></div>
      <section className="panel content"><h2>Question-Wise Performance</h2><div className="table-wrap"><table><thead><tr><th scope="col">Question</th><th scope="col">Subject</th><th scope="col">Outcome</th><th scope="col">Marks</th></tr></thead><tbody>{result.items.map(item => <tr key={item.question.id}><th scope="row">{item.index + 1}</th><td>{item.question.subject}</td><td className="capitalize">{item.outcome}{item.review && ' · Review'}</td><td>{item.marks}</td></tr>)}</tbody></table></div></section>
      <div className="filters"><Link className="button primary" to={'/solutions/' + id}>View Detailed Solutions <ArrowRight size={16} /></Link><Link className="button" to="/instructions">Reattempt Test</Link><Link className="button" to="/">Back to Dashboard</Link></div>
    </>}
  </main></>
}
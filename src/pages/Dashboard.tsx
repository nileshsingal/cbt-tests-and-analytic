import { ArrowRight, BarChart3, BookOpen, ClipboardList, Clock3, Files, LayoutGrid, LibraryBig, Target } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { TestCard } from '../components/dashboard/TestCard'
import { questions, test } from '../data/test'
import { useAttempts } from '../hooks/useAttempts'
import { clock, evaluate } from '../utils/exam'

const sections = [
  ['', 'Overview', LayoutGrid], ['available', 'Available Tests', ClipboardList],
  ['pyqs', 'Previous Year Papers', Files], ['mocks', 'Full-Length Mocks', Target],
  ['subjects', 'Subject-Wise Tests', BookOpen], ['performance', 'My Performance', BarChart3],
  ['history', 'Test History', Clock3],
] as const
const subjects = ['Indian Polity', 'Modern Indian History', 'Maharashtra History', 'Geography', 'Indian Economy', 'Environment', 'General Science', 'CSAT']

export function Dashboard({ section = '' }: { section?: string }) {
  const attempts = useAttempts()
  const completed = attempts.filter(attempt => attempt.submittedAt !== undefined)
  const active = attempts.find(attempt => attempt.submittedAt === undefined)
  const scores = completed.map(attempt => evaluate(attempt, questions))
  const overview = !section
  return <div className="dashboard">
    <aside className="sidebar"><Brand /><nav aria-label="Dashboard navigation">
      {sections.map(([id, label, Icon]) => <NavLink key={id} to={id ? '/dashboard/' + id : '/'} end><Icon size={18} />{label}</NavLink>)}
    </nav><div className="profile"><span className="avatar">DC</span><div><strong>{test.candidate}</strong><small>Practice account</small></div></div></aside>
    <main className="dashboard-main">
      {overview && <section className="welcome"><div><div className="eyebrow">MPSC EXAM PREPARATION</div><h1>Welcome, Demo Candidate</h1><p>Practise in a timed exam environment and see exactly where you can improve.</p></div><LibraryBig className="welcome-icon" aria-hidden="true" size={132} strokeWidth={0.9} /></section>}
      {(overview || section === 'available') && <section><div className="section-heading"><div><h2>Available Tests</h2><p>Start with the MPSC Rajyaseva Prelims demo.</p></div>{overview && <Link to="/dashboard/available">View all tests <ArrowRight size={16} /></Link>}</div><TestCard active={active} /></section>}
      {(overview || section === 'pyqs' || section === 'mocks') && <section><h2>{overview ? 'Explore Test Categories' : section === 'pyqs' ? 'Previous Year Question Papers' : 'Full-Length Mock Tests'}</h2><div className="category-grid">
        {(overview ? [['MPSC Rajyaseva Prelims', 'available'], ['MPSC Previous Year Papers', 'pyqs'], ['MPSC Full-Length Mock Tests', 'mocks']] : [[section === 'pyqs' ? 'MPSC Previous Year Papers' : 'MPSC Full-Length Mock Tests', section]]).map(([label, id]) => <article className="panel category" key={id}><span className="tile-icon"><Files size={20} /></span><h3>{label}</h3>{id === 'available' ? <Link to="/dashboard/available">View test <ArrowRight size={14} /></Link> : <span className="chip">Coming Soon</span>}</article>)}
      </div></section>}
      {(overview || section === 'subjects') && <section><h2>Subject-Wise Tests</h2><div className="category-grid">{subjects.map(subject => <article key={subject} className="panel category"><BookOpen size={19} /><h3>{subject}</h3><span className="chip">Coming Soon</span></article>)}</div></section>}
      {(overview || section === 'performance') && <section><h2>My Performance</h2><div className="metrics">{[['Completed tests', completed.length], ['Best score', scores.length ? Math.max(...scores.map(score => score.score)) + ' / ' + test.maximumMarks : '–'], ['Latest accuracy', scores.length ? scores[0].accuracy.toFixed(1) + '%' : '–']].map(([label, value]) => <div className="panel metric" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></section>}
      {(overview || section === 'history') && <section><h2>Test History</h2><div className="panel history">{completed.length ? completed.map(attempt => {
        const result = evaluate(attempt, questions)
        return <div className="history-row" key={attempt.id}><div><strong>{test.name}</strong><small>{new Date(attempt.submittedAt!).toLocaleString()} · {result.score}/{result.maximum} marks · {clock(result.elapsed)}</small></div><Link to={'/result/' + attempt.id}>View result <ArrowRight size={16} /></Link></div>
      }) : <p>No completed tests yet. Your results will appear here after submission.</p>}</div></section>}
    </main>
  </div>
}

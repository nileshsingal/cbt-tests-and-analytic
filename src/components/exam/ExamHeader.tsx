import { Clock3, Send } from 'lucide-react'
import { Brand } from '../Brand'
import { candidate } from '../../data/test'
import type { TestDefinition } from '../../data/test'
import { clock } from '../../utils/exam'

export function ExamTimer({ seconds }: { seconds: number }) {
  return <div className={'timer ' + (seconds < 60 ? 'urgent' : '')}><Clock3 size={19} /><span>Time left <strong aria-label={clock(seconds)}>{clock(seconds)}</strong></span></div>
}
export function ExamHeader({ test, seconds, submit }: { test: TestDefinition; seconds: number; submit: () => void }) {
  return <header className="topbar exam-header"><Brand exam /><div className="exam-title"><strong>{test.name}</strong><small>{candidate} · {test.paper}</small></div><ExamTimer seconds={seconds} /><button className="button primary" onClick={submit}><Send size={16} /> Submit Test</button></header>
}
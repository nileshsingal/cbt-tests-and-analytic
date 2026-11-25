import { ArrowLeft, ArrowRight, Flag, RotateCcw } from 'lucide-react'
import type { Action } from '../../utils/exam'

export function QuestionNavigation({ index, last, dispatch }: { index: number; last: boolean; dispatch: (action: Action) => void }) {
  return <div className="question-actions">
    <button className="button" disabled={index === 0} onClick={() => dispatch({ type: 'go', index: index - 1 })}><ArrowLeft size={16} /> Previous</button>
    <button className="button" onClick={() => dispatch({ type: 'clear' })}><RotateCcw size={15} /> Clear Response</button>
    <button className="button purple" onClick={() => dispatch({ type: 'review' })}><Flag size={15} /> {last ? 'Mark for Review' : 'Mark for Review & Next'}</button>
    <button className="button primary" onClick={() => dispatch({ type: 'save' })}>{last ? 'Save Response' : 'Save & Next'} <ArrowRight size={16} /></button>
  </div>
}
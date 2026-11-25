import { QuestionDetails } from '../QuestionPrompt'
import type { evaluate } from '../../utils/exam'
type Item = ReturnType<typeof evaluate>['items'][number]
export function SolutionCard({ item }: { item: Item }) {
  const { question, index, outcome, selected, marks, review } = item
  const optionText = (id?: string | null) => question.options.find(option => option.id === id)?.text
  return <article className="panel content solution"><div className="solution-head"><strong>Question {index + 1}</strong><span className={'chip ' + (outcome === 'correct' ? 'green' : outcome === 'incorrect' ? 'red' : '')}>{outcome}</span>{review && <span className="chip purple">Marked for Review</span>}<span className="marks">{marks > 0 ? '+' : ''}{marks} marks</span></div>
    <small>{question.subject}{question.topic && ' · ' + question.topic}</small><h2 className="question-stem">{question.questionText}</h2>
    <QuestionDetails question={question} />
    <ol className="solutions-options">{question.options.map(option => <li key={option.id} className={option.id === question.correctOptionId ? 'green' : option.id === selected && outcome === 'incorrect' ? 'red' : ''}><strong>{option.id}.</strong> {option.text}{option.id === question.correctOptionId && <span>Correct answer</span>}{option.id === selected && <span>Your answer</span>}</li>)}</ol>
    <p><strong>Your answer</strong> {optionText(selected) ?? 'Unattempted'}</p>{outcome === 'cancelled' ? <p>Cancelled in the final answer key.</p> : <p><strong>Correct answer</strong> {optionText(question.correctOptionId)}</p>}
    {question.explanation && <div className="explanation"><strong>Explanation</strong><p>{question.explanation}</p></div>}
  </article>
}
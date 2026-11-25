import { QuestionDetails } from '../QuestionPrompt'
import type { Question, Response } from '../../types/exam'

export function QuestionCard({ question, response, index, total, select }: { question: Question; response: Response; index: number; total: number; select: (id: string) => void }) {
  return <div className="question-content">
    <div className="question-heading"><h1 tabIndex={-1} id="question-heading">Question {index + 1} of {total}</h1><span className="chip green">+{question.positiveMarks} correct</span><span className="chip red">−{question.negativeMarks} incorrect</span></div>
    <fieldset><legend className="question-stem">{question.questionText}</legend>
      <QuestionDetails question={question} />
      {question.options.map(option => <label key={option.id} className={'option ' + (response.selected === option.id ? 'selected' : '')}><input type="radio" name={question.id} value={option.id} checked={response.selected === option.id} onChange={() => select(option.id)} /><span className="option-letter">{option.id}</span>{option.text}</label>)}
    </fieldset>
    <p className="response-note" aria-live="polite">{response.selected !== response.saved ? 'Draft selected. Save it to include it in your score.' : response.saved ? 'Response saved.' : 'Select an option to answer.'}{response.review && ' Marked for review.'}</p>
  </div>
}
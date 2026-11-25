import { useEffect, useRef } from 'react'
import { test } from '../../data/test'
import type { Attempt } from '../../types/exam'
import { clock, summary } from '../../utils/exam'

export function SubmitConfirmationModal({ attempt, seconds, close, confirm }: { attempt: Attempt; seconds: number; close: () => void; confirm: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    return () => element?.close()
  }, [])
  const counts = summary(attempt)
  const details = [
    ['Total questions', test.questionIds.length], ['Answered questions (including review)', counts.answered + counts.answeredReview],
    ['Unanswered questions (visited)', counts.unanswered + counts.review], ['Not visited questions', counts.unvisited],
    ['Marked for review (total)', counts.review + counts.answeredReview], ['Answered and marked for review', counts.answeredReview],
    ['Time remaining', clock(seconds)],
  ]
  return <dialog ref={dialog} aria-labelledby="submit-heading" onCancel={close}><h2 id="submit-heading">Submit examination?</h2><p>Your saved responses will be graded when you submit.</p>
    <dl className="submit-details">{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="dialog-actions"><button autoFocus className="button" onClick={close}>Continue Examination</button><button className="button primary" onClick={confirm}>Confirm Submission</button></div>
  </dialog>
}
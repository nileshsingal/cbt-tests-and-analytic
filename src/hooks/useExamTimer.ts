import { useEffect, useState } from 'react'
import type { Attempt } from '../types/exam'
import { updateAttempt } from '../services/attempts'
import { secondsLeft } from '../utils/exam'

export function useExamTimer(attempt: Attempt) {
  const [seconds, setSeconds] = useState(() => secondsLeft(attempt))
  const { id, deadline, submittedAt } = attempt
  useEffect(() => {
    if (submittedAt !== undefined) return
    function tick() {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setSeconds(remaining)
      if (remaining === 0) updateAttempt(id, { type: 'submit' })
    }
    const interval = window.setInterval(tick, 250)
    tick()
    return () => window.clearInterval(interval)
  }, [deadline, id, submittedAt])
  return seconds
}

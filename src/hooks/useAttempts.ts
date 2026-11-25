import { useEffect, useState } from 'react'
import { attemptKey, readAttempts, updateAttempt } from '../services/attempts'

export function useAttempts() {
  const [attempts, setAttempts] = useState(() => readAttempts())

  useEffect(() => {
    const refresh = () => setAttempts(readAttempts())
    window.addEventListener(attemptKey, refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => {
      window.removeEventListener(attemptKey, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    const pending = attempts.filter(attempt => attempt.submittedAt === undefined)
    if (!pending.length) return
    const deadline = Math.min(...pending.map(attempt => attempt.deadline))
    const settle = () => {
      for (const attempt of pending) {
        if (Date.now() >= attempt.deadline) updateAttempt(attempt.id, { type: 'submit' })
      }
    }
    const timer = window.setTimeout(settle, Math.max(0, deadline - Date.now()))
    window.addEventListener('focus', settle)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', settle)
    }
  }, [attempts])

  return attempts
}

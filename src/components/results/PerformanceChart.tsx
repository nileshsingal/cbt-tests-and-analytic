import type { evaluate } from '../../utils/exam'
export function PerformanceChart({ result }: { result: ReturnType<typeof evaluate> }) {
  const correct = 100 * result.correct / result.items.length
  const attempted = 100 * (result.correct + result.incorrect) / result.items.length
  return <section className="panel content"><h2>Answer Breakdown</h2><div className="chart-wrap">
    <div className="donut" aria-hidden="true" style={{ background: 'conic-gradient(#158358 0 ' + correct + '%, #c64142 ' + correct + '% ' + attempted + '%, #cbd5e1 ' + attempted + '% 100%)' }}><span>{result.items.length}<small>questions</small></span></div>
    <ul className="legend">{[['Correct', result.correct, 'answered'], ['Incorrect', result.incorrect, 'unanswered'], ['Unattempted', result.unattempted, 'unvisited']].map(([label, value, color]) => <li key={label}><span className={'status-token ' + color} />{label}<strong>{value}</strong></li>)}</ul>
  </div></section>
}
import { clock, evaluate } from '../../utils/exam'
type Result = ReturnType<typeof evaluate>
export function ResultSummary({ result }: { result: Result }) {
  const metrics = [['Correct', result.correct], ['Incorrect', result.incorrect], ['Unattempted', result.unattempted], ['Accuracy', result.accuracy.toFixed(1) + '%'], ['Time taken', clock(result.elapsed)], ['Marks deducted', result.deducted]]
  return <><section className="panel content score"><div><h2>Total Score</h2><strong>{result.score} <small>/ {result.maximum} marks</small></strong></div><div><strong>{result.percentage.toFixed(1)}%</strong><progress aria-label="Score progress" max={result.maximum} value={Math.max(0, result.score)} /></div></section>
    <div className="metrics result-metrics">{metrics.map(([label, value]) => <div className="panel metric" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></>
}
import type { Question } from '../types/exam'

export function QuestionDetails({ question }: { question: Question }) {
  return <>
    {question.table && <div className="table-wrap question-table"><table>
      {question.table.headings.some(Boolean) && <thead><tr>{question.table.headings.map((heading, index) => <th key={index} scope="col">{heading}</th>)}</tr></thead>}
      <tbody>{question.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, columnIndex) => <td key={columnIndex}>{cell}</td>)}</tr>)}</tbody>
    </table></div>}
    {question.figure && <img className="question-figure" src={question.figure.src} alt={question.figure.alt} />}
  </>
}

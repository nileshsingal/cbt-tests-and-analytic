import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Brand({ exam = false }: { exam?: boolean }) {
  const content = <><span className="brand-icon"><GraduationCap size={23} /></span><span>MPSC Test Series<small>Practice. Analyse. Improve.</small></span></>
  return exam ? <div className="brand">{content}</div> : <Link className="brand" to="/">{content}</Link>
}

import './Progress.css'

function Progress({ current, total }) {
  return (
    <div className="shared-progress">
      <span>{current} / {total}</span>
    </div>
  )
}

export default Progress

import './LoadingSpinner.css'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="loading-spinner__circle" />
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  )
}

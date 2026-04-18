import './Button.css'

function Button({ children, ...props }) {
  return (
    <button className="shared-button" {...props}>
      {children}
    </button>
  )
}

export default Button

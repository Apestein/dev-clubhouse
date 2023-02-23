import "./Logo.css"
export default function Logo() {
  return (
    <button className="Logo_button">
      <span className="actual-text text-black">
        &nbsp;dev&nbsp;clubhouse&nbsp;
      </span>
      <span className="Logo_hover-text" aria-hidden="true">
        &nbsp;dev&nbsp;clubhouse&nbsp;
      </span>
    </button>
  )
}

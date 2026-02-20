import "./Button.scss";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      className={`app-button`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

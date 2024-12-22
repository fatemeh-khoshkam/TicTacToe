export default function Button({
  type,
  onClick,
  disabled,
  children,
  className,
}: {
  type: "button" | "submit";
  onClick: () => void;
  disabled: boolean;
  children: string;
  className?: string;
}) {
  return (
    <button
      type={type}
      className={`btn ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

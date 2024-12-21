export default function Button({
  type,
  onClick,
  disabled,
  children,
}: {
  type: "button" | "submit";
  onClick: () => void;
  disabled: boolean;
  children: string;
}) {
  return (
    <button type={type} className="btn" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

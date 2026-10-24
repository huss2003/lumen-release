type Props = {
  children: string;
  variant?: "lime" | "ink";
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
  disabled?: boolean;
};

export default function RollButton({ children, variant = "lime", onClick, type = "button", href, disabled }: Props) {
  const inner = (
    <span className="roll">
      <span className="roll__stack">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  );
  const cls = `roll-btn roll-btn--${variant}`;
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}

import { classNames } from "@/utils/helpers";

const variants = {
  primary: { background: "var(--color-primary)", color: "#fff", border: "none" },
  danger: { background: "var(--color-danger)", color: "#fff", border: "none" },
  outline: {
    background: "transparent",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  },
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  className,
  style,
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames("btn", className)}
      style={{
        padding: "8px 16px",
        borderRadius: "var(--radius)",
        cursor: "pointer",
        fontSize: 14,
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
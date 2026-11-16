export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ padding: "8px 12px", minWidth: 240, border: "1px solid var(--color-border)", borderRadius: "var(--radius)", fontSize: 14 }}
    />
  );
}
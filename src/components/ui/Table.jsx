export default function Table({ columns, data, emptyText = "No data found" }) {
  return (
    <div style={{ overflowX: "auto", background: "var(--color-surface)", borderRadius: "var(--radius)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: "left", padding: 12, borderBottom: "1px solid var(--color-border)", fontSize: 13, color: "var(--color-muted)" }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 24, textAlign: "center", color: "var(--color-muted)" }}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: 12, borderBottom: "1px solid var(--color-border)", fontSize: 14 }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
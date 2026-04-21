const workspaceItems = [
  { label: "Queue", value: "0" },
  { label: "Active", value: "Ready" },
  { label: "Profile", value: "Default" },
];

export function MainPage() {
  return (
    <section className="page-grid" aria-label="Main workspace">
      <div className="workspace-panel primary-panel">
        <p className="panel-label">Workspace</p>
        <h2>FluxDL</h2>
        <div className="placeholder-surface" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="workspace-panel">
        <p className="panel-label">Status</p>
        <div className="metric-list">
          {workspaceItems.map((item) => (
            <div className="metric-row" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

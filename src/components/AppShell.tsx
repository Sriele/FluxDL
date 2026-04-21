import type { AppShellProps } from "../types";

export function AppShell({
  activeRoute,
  navigationItems,
  onNavigate,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            F
          </div>
          <div>
            <p className="brand-name">FluxDL</p>
            <p className="brand-version">Desktop</p>
          </div>
        </div>

        <nav className="nav-list">
          {navigationItems.map((item) => (
            <button
              className="nav-item"
              type="button"
              aria-current={activeRoute === item.id ? "page" : undefined}
              key={item.id}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

import { Fragment, useId, useState } from "react";

import type { AppShellProps } from "../types";

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function FluxLogoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 21 8v8l-9 5-9-5V8l9-5Z" />
      <path d="M8 9h8" />
      <path d="M8 12h6" />
      <path d="M8 15h4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 9 5 5 5-5" />
    </svg>
  );
}

function SidebarToggleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v14H4V5Z" />
      <path d="M9 5v14" />
      <path d="m15 9-3 3 3 3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" />
      <path d="M4 10h16" />
      <path d="M8 15h3" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="m5.6 5.6 2.1 2.1" />
      <path d="m16.3 16.3 2.1 2.1" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m5.6 18.4 2.1-2.1" />
      <path d="m16.3 7.7 2.1-2.1" />
    </svg>
  );
}

function SignInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 5h5v14h-5" />
      <path d="M10 8l4 4-4 4" />
      <path d="M4 12h10" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="4" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M18 8v6" />
      <path d="M15 11h6" />
    </svg>
  );
}

export function AppShell({
  activeRoute,
  navigationItems,
  onNavigate,
  children,
}: AppShellProps) {
  const accountMenuId = useId();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const accountMenuItems = [
    { label: "Connexion", icon: <SignInIcon /> },
    { label: "Creer un compte", icon: <UserPlusIcon /> },
    { label: "Profil", icon: <UserIcon />, separatorBefore: true },
    { label: "Securite", icon: <ShieldIcon /> },
    { label: "Facturation", icon: <CreditCardIcon /> },
    { label: "Preferences", icon: <SettingsIcon /> },
  ];

  function toggleSidebar() {
    setIsSidebarCollapsed((isCollapsed) => !isCollapsed);
    setIsAccountMenuOpen(false);
  }

  return (
    <div
      className="app-shell"
      data-sidebar={isSidebarCollapsed ? "collapsed" : "expanded"}
    >
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="sidebar-brand-row">
          <div className="sidebar-brand" aria-label="FluxDL">
            <span className="sidebar-brand-logo">
              <FluxLogoIcon />
            </span>
            <span className="sidebar-brand-name">FluxDL</span>
          </div>

          <button
            className="sidebar-toggle"
            type="button"
            aria-label={
              isSidebarCollapsed ? "Ouvrir la sidebar" : "Reduire la sidebar"
            }
            title={isSidebarCollapsed ? "Ouvrir la sidebar" : "Reduire la sidebar"}
            onClick={toggleSidebar}
          >
            <SidebarToggleIcon />
          </button>
        </div>

        <div className="sidebar-section-separator" role="presentation" />

        <nav className="nav-list">
          <p className="nav-section-title">Download</p>
          {navigationItems.map((item) => (
            <Fragment key={item.id}>
              {item.separatorBefore ? (
                <>
                  <div className="nav-separator" role="presentation" />
                  <p className="nav-section-title">Streaming</p>
                </>
              ) : null}
              <button
                className="nav-item"
                type="button"
                aria-current={activeRoute === item.id ? "page" : undefined}
                title={item.label}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.count ? <span className="nav-count">{item.count}</span> : null}
              </button>
            </Fragment>
          ))}
        </nav>

        <div className="account-menu-wrapper sidebar-account">
          {!isSidebarCollapsed && isAccountMenuOpen ? (
            <div className="account-dropdown" id={accountMenuId} role="menu">
              <div className="account-summary">
                <span className="account-avatar" aria-hidden="true">
                  F
                </span>
                <span>
                  <span className="account-summary-title">Compte FluxDL</span>
                  <span className="account-summary-subtitle">Non connecte</span>
                </span>
              </div>

              <div className="account-actions">
                {accountMenuItems.map((item) => (
                  <Fragment key={item.label}>
                    {item.separatorBefore ? (
                      <div className="account-action-separator" role="presentation" />
                    ) : null}
                    <button
                      className="account-action"
                      role="menuitem"
                      type="button"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      <span className="account-action-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          ) : null}

          <button
            className="account-menu"
            type="button"
            aria-expanded={!isSidebarCollapsed && isAccountMenuOpen}
            aria-controls={accountMenuId}
            aria-label="Gerer le compte"
            title="Gerer le compte"
            onClick={() => {
              if (isSidebarCollapsed) {
                setIsSidebarCollapsed(false);
                return;
              }

              setIsAccountMenuOpen((isOpen) => !isOpen);
            }}
          >
            <span className="account-icon">
              <AccountIcon />
            </span>
            <span className="account-name">Se connecter</span>
            <span className="account-chevron">
              <ChevronDownIcon />
            </span>
          </button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

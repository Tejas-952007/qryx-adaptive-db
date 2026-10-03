import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Activity, 
  Sliders, 
  FileText, 
  Lock, 
  UserCheck, 
  RefreshCw,
  Layers,
  Sun,
  Moon,
  ChevronRight,
  Info
} from 'lucide-react';
import type { User, DataSource } from '../types/queryguard';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User;
  users: User[];
  onChangeUser: (user: User) => void;
  dataSource: DataSource;
  onResetDemo: () => void;
  onOpenPrivacyModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  children?: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  users,
  onChangeUser,
  dataSource,
  onResetDemo,
  onOpenPrivacyModal,
  theme,
  onToggleTheme,
  children
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'queries', label: 'Slow Queries', icon: Database, badge: '4' },
    { id: 'recommendations', label: 'Recommendations', icon: Layers, badge: '3' },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'privacy', label: 'Privacy & Controls', icon: Lock },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Bar */}
      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--brand-primary-muted)',
              border: '1px solid var(--brand-primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary-text)',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '-0.03em'
            }}>
              QG
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  QueryGuard AI
                </span>
                <span className="badge badge-brand" style={{ fontSize: 10, padding: '2px 7px' }}>Enterprise v1.0</span>
              </div>
            </div>
          </div>

          <div style={{ height: 20, width: 1, backgroundColor: 'var(--border-default)', margin: '0 6px' }} />

          {/* Connection status badge */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              background: 'var(--bg-subtle)', 
              padding: '4px 10px', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              fontSize: 12
            }}
          >
            <span style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: dataSource.connectionStatus === 'CONNECTED' ? 'var(--success-text)' : 'var(--danger-text)',
              display: 'inline-block'
            }} />
            <span style={{ color: 'var(--text-muted)' }}>Source:</span>
            <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              {dataSource.name}
            </strong>
            <span className="badge badge-neutral" style={{ fontSize: 10 }}>
              {dataSource.mode === 'DEMO' ? 'Demo Mode' : 'Connected'}
            </span>
          </div>

          {/* Privacy status chip */}
          <button 
            onClick={onOpenPrivacyModal}
            className="badge badge-brand" 
            style={{ 
              cursor: 'pointer', 
              padding: '5px 11px', 
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            title="Click to view privacy gateway guarantees & self-test"
          >
            <ShieldCheck size={14} />
            <span>Zero Raw Rows • Keyed HMAC Masking</span>
          </button>
        </div>

        {/* Right side controls: Theme Toggle, Role selector & Demo Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Minimalist Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: 12 }}
            title={theme === 'dark' ? "Switch to Enterprise Light" : "Switch to Enterprise Dark"}
          >
            {theme === 'dark' ? <Sun size={14} style={{ color: 'var(--warning-text)' }} /> : <Moon size={14} style={{ color: 'var(--info-text)' }} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button 
            onClick={onResetDemo}
            className="btn btn-secondary" 
            style={{ fontSize: 12, padding: '5px 10px' }}
            title="Reset seeded benchmark data and status"
          >
            <RefreshCw size={13} />
            <span>Reset Demo</span>
          </button>

          {/* User / Role Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-subtle)', padding: '3px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
            <UserCheck size={14} style={{ color: 'var(--brand-primary-text)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Role:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = users.find(u => u.id === e.target.value);
                if (found) onChangeUser(found);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '2px 4px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: 'var(--bg-surface)' }}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="sidebar">
          <div style={{ padding: 'var(--space-4) var(--space-4) var(--space-2)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
              Navigation
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 var(--space-2)' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'var(--bg-surface-raised)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 13,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon 
                      size={16} 
                      style={{ 
                        color: isActive ? 'var(--brand-primary-text)' : 'var(--text-muted)',
                        transition: 'color 0.15s ease'
                      }} 
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      fontSize: 11,
                      padding: '1px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'var(--brand-primary-muted)' : 'var(--bg-subtle)',
                      color: isActive ? 'var(--brand-primary-text)' : 'var(--text-muted)',
                      fontWeight: 700
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom trust reminder box */}
          <div style={{ marginTop: 'auto', padding: 'var(--space-4)', borderTop: '1px solid var(--border-default)' }}>
            <div style={{
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              border: '1px solid var(--border-default)',
              fontSize: 12,
              lineHeight: 1.45
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--brand-primary-text)', fontWeight: 700, marginBottom: 4 }}>
                <ShieldCheck size={14} />
                <span>Production Safety</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                Human DBA approval required. Zero automated DDL/DML deployment to production.
              </p>
            </div>
          </div>
        </aside>
        {children}
      </div>
    </div>
  );
};

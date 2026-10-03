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
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Full-Height Sidebar Navigation */}
      <aside className="sidebar" style={{ width: 260, borderRight: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-default)' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '-0.03em',
            boxShadow: 'var(--shadow-sm)'
          }}>
            QG
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'block' }}>
              QueryGuard AI
            </span>
            <span className="badge badge-brand" style={{ fontSize: 10, padding: '2px 7px', marginTop: 4 }}>Enterprise v1.0</span>
          </div>
        </div>

        <div style={{ padding: '24px 20px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
            Main Menu
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'var(--brand-primary-muted)' : 'transparent',
                    color: isActive ? 'var(--brand-primary-text)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14,
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon 
                      size={18} 
                      style={{ 
                        color: isActive ? 'var(--brand-primary-text)' : 'var(--text-muted)',
                        transition: 'color 0.2s ease'
                      }} 
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-surface-raised)',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom trust reminder box */}
        <div style={{ marginTop: 'auto', padding: '24px 20px' }}>
          <div style={{
            background: 'var(--bg-surface-raised)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--border-default)',
            fontSize: 12,
            lineHeight: 1.5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-primary-text)', fontWeight: 700, marginBottom: 8 }}>
              <ShieldCheck size={16} />
              <span>Production Safety</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              Human DBA approval required. Zero automated deployment.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Right Side) */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{ 
          height: 72, 
          minHeight: 72, 
          background: 'var(--bg-canvas)', 
          borderBottom: '1px solid var(--border-default)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 32px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Connection status badge */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                background: 'var(--bg-surface)', 
                padding: '6px 12px', 
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-default)',
                fontSize: 13,
                boxShadow: 'var(--shadow-sm)'
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
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {dataSource.name}
              </strong>
            </div>

            {/* Privacy status chip */}
            <button 
              onClick={onOpenPrivacyModal}
              className="badge badge-brand" 
              style={{ 
                cursor: 'pointer', 
                padding: '6px 14px', 
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderRadius: 'var(--radius-full)'
              }}
            >
              <ShieldCheck size={14} />
              <span>Zero Raw Rows • Local Sync</span>
            </button>
          </div>

          {/* Right side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={onToggleTheme}
              className="btn btn-secondary"
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)' }}
            >
              {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--warning-text)' }} /> : <Moon size={16} style={{ color: 'var(--info-text)' }} />}
            </button>

            <button 
              onClick={onResetDemo}
              className="btn btn-secondary" 
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)' }}
            >
              <RefreshCw size={16} />
            </button>

            {/* User / Role Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--brand-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary-text)' }}>
                <UserCheck size={14} />
              </div>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const found = users.find(u => u.id === e.target.value);
                  if (found) onChangeUser(found);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none'
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

        {/* Dynamic Content Canvas */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px', backgroundColor: 'var(--bg-canvas)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

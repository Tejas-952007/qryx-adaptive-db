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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

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
      {/* Collapsible Dark Sidebar Navigation */}
      <aside 
        className="sidebar" 
        style={{ 
          width: isSidebarOpen ? 260 : 72, 
          minWidth: isSidebarOpen ? 260 : 72,
          backgroundColor: '#1E293B', 
          color: '#F8FAFC',
          display: 'flex', 
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          zIndex: 50
        }}
      >
        <div style={{ 
          padding: isSidebarOpen ? '20px' : '20px 0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          gap: 12, 
          borderBottom: '1px solid #334155',
          whiteSpace: 'nowrap'
        }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Sidebar"
            style={{
              width: 36,
              height: 36,
              minWidth: 36,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '-0.03em',
              padding: 0
            }}
          >
            QG
          </button>
          
          <div style={{ 
            opacity: isSidebarOpen ? 1 : 0, 
            transition: 'opacity 0.2s ease', 
            pointerEvents: isSidebarOpen ? 'auto' : 'none',
            display: isSidebarOpen ? 'block' : 'none'
          }}>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: '#FFFFFF', display: 'block' }}>
              QueryGuard AI
            </span>
            <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, display: 'block' }}>Enterprise v1.0</span>
          </div>
        </div>

        <div style={{ padding: isSidebarOpen ? '24px 16px' : '24px 8px' }}>
          {isSidebarOpen && (
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: 12, paddingLeft: 8, whiteSpace: 'nowrap' }}>
              Main Menu
            </div>
          )}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={!isSidebarOpen ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarOpen ? 'space-between' : 'center',
                    padding: isSidebarOpen ? '10px 12px' : '12px 0',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14,
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#94A3B8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={18} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </div>
                  {item.badge && isSidebarOpen && (
                    <span style={{
                      fontSize: 11,
                      padding: '2px 6px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: '#FFFFFF',
                      fontWeight: 600
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area (Right Side) */}
      <div 
        onClick={() => {
          if (isSidebarOpen) setIsSidebarOpen(false);
        }}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', backgroundColor: 'var(--bg-canvas)' }}
      >
        {/* Structured Context Top Bar */}
        <header style={{ 
          background: 'var(--bg-surface)', 
          borderBottom: '1px solid var(--border-default)', 
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 40
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 24px',
            borderBottom: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-subtle)'
          }}>
            {/* Context Selectors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Server</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success-text)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{dataSource.name}</span>
                  <span className="badge badge-neutral" style={{ fontSize: 10, padding: '1px 6px' }}>Primary</span>
                </div>
              </div>

              <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-strong)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Database</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <Database size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>postgres_main</span>
                </div>
              </div>

              <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-strong)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Timeframe</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <Activity size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Last 24 hours</span>
                </div>
              </div>
            </div>

            {/* Global Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={onOpenPrivacyModal} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <Lock size={14} /> Privacy Config
              </button>
              <div style={{ width: 1, height: 16, backgroundColor: 'var(--border-strong)' }} />
              <button onClick={onResetDemo} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <RefreshCw size={14} /> Sync
              </button>
              <div style={{ width: 1, height: 16, backgroundColor: 'var(--border-strong)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--brand-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary-text)' }}>
                  <UserCheck size={12} />
                </div>
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const found = users.find(u => u.id === e.target.value);
                    if (found) onChangeUser(found);
                  }}
                  style={{ background: 'transparent', border: 'none', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}
                >
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          {/* Page Title & Tabs */}
          <div style={{ padding: '16px 24px 0 24px' }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: 0, paddingBottom: 16 }}>
              {navItems.find(i => i.id === currentTab)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Dynamic Content Canvas */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px', backgroundColor: 'var(--bg-canvas)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

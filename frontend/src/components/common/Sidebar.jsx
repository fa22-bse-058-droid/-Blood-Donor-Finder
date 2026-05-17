import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  {
    section: 'Command',
    links: [
      { to: '/dashboard',  icon: 'ti-layout-dashboard', label: 'Overview' },
      { to: '/emergency',  icon: 'ti-alert-triangle',   label: 'Emergency', badge: 3, badgeColor: 'red' },
      { to: '/donor-map',  icon: 'ti-map-pin',          label: 'Donor Map' },
    ],
  },
  {
    section: 'Manage',
    links: [
      { to: '/donors',        icon: 'ti-users',              label: 'Donors' },
      { to: '/hospitals',     icon: 'ti-building-hospital',  label: 'Hospitals' },
      { to: '/analytics',     icon: 'ti-brain',              label: 'AI Analytics' },
      { to: '/notifications', icon: 'ti-bell',               label: 'Notifications', badge: 7, badgeColor: 'blue' },
    ],
  },
  {
    section: 'System',
    links: [
      { to: '/admin',    icon: 'ti-shield-check', label: 'Admin Panel' },
      { to: '/settings', icon: 'ti-settings',     label: 'Settings' },
    ],
  },
];

const BADGE_STYLES = {
  red:  { background: 'var(--ll-red)',  color: '#fff' },
  blue: { background: 'var(--ll-blue)', color: 'var(--ll-sb)' },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside style={{
      background: 'var(--ll-sb)',
      borderRight: '0.5px solid var(--ll-b1)',
      display: 'flex',
      flexDirection: 'column',
      width: '190px',
      minHeight: '100vh',
      padding: '20px 0',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '0 16px 20px',
        borderBottom: '0.5px solid var(--ll-b1)',
        marginBottom: '20px',
      }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '7px',
          background: 'var(--ll-red)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <i className="ti ti-heart" style={{ fontSize: '15px', color: '#fff' }} />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ll-mint)', letterSpacing: '.04em' }}>
            LifeLink AI
          </p>
          <span style={{ fontSize: '10px', color: 'var(--ll-muted)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Healthcare OS
          </span>
        </div>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {NAV_ITEMS.map(({ section, links }) => (
          <div key={section} style={{ padding: '0 10px', marginBottom: '16px' }}>
            <p style={{
              fontSize: '10px', color: 'var(--ll-muted)', letterSpacing: '.1em',
              textTransform: 'uppercase', padding: '0 8px', marginBottom: '5px',
            }}>
              {section}
            </p>

            {links.map(({ to, icon, label, badge, badgeColor }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 9px', borderRadius: '7px',
                  fontSize: '12px', marginBottom: '1px',
                  textDecoration: 'none', transition: 'all .15s',
                  background: isActive ? 'var(--ll-red-d)' : 'transparent',
                  color: isActive ? 'var(--ll-red)' : 'var(--ll-muted)',
                  border: isActive ? '0.5px solid rgba(229,92,108,.2)' : '0.5px solid transparent',
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'var(--ll-s1)';
                    e.currentTarget.style.color = 'var(--ll-mint)';
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--ll-muted)';
                  }
                }}
              >
                <i className={`ti ${icon}`} style={{ fontSize: '15px', width: '17px' }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 5px',
                    borderRadius: '8px', fontFamily: "'JetBrains Mono', monospace",
                    ...BADGE_STYLES[badgeColor],
                  }}>
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '0.5px solid var(--ll-b1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'var(--ll-deep)', border: '0.5px solid var(--ll-b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: 'var(--ll-blue)', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ll-mint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Admin'}
            </p>
            <span style={{ fontSize: '10px', color: 'var(--ll-muted)' }}>
              {user?.role || 'Coordinator'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ll-muted)', padding: '4px',
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: '15px' }} />
          </button>
        </div>

        {/* Online status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
          <div className="ll-pulse" style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--ll-grn)', flexShrink: 0,
          }} />
          <span style={{ fontSize: '10px', color: 'var(--ll-muted)' }}>System online</span>
        </div>
      </div>
    </aside>
  );
}
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import DonationTrends from '../components/dashboard/DonationTrends';
import BloodStockChart from '../components/dashboard/BloodStockChart';

// ─── Topbar ────────────────────────────────────────────────────────────────────
function Topbar() {
  const now = new Date().toLocaleDateString('en-PK', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Karachi',
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 22px', borderBottom: '0.5px solid var(--ll-b1)',
      background: 'rgba(13,31,45,0.8)', flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ll-mint)' }}>Overview</span>
        <span style={{ fontSize: '11px', color: 'var(--ll-muted)', marginLeft: '8px' }}>{now}</span>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        background: 'var(--ll-s1)', border: '0.5px solid var(--ll-b1)',
        borderRadius: '7px', padding: '7px 12px', width: '180px',
      }}>
        <i className="ti ti-search" style={{ fontSize: '14px', color: 'var(--ll-muted)' }} />
        <input
          type="text"
          placeholder="Search donors, hospitals…"
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--ll-mint)', fontSize: '12px',
            fontFamily: "'Syne', sans-serif", width: '100%',
          }}
        />
      </div>

      {/* Live pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: 'var(--ll-red-d)', border: '0.5px solid rgba(229,92,108,.25)',
        borderRadius: '16px', padding: '5px 10px',
        fontSize: '11px', color: 'var(--ll-red)', fontWeight: 600,
      }}>
        <div className="ll-pulse" style={{
          width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ll-red)',
        }} />
        LIVE
      </div>

      {/* Notification bell */}
      <div style={{
        width: '32px', height: '32px', background: 'var(--ll-s1)',
        border: '0.5px solid var(--ll-b1)', borderRadius: '7px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative',
      }}>
        <i className="ti ti-bell" style={{ fontSize: '16px', color: 'var(--ll-muted)' }} />
        <span style={{
          position: 'absolute', top: '5px', right: '5px',
          width: '5px', height: '5px', borderRadius: '50%',
          background: 'var(--ll-red)',
        }} />
      </div>
    </div>
  );
}

// ─── AI Insight Banner ─────────────────────────────────────────────────────────
function AiBanner({ message, tags, confidence }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'var(--ll-s1)', border: '0.5px solid rgba(116,179,206,.2)',
      borderRadius: '10px', padding: '16px', marginBottom: '18px',
      display: 'flex', gap: '12px',
    }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '8px',
        background: 'var(--ll-pur-d)', border: '0.5px solid rgba(123,143,212,.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <i className="ti ti-robot" style={{ fontSize: '17px', color: 'var(--ll-pur)' }} />
      </div>
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ll-mint)', marginBottom: '3px' }}>
          {message}
        </p>
        <span style={{ fontSize: '11px', color: 'var(--ll-muted)', lineHeight: 1.5 }}>
          Model confidence {confidence}% — based on 72hr donation patterns and active emergencies.
        </span>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
          {tags.map(t => (
            <span key={t} style={{
              fontSize: '10px', padding: '2px 7px', borderRadius: '5px',
              background: 'rgba(116,179,206,.1)', color: 'var(--ll-blue)',
              border: '0.5px solid rgba(116,179,206,.2)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Emergency Feed ────────────────────────────────────────────────────────────
const SEVERITY_STYLES = {
  critical: { borderColor: 'var(--ll-red)',  badgeBg: 'var(--ll-red-d)',  badgeColor: 'var(--ll-red)',  bloodBg: 'var(--ll-red-d)',  bloodColor: 'var(--ll-red)'  },
  high:     { borderColor: 'var(--ll-amb)',  badgeBg: 'var(--ll-amb-d)',  badgeColor: 'var(--ll-amb)',  bloodBg: 'var(--ll-amb-d)',  bloodColor: 'var(--ll-amb)'  },
  medium:   { borderColor: 'var(--ll-blue)', badgeBg: 'rgba(116,179,206,.12)', badgeColor: 'var(--ll-blue)', bloodBg: 'rgba(116,179,206,.12)', bloodColor: 'var(--ll-blue)' },
};

function EmergencyFeed({ emergencies = [] }) {
  return (
    <div className="ll-panel" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ll-mint)', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: '15px', color: 'var(--ll-muted)' }} />
          Live emergencies
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ll-blue)', cursor: 'pointer' }}>Open board</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {emergencies.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--ll-muted)', textAlign: 'center', padding: '20px 0' }}>
            No active emergencies
          </p>
        ) : emergencies.map((e) => {
          const s = SEVERITY_STYLES[e.severity] || SEVERITY_STYLES.medium;
          return (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px', background: 'var(--ll-s2)',
              borderRadius: '0 8px 8px 0',
              border: '0.5px solid var(--ll-b1)',
              borderLeft: `2.5px solid ${s.borderColor}`,
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '7px',
                background: s.bloodBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: s.bloodColor,
                fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
              }}>
                {e.bloodType}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ll-mint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {e.hospital}
                </p>
                <span style={{ fontSize: '10px', color: 'var(--ll-muted)' }}>
                  {e.reason} — {e.units} unit{e.units !== 1 ? 's' : ''} needed
                </span>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '5px',
                  fontFamily: "'JetBrains Mono', monospace",
                  background: s.badgeBg, color: s.badgeColor,
                  textTransform: 'uppercase',
                }}>
                  {e.severity}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--ll-muted)', marginTop: '3px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {e.timeAgo}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Top Donors ────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: 'var(--ll-red-d)',           color: 'var(--ll-red)'  },
  { bg: 'rgba(116,179,206,.12)',     color: 'var(--ll-blue)' },
  { bg: 'var(--ll-grn-d)',           color: 'var(--ll-grn)'  },
  { bg: 'var(--ll-amb-d)',           color: 'var(--ll-amb)'  },
];

function TopDonors({ donors = [] }) {
  return (
    <div className="ll-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ll-mint)', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <i className="ti ti-users" style={{ fontSize: '15px', color: 'var(--ll-muted)' }} />
          Top matched donors
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ll-blue)', cursor: 'pointer' }}>Full list</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {donors.map((d, i) => {
          const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 10px', background: 'var(--ll-s2)',
              borderRadius: '7px', border: '0.5px solid var(--ll-b1)',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: av.bg, color: av.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, flexShrink: 0,
              }}>
                {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ll-mint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.name}
                </p>
                <span style={{ fontSize: '10px', color: 'var(--ll-muted)' }}>
                  {d.city} · {d.lastDonation}
                </span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ll-red)', fontFamily: "'JetBrains Mono', monospace", width: '24px', textAlign: 'center' }}>
                {d.bloodType}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--ll-grn)', fontFamily: "'JetBrains Mono', monospace", width: '32px', textAlign: 'right' }}>
                {d.score}%
              </span>
              <span style={{ fontSize: '9px', color: 'var(--ll-muted)', width: '34px', textAlign: 'right' }}>
                {d.distance}km
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Activity Feed ─────────────────────────────────────────────────────────────
const ACT_COLORS = {
  emergency:    'var(--ll-red)',
  confirmation: 'var(--ll-grn)',
  system:       'var(--ll-blue)',
  warning:      'var(--ll-amb)',
  ai:           'var(--ll-pur)',
};

function ActivityFeed({ events = [] }) {
  return (
    <div className="ll-panel">
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ll-mint)', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <i className="ti ti-activity" style={{ fontSize: '15px', color: 'var(--ll-muted)' }} />
          Live activity feed
        </span>
      </div>

      <div>
        {events.map((ev, i) => (
          <div key={i} style={{
            display: 'flex', gap: '10px',
            padding: '8px 0',
            borderBottom: i < events.length - 1 ? '0.5px solid var(--ll-b1)' : 'none',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: ACT_COLORS[ev.type] || 'var(--ll-muted)',
              marginTop: '4px', flexShrink: 0,
            }} />
            <div style={{ fontSize: '11px', color: 'var(--ll-muted)', lineHeight: 1.5, flex: 1 }}>
              <strong style={{ color: 'var(--ll-blue)', fontWeight: 500 }}>{ev.actor}</strong> {ev.action}
            </div>
            <span style={{
              fontSize: '9px', color: 'var(--ll-muted)', flexShrink: 0,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {ev.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_STATS = [
  { icon: 'ti-alert-triangle', label: 'Active emergencies', value: '3',     delta: '+2 today', deltaUp: false, accent: 'red'   },
  { icon: 'ti-heart',          label: 'Active donors',      value: '1,284', delta: '+14%',     deltaUp: true,  accent: 'green' },
  { icon: 'ti-map-pin',        label: 'Nearby donors',      value: '47',    delta: '+3',       deltaUp: true,  accent: 'blue'  },
  { icon: 'ti-drop',           label: 'Units in stock',     value: '892',   delta: '−6%',      deltaUp: false, accent: 'amber' },
];

const MOCK_EMERGENCIES = [
  { id: 1, bloodType: 'B+',  hospital: 'DHQ Hospital Lahore',       reason: 'Surgical', units: 4, severity: 'critical', timeAgo: '8m ago'  },
  { id: 2, bloodType: 'O−',  hospital: 'Services Hospital PK',      reason: 'Trauma',   units: 2, severity: 'high',     timeAgo: '23m ago' },
  { id: 3, bloodType: 'AB+', hospital: 'Sahiwal Teaching Hospital', reason: 'Elective', units: 1, severity: 'medium',   timeAgo: '1hr ago' },
];

const MOCK_DONORS = [
  { id: 1, name: 'Ali Khan',    city: 'Lahore',  bloodType: 'B+',  score: 98, distance: 1.2, lastDonation: '3mo ago' },
  { id: 2, name: 'Sara Raza',   city: 'Lahore',  bloodType: 'B+',  score: 94, distance: 2.7, lastDonation: '2mo ago' },
  { id: 3, name: 'M. Hassan',   city: 'Lahore',  bloodType: 'O−',  score: 89, distance: 3.4, lastDonation: '5mo ago' },
  { id: 4, name: 'Fatima Asad', city: 'Sahiwal', bloodType: 'AB+', score: 85, distance: 4.1, lastDonation: '4mo ago' },
];

const MOCK_ACTIVITY = [
  { type: 'emergency',    actor: 'Emergency broadcast',  action: 'sent for B+ to 47 donors in Lahore',    time: 'now' },
  { type: 'confirmation', actor: 'Ali Khan',             action: 'confirmed donation for DHQ Hospital',    time: '4m'  },
  { type: 'system',       actor: 'Services Hospital PK', action: 'verified — new emergency request',       time: '23m' },
  { type: 'warning',      actor: 'AI model',             action: 'flagged potential duplicate from IP 103.x', time: '34m' },
  { type: 'confirmation', actor: '3 new donors',         action: 'registered in Lahore — O+, A−, B+',     time: '1h'  },
  { type: 'ai',           actor: 'Stock report',         action: 'auto-generated and sent to admin',       time: '2h'  },
];

const AI_INSIGHT = {
  message: 'AI shortage prediction — B+ stock critically low in Lahore',
  confidence: 91,
  tags: ['B+ SHORTAGE', 'LAHORE', '18HR WINDOW', '91% CONFIDENCE'],
};

// ─── Dashboard Page ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats]      = useState(MOCK_STATS);
  const [emergencies]= useState(MOCK_EMERGENCIES);
  const [donors]     = useState(MOCK_DONORS);
  const [activity]   = useState(MOCK_ACTIVITY);
  const [loading]    = useState(false);

  // TODO: replace mock data with real API calls
  // useEffect(() => {
  //   fetchDashboardStats().then(setStats);
  //   fetchActiveEmergencies().then(setEmergencies);
  //   fetchTopDonors().then(setDonors);
  // }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ll-bg)' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />

        <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>

          {/* AI insight banner */}
          <AiBanner
            message={AI_INSIGHT.message}
            confidence={AI_INSIGHT.confidence}
            tags={AI_INSIGHT.tags}
          />

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
            {stats.map((s, i) => (
              <StatsCard key={i} {...s} loading={loading} />
            ))}
          </div>

          {/* Trends chart + Emergency feed */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '12px', marginBottom: '18px' }}>
            <DonationTrends />
            <EmergencyFeed emergencies={emergencies} />
          </div>

          {/* Donors + Blood stock + Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            <TopDonors donors={donors} />
            <BloodStockChart />
            <ActivityFeed events={activity} />
          </div>

        </div>
      </div>
    </div>
  );
}
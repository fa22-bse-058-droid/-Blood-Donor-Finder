import React from 'react';

const ACCENT_MAP = {
  red:  {
    border: 'var(--ll-red)',
    iconBg: 'var(--ll-red-d)',
    iconColor: 'var(--ll-red)',
    deltaUp: { color: 'var(--ll-grn)', background: 'var(--ll-grn-d)' },
    deltaDn: { color: 'var(--ll-red)', background: 'var(--ll-red-d)' },
    cls: 'll-card-red',
  },
  green: {
    border: 'var(--ll-grn)',
    iconBg: 'var(--ll-grn-d)',
    iconColor: 'var(--ll-grn)',
    deltaUp: { color: 'var(--ll-grn)', background: 'var(--ll-grn-d)' },
    deltaDn: { color: 'var(--ll-red)', background: 'var(--ll-red-d)' },
    cls: 'll-card-grn',
  },
  blue: {
    border: 'var(--ll-blue)',
    iconBg: 'rgba(116,179,206,.12)',
    iconColor: 'var(--ll-blue)',
    deltaUp: { color: 'var(--ll-grn)', background: 'var(--ll-grn-d)' },
    deltaDn: { color: 'var(--ll-red)', background: 'var(--ll-red-d)' },
    cls: 'll-card-blue',
  },
  amber: {
    border: 'var(--ll-amb)',
    iconBg: 'var(--ll-amb-d)',
    iconColor: 'var(--ll-amb)',
    deltaUp: { color: 'var(--ll-grn)', background: 'var(--ll-grn-d)' },
    deltaDn: { color: 'var(--ll-red)', background: 'var(--ll-red-d)' },
    cls: 'll-card-amb',
  },
};

/**
 * StatsCard
 * @param {string}  icon      - Tabler icon name e.g. 'ti-heart'
 * @param {string}  label     - Card label
 * @param {string|number} value - Main metric value
 * @param {string}  delta     - Change text e.g. '+14%' or '−6%'
 * @param {boolean} deltaUp   - true = green delta, false = red delta
 * @param {'red'|'green'|'blue'|'amber'} accent
 * @param {boolean} loading
 */
export default function StatsCard({
  icon = 'ti-chart-bar',
  label = 'Metric',
  value = '—',
  delta,
  deltaUp = true,
  accent = 'blue',
  loading = false,
}) {
  const a = ACCENT_MAP[accent] || ACCENT_MAP.blue;

  return (
    <div
      className={a.cls}
      style={{
        background: 'var(--ll-s1)',
        border: '0.5px solid var(--ll-b1)',
        borderRadius: '10px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color .2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ll-b2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--ll-b1)'}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '7px',
          background: a.iconBg, color: a.iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className={`ti ${icon}`} style={{ fontSize: '16px' }} />
        </div>

        {delta && (
          <span style={{
            fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '5px',
            fontFamily: "'JetBrains Mono', monospace",
            ...(deltaUp ? a.deltaUp : a.deltaDn),
          }}>
            {delta}
          </span>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div style={{
          height: '26px', width: '60%', borderRadius: '5px',
          background: 'var(--ll-b1)', marginBottom: '6px',
          animation: 'll-pulse 1.4s ease infinite',
        }} />
      ) : (
        <div style={{
          fontSize: '26px', fontWeight: 700, color: 'var(--ll-mint)',
          lineHeight: 1, marginBottom: '3px',
          fontFamily: "'Syne', sans-serif",
        }}>
          {value}
        </div>
      )}

      {/* Label */}
      <div style={{ fontSize: '11px', color: 'var(--ll-muted)' }}>
        {label}
      </div>
    </div>
  );
}
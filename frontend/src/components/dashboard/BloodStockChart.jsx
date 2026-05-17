import React from 'react';

const STOCK_DATA = [
  { type: 'A+',  pct: 72, units: 144 },
  { type: 'A−',  pct: 45, units: 90  },
  { type: 'B+',  pct: 18, units: 36  },
  { type: 'B−',  pct: 33, units: 66  },
  { type: 'O+',  pct: 61, units: 122 },
  { type: 'O−',  pct: 22, units: 44  },
  { type: 'AB+', pct: 55, units: 110 },
  { type: 'AB−', pct: 40, units: 80  },
];

const getColor = (pct) => {
  if (pct < 25) return 'var(--ll-red)';
  if (pct < 50) return 'var(--ll-amb)';
  return 'var(--ll-grn)';
};

export default function BloodStockChart({ data = STOCK_DATA }) {
  return (
    <div className="ll-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ll-mint)', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <i className="ti ti-drop" style={{ fontSize: '15px', color: 'var(--ll-muted)' }} />
          Blood stock levels
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ll-blue)', cursor: 'pointer' }}>Manage</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map(({ type, pct, units }) => {
          const color = getColor(pct);
          return (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px', fontWeight: 700, width: '28px',
                color: 'var(--ll-mint)', fontFamily: "'JetBrains Mono', monospace",
              }}>
                {type}
              </span>

              <div style={{
                flex: 1, height: '5px', borderRadius: '3px',
                background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  borderRadius: '3px', background: color,
                  transition: 'width 0.8s ease',
                }} />
              </div>

              <span style={{
                fontSize: '10px', fontWeight: 600, width: '30px',
                textAlign: 'right', color,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {pct}%
              </span>

              <span style={{
                fontSize: '9px', color: 'var(--ll-muted)', width: '34px',
                textAlign: 'right', fontFamily: "'JetBrains Mono', monospace",
              }}>
                {units}u
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid var(--ll-b1)' }}>
        {[['var(--ll-grn)', '≥50% Good'], ['var(--ll-amb)', '25–49% Low'], ['var(--ll-red)', '<25% Critical']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
            <span style={{ fontSize: '10px', color: 'var(--ll-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
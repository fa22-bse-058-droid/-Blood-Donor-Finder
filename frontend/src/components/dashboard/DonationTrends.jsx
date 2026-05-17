import { useState } from 'react'

const WEEKLY = [
  { label: 'Mon', donations: 42, requests: 18 },
  { label: 'Tue', donations: 67, requests: 24 },
  { label: 'Wed', donations: 53, requests: 31 },
  { label: 'Thu', donations: 89, requests: 19 },
  { label: 'Fri', donations: 74, requests: 27 },
  { label: 'Sat', donations: 110, requests: 15 },
  { label: 'Sun', donations: 95, requests: 22 },
]

export default function DonationTrends() {
  const [hovered, setHovered] = useState(null)
  const maxVal = Math.max(...WEEKLY.map(d => Math.max(d.donations, d.requests)))
  const W = 560, H = 140, PAD = 20

  const toY = v => H - PAD - ((v / maxVal) * (H - PAD * 2))
  const toX = (i) => PAD + (i / (WEEKLY.length - 1)) * (W - PAD * 2)

  const donPath = WEEKLY.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.donations)}`).join(' ')
  const reqPath = WEEKLY.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.requests)}`).join(' ')
  const donFill = donPath + ` L${toX(WEEKLY.length-1)},${H} L${toX(0)},${H} Z`
  const reqFill = reqPath + ` L${toX(WEEKLY.length-1)},${H} L${toX(0)},${H} Z`

  return (
    <div className="ll-panel">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ll-mint)',
                        display: 'flex', alignItems: 'center', gap: '7px' }}>
          <i className="ti ti-chart-line" style={{ fontSize: '15px', color: 'var(--ll-muted)' }} />
          Weekly donation vs demand
        </span>
        <div style={{ display: 'flex', gap: '14px' }}>
          {[
            { label: 'Donations', color: '#74B3CE' },
            { label: 'Requests',  color: '#E63946' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '2px', background: l.color, borderRadius: '1px' }} />
              <span style={{ fontSize: '10px', color: 'var(--ll-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="donGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#74B3CE" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#74B3CE" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E63946" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#E63946" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i}
            x1={PAD} y1={toY(maxVal * t)}
            x2={W - PAD} y2={toY(maxVal * t)}
            stroke="rgba(116,179,206,0.08)" strokeWidth="1"/>
        ))}

        {/* Fill areas */}
        <path d={reqFill} fill="url(#reqGrad)"/>
        <path d={donFill} fill="url(#donGrad)"/>

        {/* Lines */}
        <path d={reqPath} fill="none" stroke="#E63946" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={donPath} fill="none" stroke="#74B3CE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Points + hover */}
        {WEEKLY.map((d, i) => (
          <g key={i}
             onMouseEnter={() => setHovered(i)}
             onMouseLeave={() => setHovered(null)}
             style={{ cursor: 'pointer' }}>
            {/* Hover zone */}
            <rect x={toX(i) - 16} y={0} width={32} height={H} fill="transparent"/>

            {/* Vertical hover line */}
            {hovered === i && (
              <line x1={toX(i)} y1={PAD} x2={toX(i)} y2={H}
                stroke="rgba(116,179,206,0.2)" strokeWidth="1" strokeDasharray="3,3"/>
            )}

            {/* Donation dot */}
            <circle cx={toX(i)} cy={toY(d.donations)} r={hovered === i ? 4 : 2.5}
              fill="#74B3CE" stroke="#0D1F2D" strokeWidth="1.5" style={{ transition: 'r 0.15s' }}/>
            {/* Request dot */}
            <circle cx={toX(i)} cy={toY(d.requests)} r={hovered === i ? 4 : 2.5}
              fill="#E63946" stroke="#0D1F2D" strokeWidth="1.5" style={{ transition: 'r 0.15s' }}/>

            {/* Tooltip */}
            {hovered === i && (
              <g>
                <rect x={toX(i) - 42} y={toY(d.donations) - 40} width={84} height={34}
                  rx="5" fill="rgba(13,31,45,0.95)" stroke="rgba(116,179,206,0.2)" strokeWidth="0.5"/>
                <text x={toX(i)} y={toY(d.donations) - 24} textAnchor="middle"
                  fill="#74B3CE" fontSize="10" fontWeight="600">
                  +{d.donations} donated
                </text>
                <text x={toX(i)} y={toY(d.donations) - 12} textAnchor="middle"
                  fill="#E63946" fontSize="10">
                  {d.requests} requested
                </text>
              </g>
            )}

            {/* X labels */}
            <text x={toX(i)} y={H + 4} textAnchor="middle"
              fill="#508991" fontSize="9" fontFamily="system-ui">
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
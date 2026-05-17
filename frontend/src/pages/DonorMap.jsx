import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Sidebar from '../components/common/Sidebar'
import { BLOOD_TYPES } from '../utils/constants'
import { calculateDistance } from '../utils/helpers'

// ── Mock donors (fallback) ─────────────────────────────────
const MOCK_DONORS = [
  { id: 1, username: 'Ali Khan',    blood_type: 'B+',  city: 'Lahore',    latitude: 31.5204, longitude: 74.3587, is_available: true,  reputation_score: 98, total_donations: 12, last_donation_date: '2026-02-10', is_verified_donor: true  },
  { id: 2, username: 'Sara Raza',   blood_type: 'O+',  city: 'Lahore',    latitude: 31.5497, longitude: 74.3436, is_available: true,  reputation_score: 94, total_donations: 8,  last_donation_date: '2026-01-15', is_verified_donor: true  },
  { id: 3, username: 'M. Hassan',   blood_type: 'A+',  city: 'Sahiwal',   latitude: 30.6706, longitude: 73.1048, is_available: false, reputation_score: 87, total_donations: 5,  last_donation_date: '2026-03-01', is_verified_donor: false },
  { id: 4, username: 'Fatima Asad', blood_type: 'AB+', city: 'Karachi',   latitude: 24.8607, longitude: 67.0011, is_available: true,  reputation_score: 91, total_donations: 15, last_donation_date: '2025-12-20', is_verified_donor: true  },
  { id: 5, username: 'Usman Tariq', blood_type: 'B-',  city: 'Islamabad', latitude: 33.6844, longitude: 73.0479, is_available: true,  reputation_score: 78, total_donations: 3,  last_donation_date: '2026-01-05', is_verified_donor: false },
  { id: 6, username: 'Ayesha Noor', blood_type: 'O-',  city: 'Lahore',    latitude: 31.4697, longitude: 74.4083, is_available: true,  reputation_score: 95, total_donations: 20, last_donation_date: '2025-11-30', is_verified_donor: true  },
  { id: 7, username: 'Zain Abbas',  blood_type: 'A-',  city: 'Faisalabad',latitude: 31.4504, longitude: 73.1350, is_available: true,  reputation_score: 82, total_donations: 6,  last_donation_date: '2026-02-28', is_verified_donor: false },
  { id: 8, username: 'Hina Malik',  blood_type: 'AB-', city: 'Rawalpindi',latitude: 33.5651, longitude: 73.0169, is_available: false, reputation_score: 76, total_donations: 4,  last_donation_date: '2026-03-10', is_verified_donor: false },
]

// ── Donor Card ─────────────────────────────────────────────
function DonorCard({ donor, userLat, userLon, selected, onClick }) {
  const dist = userLat && userLon && donor.latitude && donor.longitude
    ? calculateDistance(userLat, userLon, donor.latitude, donor.longitude)
    : null

  const BLOOD_COLORS = {
    'O-': '#E63946', 'O+': '#c1121f',
    'A+': '#74B3CE', 'A-': '#508991',
    'B+': '#E8753A', 'B-': '#d4622a',
    'AB+': '#9B59B6', 'AB-': '#7D3C98',
  }

  return (
    <div onClick={onClick}
      style={{
        padding: '14px', borderRadius: '10px', cursor: 'pointer',
        border: selected
          ? '1px solid rgba(116,179,206,0.5)'
          : '0.5px solid var(--ll-b1)',
        background: selected
          ? 'rgba(116,179,206,0.12)'
          : 'var(--ll-s1)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(116,179,206,0.06)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'var(--ll-s1)' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Blood type */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
          background: `${BLOOD_COLORS[donor.blood_type]}22`,
          border: `1px solid ${BLOOD_COLORS[donor.blood_type]}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: '900',
          color: BLOOD_COLORS[donor.blood_type],
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {donor.blood_type}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span style={{ color: '#D6F3F4', fontSize: '13px', fontWeight: '600',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {donor.username}
            </span>
            {donor.is_verified_donor && (
              <i className="ti ti-rosette-discount-check"
                style={{ fontSize: '13px', color: '#74B3CE', flexShrink: 0 }} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10px', color: '#508991' }}>
              <i className="ti ti-map-pin" style={{ marginRight: '2px' }} />
              {donor.city}
            </span>
            {dist && (
              <span style={{ fontSize: '10px', color: '#74B3CE' }}>
                {dist} km away
              </span>
            )}
            <span style={{ fontSize: '10px', color: '#508991' }}>
              {donor.total_donations} donations
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', marginLeft: 'auto',
            background: donor.is_available ? '#4CAF50' : '#666',
            boxShadow: donor.is_available ? '0 0 6px #4CAF50' : 'none',
            marginBottom: '4px',
          }} />
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#74B3CE' }}>
            {donor.reputation_score}%
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Simple SVG Map ─────────────────────────────────────────
function PakistanMap({ donors, selected, onSelect, userLat, userLon }) {
  // Convert lat/lon to SVG coords (Pakistan bounding box)
  const LAT_MIN = 23.5, LAT_MAX = 37.0
  const LON_MIN = 60.5, LON_MAX = 77.5
  const W = 600, H = 500

  const toSvg = (lat, lon) => ({
    x: ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W,
    y: H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H,
  })

  const BLOOD_COLORS = {
    'O-': '#E63946', 'O+': '#c1121f',
    'A+': '#74B3CE', 'A-': '#508991',
    'B+': '#E8753A', 'B-': '#d4622a',
    'AB+': '#9B59B6', 'AB-': '#7D3C98',
  }

  const cities = [
    { name: 'Karachi',    lat: 24.86, lon: 67.01 },
    { name: 'Lahore',     lat: 31.52, lon: 74.36 },
    { name: 'Islamabad',  lat: 33.68, lon: 73.05 },
    { name: 'Peshawar',   lat: 34.01, lon: 71.57 },
    { name: 'Quetta',     lat: 30.18, lon: 66.99 },
    { name: 'Faisalabad', lat: 31.45, lon: 73.13 },
    { name: 'Sahiwal',    lat: 30.67, lon: 73.10 },
    { name: 'Rawalpindi', lat: 33.56, lon: 73.02 },
  ]

  return (
    <div style={{ background: 'var(--ll-s1)', border: '0.5px solid var(--ll-b1)',
                   borderRadius: '14px', overflow: 'hidden', flex: 1 }}>
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--ll-b1)',
                     display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ll-mint)',
                        display: 'flex', alignItems: 'center', gap: '7px' }}>
          <i className="ti ti-map" style={{ color: 'var(--ll-muted)' }} />
          Donor Map — Pakistan
        </span>
        <span style={{ fontSize: '11px', color: '#508991' }}>
          {donors.length} donors plotted
        </span>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block', padding: '10px' }}>

        {/* Pakistan outline — simplified */}
        <path d="M180 80 L240 60 L300 50 L380 70 L440 100 L480 140 L500 180
                 L520 220 L510 270 L490 310 L460 350 L420 380 L380 400
                 L340 420 L300 430 L260 420 L220 400 L180 370 L150 330
                 L130 280 L120 240 L130 200 L150 160 L170 120 Z"
          fill="rgba(116,179,206,0.04)" stroke="rgba(116,179,206,0.15)"
          strokeWidth="1.5" strokeLinejoin="round"/>

        {/* Grid lines */}
        {[0.25,0.5,0.75].map((t,i) => (
          <g key={i}>
            <line x1={0} y1={H*t} x2={W} y2={H*t}
              stroke="rgba(116,179,206,0.05)" strokeWidth="1"/>
            <line x1={W*t} y1={0} x2={W*t} y2={H}
              stroke="rgba(116,179,206,0.05)" strokeWidth="1"/>
          </g>
        ))}

        {/* City labels */}
        {cities.map((c, i) => {
          const p = toSvg(c.lat, c.lon)
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3"
                fill="rgba(116,179,206,0.3)" stroke="rgba(116,179,206,0.5)" strokeWidth="0.5"/>
              <text x={p.x + 6} y={p.y + 4} fill="#508991" fontSize="9"
                fontFamily="system-ui" style={{ userSelect: 'none' }}>
                {c.name}
              </text>
            </g>
          )
        })}

        {/* User location */}
        {userLat && userLon && (() => {
          const p = toSvg(userLat, userLon)
          return (
            <g>
              <circle cx={p.x} cy={p.y} r="14"
                fill="rgba(116,179,206,0.1)" stroke="rgba(116,179,206,0.3)" strokeWidth="1"/>
              <circle cx={p.x} cy={p.y} r="6"
                fill="#74B3CE" stroke="#0D1F2D" strokeWidth="1.5"/>
              <text x={p.x} y={p.y - 18} textAnchor="middle"
                fill="#74B3CE" fontSize="9" fontFamily="system-ui">
                You
              </text>
            </g>
          )
        })()}

        {/* Donor pins */}
        {donors.filter(d => d.latitude && d.longitude).map(d => {
          const p = toSvg(d.latitude, d.longitude)
          const color = BLOOD_COLORS[d.blood_type] || '#74B3CE'
          const isSelected = selected?.id === d.id

          return (
            <g key={d.id} onClick={() => onSelect(d)} style={{ cursor: 'pointer' }}>
              {/* Pulse ring for available */}
              {d.is_available && (
                <circle cx={p.x} cy={p.y} r={isSelected ? 20 : 14}
                  fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
              )}
              {/* Pin */}
              <circle cx={p.x} cy={p.y} r={isSelected ? 10 : 7}
                fill={d.is_available ? color : '#444'}
                stroke="#0D1F2D" strokeWidth="1.5"
                style={{ transition: 'all 0.2s',
                          filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none' }}/>
              {/* Blood type label on selected */}
              {isSelected && (
                <g>
                  <rect x={p.x - 20} y={p.y - 30} width="40" height="16"
                    rx="4" fill="rgba(13,31,45,0.95)"
                    stroke={color} strokeWidth="0.5"/>
                  <text x={p.x} y={p.y - 19} textAnchor="middle"
                    fill={color} fontSize="9" fontWeight="700"
                    fontFamily="'JetBrains Mono', monospace">
                    {d.blood_type}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function DonorMap() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [donors, setDonors]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null)
  const [bloodFilter, setBloodFilter] = useState('all')
  const [availOnly, setAvailOnly]     = useState(false)
  const [userLat, setUserLat]         = useState(null)
  const [userLon, setUserLon]         = useState(null)
  const [locating, setLocating]       = useState(false)
  const [search, setSearch]           = useState('')

  useEffect(() => {
    api.get('/donors/list/')
      .then(r => setDonors(r.data.length > 0 ? r.data : MOCK_DONORS))
      .catch(() => setDonors(MOCK_DONORS))
      .finally(() => setLoading(false))
  }, [])

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => { setUserLat(pos.coords.latitude); setUserLon(pos.coords.longitude); setLocating(false) },
      ()  => { alert('Could not get location'); setLocating(false) }
    )
  }

  const filtered = donors.filter(d => {
    const matchBlood = bloodFilter === 'all' || d.blood_type === bloodFilter
    const matchAvail = !availOnly || d.is_available
    const matchSearch = !search ||
      d.username?.toLowerCase().includes(search.toLowerCase()) ||
      d.city?.toLowerCase().includes(search.toLowerCase()) ||
      d.blood_type?.toLowerCase().includes(search.toLowerCase())
    return matchBlood && matchAvail && matchSearch
  })

  const BLOOD_COLORS = {
    'O-':'#E63946','O+':'#c1121f','A+':'#74B3CE','A-':'#508991',
    'B+':'#E8753A','B-':'#d4622a','AB+':'#9B59B6','AB-':'#7D3C98',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ll-bg)' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
          padding: '14px 22px', borderBottom: '0.5px solid var(--ll-b1)',
          background: 'rgba(13,31,45,0.8)', flexShrink: 0,
        }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ll-mint)' }}>Donor Map</span>
            <span style={{ fontSize: '11px', color: 'var(--ll-muted)', marginLeft: '8px' }}>
              {filtered.length} donors found
            </span>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px',
                         background: 'var(--ll-s1)', border: '0.5px solid var(--ll-b1)',
                         borderRadius: '7px', padding: '7px 12px', width: '200px' }}>
            <i className="ti ti-search" style={{ fontSize: '14px', color: 'var(--ll-muted)' }} />
            <input type="text" placeholder="Search donor, city…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none',
                       color: '#D6F3F4', fontSize: '12px', width: '100%' }} />
          </div>

          {/* Get location */}
          <button onClick={getLocation} disabled={locating}
            style={{ padding: '7px 14px', borderRadius: '7px', border: 'none',
                     background: userLat ? 'rgba(76,175,80,0.15)' : 'var(--ll-s1)',
                     color: userLat ? '#4CAF50' : '#74B3CE',
                     outline: `0.5px solid ${userLat ? 'rgba(76,175,80,0.3)' : 'var(--ll-b1)'}`,
                     cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            <i className="ti ti-current-location" style={{ marginRight: '5px' }} />
            {locating ? 'Locating…' : userLat ? 'Located ✓' : 'My Location'}
          </button>

          {/* Available only toggle */}
          <div onClick={() => setAvailOnly(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px',
                      cursor: 'pointer', padding: '7px 12px', borderRadius: '7px',
                      background: availOnly ? 'rgba(76,175,80,0.1)' : 'var(--ll-s1)',
                      border: `0.5px solid ${availOnly ? 'rgba(76,175,80,0.3)' : 'var(--ll-b1)'}` }}>
            <div style={{ width: '28px', height: '15px', borderRadius: '8px',
                           background: availOnly ? '#4CAF50' : '#333',
                           transition: 'all 0.2s', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '2px',
                             left: availOnly ? '14px' : '2px',
                             width: '11px', height: '11px', borderRadius: '50%',
                             background: 'white', transition: 'all 0.2s' }} />
            </div>
            <span style={{ fontSize: '12px', color: availOnly ? '#4CAF50' : '#508991' }}>
              Available only
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Left — Donor list */}
          <div style={{ width: '300px', flexShrink: 0, borderRight: '0.5px solid var(--ll-b1)',
                         overflowY: 'auto', padding: '14px' }}>

            {/* Blood type filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
              {['all', ...BLOOD_TYPES].map(bt => (
                <button key={bt} onClick={() => setBloodFilter(bt)}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: 'none',
                           cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                           fontFamily: "'JetBrains Mono', monospace",
                           background: bloodFilter === bt
                             ? `${BLOOD_COLORS[bt] || '#74B3CE'}22` : 'var(--ll-s1)',
                           color: bloodFilter === bt
                             ? (BLOOD_COLORS[bt] || '#74B3CE') : '#508991',
                           outline: bloodFilter === bt
                             ? `1px solid ${BLOOD_COLORS[bt] || '#74B3CE'}44` : '0.5px solid var(--ll-b1)',
                           transition: 'all 0.15s' }}>
                  {bt === 'all' ? 'All' : bt}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', color: '#508991', padding: '40px', fontSize: '13px' }}>
                Loading donors...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#508991', padding: '40px', fontSize: '13px' }}>
                No donors found
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filtered.map(d => (
                  <DonorCard key={d.id} donor={d}
                    userLat={userLat} userLon={userLon}
                    selected={selected?.id === d.id}
                    onClick={() => setSelected(selected?.id === d.id ? null : d)} />
                ))}
              </div>
            )}
          </div>

          {/* Right — Map + selected detail */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                         padding: '14px', gap: '14px', overflowY: 'auto' }}>

            {/* Map */}
            <PakistanMap
              donors={filtered}
              selected={selected}
              onSelect={d => setSelected(selected?.id === d.id ? null : d)}
              userLat={userLat}
              userLon={userLon}
            />

            {/* Selected donor detail */}
            {selected && (
              <div className="ll-panel" style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                               alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: `${BLOOD_COLORS[selected.blood_type] || '#74B3CE'}22`,
                      border: `1px solid ${BLOOD_COLORS[selected.blood_type] || '#74B3CE'}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: '900',
                      color: BLOOD_COLORS[selected.blood_type] || '#74B3CE',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {selected.blood_type}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#D6F3F4', fontWeight: '700', fontSize: '15px' }}>
                          {selected.username}
                        </span>
                        {selected.is_verified_donor && (
                          <i className="ti ti-rosette-discount-check"
                            style={{ color: '#74B3CE', fontSize: '15px' }} />
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#508991' }}>
                        <i className="ti ti-map-pin" style={{ marginRight: '3px' }} />
                        {selected.city}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%',
                                   background: selected.is_available ? '#4CAF50' : '#666',
                                   boxShadow: selected.is_available ? '0 0 6px #4CAF50' : 'none' }} />
                    <span style={{ fontSize: '11px', color: selected.is_available ? '#4CAF50' : '#666' }}>
                      {selected.is_available ? 'Available' : 'Unavailable'}
                    </span>
                    <button onClick={() => setSelected(null)}
                      style={{ background: 'none', border: 'none', color: '#508991',
                               cursor: 'pointer', fontSize: '16px', marginLeft: '8px' }}>
                      <i className="ti ti-x" />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '10px' }}>
                  {[
                    { label: 'Reputation',     value: `${selected.reputation_score}%`, color: '#74B3CE' },
                    { label: 'Total Donations', value: selected.total_donations,        color: '#4CAF50' },
                    { label: 'Last Donation',   value: selected.last_donation_date || 'N/A', color: '#508991' },
                    { label: 'Distance',
                      value: userLat && selected.latitude
                        ? `${calculateDistance(userLat, userLon, selected.latitude, selected.longitude)} km`
                        : 'Enable location',
                      color: '#E8753A' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '10px 12px', borderRadius: '8px',
                                          background: 'var(--ll-s2)',
                                          border: '0.5px solid var(--ll-b1)' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '10px', color: '#508991', marginTop: '2px',
                                     textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
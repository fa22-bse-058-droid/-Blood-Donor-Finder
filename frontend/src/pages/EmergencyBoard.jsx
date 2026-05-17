import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Sidebar from '../components/common/Sidebar'
import PanicButton from '../components/emergency/PanicButton'
import { getTimeAgo, getSeverityColor } from '../utils/helpers'

// ── Severity Badge ─────────────────────────────────────────
function SeverityBadge({ severity }) {
  const colors = {
    critical: { bg: 'rgba(230,57,70,0.15)',  color: '#E63946', border: 'rgba(230,57,70,0.3)'  },
    high:     { bg: 'rgba(232,117,58,0.15)', color: '#E8753A', border: 'rgba(232,117,58,0.3)' },
    medium:   { bg: 'rgba(116,179,206,0.15)',color: '#74B3CE', border: 'rgba(116,179,206,0.3)' },
    low:      { bg: 'rgba(80,137,145,0.15)', color: '#508991', border: 'rgba(80,137,145,0.3)'  },
  }
  const c = colors[severity] || colors.medium
  return (
    <span style={{
      fontSize: '10px', fontWeight: '700', padding: '3px 9px',
      borderRadius: '5px', textTransform: 'uppercase', letterSpacing: '0.5px',
      background: c.bg, color: c.color, border: `0.5px solid ${c.border}`,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {severity}
    </span>
  )
}

// ── Status Badge ───────────────────────────────────────────
function StatusBadge({ status }) {
  const colors = {
    pending:   { bg: 'rgba(232,117,58,0.12)',  color: '#E8753A' },
    verified:  { bg: 'rgba(116,179,206,0.12)', color: '#74B3CE' },
    fulfilled: { bg: 'rgba(76,175,80,0.12)',   color: '#4CAF50' },
    cancelled: { bg: 'rgba(100,100,100,0.12)', color: '#666'    },
  }
  const c = colors[status] || colors.pending
  return (
    <span style={{
      fontSize: '10px', fontWeight: '600', padding: '3px 9px',
      borderRadius: '5px', textTransform: 'capitalize',
      background: c.bg, color: c.color,
    }}>
      {status}
    </span>
  )
}

// ── Request Card ───────────────────────────────────────────
function RequestCard({ req, onVerify, onCancel, userRole }) {
  const borderColors = {
    critical: '#E63946', high: '#E8753A', medium: '#74B3CE', low: '#508991'
  }

  return (
    <div style={{
      background: 'var(--ll-s1)', border: '0.5px solid var(--ll-b1)',
      borderLeft: `3px solid ${borderColors[req.severity] || '#74B3CE'}`,
      borderRadius: '0 12px 12px 0', padding: '16px 18px',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(116,179,206,0.08)'}
    onMouseLeave={e => e.currentTarget.style.background = 'var(--ll-s1)'}>

      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>

        {/* Left — Blood type + info */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          {/* Blood type chip */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '10px', flexShrink: 0,
            background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '900', color: '#E63946',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {req.blood_type}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
              <span style={{ color: '#D6F3F4', fontWeight: '700', fontSize: '14px' }}>
                {req.hospital_name}
              </span>
              <SeverityBadge severity={req.severity} />
              <StatusBadge status={req.status} />
              {req.is_spam && (
                <span style={{ fontSize: '10px', color: '#E63946',
                                background: 'rgba(230,57,70,0.1)', padding: '2px 6px',
                                borderRadius: '4px', border: '0.5px solid rgba(230,57,70,0.3)' }}>
                  ⚠ Spam
                </span>
              )}
            </div>

            <div style={{ fontSize: '12px', color: '#508991', marginBottom: '4px' }}>
              <i className="ti ti-map-pin" style={{ marginRight: '4px' }} />
              {req.hospital_address}
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#74B3CE' }}>
                <i className="ti ti-drop" style={{ marginRight: '4px' }} />
                {req.units_needed}ml needed
              </span>
              {req.patient_name && (
                <span style={{ fontSize: '11px', color: '#74B3CE' }}>
                  <i className="ti ti-user" style={{ marginRight: '4px' }} />
                  {req.patient_name}
                </span>
              )}
              <span style={{ fontSize: '11px', color: '#74B3CE' }}>
                <i className="ti ti-phone" style={{ marginRight: '4px' }} />
                {req.contact_phone}
              </span>
              {req.notes && (
                <span style={{ fontSize: '11px', color: '#508991', fontStyle: 'italic' }}>
                  "{req.notes}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right — time + actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', color: '#508991',
                          fontFamily: "'JetBrains Mono', monospace" }}>
            {getTimeAgo(req.created_at)}
          </span>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* Verify — admin/coordinator only */}
            {['admin','emergency_coordinator'].includes(userRole) &&
              req.status === 'pending' && !req.is_spam && (
              <button onClick={() => onVerify(req.id)}
                style={{ padding: '6px 12px', borderRadius: '7px', border: 'none',
                         background: 'rgba(116,179,206,0.15)', color: '#74B3CE',
                         cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                         transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(116,179,206,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(116,179,206,0.15)'}>
                <i className="ti ti-check" style={{ marginRight: '4px' }} />
                Verify
              </button>
            )}

            {/* Cancel — own request */}
            {req.status === 'pending' && (
              <button onClick={() => onCancel(req.id)}
                style={{ padding: '6px 12px', borderRadius: '7px', border: 'none',
                         background: 'rgba(230,57,70,0.1)', color: '#E63946',
                         cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                         transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(230,57,70,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(230,57,70,0.1)'}>
                <i className="ti ti-x" style={{ marginRight: '4px' }} />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Filter Bar ─────────────────────────────────────────────
function FilterBar({ active, setActive, counts }) {
  const filters = [
    { key: 'all',      label: 'All',      count: counts.all      },
    { key: 'critical', label: 'Critical', count: counts.critical  },
    { key: 'high',     label: 'High',     count: counts.high      },
    { key: 'medium',   label: 'Medium',   count: counts.medium    },
    { key: 'low',      label: 'Low',      count: counts.low       },
    { key: 'pending',  label: 'Pending',  count: counts.pending   },
    { key: 'verified', label: 'Verified', count: counts.verified  },
  ]

  const accentColor = {
    all: '#74B3CE', critical: '#E63946', high: '#E8753A',
    medium: '#74B3CE', low: '#508991', pending: '#E8753A', verified: '#4CAF50'
  }

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
      {filters.map(f => (
        <button key={f.key} onClick={() => setActive(f.key)}
          style={{
            padding: '7px 14px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontSize: '12px', fontWeight: '600',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
            background: active === f.key
              ? `${accentColor[f.key]}22`
              : 'var(--ll-s1)',
            color: active === f.key ? accentColor[f.key] : '#508991',
            outline: active === f.key ? `1px solid ${accentColor[f.key]}44` : '0.5px solid var(--ll-b1)',
          }}>
          {f.label}
          {f.count > 0 && (
            <span style={{
              fontSize: '10px', fontWeight: '700', minWidth: '18px', height: '18px',
              borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active === f.key ? `${accentColor[f.key]}33` : 'rgba(116,179,206,0.1)',
              color: active === f.key ? accentColor[f.key] : '#508991',
            }}>
              {f.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ── Mock Data (fallback) ───────────────────────────────────
const MOCK_REQUESTS = [
  { id: 1, blood_type: 'B+',  hospital_name: 'DHQ Hospital Lahore',       hospital_address: 'Jail Road, Lahore',       severity: 'critical', status: 'pending',   units_needed: 1800, contact_phone: '0300-1234567', patient_name: 'Ahmed Raza',  notes: 'Post-surgery trauma', is_spam: false, created_at: new Date(Date.now()-8*60000).toISOString()  },
  { id: 2, blood_type: 'O-',  hospital_name: 'Services Hospital PK',      hospital_address: 'Shadman, Lahore',         severity: 'high',     status: 'pending',   units_needed: 900,  contact_phone: '0311-9876543', patient_name: '',            notes: 'Trauma case',         is_spam: false, created_at: new Date(Date.now()-23*60000).toISOString() },
  { id: 3, blood_type: 'AB+', hospital_name: 'Sahiwal Teaching Hospital', hospital_address: 'Hospital Road, Sahiwal', severity: 'medium',   status: 'verified',  units_needed: 450,  contact_phone: '0322-5554444', patient_name: 'Sara Malik',  notes: 'Elective surgery',    is_spam: false, created_at: new Date(Date.now()-60*60000).toISOString() },
  { id: 4, blood_type: 'A+',  hospital_name: 'Aga Khan Hospital',         hospital_address: 'Stadium Road, Karachi',  severity: 'high',     status: 'pending',   units_needed: 900,  contact_phone: '0213-4930051', patient_name: 'Bilal Khan',  notes: '',                    is_spam: false, created_at: new Date(Date.now()-90*60000).toISOString() },
  { id: 5, blood_type: 'O+',  hospital_name: 'PIMS Hospital',             hospital_address: 'G-8, Islamabad',         severity: 'low',      status: 'fulfilled', units_needed: 450,  contact_phone: '0519-261170',  patient_name: '',            notes: 'Routine procedure',   is_spam: false, created_at: new Date(Date.now()-3*3600000).toISOString()},
]

// ── Main Page ──────────────────────────────────────────────
export default function EmergencyBoard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [bloodFilter, setBloodFilter] = useState('all')

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/emergency/requests/')
      setRequests(data.length > 0 ? data : MOCK_REQUESTS)
    } catch {
      setRequests(MOCK_REQUESTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  // Auto refresh every 30 seconds
  useEffect(() => {
    const iv = setInterval(fetchRequests, 30000)
    return () => clearInterval(iv)
  }, [])

  const handleVerify = async (id) => {
    try {
      await api.post(`/emergency/requests/${id}/verify/`)
      fetchRequests()
    } catch {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' } : r))
    }
  }

  const handleCancel = async (id) => {
    try {
      await api.post(`/emergency/requests/${id}/cancel/`)
      fetchRequests()
    } catch {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    }
  }

  // Counts for filter bar
  const counts = {
    all:      requests.filter(r => !r.is_spam).length,
    critical: requests.filter(r => r.severity === 'critical' && !r.is_spam).length,
    high:     requests.filter(r => r.severity === 'high'     && !r.is_spam).length,
    medium:   requests.filter(r => r.severity === 'medium'   && !r.is_spam).length,
    low:      requests.filter(r => r.severity === 'low'      && !r.is_spam).length,
    pending:  requests.filter(r => r.status   === 'pending'  && !r.is_spam).length,
    verified: requests.filter(r => r.status   === 'verified' && !r.is_spam).length,
  }

  // Filtered list
  const filtered = requests.filter(r => {
    if (r.is_spam) return false
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'pending'  ? r.status   === 'pending'  :
      filter === 'verified' ? r.status   === 'verified' :
      r.severity === filter
    const matchBlood  = bloodFilter === 'all' || r.blood_type === bloodFilter
    const matchSearch = !search ||
      r.hospital_name.toLowerCase().includes(search.toLowerCase()) ||
      r.blood_type.toLowerCase().includes(search.toLowerCase()) ||
      r.contact_phone.includes(search)
    return matchFilter && matchBlood && matchSearch
  })

  const BLOOD_TYPES = ['all','A+','A-','B+','B-','AB+','AB-','O+','O-']

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ll-bg)' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 22px', borderBottom: '0.5px solid var(--ll-b1)',
          background: 'rgba(13,31,45,0.8)', flexShrink: 0, flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ll-mint)' }}>
              Emergency Board
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ll-muted)', marginLeft: '8px' }}>
              Live blood requests
            </span>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'var(--ll-s1)', border: '0.5px solid var(--ll-b1)',
            borderRadius: '7px', padding: '7px 12px', width: '220px',
          }}>
            <i className="ti ti-search" style={{ fontSize: '14px', color: 'var(--ll-muted)' }} />
            <input type="text" placeholder="Search hospital, blood type…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none',
                       color: '#D6F3F4', fontSize: '12px', width: '100%' }} />
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

          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '7px 14px', borderRadius: '7px', border: '0.5px solid var(--ll-b1)',
                     background: 'var(--ll-s1)', color: 'var(--ll-muted)',
                     cursor: 'pointer', fontSize: '12px' }}>
            <i className="ti ti-arrow-left" style={{ marginRight: '4px' }} />
            Back
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>

          {/* Summary strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
                         gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Total Requests', value: counts.all,      color: '#74B3CE' },
              { label: 'Critical',       value: counts.critical,  color: '#E63946' },
              { label: 'Pending',        value: counts.pending,   color: '#E8753A' },
              { label: 'Verified',       value: counts.verified,  color: '#4CAF50' },
            ].map((s, i) => (
              <div key={i} className="ll-panel" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#508991', marginTop: '3px',
                               textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Blood type quick filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {BLOOD_TYPES.map(bt => (
              <button key={bt} onClick={() => setBloodFilter(bt)}
                style={{ padding: '5px 12px', borderRadius: '6px', border: 'none',
                         cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                         fontFamily: "'JetBrains Mono', monospace",
                         background: bloodFilter === bt ? 'rgba(230,57,70,0.2)' : 'var(--ll-s1)',
                         color: bloodFilter === bt ? '#E63946' : '#508991',
                         outline: bloodFilter === bt ? '1px solid rgba(230,57,70,0.35)' : '0.5px solid var(--ll-b1)',
                         transition: 'all 0.15s' }}>
                {bt === 'all' ? 'All Types' : bt}
              </button>
            ))}
          </div>

          {/* Severity/Status filter */}
          <FilterBar active={filter} setActive={setFilter} counts={counts} />

          {/* Request list */}
          {loading ? (
            <div style={{ textAlign: 'center', color: '#508991', padding: '60px',
                           fontSize: '14px' }}>
              <i className="ti ti-loader" style={{ fontSize: '24px', marginBottom: '12px', display: 'block' }} />
              Loading emergencies...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                <i className="ti ti-mood-empty" style={{ color: '#508991' }} />
              </div>
              <div style={{ color: '#508991', fontSize: '14px' }}>No requests found</div>
              <div style={{ color: '#345', fontSize: '12px', marginTop: '4px' }}>
                Try changing the filter or blood type
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(req => (
                <RequestCard key={req.id} req={req}
                  onVerify={handleVerify}
                  onCancel={handleCancel}
                  userRole={user?.role} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panic Button */}
      <PanicButton onSuccess={fetchRequests} />
    </div>
  )
}
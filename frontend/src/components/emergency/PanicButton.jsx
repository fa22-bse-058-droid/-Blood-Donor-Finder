import { useState } from 'react'
import api from '../../services/api'

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

export default function PanicButton({ onSuccess }) {
  const [open, setOpen]       = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [form, setForm]       = useState({
    blood_type: 'O+', units_needed: 450, severity: 'critical',
    hospital_name: '', hospital_address: '', contact_phone: '', notes: ''
  })

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.hospital_name || !form.contact_phone) {
      alert('Hospital name and contact phone are required')
      return
    }
    setSending(true)
    try {
      const submit = async (extra = {}) => {
        await api.post('/emergency/requests/', { ...form, ...extra })
        setSent(true)
        setTimeout(() => { setSent(false); setOpen(false); onSuccess?.() }, 2000)
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => submit({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          ()  => submit()
        )
      } else {
        await submit()
      }
    } catch {
      alert('Failed to send emergency request')
    } finally {
      setSending(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px', outline: 'none',
    background: 'rgba(0,67,70,0.4)', color: '#D6F3F4', fontSize: '13px',
    border: '0.5px solid rgba(116,179,206,0.25)', boxSizing: 'border-box',
    fontFamily: 'system-ui',
  }
  const labelStyle = { display: 'block', color: '#508991', fontSize: '11px',
                        marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }

  return (
    <>
      {/* Floating panic button */}
      <button onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px',
          width: '56px', height: '56px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, #E63946, #c1121f)',
          color: 'white', cursor: 'pointer', fontSize: '22px',
          boxShadow: '0 0 0 0 rgba(230,57,70,0.4)',
          animation: 'panicPulse 2.5s infinite',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999,
        }}
        title="Emergency Blood Request">
        <i className="ti ti-urgent" style={{ fontSize: '22px' }} />
        <style>{`
          @keyframes panicPulse {
            0%   { box-shadow: 0 0 0 0 rgba(230,57,70,0.5); }
            70%  { box-shadow: 0 0 0 14px rgba(230,57,70,0); }
            100% { box-shadow: 0 0 0 0 rgba(230,57,70,0); }
          }
        `}</style>
      </button>

      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(13,31,45,0.92)', backdropFilter: 'blur(8px)',
          padding: '20px',
        }}>
          <div style={{
            width: '100%', maxWidth: '500px', borderRadius: '18px',
            background: '#0D1F2D', border: '0.5px solid rgba(230,57,70,0.3)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            {/* Modal header */}
            <div style={{
              padding: '18px 22px', borderBottom: '0.5px solid rgba(116,179,206,0.1)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(230,57,70,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(230,57,70,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className="ti ti-urgent" style={{ fontSize: '18px', color: '#E63946' }} />
                </div>
                <div>
                  <div style={{ color: '#D6F3F4', fontWeight: '700', fontSize: '15px' }}>
                    Emergency Blood Request
                  </div>
                  <div style={{ color: '#508991', fontSize: '11px' }}>
                    Donors will be alerted immediately
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#508991',
                         cursor: 'pointer', fontSize: '20px', padding: '4px' }}>
                <i className="ti ti-x" />
              </button>
            </div>

            {/* Success state */}
            {sent ? (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <i className="ti ti-circle-check"
                  style={{ fontSize: '48px', color: '#4CAF50', display: 'block', marginBottom: '16px' }} />
                <div style={{ color: '#D6F3F4', fontWeight: '700', fontSize: '18px', marginBottom: '6px' }}>
                  Alert Sent!
                </div>
                <div style={{ color: '#508991', fontSize: '13px' }}>
                  Nearby donors are being notified
                </div>
              </div>
            ) : (
              <div style={{ padding: '20px 22px' }}>
                {/* Grid form */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

                  <div>
                    <label style={labelStyle}>Blood Type *</label>
                    <select name="blood_type" value={form.blood_type} onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      {BLOOD_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Severity *</label>
                    <select name="severity" value={form.severity} onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      {['critical','high','medium','low'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Hospital Name *</label>
                    <input name="hospital_name" type="text" value={form.hospital_name}
                      onChange={handleChange} placeholder="e.g. Services Hospital, Lahore"
                      style={inputStyle} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Hospital Address</label>
                    <input name="hospital_address" type="text" value={form.hospital_address}
                      onChange={handleChange} placeholder="Street, City"
                      style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Contact Phone *</label>
                    <input name="contact_phone" type="tel" value={form.contact_phone}
                      onChange={handleChange} placeholder="03XX-XXXXXXX"
                      style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Units Needed (ml)</label>
                    <input name="units_needed" type="number" value={form.units_needed}
                      onChange={handleChange} min="450" step="450"
                      style={inputStyle} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Notes</label>
                    <input name="notes" type="text" value={form.notes}
                      onChange={handleChange} placeholder="Brief reason (optional)"
                      style={inputStyle} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                  <button onClick={() => setOpen(false)}
                    style={{ flex: 1, padding: '11px', borderRadius: '9px',
                             border: '0.5px solid var(--ll-b1)', background: 'var(--ll-s1)',
                             color: '#508991', cursor: 'pointer', fontSize: '13px' }}>
                    Cancel
                  </button>
                  <button onClick={handleSubmit} disabled={sending}
                    style={{ flex: 2, padding: '11px', borderRadius: '9px', border: 'none',
                             background: sending ? '#508991' : 'linear-gradient(135deg, #E63946, #c1121f)',
                             color: 'white', cursor: sending ? 'not-allowed' : 'pointer',
                             fontSize: '13px', fontWeight: '700',
                             boxShadow: sending ? 'none' : '0 4px 15px rgba(230,57,70,0.35)' }}>
                    {sending ? 'Sending Alert...' : '🚨 Send Emergency Alert'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom'
import { BLOOD_TYPES, ROLES } from '../utils/constants'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'donor',
    phone: '',
    city: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await register(form)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
  const data = err.response?.data
  if (data && typeof data === 'object') {
    const messages = Object.entries(data)
      .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join(' | ')
    setError(messages)
  } else {
    setError('Registration failed. Try again.')
  }
}finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(116,179,206,0.3)',
    background: 'rgba(0,67,70,0.5)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    color: '#74B3CE',
    fontSize: '13px',
    marginBottom: '6px',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', padding: '24px',
                  background: 'linear-gradient(135deg, #172A3A 0%, #004346 50%, #172A3A 100%)' }}>
      <div style={{ width: '100%', maxWidth: '480px', padding: '36px',
                    borderRadius: '20px',
                    background: 'rgba(116,179,206,0.08)',
                    border: '1px solid rgba(116,179,206,0.2)',
                    backdropFilter: 'blur(20px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
               style={{ marginBottom: '12px' }}>
            <path d="M24 4C24 4 8 20 8 30C8 39.2 15.2 44 24 44C32.8 44 40 39.2 40 30C40 20 24 4 24 4Z"
              fill="url(#rGrad)" />
            <defs>
              <linearGradient id="rGrad" x1="24" y1="4" x2="24" y2="44">
                <stop offset="0%" stopColor="#E63946"/>
                <stop offset="100%" stopColor="#74B3CE"/>
              </linearGradient>
            </defs>
          </svg>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>
            Join LifeLink AI
          </h1>
          <p style={{ color: '#508991', fontSize: '14px', marginTop: '6px' }}>
            Create your account and start saving lives
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px',
                        background: 'rgba(230,57,70,0.15)', color: '#E63946',
                        border: '1px solid rgba(230,57,70,0.3)', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Username *</label>
              <input name="username" type="text" required
                value={form.username} onChange={handleChange}
                placeholder="yourname" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Email *</label>
              <input name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@email.com" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Password *</label>
              <input name="password" type="password" required
                value={form.password} onChange={handleChange}
                placeholder="Min 8 characters" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Role *</label>
              <select name="role" value={form.role} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="donor">Donor</option>
                <option value="hospital">Hospital</option>
                <option value="emergency_coordinator">Emergency Coordinator</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>City</label>
              <input name="city" type="text"
                value={form.city} onChange={handleChange}
                placeholder="Lahore" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Phone</label>
              <input name="phone" type="tel"
                value={form.phone} onChange={handleChange}
                placeholder="+92 300 0000000" style={inputStyle} />
            </div>

          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', marginTop: '20px',
                     borderRadius: '12px', border: 'none', cursor: 'pointer',
                     fontSize: '15px', fontWeight: 'bold', color: 'white',
                     background: loading
                       ? '#508991'
                       : 'linear-gradient(135deg, #74B3CE, #004346)',
                     transition: 'opacity 0.2s' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px',
                    fontSize: '13px', color: '#508991' }}>
          Already have an account?{' '}
          <Link to="/login"
            style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(form.username, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: 'linear-gradient(135deg, #172A3A 0%, #004346 50%, #172A3A 100%)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl"
           style={{ background: 'rgba(116,179,206,0.1)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(116,179,206,0.2)' }}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🩸</div>
          <h1 className="text-3xl font-bold text-white">LifeLink AI</h1>
          <p style={{ color: '#74B3CE' }}>Sign in to your account</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(230,57,70,0.2)', color: '#E63946', border: '1px solid rgba(230,57,70,0.3)' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: '#74B3CE' }}>Username</label>
            <input type="text" required value={form.username}
              onChange={e => setForm(p => ({...p, username: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl outline-none text-white"
              style={{ background: 'rgba(0,67,70,0.5)', border: '1px solid rgba(116,179,206,0.3)' }} />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: '#74B3CE' }}>Password</label>
            <input type="password" required value={form.password}
              onChange={e => setForm(p => ({...p, password: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl outline-none text-white"
              style={{ background: 'rgba(0,67,70,0.5)', border: '1px solid rgba(116,179,206,0.3)' }} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition-all"
            style={{ background: loading ? '#508991' : 'linear-gradient(135deg, #74B3CE, #004346)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: '#74B3CE' }}>
          No account? <Link to="/register" className="font-bold text-white hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  )
}
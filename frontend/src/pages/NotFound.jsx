import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', height: '100vh', background: '#172A3A' }}>
      <div style={{ fontSize: '80px' }}></div>
      <h1 style={{ color: '#74B3CE', fontSize: '48px', fontWeight: 'bold' }}>404</h1>
      <p style={{ color: '#D6F3F4', marginBottom: '24px' }}>Page not found</p>
      <button onClick={() => navigate('/')}
        style={{ padding: '12px 32px', borderRadius: '12px', border: 'none',
                 background: 'linear-gradient(135deg, #74B3CE, #004346)',
                 color: 'white', cursor: 'pointer', fontSize: '16px' }}>
        Go Home
      </button>
    </div>
  )
}
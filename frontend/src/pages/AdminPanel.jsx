import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [bloodStats, setBloodStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, bloodRes] = await Promise.all([
          api.get('/analytics/dashboard/'),
          api.get('/analytics/blood-types/'),
        ])
        setStats(statsRes.data)
        setBloodStats(bloodRes.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cardStyle = {
    padding: '24px',
    borderRadius: '16px',
    background: 'rgba(116,179,206,0.1)',
    border: '1px solid rgba(116,179,206,0.2)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#172A3A', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#D6F3F4', fontSize: '28px', fontWeight: 'bold' }}>
            Admin Panel
          </h1>
          <p style={{ color: '#508991', fontSize: '14px' }}>
            Welcome, {user?.username}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '10px 20px', borderRadius: '10px',
                     border: '1px solid #74B3CE', background: 'transparent',
                     color: '#74B3CE', cursor: 'pointer' }}>
            Dashboard
          </button>
          <button onClick={() => { logout(); navigate('/') }}
            style={{ padding: '10px 20px', borderRadius: '10px', border: 'none',
                     background: '#E63946', color: 'white', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#74B3CE', marginTop: '80px' }}>
          Loading analytics...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Donors', value: stats?.total_donors ?? 0, color: '#74B3CE' },
              { label: 'Available Donors', value: stats?.available_donors ?? 0, color: '#4CAF50' },
              { label: 'Total Emergencies', value: stats?.total_emergencies ?? 0, color: '#E63946' },
              { label: 'Active Emergencies', value: stats?.active_emergencies ?? 0, color: '#E8753A' },
              { label: 'Fulfilled', value: stats?.fulfilled_emergencies ?? 0, color: '#508991' },
              { label: 'Total Hospitals', value: stats?.total_hospitals ?? 0, color: '#9B59B6' },
            ].map((s, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: s.color }}>
                  {s.value}
                </div>
                <div style={{ color: '#508991', fontSize: '13px', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Blood Type Stats */}
          <div style={cardStyle}>
            <h2 style={{ color: '#D6F3F4', fontSize: '20px',
                         fontWeight: 'bold', marginBottom: '20px' }}>
              Blood Type Analytics
            </h2>
            <div style={{ display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                          gap: '12px' }}>
              {bloodStats.map((bt, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '12px',
                                      background: 'rgba(0,67,70,0.5)',
                                      border: '1px solid rgba(116,179,206,0.15)',
                                      textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold',
                                color: '#E63946', marginBottom: '8px' }}>
                    {bt.blood_type}
                  </div>
                  <div style={{ fontSize: '12px', color: '#74B3CE' }}>
                    Donors: {bt.donor_count}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E8753A', marginTop: '2px' }}>
                    Requests: {bt.emergency_count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
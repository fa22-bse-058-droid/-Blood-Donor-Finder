export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getTimeAgo = (dateStr) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

export const getBloodTypeColor = (bloodType) => {
  const colors = {
    'O+': '#E63946', 'O-': '#c1121f',
    'A+': '#74B3CE', 'A-': '#508991',
    'B+': '#E8753A', 'B-': '#d4622a',
    'AB+': '#9B59B6', 'AB-': '#7D3C98',
  }
  return colors[bloodType] || '#74B3CE'
}

export const getSeverityColor = (severity) => {
  const colors = {
    low: '#508991',
    medium: '#74B3CE',
    high: '#E8753A',
    critical: '#E63946'
  }
  return colors[severity] || '#74B3CE'
}

export const getStatusColor = (status) => {
  const colors = {
    pending: '#74B3CE',
    verified: '#508991',
    fulfilled: '#4CAF50',
    cancelled: '#E63946'
  }
  return colors[status] || '#74B3CE'
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export const isEligibleToDonate = (lastDonationDate) => {
  if (!lastDonationDate) return true
  const last = new Date(lastDonationDate)
  const now = new Date()
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))
  return diffDays >= 60
}
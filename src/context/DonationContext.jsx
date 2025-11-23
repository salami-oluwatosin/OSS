import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'

const DonationContext = createContext(null)

export function DonationProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [donations, setDonations] = useState([])
  const [distributions, setDistributions] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsAdmin(true)
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    setIsAdmin(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAdmin(false)
  }

  const addDonation = (d) => {
    const id = Date.now().toString()
    setDonations(prev => [...prev, { ...d, id }])
  }

  const addDistribution = (dist) => {
    const id = Date.now().toString()
    setDistributions(prev => [...prev, { ...dist, id }])
  }

  const summary = useMemo(() => {
    const receivedByItem = {}
    donations.forEach(d => {
      receivedByItem[d.item] = (receivedByItem[d.item] || 0) + Number(d.quantity)
    })
    const distributedByItem = {}
    distributions.forEach(s => {
      distributedByItem[s.item] = (distributedByItem[s.item] || 0) + Number(s.quantity)
    })
    const items = Object.keys({ ...receivedByItem, ...distributedByItem })
    const rows = items.map(item => ({
      item,
      received: receivedByItem[item] || 0,
      distributed: distributedByItem[item] || 0,
      remaining: (receivedByItem[item] || 0) - (distributedByItem[item] || 0)
    }))
    return { rows }
  }, [donations, distributions])

  const exportCSV = () => {
    const headers = ['type','id','donor_or_recipient','item','quantity','category','date']
    const rows = [headers.join(',')]
    donations.forEach(d => rows.push(['donation', d.id, d.donor, d.item, d.quantity, d.category, d.date].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')))
    distributions.forEach(s => rows.push(['distribution', s.id, s.recipient, s.item, s.quantity, '', s.date].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')))
    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'donations_export.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <DonationContext.Provider value={{
      isAdmin,
      login,
      logout,
      donations,
      distributions,
      addDonation,
      addDistribution,
      summary,
      exportCSV
    }}>
      {children}
    </DonationContext.Provider>
  )
}

export function useDonation() {
  const ctx = useContext(DonationContext)
  if (!ctx) throw new Error('useDonation must be used within DonationProvider')
  return ctx
}
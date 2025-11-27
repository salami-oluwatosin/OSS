import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../config/Apibaseurl';

const DonationContext = createContext();

export function DonationProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [summary, setSummary] = useState({ rows: [] });

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setSummary({ rows: [] });
  };

  const refreshSummary = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary({ rows: data });
      }
    } catch (err) {
      console.error('Refresh failed');
    }
  };

  useEffect(() => {
    if (token) refreshSummary();
  }, [token]);

  const value = {
    isAdmin: !!token,
    token,
    login,
    logout,
    summary,
    refreshSummary,
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
}

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) throw new Error('useDonation must be used inside DonationProvider');
  return context;
};
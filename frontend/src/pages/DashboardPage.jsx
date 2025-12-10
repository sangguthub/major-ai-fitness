// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';         // your Axios instance
import Dashboard from './Dashboard';  // path based on your structure

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      setError(null);
      const res = await api.get('/profile/me'); // adjust endpoint if different
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-transparent mx-auto mb-4" />
          <p className="text-lg">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white">
        <div className="bg-card p-6 rounded-xl shadow-ai border border-[#161B22] max-w-md text-center">
          <p className="mb-4 text-red-400">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchProfile();
            }}
            className="px-4 py-2 rounded-lg bg-ai-green text-black font-semibold hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      profile={profile}
      setProfile={setProfile}
      fetchProfile={fetchProfile}
    />
  );
};

export default DashboardPage;

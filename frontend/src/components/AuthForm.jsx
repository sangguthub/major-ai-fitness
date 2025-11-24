import React, { useState } from 'react';
import api from '../api/api';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = `/auth/${isLogin ? 'login' : 'register'}`;
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await api.post(url, payload);
      // Pass the token and the initial profile data to App.jsx
      onAuthSuccess(response.data.token, response.data.profile);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Check server/credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'User Login' : 'User Registration'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} className="input" />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
        <input type="password" placeholder="Password (password123 for test user)" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:underline">
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
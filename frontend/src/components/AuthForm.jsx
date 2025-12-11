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
            
            // CRITICAL FIX: Pass the entire response data object to onAuthSuccess.
            // This ensures App.jsx receives { id, name, email, profile, token }
            onAuthSuccess(response.data); 
            
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Authentication failed. Check server/credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-lg shadow-2xl bg-gray-900 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">{isLogin ? 'User Login' : 'User Registration'}</h2>
            {error && <p className="text-red-500 mb-4 bg-red-950/30 p-3 rounded border border-red-800">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} className="input" />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                    <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                    <input type="password" id="password" placeholder="Password (password123)" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-3 rounded font-semibold shadow-md ${loading ? 'bg-gray-600' : 'btn-primary'}`}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-accent-blue hover:underline"
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
import React, { useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom'; 

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
            
            onAuthSuccess(response.data); 
            
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Authentication failed. Check server/credentials.'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input 
                            type="text" id="name" placeholder="Name" value={name} 
                            onChange={(e) => setName(e.target.value)} required={!isLogin} 
                            className="w-full px-4 py-2 bg-slate-800/70 border border-white/10 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                    <input 
                        type="email" id="email" placeholder="Email" value={email} 
                        onChange={(e) => setEmail(e.target.value)} required 
                        className="w-full px-4 py-2 bg-slate-800/70 border border-white/10 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <input 
                        type="password" id="password" placeholder="Password" value={password} 
                        onChange={(e) => setPassword(e.target.value)} required 
                        className="w-full px-4 py-2 bg-slate-800/70 border border-white/10 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                    />
                </div>
                
                {/* --- FORGOT PASSWORD LINK --- */}
                {isLogin && (
                    <div className="flex justify-end text-sm">
                        <Link to="/password-recovery" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>
                )}

                {error && (
                    <div className="p-2 text-sm text-red-300 bg-red-900/40 rounded-lg text-center border border-red-700/50">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 
                        ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Log In to System' : 'Create Account')}
                </button>
            </form>

            <div className="text-center text-sm text-slate-400 mt-4">
                {isLogin ? (
                    <>
                        Need an account?{' '}
                        <button onClick={() => setIsLogin(false)} className="text-indigo-400 hover:underline font-medium">
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <button onClick={() => setIsLogin(true)} className="text-indigo-400 hover:underline font-medium">
                            Log In
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
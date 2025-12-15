import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const ResetPassword = () => {
    const { resetToken } = useParams(); // Retrieves the token from the URL
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            // Post the new password along with the token from the URL parameters
            const response = await api.post(`/auth/resetpassword/${resetToken}`, { password });
            
            setMessage(response.data.message + ' You will be redirected to the login page.');
            
            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            console.error('Reset Password Error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0A0F17]">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#161B22] rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-ai-green">Set New Password</h2>
                <p className="text-gray-400 text-center">Enter and confirm your new password.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            className="w-full px-3 py-2 mt-1 text-white bg-[#0D1117] border border-gray-600 rounded-lg focus:ring-ai-green focus:border-ai-green"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                            className="w-full px-3 py-2 mt-1 text-white bg-[#0D1117] border border-gray-600 rounded-lg focus:ring-ai-green focus:border-ai-green"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white 
                            ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-ai-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ai-green'}`}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                {message && <p className="text-sm text-center text-green-400 p-2 bg-green-900/50 rounded">{message}</p>}
                {error && <p className="text-sm text-center text-red-400 p-2 bg-red-900/50 rounded">{error}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
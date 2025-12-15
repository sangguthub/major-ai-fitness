import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const PasswordRecovery = () => {
    const navigate = useNavigate();
    // 'verify' starts the flow for logged-in users, 'email' is the fallback
    const [step, setStep] = useState('verify'); 
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- 1. Old Password Verification & Reset ---
    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            // Note: This route requires the JWT token to be present in localStorage
            await api.post('/auth/verify-password', { 
                oldPassword, 
                newPassword 
            });
            
            setMessage('Password successfully updated! Redirecting to login...');
            
            // Clear token to force re-login with new password
            localStorage.removeItem('token');
            
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);

        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update password.';
            
            if (msg.includes('Incorrect old password.')) {
                // If old password fails, move to email recovery step
                setError('Incorrect current password. Please try again or use the email recovery option.');
                setStep('email');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Email Recovery Request ---
    const handleEmailResetRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('/auth/forgotpassword', { email });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending password reset email.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- Render Logic ---
    
    // View 1: Verify Old Password
    if (step === 'verify') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0F17]">
                <div className="w-full max-w-md p-8 space-y-6 bg-[#161B22] rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-3xl font-bold text-center text-ai-green">Change Password</h2>
                    <p className="text-gray-400 text-center">Enter your current password to set a new one.</p>
                    
                    {message && <p className="text-sm text-center text-yellow-400 p-2 bg-[#1C252D] rounded">{message}</p>}
                    {error && <p className="text-sm text-center text-red-400 p-2 bg-red-900/50 rounded">{error}</p>}

                    <form onSubmit={handleVerifyAndReset} className="space-y-4">
                        <div>
                            <label htmlFor="old-password" className="block text-sm font-medium text-gray-300">Current Password</label>
                            <input
                                type="password" id="old-password" value={oldPassword} 
                                onChange={(e) => setOldPassword(e.target.value)} required
                                className="w-full px-3 py-2 mt-1 input" placeholder="******"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300">New Password</label>
                            <input
                                type="password" id="new-password" value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} required
                                className="w-full px-3 py-2 mt-1 input" placeholder="New Password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                            <input
                                type="password" id="confirm-new-password" value={confirmNewPassword} 
                                onChange={(e) => setConfirmNewPassword(e.target.value)} required
                                className="w-full px-3 py-2 mt-1 input" placeholder="Confirm New Password"
                            />
                        </div>

                        <button type="submit" disabled={loading} className={`w-full py-2 px-4 btn-primary ${loading ? 'bg-gray-500 cursor-not-allowed' : ''}`}>
                            {loading ? 'Verifying...' : 'Set New Password'}
                        </button>
                    </form>
                    
                    {/* Fallback to Email Button */}
                    <div className="text-center pt-2">
                        <p className="text-gray-400 text-sm">Lost access or don't know the current password?</p>
                        <button 
                            onClick={() => {setStep('email'); setError(''); setMessage('');}} 
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-1"
                        >
                            Use Email Recovery
                        </button>
                    </div>
                </div>
            </div>
        );
    } 
    
    // View 2: Email Recovery Request
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0A0F17]">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#161B22] rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-ai-green">Email Recovery</h2>
                <p className="text-gray-400 text-center">Enter your email to receive a password reset link.</p>

                <form onSubmit={handleEmailResetRequest} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-3 py-2 mt-1 input" placeholder="user@example.com"
                        />
                    </div>

                    <button type="submit" disabled={loading} className={`w-full py-2 px-4 btn-primary ${loading ? 'bg-gray-500 cursor-not-allowed' : ''}`}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {message && <p className="text-sm text-center text-yellow-400 p-2 bg-[#1C252D] rounded">{message}</p>}
                {error && <p className="text-sm text-center text-red-400 p-2 bg-red-900/50 rounded">{error}</p>}
                
                <div className="text-center pt-2">
                    <button 
                        onClick={() => {setStep('verify'); setError(''); setMessage('');}} 
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-1"
                    >
                        Go back to Password Verification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordRecovery;
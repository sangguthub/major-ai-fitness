import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import ProfileForm from '../components/ProfileForm';
import RiskForm from '../components/RiskForm';
import CalorieUpload from '../components/CalorieUpload';

const Dashboard = ({ profile, setProfile }) => {
    // Removed: useState(loading) and useEffect.
    // Component now assumes it receives valid 'profile' data immediately.
    
    const navigate = useNavigate();

    // The fetchProfile function is kept, but it MUST be called manually 
    // by child components (ProfileForm, RiskForm) when they need to refresh the data.
    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            // Update the parent state (App.jsx)
            setProfile(prev => ({ 
                ...prev, 
                ...response.data.profile, 
                latestRisk: response.data.latestRisk, 
                name: response.data.name 
            })); 
            // NOTE: No setLoading(false) is called here, as loading state is removed.
        } catch (err) {
            console.error("Profile Fetch Error:", err); 
            // In a production app, you would redirect to login or show a global error here.
        }
    };
    
    // Check for essential data needed for BMI/BMR/Risk Calculation
    // If 'profile' is initially empty (e.g., {}), this will show blank stats.
    const isProfileIncomplete = !profile.age || !profile.height || !profile.weight;

    // NOTE: If profile data is needed immediately, this pattern fails, 
    // which is why the useEffect pattern is mandatory for stable data fetching.

    return (
        <div className="container mx-auto">
            {/* The rest of the component remains the same, relying on profile props */}
            <h2 className="text-2xl font-semibold mb-6">Welcome, {profile.name || 'User'}!</h2>
            
            {/* Action Bar */}
            <div className="flex justify-end mb-6">
                <button 
                    onClick={() => navigate('/recommendations')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                >
                    View Personalized Plans 🧠
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. User Profile & Update (Module 1) */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">👤 Profile & Update</h3>
                    <ProfileForm profile={profile} fetchProfile={fetchProfile} />
                    {profile.bmi && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p><strong>BMI:</strong> {profile.bmi}</p>
                            <p><strong>BMR (Cal/Day):</strong> {profile.bmr}</p>
                            <p><strong>Latest Risk:</strong> <span className={`font-bold text-${profile.latestRisk === 'High' ? 'red' : profile.latestRisk === 'Medium' ? 'orange' : 'green'}-600`}>{profile.latestRisk || 'N/A'}</span></p>
                        </div>
                    )}
                </div>

                {/* 2. Health Risk Check (Module 3) */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">❤️ Health Risk Check</h3>
                    {isProfileIncomplete ? (
                        <p className="text-red-500">Please complete Age, Height, Weight above to check risk.</p>
                    ) : (
                        <RiskForm profile={profile} fetchProfile={fetchProfile} />
                    )}
                </div>

                {/* 3. Image Upload (Module 2) */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">🥗 Calorie Estimation</h3>
                    <CalorieUpload />
                </div>
                
            </div>
            
            {/* 4. Analytics & Logs (Module 5 Placeholder) */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">📊 Daily Analytics & Progress</h3>
                <p className="text-gray-600">This section will eventually display charts (Weight vs Time, Calorie Intake vs Target) using libraries like Chart.js.</p>
            </div>
        </div>
    );
};

export default Dashboard;
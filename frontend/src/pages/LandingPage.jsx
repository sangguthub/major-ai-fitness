import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const LandingPage = ({ onAuthSuccess }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-68px)] p-10 bg-[#0D1117]">
            <div className="md:flex max-w-6xl w-full bg-card rounded-xl shadow-2xl overflow-hidden border border-[#161B22]">
                
                {/* Left Section: AI Theme Banner (60%) */}
                <div className="md:w-3/5 p-12 bg-[#121212] flex flex-col justify-center text-left">
                    <h1 className="text-6xl font-extrabold text-ai-green mb-4 leading-tight">
                        AI-Powered Fitness <br/> Diagnosis System
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-lg">
                        Harnessing **Deep Learning** and **Predictive Analytics** to define your personalized path to health optimization.
                    </p>
                    <ul className="space-y-3 text-lg text-gray-300">
                        <li className="flex items-center"><span className="text-ai-green mr-3">✓</span> Predictive Health Risk Analysis</li>
                        <li className="flex items-center"><span className="text-ai-green mr-3">✓</span> Image-Based Calorie Estimation</li>
                        <li className="flex items-center"><span className="text-ai-green mr-3">✓</span> Dynamic Diet & Workout Plans</li>
                    </ul>
                </div>

                {/* Right Section: Login/Register (40%) */}
                <div className="md:w-2/5 p-10 flex items-center justify-center bg-[#161B22]">
                    <div className="w-full max-w-sm">
                        <h2 className="text-3xl font-bold text-center text-white mb-6">System Access</h2>
                        <AuthForm onAuthSuccess={onAuthSuccess} />
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Use test@example.com / password123 to access the mock data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
import React from 'react';
import { FaHeartbeat, FaCamera, FaRobot, FaSitemap, FaMicrochip, FaChartLine } from 'react-icons/fa';

const AboutPage = () => {
    return (
        <div className="container mx-auto p-8 bg-[#0D1117] text-white">
            <div className="max-w-6xl mx-auto p-8 rounded-xl">
                
                {/* --- HEADER --- */}
                <header className="text-center mb-12">
                    <p className="text-lg font-semibold text-accent-blue mb-2">Our Vision</p>
                    <h2 className="text-5xl md:text-5xl font-extrabold text-ai-green tracking-wide mb-4">
                        The AI Fitness & Prediction System
                    </h2>
                    <p className="text-xl text-gray-400 max-w-4xl mx-auto">
                        This system bridges web development (MERN stack) with **specialized Machine Learning services (Python/Flask)** to deliver a highly predictive and personalized platform, moving beyond simple calorie tracking toward proactive health risk mitigation.
                    </p>
                </header>

                {/* --- 1. CORE INTELLIGENCE MODULES (Grid Layout) --- */}
                <h3 className="text-3xl font-bold mb-6 text-accent-blue border-b border-[#2D333B] pb-3 flex items-center">
                    <FaMicrochip className="mr-3 text-ai-green" />
                    Core System Intelligence
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    
                    {/* Module 1: Health Risk Prediction */}
                    <div className="p-6 rounded-xl bg-[#161B22] border border-red-500/30 shadow-2xl shadow-red-500/10 transition-all duration-300 hover:scale-[1.03]">
                        <FaHeartbeat className="text-4xl text-red-500 mb-3" />
                        <h4 className="text-xl font-bold mb-2 text-white">
                            1. Advanced Risk Diagnosis
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Uses a **Random Forest Classifier** trained on **11+ advanced lifestyle features** (Water Intake, Meat Freq) to predict **Obesity & Metabolic Risk**.
                        </p>
                        <p className="text-xs text-ai-green font-bold">
                            Tech Stack: Python/Flask, scikit-learn.
                        </p>
                    </div>

                    {/* Module 2: Calorie Estimation */}
                    <div className="p-6 rounded-xl bg-[#161B22] border border-yellow-500/30 shadow-2xl shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.03]">
                        <FaCamera className="text-4xl text-yellow-500 mb-3" />
                        <h4 className="text-xl font-bold mb-2 text-white">
                            2. Image-Based Calorie Estimation
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Simulates a **Deep Learning CNN** to classify food images and estimate macros/calories against a local nutritional database, automating food logging.
                        </p>
                        <p className="text-xs text-ai-green font-bold">
                            Tech Stack: Python/Flask, CNN (Simulated).
                        </p>
                    </div>

                    {/* Module 3: Recommendation Engine & Gamification */}
                    <div className="p-6 rounded-xl bg-[#161B22] border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 transition-all duration-300 hover:scale-[1.03]">
                        <FaChartLine className="text-4xl text-indigo-500 mb-3" />
                        <h4 className="text-xl font-bold mb-2 text-white">
                            3. Goal-Driven Personalization & Gamification
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                            A **Rule-Based Algorithm** synthesizes TDEE, Goal, and Risk Score to provide precise macro targets and workout plans. Includes a **Daily Streak** system for consistency.
                        </p>
                        <p className="text-xs text-ai-green font-bold">
                            Tech Stack: Node.js/Express.js, Rule-Based Logic.
                        </p>
                    </div>

                </div>

                {/* --- 2. SYSTEM ARCHITECTURE --- */}
                <h3 className="text-3xl font-bold mb-6 text-accent-blue mt-12 border-b border-[#2D333B] pb-3 flex items-center">
                    <FaSitemap className="mr-3 text-ai-green" />
                    System Architecture: MERN + Python Microservices
                </h3>

                <p className="text-gray-300 mb-8">
                    The project utilizes a modular **Microservices Architecture** to ensure high performance and maintainability by strictly separating the front-end, business logic, and compute-intensive tasks (AI/ML). 
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-2xl font-extrabold text-ai-green">Frontend</p>
                        <p className="text-sm text-gray-400">React (UI/Visualization)</p>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-2xl font-extrabold text-ai-green">Backend</p>
                        <p className="text-sm text-gray-400">Node/Express (API Gateway)</p>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-2xl font-extrabold text-ai-green">Database</p>
                        <p className="text-sm text-gray-400">MongoDB / Mock DB</p>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-2xl font-extrabold text-ai-green">ML Tier</p>
                        <p className="text-sm text-gray-400">Python/Flask (AI Services)</p>
                    </div>
                </div>

                {/* --- FOOTER / PROJECT NOTE --- */}
                <div className="mt-12 pt-6 border-t border-[#2D333B] text-center text-sm text-gray-500">
                    This project demonstrates full-stack development competency, data integration, and practical machine learning model deployment via microservices.
                </div>
            </div>
        </div>
    );
};

export default AboutPage; 
import React from 'react';

const AboutPage = () => {
    return (
        <div className="container mx-auto p-8 bg-[#0D1117] text-white">
            <div className="max-w-4xl mx-auto bg-card p-8 rounded-xl shadow-ai border border-[#161B22]">
                
                <h2 className="text-4xl font-extrabold mb-6 text-ai-green border-b border-[#2D333B] pb-3">
                    About the AI Fitness & Diet Recommendation System
                </h2>

                <p className="text-lg text-gray-400 mb-6">
                    This system is a major project designed to solve modern health challenges by integrating **predictive intelligence** into personalized diet and fitness planning.
                </p>

                {/* --- Core Modules --- */}
                <h3 className="text-2xl font-bold mb-4 text-accent-blue">
                    System Intelligence & Technology
                </h3>

                {/* 1. Health Risk Prediction */}
                <div className="mb-6 p-4 border border-[#2D333B] rounded-lg">
                    <h4 className="text-xl font-semibold mb-2 text-white">
                        1. Predictive Health Risk Diagnosis
                    </h4>
                    <p className="text-gray-300">
                        The core is a **Random Forest Classifier (Machine Learning)** that assesses the probability of **Obesity Risk (Low/Medium/High)** based on user biometrics and lifestyle data.
                    </p>
                    <p className="text-sm text-ai-green mt-2">
                        <span className="font-bold">Tech Stack:</span> Python, Flask, scikit-learn.
                    </p>
                </div>

                {/* 2. Calorie Estimation */}
                <div className="mb-6 p-4 border border-[#2D333B] rounded-lg">
                    <h4 className="text-xl font-semibold mb-2 text-white">
                        2. Image-Based Calorie Estimation
                    </h4>
                    <p className="text-gray-300">
                        This module simulates a **Deep Learning Convolutional Neural Network (CNN)** for classifying food images and estimating portion sizes to automate calorie tracking.
                    </p>
                    <p className="text-sm text-ai-green mt-2">
                        <span className="font-bold">Tech Stack:</span> Python, Flask, CNN (Simulated).
                    </p>
                </div>

                {/* 3. Recommendation Engine */}
                <div className="mb-6 p-4 border border-[#2D333B] rounded-lg">
                    <h4 className="text-xl font-semibold mb-2 text-white">
                        3. Goal-Driven Personalization
                    </h4>
                    <p className="text-gray-300">
                        The Node.js backend uses a **rule-based algorithm** to synthesize **BMR, Activity Level, Weight Goal, and Predicted Risk** to generate precise Daily Calorie Targets and customized diet and fitness plans.
                    </p>
                    <p className="text-sm text-ai-green mt-2">
                        <span className="font-bold">Tech Stack:</span> Node.js/Express.js, Rule-Based Logic.
                    </p>
                </div>

                {/* --- Architecture --- */}
                <h3 className="text-2xl font-bold mb-4 text-accent-blue mt-6">
                    System Architecture
                </h3>
                <p className="text-gray-300">
                    The project utilizes a modular **Microservices Architecture**, separating the web application (MERN stack) from the specialized machine learning services (Python/Flask) for high performance.
                </p>
                <ul className="list-disc ml-5 mt-4 text-gray-300 space-y-1">
                    <li>**Frontend:** React (UI/Routing)</li>
                    <li>**Backend:** Node.js/Express.js (API Gateway/Authentication)</li>
                    <li>**ML Services:** Python/Flask (Prediction & Estimation)</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;
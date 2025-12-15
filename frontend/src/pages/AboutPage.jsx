import React from 'react';
import { FaHeartbeat, FaCamera, FaRobot, FaSitemap, FaMicrochip, FaChartLine, FaBrain } from 'react-icons/fa'; // Added FaBrain

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="container mx-auto px-8 py-16">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header Section with Modern Hero Design */}
                    <header className="text-center mb-20 relative">
                        {/* Floating gradient orbs for depth */}
                        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-0 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm mb-6">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <p className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    Our Vision
                                </p>
                            </div>
                            
                            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    The AI Fitness &
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    Prediction System
                                </span>
                            </h2>
                            
                            <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-8"></div>
                            
                            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                                This system bridges web development (MERN stack) with <span className="text-emerald-400 font-semibold">specialized Machine Learning services (Python/Flask)</span> and **Generative AI (Gemini)** to deliver a highly predictive and personalized platform, moving beyond simple calorie tracking toward proactive health risk mitigation.
                            </p>
                        </div>
                    </header>

                    {/* Core Intelligence Modules Section */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <FaMicrochip className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    Core System Intelligence
                                </h3>
                                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2"></div>
                            </div>
                        </div>

                        {/* Changed to 4 columns to accommodate the new Gemini feature */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            
                            {/* Module 1: Health Risk Prediction (ML) */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-red-500/20">
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Accent line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                                
                                <div className="relative p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center mb-6 border border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <FaHeartbeat className="text-3xl text-red-400" />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold mb-4 text-white">
                                        1. Advanced Risk Diagnosis
                                    </h4>
                                    
                                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                        Uses a <span className="text-red-400 font-semibold">Random Forest Classifier</span> trained on <span className="text-red-400 font-semibold">11+ advanced lifestyle features</span> to predict Obesity & Metabolic Risk.
                                    </p>
                                    
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                        <p className="text-xs text-emerald-400 font-bold">
                                            Python/Flask, scikit-learn
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Module 2: Calorie Estimation (Simulated CV) */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-amber-500"></div>
                                
                                <div className="relative p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center mb-6 border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <FaCamera className="text-3xl text-yellow-400" />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold mb-4 text-white">
                                        2. Image-Based Calorie Estimation
                                    </h4>
                                    
                                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                        Simulates a <span className="text-yellow-400 font-semibold">Deep Learning CNN</span> to classify food images and estimate macros/calories, automating tedious food logging.
                                    </p>
                                    
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                        <p className="text-xs text-emerald-400 font-bold">
                                            Python/Flask, CNN (Simulated)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Module 3: Generative AI Coach (NEW) */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                                
                                <div className="relative p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <FaBrain className="text-3xl text-cyan-400" />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold mb-4 text-white">
                                        3. Gemini AI Maintenance Coach
                                    </h4>
                                    
                                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                        Leverages the <span className="text-cyan-400 font-semibold">Gemini API</span> to generate hyper-personalized, three-part daily advice: Workout, Diet Focus, and Mind/Recovery strategies.
                                    </p>
                                    
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                        <p className="text-xs text-emerald-400 font-bold">
                                            Google Gemini API, Node.js
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Module 4: Goal-Driven Personalization (Rule-Based + Dashboard) */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                
                                <div className="relative p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <FaChartLine className="text-3xl text-indigo-400" />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold mb-4 text-white">
                                        4. Goal-Driven Personalization
                                    </h4>
                                    
                                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                        A <span className="text-indigo-400 font-semibold">Rule-Based Algorithm</span> synthesizes TDEE, Goal, and Risk Score to provide precise macro targets. Includes Daily Streaks for gamification.
                                    </p>
                                    
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                        <p className="text-xs text-emerald-400 font-bold">
                                            Node.js/Express.js, Rule-Based Logic
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Architecture Section */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <FaSitemap className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    System Architecture: MERN + Python Microservices
                                </h3>
                                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-2"></div>
                            </div>
                        </div>

                        <p className="text-slate-300 text-lg mb-12 leading-relaxed max-w-5xl">
                            The project utilizes a modular <span className="text-cyan-400 font-semibold">Microservices Architecture</span> to ensure high performance and maintainability by strictly separating the front-end, business logic, and compute-intensive tasks (AI/ML). 
                        </p>
                        
                        {/* Architecture Breakdown (4 Columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            
                            {/* Frontend */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-8 text-center transition-all duration-300 hover:scale-105 hover:border-emerald-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <p className="text-3xl font-black bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
                                        Frontend
                                    </p>
                                    <div className="h-0.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-3"></div>
                                    <p className="text-sm text-slate-400">React (UI/Visualization)</p>
                                </div>
                            </div>
                            
                            {/* Backend */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-8 text-center transition-all duration-300 hover:scale-105 hover:border-teal-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <p className="text-3xl font-black bg-gradient-to-br from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                                        Backend
                                    </p>
                                    <div className="h-0.5 w-16 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto mb-3"></div>
                                    <p className="text-sm text-slate-400">Node/Express (API Gateway)</p>
                                </div>
                            </div>
                            
                            {/* Database */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-8 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <p className="text-3xl font-black bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
                                        Database
                                    </p>
                                    <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-3"></div>
                                    <p className="text-sm text-slate-400">MongoDB / Mock DB</p>
                                </div>
                            </div>
                            
                            {/* ML Tier */}
                            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-8 text-center transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <p className="text-3xl font-black bg-gradient-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-3">
                                        AI/ML Tier
                                    </p>
                                    <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-3"></div>
                                    <p className="text-sm text-slate-400">Python/Flask (Prediction & Vision)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-8 text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5"></div>
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            <p className="text-slate-300 text-base leading-relaxed max-w-3xl mx-auto">
                                This project demonstrates full-stack development competency, data integration, and practical machine learning model deployment via microservices.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutPage;
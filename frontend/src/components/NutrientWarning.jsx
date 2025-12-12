import React from 'react';
import { FaBolt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// This component receives the processed warnings array as a prop
const NutrientWarning = ({ warnings }) => {
    
    // Determine status: If any warning exists, we show the alert state.
    const hasWarnings = warnings && warnings.length > 0;

    // Define dynamic classes based on status
    const containerClasses = hasWarnings
        ? 'bg-gradient-to-r from-red-900/40 to-red-900/20 border-red-700/70 shadow-lg shadow-red-900/30'
        : 'bg-gradient-to-r from-ai-green/10 to-transparent border-ai-green/50 shadow-md shadow-ai-green/10';

    const icon = hasWarnings ? <FaExclamationTriangle className="mr-2 text-red-400" /> : <FaCheckCircle className="mr-2 text-ai-green" />;
    const titleColor = hasWarnings ? 'text-red-400' : 'text-ai-green';

    return (
        <div 
            className={`p-4 rounded-xl border transition-all duration-300 ${containerClasses}`}
        >
            <h4 className={`font-extrabold mb-3 flex items-center text-sm uppercase tracking-wider ${titleColor}`}>
                <FaBolt className="mr-2" />
                Daily Nutrient Status
            </h4>
            
            {/* Displaying warnings if the array is populated */}
            {hasWarnings ? (
                <div className="space-y-2">
                    <p className="text-xs text-red-300">
                        Immediate attention required for:
                    </p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                        {warnings.map((warning, index) => (
                            <li key={index} className="text-red-400">
                                {/* Example output: LOW: Vitamin D (IU). Intake is low (33% of target). */}
                                <span className="font-bold">{warning.status}:</span> {warning.nutrient} ({warning.intake}% of target)
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    {icon}
                    <p className="text-xs text-ai-green font-medium">
                        All monitored targets met. Excellent!
                    </p>
                </div>
            )}
        </div>
    );
};

export default NutrientWarning;
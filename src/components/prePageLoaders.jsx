import React from 'react'

function PrePageLoaders() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-300">
            <div className="flex flex-col items-center space-y-8">
                <div className="flex space-x-3 h-24 items-end">
                    <div className="w-4 rounded-full animate-pulse-bar animation-delay-100 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300"></div>
                    <div className="w-4 rounded-full animate-pulse-bar animation-delay-200 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300"></div>
                    <div className="w-4 rounded-full animate-pulse-bar animation-delay-300 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300"></div>
                    <div className="w-4 rounded-full animate-pulse-bar animation-delay-400 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300"></div>
                    <div className="w-4 rounded-full animate-pulse-bar animation-delay-500 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300"></div>
                </div>

                <p className="text-lg font-semibold text-gray-300">Loading...</p>
            </div>
            <style>
                {`
                    @keyframes pulseBar {
                        0%, 100% {
                            height: 20%; 
                            opacity: 0.6;
                        }
                        50% {
                            height: 100%;
                            opacity: 1;
                        }
                    }
    
                    .animate-pulse-bar {
                        animation: pulseBar 1.2s ease-in-out infinite;
                    }
    
                    .animation-delay-100 { animation-delay: 0.1s; }
                    .animation-delay-200 { animation-delay: 0.2s; }
                    .animation-delay-300 { animation-delay: 0.3s; }
                    .animation-delay-400 { animation-delay: 0.4s; }
                    .animation-delay-500 { animation-delay: 0.5s; }
                `}
            </style>
        </div>
    )
}

export default PrePageLoaders

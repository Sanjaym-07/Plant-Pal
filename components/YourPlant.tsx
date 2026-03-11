import React, { useState, useEffect, useMemo } from 'react';
import { LoadingSpinner, PlantMonitorIcon, WaterIcon } from './icons/Icons';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

type LogEntry = {
    timestamp: string;
    message: string;
};

const YourPlant: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [moistureLevel, setMoistureLevel] = useState(75);
    const [threshold, setThreshold] = useState(40);
    const [isWatering, setIsWatering] = useState(false);
    const [log, setLog] = useState<LogEntry[]>([]);

    const addLogEntry = (message: string) => {
        const newEntry: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            message: message,
        };
        setLog(prevLog => [newEntry, ...prevLog].slice(0, 10)); // Keep last 10 entries
    };

    // Simulate connection to hardware
    const handleConnect = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnected(true);
            setIsConnecting(false);
            addLogEntry("Connected to PlantPal device.");
            addLogEntry(`Initial moisture: ${moistureLevel}%.`);
        }, 2000);
    };

    // Simulate moisture level decreasing over time
    useEffect(() => {
        if (!isConnected || isWatering) return;

        const interval = setInterval(() => {
            setMoistureLevel(prev => Math.max(0, prev - 1));
        }, 3000); // Decrease moisture every 3 seconds

        return () => clearInterval(interval);
    }, [isConnected, isWatering]);

    // Simulate automatic watering
    useEffect(() => {
        if (isConnected && !isWatering && moistureLevel < threshold) {
            setIsWatering(true);
            addLogEntry(`Moisture low (${moistureLevel}%). Auto-watering initiated.`);
            
            setTimeout(() => {
                setMoistureLevel(90); // Water fills it up
                addLogEntry("Watering complete. Moisture restored to 90%.");
                setIsWatering(false);
            }, 5000); // Watering takes 5 seconds
        }
    }, [isConnected, moistureLevel, threshold, isWatering]);
    
    const handleManualWater = () => {
        if (isWatering || !isConnected) return;
        setIsWatering(true);
        addLogEntry("Manual watering initiated.");

        setTimeout(() => {
            setMoistureLevel(95);
            addLogEntry("Manual watering complete. Moisture at 95%.");
            setIsWatering(false);
        }, 5000);
    };

    const gaugeData = useMemo(() => [{ name: 'Moisture', value: moistureLevel, fill: moistureLevel < threshold ? '#fb923c' : '#a78bfa' }], [moistureLevel, threshold]);
    const statusText = isWatering ? "Watering..." : moistureLevel < threshold ? "Low Moisture" : "Optimal";

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                <PlantMonitorIcon className="w-24 h-24 text-secondary mb-4" />
                <h2 className="text-3xl font-bold text-text-light mb-2">Connect to Your Plant Monitor</h2>
                <p className="text-text-dark mb-6 max-w-md">Link your PlantPal hardware to get live soil moisture data and enable automatic watering.</p>
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-48 flex justify-center items-center gap-2 py-3 px-4 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition"
                >
                    {isConnecting ? <><LoadingSpinner/> Connecting...</> : 'Connect'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-primary text-center">My Garden Monitor</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Monitor */}
                <div className="lg:col-span-3 p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold text-secondary mb-4">Live Soil Moisture</h3>
                    <div className="w-full h-80 relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={gaugeData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                <RadialBar background cornerRadius={10} dataKey="value" />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-7xl font-bold text-text-light">{moistureLevel}%</span>
                            <span className={`text-xl font-semibold ${moistureLevel < threshold ? 'text-orange-400' : 'text-primary'}`}>{statusText}</span>
                        </div>
                    </div>
                </div>

                {/* Controls and Log */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                        <h3 className="text-xl font-bold text-text-light mb-4">Controls</h3>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-text-dark mb-2">Watering Threshold: <span className="font-bold text-secondary">{threshold}%</span></label>
                                <input
                                    type="range"
                                    min="10"
                                    max="70"
                                    step="5"
                                    value={threshold}
                                    onChange={(e) => setThreshold(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <button
                                onClick={handleManualWater}
                                disabled={isWatering}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition"
                            >
                               <WaterIcon className="w-5 h-5" /> Water Now
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                        <h3 className="text-xl font-bold text-text-light mb-4">Activity Log</h3>
                        <ul className="space-y-2 h-48 overflow-y-auto pr-2">
                           {log.length > 0 ? log.map((entry, index) => (
                               <li key={index} className="text-sm text-text-dark border-b border-panel-border pb-1">
                                   <span className="font-semibold text-text-light">{entry.timestamp}:</span> {entry.message}
                               </li>
                           )) : <p className="text-text-dark">No activity yet.</p>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YourPlant;

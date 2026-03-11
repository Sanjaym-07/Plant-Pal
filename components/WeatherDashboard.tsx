import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { WeatherIcon, TemperatureIcon, HumidityIcon, RainfallIcon, WindIcon } from './icons/Icons';
import { RainAnimation } from './animations/RainAnimation';

const WeatherDashboard: React.FC = () => {
    // Mock weather data as we can't call external APIs.
    const weatherData = useMemo(() => {
        const today = new Date();
        const data = [];
        const conditions = ['Sunny', 'Cloudy', 'Rainy'];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            data.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temperature: Math.floor(Math.random() * (35 - 15 + 1) + 15),
                humidity: Math.floor(Math.random() * (90 - 40 + 1) + 40),
                rainfall: Math.floor(Math.random() * 20),
                wind: Math.floor(Math.random() * (25 - 5 + 1) + 5),
                condition: i === 0 ? 'Rainy' : conditions[Math.floor(Math.random() * conditions.length)],
            });
        }
        return data;
    }, []);

    const currentWeather = weatherData[0];

    const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="p-3 bg-secondary/20 rounded-full mb-2">
                {icon}
            </div>
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-text-dark">{label}</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {currentWeather.condition === 'Rainy' && <RainAnimation />}
            <header className="text-center">
                <WeatherIcon className="w-16 h-16 mx-auto text-primary animate-float" />
                <h1 className="text-5xl font-extrabold text-primary mt-4">
                    Weather Dashboard
                </h1>
                <p className="text-lg text-text-dark mt-2 max-w-2xl mx-auto">
                    Real-time weather monitoring and 7-day forecast to help you plan your farming activities.
                </p>
            </header>

            <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Current Conditions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-panel-border">
                    <StatCard icon={<TemperatureIcon className="w-8 h-8 text-secondary"/>} label="Temperature" value={`${currentWeather.temperature}°C`} />
                    <StatCard icon={<HumidityIcon className="w-8 h-8 text-secondary"/>} label="Humidity" value={`${currentWeather.humidity}%`} />
                    <StatCard icon={<RainfallIcon className="w-8 h-8 text-secondary"/>} label="Rainfall" value={`${currentWeather.rainfall}mm`} />
                    <StatCard icon={<WindIcon className="w-8 h-8 text-secondary"/>} label="Wind Speed" value={`${currentWeather.wind}km/h`} />
                </div>
            </div>

            <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                 <h3 className="text-2xl font-bold mb-4 text-secondary">7-Day Forecast</h3>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                         <h4 className="text-xl font-semibold mb-4 text-center text-primary">Temperature (°C)</h4>
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={weatherData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#e2e8f0" />
                                <YAxis stroke="#e2e8f0" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155' }} />
                                <Legend />
                                <Line type="monotone" dataKey="temperature" stroke="#a78bfa" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold mb-4 text-center text-primary">Rainfall (mm)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weatherData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#e2e8f0" />
                                <YAxis stroke="#e2e8f0" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155' }} />
                                <Legend />
                                <Bar dataKey="rainfall" fill="#34d399" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default WeatherDashboard;
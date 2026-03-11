import React, { useState } from 'react';
import { getSustainabilityAnalysis } from '../services/geminiService';
import type { SustainabilityData } from '../types';
import { LoadingSpinner } from './icons/Icons';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';

const SustainabilityTracker: React.FC = () => {
  const [inputs, setInputs] = useState({
    water: 15000,
    carbon: 500,
    soil: 'Loamy with good organic matter',
  });
  const [analysis, setAnalysis] = useState<SustainabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'soil' ? value : Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await getSustainabilityAnalysis(inputs);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = analysis ? [
    { name: 'Water', score: analysis.waterUsageScore, fill: '#60a5fa' },
    { name: 'Carbon', score: analysis.carbonFootprintScore, fill: '#a78bfa' },
    { name: 'Soil', score: analysis.soilHealthScore, fill: '#34d399' },
  ] : [];

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-primary text-center">Sustainability Tracker</h2>
      
      <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Water Used (liters/hectare)</label>
              <input type="number" name="water" value={inputs.water} onChange={handleInputChange} className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Carbon Footprint (kg CO2e/hectare)</label>
              <input type="number" name="carbon" value={inputs.carbon} onChange={handleInputChange} className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Soil Health Description</label>
            <textarea name="soil" value={inputs.soil} onChange={handleInputChange} rows={3} className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md"></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition duration-300">
            {loading ? <><LoadingSpinner/> Analyzing Data...</> : 'Analyze Sustainability'}
          </button>
        </form>
      </div>

      {error && <div className="p-4 bg-red-900/80 backdrop-blur-sm border border-red-700 text-white rounded-lg max-w-4xl mx-auto">{error}</div>}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                <h3 className="text-xl font-semibold mb-4 text-center text-text-light">Eco-Impact Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart 
                        innerRadius="20%" 
                        outerRadius="80%" 
                        data={chartData} 
                        startAngle={180} 
                        endAngle={0}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar background dataKey="score" cornerRadius={10} />
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{color: '#e2e8f0'}} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155' }} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                <h3 className="text-xl font-semibold mb-4 text-text-light">Improvement Recommendations</h3>
                <ul className="space-y-3 list-disc list-inside text-text-dark">
                    {analysis.recommendations.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default SustainabilityTracker;
import React, { useState } from 'react';
import { getYieldPrediction } from '../services/geminiService';
import type { YieldData } from '../types';
import { CROP_LIST } from '../constants';
import { LoadingSpinner } from './icons/Icons';
import { RainAnimation } from './animations/RainAnimation';

const YieldEstimation: React.FC = () => {
  const [crop, setCrop] = useState(CROP_LIST[0]);
  const [area, setArea] = useState(10);
  const [conditions, setConditions] = useState('Good soil quality, adequate rainfall, and moderate temperatures.');
  const [prediction, setPrediction] = useState<YieldData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulateRain, setSimulateRain] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await getYieldPrediction(crop, area, conditions);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {simulateRain && <RainAnimation />}
      <h2 className="text-4xl font-bold text-primary text-center">Yield Estimation</h2>
      
      <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border space-y-4 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Crop</label>
              <select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md">
                {CROP_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Area (hectares)</label>
              <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Growing Conditions</label>
            <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={3} className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md"></textarea>
          </div>
           <div className="flex items-center justify-center pt-2">
            <input 
                type="checkbox" 
                id="rain-sim" 
                checked={simulateRain}
                onChange={(e) => setSimulateRain(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 bg-slate-700 text-secondary focus:ring-secondary cursor-pointer"
            />
            <label htmlFor="rain-sim" className="ml-3 block text-sm font-medium text-text-dark cursor-pointer">
                Simulate Rainy Growing Conditions
            </label>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition duration-300">
            {loading ? <><LoadingSpinner/> Predicting Yield...</> : 'Predict Yield'}
          </button>
        </form>

        {error && <div className="p-4 bg-red-900/80 backdrop-blur-sm border border-red-700 text-white rounded-lg">{error}</div>}

        {prediction && (
          <div className="mt-8 border-t border-panel-border pt-6 animate-fade-in space-y-6">
              <div className="text-center">
                  <p className="text-lg text-text-dark">Estimated Yield for {crop}</p>
                  <p className="text-5xl font-extrabold text-secondary my-2">{prediction.estimatedYield}</p>
                  <p className="text-md text-text-dark">Confidence: <span className="font-semibold text-primary">{prediction.confidence}</span></p>
              </div>
              
              <div>
                  <h4 className="text-xl font-semibold mb-2 text-center text-text-light">Advice to Maximize Yield</h4>
                  <ul className="space-y-2 list-disc list-inside text-text-dark max-w-xl mx-auto">
                      {prediction.advice.map((tip, index) => (
                          <li key={index}>{tip}</li>
                      ))}
                  </ul>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldEstimation;
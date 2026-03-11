import React, { useState } from 'react';
import { getFertilizerAdvice } from '../services/geminiService';
import type { FertilizerData } from '../types';
import { CROP_LIST } from '../constants';
import { LoadingSpinner, FertilizerIcon, WaterIcon } from './icons/Icons';

const FertilizerManagement: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState(CROP_LIST[0]);
  const [advice, setAdvice] = useState<FertilizerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const result = await getFertilizerAdvice(selectedCrop);
      setAdvice(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-primary text-center">Fertilizer & Water Management</h2>
      
      <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-text-dark mb-1">Select a Crop</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)} 
              className="w-full p-3 bg-slate-900/50 border border-panel-border rounded-md focus:ring-primary focus:border-primary"
            >
              {CROP_LIST.map(crop => <option key={crop} value={crop}>{crop}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full md:w-auto mt-2 md:mt-0 self-end py-3 px-6 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition duration-300 flex items-center justify-center gap-2">
             {loading ? <><LoadingSpinner/> Analyzing...</> : 'Get Advice'}
          </button>
        </form>

        {error && <div className="mt-6 p-4 bg-red-900/80 backdrop-blur-sm border border-red-700 text-white rounded-lg">{error}</div>}

        {advice && (
          <div className="mt-8 border-t border-panel-border pt-6 animate-fade-in space-y-6">
              <h3 className="text-2xl font-bold text-text-light">Recommendations for <span className="text-secondary">{selectedCrop}</span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                          <FertilizerIcon className="w-8 h-8 text-primary" />
                          <h4 className="text-xl font-semibold">Fertilizer Plan</h4>
                      </div>
                      <p><strong>Type:</strong> {advice.type}</p>
                      <p><strong>Quantity:</strong> {advice.quantity}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                          <WaterIcon className="w-8 h-8 text-primary" />
                          <h4 className="text-xl font-semibold">Irrigation Schedule</h4>
                      </div>
                      <p>{advice.schedule}</p>
                  </div>
              </div>

              <div>
                  <h4 className="text-xl font-semibold mb-2">Reasoning</h4>
                  <p className="text-text-dark">{advice.reasoning}</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FertilizerManagement;
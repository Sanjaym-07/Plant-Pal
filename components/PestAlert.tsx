import React, { useState, useRef } from 'react';
import { detectPestOrDisease } from '../services/geminiService';
import type { PestData } from '../types';
import { LoadingSpinner, UploadIcon } from './icons/Icons';

const PestAlert: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<PestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await detectPestOrDisease(imageFile, description);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-primary text-center">Pest & Disease Alert</h2>
      <p className="text-lg text-text-dark text-center max-w-3xl mx-auto">
        Upload an image of your crop taken by your camera or hardware device. Our AI will analyze it to detect potential pests or diseases.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Crop Image</label>
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-panel-border border-dashed rounded-md cursor-pointer hover:border-primary transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Crop preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
                  ) : (
                    <>
                      <UploadIcon className="mx-auto h-12 w-12 text-text-dark" />
                      <p className="text-sm text-text-dark">Click to upload an image</p>
                    </>
                  )}
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-dark">
                Optional Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full p-2 bg-slate-900/50 border-panel-border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                placeholder="e.g., Yellow spots on leaves, plant is wilting..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading || !imageFile}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition duration-300"
            >
              {loading ? <><LoadingSpinner /> Analyzing Image...</> : 'Analyze Image'}
            </button>
          </form>
        </div>

        <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
          <h3 className="text-2xl font-bold text-text-light mb-4">Analysis Result</h3>
          {error && <div className="p-4 bg-red-900/80 backdrop-blur-sm border border-red-700 text-white rounded-lg">{error}</div>}
          {result ? (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xl font-semibold text-secondary">{result.pestOrDisease}</h4>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${result.confidence * 100}%` }}></div>
              </div>
              <p className="text-sm text-text-dark">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
              <div>
                <h5 className="font-semibold text-text-light">Description</h5>
                <p className="text-text-dark">{result.description}</p>
              </div>
              <div>
                <h5 className="font-semibold text-text-light">Suggested Remedy</h5>
                <p className="text-text-dark">{result.remedy}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-dark">
              <p>Analysis will appear here once you upload an image.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestAlert;
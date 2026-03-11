
import React, { useState, useRef } from 'react';
import { getCropRecommendations, generateImage, visualizeInEnvironment } from '../services/geminiService';
import type { CropData } from '../types';
import { FARMING_TYPES, FARMING_TYPE_DETAILS } from '../constants';
import { LoadingSpinner, UploadIcon } from './icons/Icons';

type Step = 'type' | 'details' | 'result';

const FarmingTypeCard: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
    <div
        onClick={onClick}
        className="p-6 bg-panel-bg backdrop-blur-sm rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-panel-border text-center"
    >
        <h3 className="text-xl font-bold text-text-light">{title}</h3>
    </div>
);

const CropRecommendation: React.FC = () => {
    const [step, setStep] = useState<Step>('type');
    const [farmingType, setFarmingType] = useState<string | null>(null);
    const [params, setParams] = useState<Record<string, any>>({});
    const [suggestion, setSuggestion] = useState('');
    const [recommendations, setRecommendations] = useState<CropData[] | null>(null);
    const [combinedPrompt, setCombinedPrompt] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [visualizeStage, setVisualizeStage] = useState<'idle' | 'upload' | 'loading' | 'done'>('idle');
    const [envImage, setEnvImage] = useState<File | null>(null);
    const [envImageUrl, setEnvImageUrl] = useState<string | null>(null);
    const [finalImage, setFinalImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTypeSelect = (type: string) => {
        setFarmingType(type);
        const initialParams = FARMING_TYPE_DETAILS[type].reduce((acc, field) => {
            acc[field.name] = field.options ? field.options[0] : '';
            return acc;
        }, {} as Record<string, any>);
        setParams(initialParams);
        setStep('details');
    };

    const handleParamChange = (name: string, value: string | number) => {
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRecommendations(null);
        try {
            const response = await getCropRecommendations(farmingType!, params, suggestion);
            
            // Generate images for all recommendations in parallel
            const recommendationsWithImages = await Promise.all(
                response.recommendations.map(async (rec) => {
                    const imageUrl = await generateImage(rec.visualDescription);
                    return { ...rec, imageUrl };
                })
            );

            setRecommendations(recommendationsWithImages);
            setCombinedPrompt(response.combinedPrompt);
            setStep('result');
            setVisualizeStage('upload');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleEnvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEnvImage(file);
            setEnvImageUrl(URL.createObjectURL(file));
        }
    };

    const handleVisualize = async () => {
        if (!envImage || !combinedPrompt) return;
        setVisualizeStage('loading');
        setError(null);
        try {
            const resultImage = await visualizeInEnvironment(envImage, combinedPrompt);
            setFinalImage(resultImage);
            setVisualizeStage('done');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setVisualizeStage('upload');
        }
    };

    const reset = () => {
        setStep('type');
        setFarmingType(null);
        setParams({});
        setSuggestion('');
        setRecommendations(null);
        setCombinedPrompt(null);
        setError(null);
        setVisualizeStage('idle');
        setEnvImage(null);
        setEnvImageUrl(null);
        setFinalImage(null);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-primary text-center">AI Crop Recommendation</h2>
            
            {step === 'type' && (
                <div className="animate-fade-in">
                    <p className="text-lg text-text-dark text-center mb-6">What is your primary goal?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(FARMING_TYPES).map(type => (
                            <FarmingTypeCard key={type} title={type} onClick={() => handleTypeSelect(type)} />
                        ))}
                    </div>
                </div>
            )}

            {step === 'details' && farmingType && (
                <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border animate-fade-in">
                    <h3 className="text-2xl font-bold text-secondary mb-4">Details for {farmingType}</h3>
                    <form onSubmit={handleSubmitDetails} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {FARMING_TYPE_DETAILS[farmingType].map(field => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-text-dark mb-1">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <select value={params[field.name]} onChange={e => handleParamChange(field.name, e.target.value)} className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md">
                                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={params[field.name]}
                                            onChange={e => handleParamChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Optional: Any specific requests or plants you have in mind?
                            </label>
                            <textarea
                                value={suggestion}
                                onChange={e => setSuggestion(e.target.value)}
                                placeholder="e.g., I'd love something low-maintenance, or I'm interested in growing herbs..."
                                className="w-full p-2 bg-slate-900/50 border border-panel-border rounded-md"
                                rows={2}
                            />
                        </div>
                        {error && <div className="p-3 bg-red-900/80 text-white rounded-md">{error}</div>}
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setStep('type')} className="w-full py-3 px-4 bg-slate-600 text-white font-semibold rounded-lg hover:bg-opacity-80 transition">Back</button>
                            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition">
                                {loading ? <><LoadingSpinner/> Finding Crops...</> : 'Get Recommendations'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {step === 'result' && recommendations && (
                <div className="animate-fade-in space-y-8">
                    <h3 className="text-3xl font-bold text-secondary text-center">Top 3 Recommendations</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {recommendations.map((rec) => (
                            <div key={rec.name} className="flex flex-col p-4 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
                                {rec.imageUrl ? (
                                    <img src={rec.imageUrl} alt={rec.name} className="w-full h-56 object-cover rounded-lg shadow-lg mb-4"/>
                                ) : (
                                    <div className="w-full h-56 bg-slate-700 rounded-lg flex items-center justify-center mb-4"><LoadingSpinner /></div>
                                )}
                                <div className="space-y-3 flex-grow">
                                    <h4 className="text-2xl font-bold text-secondary">{rec.name}</h4>
                                    <p className="text-text-dark text-sm">{rec.reasoning}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border text-center">
                        <h3 className="text-2xl font-bold text-text-light mb-2">Visualize All 3 in Your Space</h3>
                        <p className="text-text-dark mb-4">Upload a picture of your garden, balcony, or field to see how these crops could look together.</p>
                    
                        {visualizeStage === 'upload' && (
                            <div className="space-y-4">
                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-panel-border border-dashed rounded-md cursor-pointer hover:border-primary transition" onClick={() => fileInputRef.current?.click()}>
                                    <div className="space-y-1 text-center">
                                        {envImageUrl ? <img src={envImageUrl} alt="Environment preview" className="mx-auto h-40 w-auto rounded-md object-contain" /> : <UploadIcon className="mx-auto h-12 w-12 text-text-dark" />}
                                        <p className="text-sm text-text-dark">{envImageUrl ? 'Click to change image' : 'Click to upload your environment'}</p>
                                    </div>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleEnvFileChange} className="hidden" />
                                <button onClick={handleVisualize} disabled={!envImage} className="w-full md:w-auto py-2 px-6 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition">Generate Visualization</button>
                            </div>
                        )}
                        
                        {visualizeStage === 'loading' && (
                            <div className="flex justify-center items-center gap-4 text-text-light"><LoadingSpinner /> Generating your visualization... This might take a moment.</div>
                        )}
                        
                        {visualizeStage === 'done' && finalImage && (
                            <div className="space-y-4">
                                <h4 className="text-xl font-semibold text-secondary">Here's your visualization!</h4>
                                <img src={finalImage} alt="Final visualization" className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg mx-auto"/>
                            </div>
                        )}
                        {error && <div className="mt-4 p-3 bg-red-900/80 text-white rounded-md">{error}</div>}
                    </div>
                    
                    <div className="text-center">
                        <button onClick={reset} className="py-2 px-6 bg-slate-600 text-white font-semibold rounded-lg hover:bg-opacity-80 transition">Start Over</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropRecommendation;
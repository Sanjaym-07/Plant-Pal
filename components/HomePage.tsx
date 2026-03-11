import React from 'react';
import type { ViewType } from '../App';
import { CropIcon, FertilizerIcon, PestIcon, WeatherIcon } from './icons/Icons';

interface HomePageProps {
  setCurrentView: (view: ViewType) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-panel-bg/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-panel-border"
  >
    <div className="text-secondary mb-4 w-12 h-12">{icon}</div>
    <h3 className="text-xl font-bold text-text-light mb-2">{title}</h3>
    <p className="text-text-dark">{description}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  return (
    <div className="space-y-12">
      <header className="text-center p-8 bg-panel-bg backdrop-blur-lg rounded-xl shadow-2xl border border-panel-border">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
          PlantPal - Smart Crop Manager
        </h1>
        <p className="text-lg text-text-dark max-w-3xl mx-auto">
          Integrating AI and environmental tech to empower farmers and researchers. Optimize your crop production with data-driven insights and intelligent recommendations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<CropIcon />}
          title="Crop Recommendation"
          description="Get AI-powered suggestions for the best crops based on your soil and climate conditions."
          onClick={() => setCurrentView('crop')}
        />
        <FeatureCard
          icon={<FertilizerIcon />}
          title="Fertilizer Advice"
          description="Receive precise fertilizer and irrigation schedules to maximize growth and health."
          onClick={() => setCurrentView('fertilizer')}
        />
        <FeatureCard
          icon={<PestIcon />}
          title="Pest & Disease Alert"
          description="Upload an image of your crop to detect potential threats and get instant remedies."
          onClick={() => setCurrentView('pest')}
        />
        <FeatureCard
          icon={<WeatherIcon />}
          title="Weather Dashboard"
          description="Access real-time weather data and forecasts to plan your activities effectively."
          onClick={() => setCurrentView('weather')}
        />
      </div>

       <div className="text-center p-8 bg-panel-bg backdrop-blur-lg rounded-xl shadow-lg border border-panel-border">
        <h2 className="text-3xl font-bold text-text-light mb-4">How It Works</h2>
        <p className="text-text-dark max-w-3xl mx-auto">
          Our platform leverages cutting-edge AI to analyze your inputs—from soil moisture readings captured by your hardware to images of your crops. It provides actionable insights across every stage of the production cycle, helping you make smarter, more sustainable farming decisions.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
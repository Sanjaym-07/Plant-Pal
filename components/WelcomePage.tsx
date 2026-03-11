import React from 'react';
import { WindyFieldAnimation } from './animations/WindyFieldAnimation';

interface WelcomePageProps {
  onEnter: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
          alt="Lush green field at sunrise"
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        />
        <WindyFieldAnimation />
        <div className="absolute inset-0 bg-slate-900/60"></div>
      </div>
      
      <div className="relative z-10 text-center p-8 space-y-8 animate-fade-in">
        <header>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
            PlantPal
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-text-dark">
            Smart Crop Manager
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl text-text-light italic">
                "Cultivating Intelligence, Harvesting Success."
            </p>
        </div>
        
        <button
          onClick={onEnter}
          className="px-8 py-4 bg-secondary text-slate-900 font-bold text-lg rounded-full hover:bg-opacity-80 transition-transform hover:scale-105 shadow-2xl shadow-secondary/20"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;

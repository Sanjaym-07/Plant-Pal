import React from 'react';
import type { ViewType } from '../App';
import { LogoIcon } from './icons/Icons';

interface NavbarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, isAuthenticated, onLogout, onLoginClick }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'crop', label: 'Crop Recommendation' },
    { id: 'plant', label: 'Your Plant' },
    { id: 'weather', label: 'Weather' },
    { id: 'fertilizer', label: 'Fertilizer' },
    { id: 'yield', label: 'Yield' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'pest', label: 'Pest Alert' },
    { id: 'hardware', label: 'Hardware' },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-slate-900/30 backdrop-blur-lg border-b border-panel-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
             <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-text-light hover:text-primary transition">
                <LogoIcon className="h-10 w-10 text-secondary" />
                <span className="text-xl font-bold">PlantPal</span>
             </button>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
                  currentView === item.id 
                    ? 'text-secondary bg-secondary/10' 
                    : 'text-text-light hover:text-secondary hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:block">
            {isAuthenticated ? (
                <button 
                  onClick={onLogout}
                  className="px-5 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-opacity-80 transition-transform hover:scale-105"
                >
                  Logout
                </button>
            ) : (
                <button 
                  onClick={onLoginClick}
                  className="px-5 py-2 bg-secondary text-slate-900 font-bold rounded-full hover:bg-opacity-80 transition-transform hover:scale-105"
                >
                  Login
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
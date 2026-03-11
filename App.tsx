import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CropRecommendation from './components/CropRecommendation';
import FertilizerManagement from './components/FertilizerManagement';
import PestAlert from './components/PestAlert';
import WeatherDashboard from './components/WeatherDashboard';
import YieldEstimation from './components/YieldEstimation';
import SustainabilityTracker from './components/SustainabilityTracker';
import WelcomePage from './components/WelcomePage';
import YourPlant from './components/YourPlant';
import LoginPage from './components/LoginPage';
import HardwareIntegration from './components/HardwareIntegration';

export type ViewType = 'home' | 'crop' | 'fertilizer' | 'pest' | 'weather' | 'yield' | 'sustainability' | 'plant' | 'hardware';

const BACKGROUND_IMAGES: Record<ViewType, string> = {
  home: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop',
  crop: 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=2787&auto=format&fit=crop',
  fertilizer: 'https://images.unsplash.com/photo-1573014316383-3670087e53a3?q=80&w=2874&auto=format&fit=crop',
  pest: 'https://images.unsplash.com/photo-1621038943519-218a53e2a222?q=80&w=2787&auto=format&fit=crop',
  weather: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2851&auto=format&fit=crop',
  yield: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2874&auto=format&fit=crop',
  sustainability: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2940&auto=format&fit=crop',
  plant: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2787&auto=format&fit=crop',
  hardware: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2940&auto=format&fit=crop',
};

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check for logged-in user in localStorage on initial load
    const loggedInUser = localStorage.getItem('plantpal-user');
    if (loggedInUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('plantpal-user');
    setIsAuthenticated(false);
    setCurrentView('home'); // Redirect to home on logout
  };


  if (showWelcome) {
    return <WelcomePage onEnter={() => setShowWelcome(false)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage setCurrentView={setCurrentView} />;
      case 'crop':
        return <CropRecommendation />;
      case 'fertilizer':
        return <FertilizerManagement />;
      case 'pest':
        return <PestAlert />;
      case 'weather':
        return <WeatherDashboard />;
      case 'yield':
        return <YieldEstimation />;
      case 'sustainability':
        return <SustainabilityTracker />;
      case 'plant':
        return <YourPlant />;
      case 'hardware':
        return <HardwareIntegration />;
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <>
      <div 
        className="min-h-screen w-full bg-cover bg-center bg-fixed transition-all duration-500" 
        style={{ backgroundImage: `url('${BACKGROUND_IMAGES[currentView]}')` }}
      >
        <div className="min-h-screen w-full bg-black/40">
          <Navbar 
            currentView={currentView} 
            setCurrentView={setCurrentView}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onLoginClick={() => setShowLogin(true)}
          />
          <main className="px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <div className="w-full max-w-7xl mx-auto animate-slide-in">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
      {showLogin && (
        <LoginPage 
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default App;
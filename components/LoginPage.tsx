import React, { useState } from 'react';
import { LoadingSpinner } from './icons/Icons';

interface LoginPageProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose, onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            try {
                const users = JSON.parse(localStorage.getItem('plantpal-users') || '[]');
                if (isLoginMode) {
                    const user = users.find((u: any) => u.email === email && u.password === password);
                    if (user) {
                        localStorage.setItem('plantpal-user', JSON.stringify({ email }));
                        onLoginSuccess();
                    } else {
                        setError('Invalid email or password.');
                    }
                } else { // Sign up mode
                    const existingUser = users.find((u: any) => u.email === email);
                    if (existingUser) {
                        setError('An account with this email already exists.');
                    } else {
                        users.push({ email, password });
                        localStorage.setItem('plantpal-users', JSON.stringify(users));
                        localStorage.setItem('plantpal-user', JSON.stringify({ email }));
                        onLoginSuccess();
                    }
                }
            } catch (err) {
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md p-8 bg-panel-bg rounded-2xl shadow-2xl border border-panel-border m-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-dark hover:text-text-light">&times;</button>
                <h2 className="text-3xl font-bold text-center text-primary mb-2">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-center text-text-dark mb-6">{isLoginMode ? 'Sign in to continue' : 'Join PlantPal today'}</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-slate-900/50 border border-panel-border rounded-md text-text-light focus:ring-primary focus:border-primary"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-slate-900/50 border border-panel-border rounded-md text-text-light focus:ring-primary focus:border-primary"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-secondary text-slate-900 font-semibold rounded-lg shadow-md hover:bg-opacity-80 disabled:bg-gray-500 transition"
                    >
                        {loading ? <LoadingSpinner /> : isLoginMode ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                
                <p className="text-center text-sm text-text-dark mt-6">
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }} className="font-semibold text-secondary hover:underline ml-1">
                        {isLoginMode ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

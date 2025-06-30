// pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { LogOut, User } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import AuthForm from '../components/AuthForm';
import ConfigurationManager from '../components/ConfigurationManager';
import { AuthProvider, useAuth } from '../lib/auth';
import { BusinessConfig, defaultConfig } from '../lib/config';

function MainApp() {
  const { user, logout, login, isAuthenticated } = useAuth();
  const [config, setConfig] = useState<BusinessConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // In productie zou dit uit Firebase komen
        const savedConfig = localStorage.getItem('repkot_config');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
        }
      } catch (err) {
        console.error('Error loading config:', err);
        setError('Could not load configuration, using defaults');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadConfig();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleConfigChange = async (newConfig: BusinessConfig) => {
    try {
      setConfig(newConfig);
      localStorage.setItem('repkot_config', JSON.stringify(newConfig));
      setError(null);
    } catch (err) {
      console.error('Failed to save config:', err);
      setError('Failed to save configuration changes.');
    }
  };

  const handleLogout = () => {
    logout();
    setShowConfig(false);
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={login} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">REPKOT Beheertool laden...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>REPKOT Beheertool - Professioneel Repetitieruimte Management</title>
        <meta name="description" content="Moderne beheertool voor REPKOT repetitieruimtes met real-time monitoring, boekingsbeheer en financiële rapportage." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Error notification */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User info bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              Ingelogd als: <strong>{user?.username}</strong> ({user?.role})
            </span>
            <span className="text-xs text-gray-500">
              Sinds: {user?.loginTime ? new Date(user.loginTime).toLocaleString('nl-BE') : 'Onbekend'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`text-sm px-3 py-1 rounded-md ${
                  showConfig 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {showConfig ? 'Dashboard' : 'Configuratie'}
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 px-3 py-1 rounded-md hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      {showConfig && user?.role === 'admin' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ConfigurationManager 
            config={config} 
            onConfigChange={handleConfigChange}
          />
        </div>
      ) : (
        <Dashboard 
          config={config} 
          onConfigChange={handleConfigChange}
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

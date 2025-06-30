// pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import { BusinessConfig, defaultConfig } from '../lib/config';
import FirebaseService from '../lib/firebase';

export default function Home() {
  const [config, setConfig] = useState<BusinessConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load configuration from Firebase on component mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const firebaseConfig = await FirebaseService.getConfig();
      setConfig(firebaseConfig);
    } catch (err) {
      console.error('Failed to load config:', err);
      setError('Failed to load configuration. Using default values.');
      // Continue with default config
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = async (newConfig: BusinessConfig) => {
    try {
      // Update local state immediately for responsiveness
      setConfig(newConfig);
      
      // Save to Firebase
      await FirebaseService.saveConfig(newConfig);
    } catch (err) {
      console.error('Failed to save config:', err);
      setError('Failed to save configuration changes.');
      
      // Revert local state if save failed
      loadConfig();
    }
  };

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

      <Dashboard 
        config={config} 
        onConfigChange={handleConfigChange}
      />
    </>
  );
}

// Optional: Export static props for better performance
export async function getStaticProps() {
  return {
    props: {
      // Add any static props here if needed
    },
    // Regenerate the page at most once per hour
    revalidate: 3600,
  };
}

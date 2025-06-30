// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Lock, 
  Target, 
  Clock,
  Settings,
  Calendar,
  DollarSign,
  Thermometer,
  KeyRound
} from 'lucide-react';
import { BusinessConfig, BusinessCalculator, defaultConfig } from '../lib/config';

interface DashboardProps {
  config?: BusinessConfig;
  onConfigChange?: (config: BusinessConfig) => void;
}

export default function Dashboard({ config = defaultConfig, onConfigChange }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calculator] = useState(new BusinessCalculator(config));

  // Simuleer huidige data
  const [currentData] = useState({
    monthlyRevenue: 2080,
    occupancyRate: 25,
    activeLockers: 5,
    breakEvenPercentage: 149
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scenarios = [
    calculator.calculateScenario(70, 75),
    calculator.calculateScenario(80, 85), 
    calculator.calculateScenario(90, 95)
  ];

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'blue' 
  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    color?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </div>
  );

  const ConfigPanel = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Bedrijfsconfiguratie</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Studio Tarieven</h4>
            <div className="space-y-3">
              {config.studios.map((studio, index) => (
                <div key={studio.id} className="flex items-center gap-3">
                  <span className="w-20 text-sm">{studio.name}</span>
                  <input 
                    type="number" 
                    value={studio.hourlyRate}
                    onChange={(e) => {
                      const newConfig = { ...config };
                      newConfig.studios[index].hourlyRate = Number(e.target.value);
                      onConfigChange?.(newConfig);
                    }}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                  <span className="text-sm text-gray-500">€/uur</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Operationele Kosten</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Huur:</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={config.operationalCosts.rent}
                    onChange={(e) => {
                      const newConfig = { ...config };
                      newConfig.operationalCosts.rent = Number(e.target.value);
                      onConfigChange?.(newConfig);
                    }}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                  <span className="text-sm">€/mnd</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">€{calculator.getTotalMonthlyCosts()}</p>
              <p className="text-sm text-gray-500">Totale kosten/mnd</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">€{calculator.getMaxMonthlyRevenue()}</p>
              <p className="text-sm text-gray-500">Max omzet/mnd</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">{calculator.calculateBreakEvenOccupancy().toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Break-even bezetting</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Scenario Analyse</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">{scenario.occupancyRate}% Bezetting</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Omzet:</span>
                  <span className="font-medium">€{Math.round(scenario.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Winst:</span>
                  <span className={`font-medium ${scenario.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{Math.round(scenario.profit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Per partner:</span>
                  <span className="font-medium">€{Math.round(scenario.profitPerPartner)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                title="Maand Omzet"
                value={`€${currentData.monthlyRevenue}`}
                subtitle={`Doel: €${config.breakEven.targetMonthlyRevenue} (break-even)`}
                icon={DollarSign}
                color="green"
              />
              <MetricCard
                title="Bezetting"
                value={`${currentData.occupancyRate}%`}
                subtitle="52/208 dagdelen dit maand"
                icon={TrendingUp}
                color="blue"
              />
              <MetricCard
                title="Actieve Lockers"
                value={`${currentData.activeLockers}/${config.lockers.totalCount}`}
                subtitle={`€${currentData.activeLockers * config.lockers.monthlyRate}/maand`}
                icon={Lock}
                color="purple"
              />
              <MetricCard
                title="Break-even Status"
                value={`${currentData.breakEvenPercentage}%`}
                subtitle="35 dagdelen nodig/behaald"
                icon={Target}
                color="orange"
              />
              <MetricCard
                title="Huidige Tijd"
                value={currentTime.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })}
                subtitle="Live monitoring"
                icon={Clock}
                color="gray"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold">🎉 Deployment Gelukt!</h3>
              <p className="text-blue-700 text-sm mt-1">
                Je REPKOT beheertool draait nu live! Firebase integratie wordt binnenkort toegevoegd.
              </p>
            </div>
          </div>
        );
      case 'config':
        return <ConfigPanel />;
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">{activeTab} - Binnenkort beschikbaar</h3>
            <p className="text-gray-600">Deze functionaliteit wordt binnenkort toegevoegd.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                R
              </div>
              <h1 className="text-xl font-bold text-gray-900">REPKOT Beheertool</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Partner Dashboard</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                👥
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'config', label: 'Configuratie', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
}

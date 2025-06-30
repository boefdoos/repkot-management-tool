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
  KeyRound,
  CreditCard,
  Wrench
} from 'lucide-react';
import { BusinessConfig, BusinessCalculator, defaultConfig } from '../lib/config';
import SubscriptionManager from './SubscriptionManager';
import BookingManager from './BookingManager';
import LockerManager from './LockerManager';

interface DashboardProps {
  config?: BusinessConfig;
  onConfigChange?: (config: BusinessConfig) => void;
}

export default function Dashboard({ config = defaultConfig, onConfigChange }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calculator] = useState(new BusinessCalculator(config));

  // Simuleer huidige data - later uit Firebase
  const [currentData] = useState({
    monthlyRevenue: 2080,
    occupancyRate: 25,
    activeLockers: 5,
    breakEvenPercentage: 149,
    subscriptionRevenue: 1600,
    hourlyRevenue: 480
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

  const StudioStatus = ({ studio, isOccupied, currentUser, nextBooking, temperature }: {
    studio: any;
    isOccupied: boolean;
    currentUser?: string;
    nextBooking?: string;
    temperature: number;
  }) => (
    <div className={`p-4 rounded-lg border ${isOccupied ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{studio.name}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {isOccupied ? 'Bezet' : 'Vrij'}
        </span>
      </div>
      <p className="text-sm text-gray-600">{studio.size}m² • €{studio.hourlyRate}/uur</p>
      {currentUser && (
        <p className="text-sm font-medium text-blue-600 mt-1">👥 {currentUser}</p>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Thermometer className="w-4 h-4" />
          {temperature}°C
        </span>
        <span className="text-sm text-gray-500">{nextBooking || 'Geen boekingen'}</span>
      </div>
    </div>
  );

  const AccessCodeManager = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5" />
          Toegangscodes Beheer
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Actieve Codes</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">The Foxes</p>
                  <p className="text-sm text-gray-500">13:00-15:00 - Studio A</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold">4721</p>
                  <button className="text-red-600 text-sm hover:underline">Deactiveer</button>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">DJ Mike</p>
                  <p className="text-sm text-gray-500">14:00-17:00 - Studio C</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold">8394</p>
                  <button className="text-red-600 text-sm hover:underline">Deactiveer</button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Nieuwe Code Genereren</h4>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Klant naam" 
                className="form-input"
              />
              <input 
                type="datetime-local" 
                className="form-input"
              />
              <select className="form-input">
                <option>Studio A</option>
                <option>Studio B</option>
                <option>Studio C</option>
                <option>Alle Studios</option>
              </select>
              <button className="btn btn-primary w-full">
                Genereer Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Beveiligingsstatus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Camera Status</h4>
            <div className="space-y-2">
              {['Ingang', 'Gemeenschappelijke ruimte', 'Gang'].map((location, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{location}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Online
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Recente Activiteit</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>13:45 - Toegang Studio A</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>14:02 - Toegang Studio C</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>12:30 - Ongeautoriseerde poging</span>
                <span className="text-red-600">⚠</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ClimateControl = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Klimaatbeheersing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.studios.map((studio, index) => {
            const temperatures = [21, 19, 22];
            const statuses = ['Actief', 'Standby', 'Actief'];
            return (
              <div key={studio.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{studio.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    statuses[index] === 'Actief' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {statuses[index]}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Temperatuur</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="16" 
                        max="25" 
                        value={temperatures[index]}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="font-mono text-lg w-12">{temperatures[index]}°C</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn btn-secondary text-sm">Verwarming</button>
                    <button className="btn btn-secondary text-sm">Koeling</button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Luchtvochtigheid: {52 + index}%</p>
                    <p>Ventilatie: {['Normaal', 'Laag', 'Hoog'][index]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy Management */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Energiebeheer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Huidig Verbruik</h4>
            <div className="text-3xl font-bold text-blue-600 mb-2">3.2 kW</div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Verwarming:</span>
                <span>1.8 kW</span>
              </div>
              <div className="flex justify-between">
                <span>Ventilatie:</span>
                <span>0.8 kW</span>
              </div>
              <div className="flex justify-between">
                <span>Verlichting:</span>
                <span>0.6 kW</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Maand Overzicht</h4>
            <div className="text-3xl font-bold text-green-600 mb-2">€187</div>
            <div className="text-sm text-gray-600">
              <p>Budget: €200/maand</p>
              <p className="text-green-600">€13 onder budget</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '93.5%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FinancialDashboard = () => (
    <div className="space-y-6">
      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Totale Omzet"
          value={`€${currentData.monthlyRevenue}`}
          subtitle={`+${Math.round(((currentData.monthlyRevenue / config.breakEven.targetMonthlyRevenue) - 1) * 100)}% vs target`}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Abonnement Omzet"
          value={`€${currentData.subscriptionRevenue}`}
          subtitle={`${Math.round((currentData.subscriptionRevenue / currentData.monthlyRevenue) * 100)}% van totaal`}
          icon={CreditCard}
          color="blue"
        />
        <MetricCard
          title="Losse Verhuur"
          value={`€${currentData.hourlyRevenue}`}
          subtitle={`${Math.round((currentData.hourlyRevenue / currentData.monthlyRevenue) * 100)}% van totaal`}
          icon={Clock}
          color="purple"
        />
        <MetricCard
          title="Locker Omzet"
          value={`€${currentData.activeLockers * config.lockers.monthlyRate}`}
          subtitle={`${Math.round(((currentData.activeLockers * config.lockers.monthlyRate) / currentData.monthlyRevenue) * 100)}% van totaal`}
          icon={Lock}
          color="orange"
        />
      </div>

      {/* Financial Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Financiële Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Omzet Breakdown</h4>
            <div className="space-y-2">
              {config.studios.map((studio, index) => {
                const revenues = [820, 720, 600]; // Simulatie
                return (
                  <div key={studio.id} className="flex justify-between items-center p-2 border rounded">
                    <span>{studio.name} ({studio.size}m²)</span>
                    <span className="font-semibold">€{revenues[index]}</span>
                  </div>
                );
              })}
              <div className="flex justify-between items-center p-2 border rounded font-semibold bg-blue-50">
                <span>Totaal Studios</span>
                <span>€{1540}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Kostenstructuur</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 border rounded">
                <span>Operationele kosten</span>
                <span className="font-semibold">€{calculator.getTotalMonthlyCosts()}</span>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span>Netto winst</span>
                <span className={`font-semibold ${
                  currentData.monthlyRevenue - calculator.getTotalMonthlyCosts() > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  €{currentData.monthlyRevenue - calculator.getTotalMonthlyCosts()}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 border rounded bg-green-50">
                <span>Per partner</span>
                <span className="font-semibold text-green-600">
                  €{Math.round((currentData.monthlyRevenue - calculator.getTotalMonthlyCosts()) / 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Analysis */}
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

  const MaintenancePanel = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Onderhoud & Monitoring
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Geplande Taken</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Filter ventilatie vervangen</p>
                  <p className="text-sm text-gray-500">Vervaldatum: 15 juli 2025</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Binnenkort
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Akoestische panelen controle</p>
                  <p className="text-sm text-gray-500">Vervaldatum: 1 augustus 2025</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Gepland
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Recente Problemen</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Studio B - Thermostaat error</p>
                  <p className="text-sm text-gray-500">Gerapporteerd: 25 juni 2025</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Open
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Locker 4 - Slot klemming</p>
                  <p className="text-sm text-gray-500">Opgelost: 22 juni 2025</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  Opgelost
                </span>
              </div>
            </div>
            <button className="btn btn-primary mt-3 w-full">
              Nieuw Probleem Melden
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Noodcontacten</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold">Partner 1 (Technisch)</h4>
            <p className="text-sm text-gray-600 mb-2">Primair contact voor technische problemen</p>
            <div className="space-y-1">
              <a href="tel:+32123456789" className="flex items-center gap-2 text-blue-600 text-sm">
                📞 +32 123 45 67 89
              </a>
              <a href="mailto:partner1@repkot.be" className="flex items-center gap-2 text-blue-600 text-sm">
                📧 partner1@repkot.be
              </a>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold">Partner 2 (Zakelijk)</h4>
            <p className="text-sm text-gray-600 mb-2">Primair contact voor klanten/administratie</p>
            <div className="space-y-1">
              <a href="tel:+32987654321" className="flex items-center gap-2 text-blue-600 text-sm">
                📞 +32 98 76 54 321
              </a>
              <a href="mailto:partner2@repkot.be" className="flex items-center gap-2 text-blue-600 text-sm">
                📧 partner2@repkot.be
              </a>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold">Externe Diensten</h4>
            <p className="text-sm text-gray-600 mb-2">Voor urgente technische problemen</p>
            <div className="space-y-1 text-sm">
              <div><strong>Elektricien:</strong> +32 111 22 33 44</div>
              <div><strong>Verwarming:</strong> +32 555 66 77 88</div>
              <div><strong>Beveiliging:</strong> +32 999 88 77 66</div>
            </div>
          </div>
        </div>
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
                      newConfig.studios[index].dayRate = Number(e.target.value) * 4;
                      newConfig.studios[index].monthlyRate = Number(e.target.value) * 40;
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
              <div className="flex justify-between">
                <span className="text-sm">Utilities:</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={config.operationalCosts.utilities}
                    onChange={(e) => {
                      const newConfig = { ...config };
                      newConfig.operationalCosts.utilities = Number(e.target.value);
                      onConfigChange?.(newConfig);
                    }}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                  <span className="text-sm">€/mnd</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Locker prijs:</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={config.lockers.monthlyRate}
                    onChange={(e) => {
                      const newConfig = { ...config };
                      newConfig.lockers.monthlyRate = Number(e.target.value);
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
              <p className="text-lg font-bold text-blue-600">€{Math.round(calculator.getMaxMonthlyRevenue())}</p>
              <p className="text-sm text-gray-500">Max omzet/mnd</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">{calculator.calculateBreakEvenOccupancy().toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Break-even bezetting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Analysis in Config */}
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

            {/* Studio Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Studio Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StudioStatus 
                  studio={config.studios[0]} 
                  isOccupied={true}
                  currentUser="The Foxes"
                  nextBooking="Volgende: 14:00"
                  temperature={21}
                />
                <StudioStatus 
                  studio={config.studios[1]} 
                  isOccupied={false}
                  nextBooking="Volgende: 16:00"
                  temperature={19}
                />
                <StudioStatus 
                  studio={config.studios[2]} 
                  isOccupied={true}
                  currentUser="DJ Mike"
                  nextBooking="Volgende: 15:30"
                  temperature={22}
                />
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold">🎉 REPKOT Beheertool is Live!</h3>
              <p className="text-blue-700 text-sm mt-1">
                Alle functionaliteiten zijn toegevoegd: Abonnementenbeheer, Boekingssysteem, Lockerbeheer, Financiële rapportage, Klimaatbeheersing en Toegangscodes.
              </p>
            </div>
          </div>
        );
      case 'subscriptions':
        return <SubscriptionManager config={config} />;
      case 'bookings':
        return <BookingManager config={config} />;
      case 'access':
        return <AccessCodeManager />;
      case 'climate':
        return <ClimateControl />;
      case 'lockers':
        return <LockerManager config={config} />;
      case 'finance':
        return <FinancialDashboard />;
      case 'maintenance':
        return <MaintenancePanel />;
      case 'config':
        return <ConfigPanel />;
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">{activeTab} - In ontwikkeling</h3>
            <p className="text-gray-600">Deze functionaliteit wordt verder ontwikkeld.</p>
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
              { id: 'subscriptions', label: 'Abonnementen', icon: CreditCard },
              { id: 'bookings', label: 'Losse Boekingen', icon: Calendar },
              { id: 'access', label: 'Toegang', icon: KeyRound },
              { id: 'climate', label: 'Klimaat', icon: Thermometer },
              { id: 'lockers', label: 'Lockers', icon: Lock },
              { id: 'finance', label: 'Financieel', icon: DollarSign },
              { id: 'maintenance', label: 'Onderhoud', icon: Wrench },
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

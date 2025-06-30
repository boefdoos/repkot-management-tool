// components/ConfigurationManager.tsx
import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3,
  DollarSign,
  Building,
  Users,
  Lock,
  Mail,
  Shield,
  Calculator,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { BusinessConfig, defaultConfig } from '../lib/config';

interface ConfigurationManagerProps {
  config: BusinessConfig;
  onConfigChange: (config: BusinessConfig) => void;
}

interface ConfigSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

export default function ConfigurationManager({ config, onConfigChange }: ConfigurationManagerProps) {
  const [activeSection, setActiveSection] = useState('studios');
  const [localConfig, setLocalConfig] = useState<BusinessConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Studio management
  const [editingStudio, setEditingStudio] = useState<string | null>(null);
  const [newStudio, setNewStudio] = useState({
    name: '',
    size: 20,
    hourlyRate: 10,
    maxCapacity: 6
  });

  const configSections: ConfigSection[] = [
    { id: 'studios', title: 'Studio Management', icon: Building, description: 'Beheer studios, tarieven en capaciteit' },
    { id: 'costs', title: 'Operationele Kosten', icon: DollarSign, description: 'Maandelijkse kosten en uitgaven' },
    { id: 'lockers', title: 'Locker Configuratie', icon: Lock, description: 'Locker instellingen en prijzen' },
    { id: 'business', title: 'Business Parameters', icon: Calculator, description: 'Break-even, kortingen en targets' },
    { id: 'notifications', title: 'Notificaties', icon: Mail, description: 'Email templates en meldingen' },
    { id: 'security', title: 'Beveiliging & Toegang', icon: Shield, description: 'Toegangscontrole en beveiliging' },
    { id: 'system', title: 'Systeem Instellingen', icon: Settings, description: 'Algemene systeem configuratie' }
  ];

  const updateLocalConfig = (updates: Partial<BusinessConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const saveConfiguration = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onConfigChange(localConfig);
      setHasChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const resetToDefaults = () => {
    setLocalConfig(defaultConfig);
    setHasChanges(true);
    setShowConfirmReset(false);
  };

  const exportConfiguration = () => {
    const dataStr = JSON.stringify(localConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `repkot-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setLocalConfig(importedConfig);
          setHasChanges(true);
          alert('Configuratie succesvol geïmporteerd!');
        } catch (error) {
          alert('Fout bij importeren: Ongeldig JSON bestand');
        }
      };
      reader.readAsText(file);
    }
  };

  // Studio Management Functions
  const addStudio = () => {
    if (!newStudio.name.trim()) {
      alert('Voer een studio naam in');
      return;
    }

    const studio = {
      id: `studio-${newStudio.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: newStudio.name,
      size: newStudio.size,
      hourlyRate: newStudio.hourlyRate,
      dayRate: newStudio.hourlyRate * 4,
      monthlyRate: newStudio.hourlyRate * 16,
      maxCapacity: newStudio.maxCapacity
    };

    updateLocalConfig({
      studios: [...localConfig.studios, studio]
    });

    setNewStudio({ name: '', size: 20, hourlyRate: 10, maxCapacity: 6 });
  };

  const updateStudio = (studioId: string, updates: any) => {
    const updatedStudios = localConfig.studios.map(studio => {
      if (studio.id === studioId) {
        const updatedStudio = { ...studio, ...updates };
        // Auto-calculate derived rates
        if (updates.hourlyRate) {
          updatedStudio.dayRate = updates.hourlyRate * 4;
          updatedStudio.monthlyRate = updates.hourlyRate * 16;
        }
        return updatedStudio;
      }
      return studio;
    });

    updateLocalConfig({ studios: updatedStudios });
  };

  const removeStudio = (studioId: string) => {
    if (localConfig.studios.length <= 1) {
      alert('Er moet minimaal één studio blijven');
      return;
    }

    updateLocalConfig({
      studios: localConfig.studios.filter(studio => studio.id !== studioId)
    });
  };

  // Render Functions
  const renderStudioManagement = () => (
    <div className="space-y-6">
      {/* Studio List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Bestaande Studios</h3>
        <div className="space-y-4">
          {localConfig.studios.map(studio => (
            <div key={studio.id} className="border rounded-lg p-4">
              {editingStudio === studio.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                      <input
                        type="text"
                        value={studio.name}
                        onChange={(e) => updateStudio(studio.id, { name: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grootte (m²)</label>
                      <input
                        type="number"
                        value={studio.size}
                        onChange={(e) => updateStudio(studio.id, { size: Number(e.target.value) })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uur Tarief (€)</label>
                      <input
                        type="number"
                        value={studio.hourlyRate}
                        onChange={(e) => updateStudio(studio.id, { hourlyRate: Number(e.target.value) })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Capaciteit</label>
                      <input
                        type="number"
                        value={studio.maxCapacity}
                        onChange={(e) => updateStudio(studio.id, { maxCapacity: Number(e.target.value) })}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingStudio(null)}
                      className="btn btn-primary text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Opslaan
                    </button>
                    <button
                      onClick={() => setEditingStudio(null)}
                      className="btn btn-secondary text-sm"
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{studio.name}</h4>
                    <p className="text-sm text-gray-600">
                      {studio.size}m² • €{studio.hourlyRate}/uur • €{studio.dayRate}/dagdeel • €{studio.monthlyRate}/maand
                    </p>
                    <p className="text-xs text-gray-500">Max. {studio.maxCapacity} personen</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingStudio(studio.id)}
                      className="btn btn-secondary text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Bewerken
                    </button>
                    <button
                      onClick={() => removeStudio(studio.id)}
                      className="btn text-sm bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                      Verwijderen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Studio */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Nieuwe Studio Toevoegen</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Studio Naam</label>
            <input
              type="text"
              value={newStudio.name}
              onChange={(e) => setNewStudio(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              placeholder="Bijv. Studio D"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grootte (m²)</label>
            <input
              type="number"
              value={newStudio.size}
              onChange={(e) => setNewStudio(prev => ({ ...prev, size: Number(e.target.value) }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uur Tarief (€)</label>
            <input
              type="number"
              value={newStudio.hourlyRate}
              onChange={(e) => setNewStudio(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Capaciteit</label>
            <input
              type="number"
              value={newStudio.maxCapacity}
              onChange={(e) => setNewStudio(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
              className="form-input"
            />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={addStudio} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Studio Toevoegen
          </button>
        </div>

        {/* Rate Preview */}
        {newStudio.hourlyRate > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Tarief Preview</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Dagdeel (4u):</span>
                <span className="font-semibold ml-2">€{newStudio.hourlyRate * 4}</span>
              </div>
              <div>
                <span className="text-gray-600">Maandabo (16u):</span>
                <span className="font-semibold ml-2">€{newStudio.hourlyRate * 16}</span>
              </div>
              <div>
                <span className="text-gray-600">Per m²/uur:</span>
                <span className="font-semibold ml-2">€{(newStudio.hourlyRate / newStudio.size).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOperationalCosts = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Maandelijkse Operationele Kosten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(localConfig.operationalCosts).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <label className="font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <p className="text-xs text-gray-500">
                  {getOperationalCostDescription(key)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">€</span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const newCosts = { ...localConfig.operationalCosts };
                    newCosts[key as keyof typeof newCosts] = Number(e.target.value);
                    updateLocalConfig({ operationalCosts: newCosts });
                  }}
                  className="w-20 px-2 py-1 border rounded text-right"
                />
                <span className="text-gray-500 text-sm">/mnd</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-600">
                €{Object.values(localConfig.operationalCosts).reduce((sum, cost) => sum + cost, 0)}
              </p>
              <p className="text-sm text-gray-500">Totale Kosten/mnd</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                €{Math.round(localConfig.studios.reduce((sum, studio) => sum + (studio.hourlyRate * 30 * 8), 0))}
              </p>
              <p className="text-sm text-gray-500">Max Omzet/mnd</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round((Object.values(localConfig.operationalCosts).reduce((sum, cost) => sum + cost, 0) / localConfig.studios.reduce((sum, studio) => sum + (studio.hourlyRate * 30 * 8), 0)) * 100)}%
              </p>
              <p className="text-sm text-gray-500">Break-even bezetting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLockerConfiguration = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Locker Instellingen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Basis Configuratie</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aantal Lockers</label>
                <input
                  type="number"
                  value={localConfig.lockers.totalCount}
                  onChange={(e) => updateLocalConfig({
                    lockers: { ...localConfig.lockers, totalCount: Number(e.target.value) }
                  })}
                  className="form-input"
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maandprijs (€)</label>
                <input
                  type="number"
                  value={localConfig.lockers.monthlyRate}
                  onChange={(e) => updateLocalConfig({
                    lockers: { ...localConfig.lockers, monthlyRate: Number(e.target.value) }
                  })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Afmetingen (cm)</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breedte</label>
                <input
                  type="number"
                  value={localConfig.lockers.dimensions.width}
                  onChange={(e) => updateLocalConfig({
                    lockers: {
                      ...localConfig.lockers,
                      dimensions: { ...localConfig.lockers.dimensions, width: Number(e.target.value) }
                    }
                  })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hoogte</label>
                <input
                  type="number"
                  value={localConfig.lockers.dimensions.height}
                  onChange={(e) => updateLocalConfig({
                    lockers: {
                      ...localConfig.lockers,
                      dimensions: { ...localConfig.lockers.dimensions, height: Number(e.target.value) }
                    }
                  })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diepte</label>
                <input
                  type="number"
                  value={localConfig.lockers.dimensions.depth}
                  onChange={(e) => updateLocalConfig({
                    lockers: {
                      ...localConfig.lockers,
                      dimensions: { ...localConfig.lockers.dimensions, depth: Number(e.target.value) }
                    }
                  })}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Locker Revenue Projection</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">100% bezetting:</span>
              <span className="font-semibold ml-2">€{localConfig.lockers.totalCount * localConfig.lockers.monthlyRate}/mnd</span>
            </div>
            <div>
              <span className="text-gray-600">75% bezetting:</span>
              <span className="font-semibold ml-2">€{Math.round(localConfig.lockers.totalCount * localConfig.lockers.monthlyRate * 0.75)}/mnd</span>
            </div>
            <div>
              <span className="text-gray-600">Volume per locker:</span>
              <span className="font-semibold ml-2">
                {Math.round((localConfig.lockers.dimensions.width * localConfig.lockers.dimensions.height * localConfig.lockers.dimensions.depth) / 1000000 * 100) / 100}m³
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessParameters = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Business Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Break-even & Targets</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Maandelijkse Omzet (€)</label>
                <input
                  type="number"
                  value={localConfig.breakEven.targetMonthlyRevenue}
                  onChange={(e) => updateLocalConfig({
                    breakEven: { ...localConfig.breakEven, targetMonthlyRevenue: Number(e.target.value) }
                  })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Bezettingsgraad (%)</label>
                <input
                  type="number"
                  value={localConfig.breakEven.minimumOccupancyRate}
                  onChange={(e) => updateLocalConfig({
                    breakEven: { ...localConfig.breakEven, minimumOccupancyRate: Number(e.target.value) }
                  })}
                  className="form-input"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Kortingen & Prijsbeleid</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Studentenkorting (%)</label>
                <input
                  type="number"
                  value={localConfig.discounts.student}
                  onChange={(e) => updateLocalConfig({
                    discounts: { ...localConfig.discounts, student: Number(e.target.value) }
                  })}
                  className="form-input"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulk/Jaarkorting (%)</label>
                <input
                  type="number"
                  value={localConfig.discounts.bulk}
                  onChange={(e) => updateLocalConfig({
                    discounts: { ...localConfig.discounts, bulk: Number(e.target.value) }
                  })}
                  className="form-input"
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-3">Partnerschap</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aantal Partners</label>
              <input
                type="number"
                value={localConfig.partners.count}
                onChange={(e) => updateLocalConfig({
                  partners: { ...localConfig.partners, count: Number(e.target.value) }
                })}
                className="form-input"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Winstverdeling per partner (%)</label>
              <input
                type="number"
                value={localConfig.partners.profitSplitPercentage}
                onChange={(e) => updateLocalConfig({
                  partners: { ...localConfig.partners, profitSplitPercentage: Number(e.target.value) }
                })}
                className="form-input"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Import/Export Configuratie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Export Configuratie</h4>
            <p className="text-sm text-gray-600 mb-4">
              Download de huidige configuratie als JSON bestand voor backup of migratie.
            </p>
            <button onClick={exportConfiguration} className="btn btn-primary">
              <Download className="w-4 h-4" />
              Export Configuratie
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3">Import Configuratie</h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload een configuratie bestand om alle instellingen te vervangen.
            </p>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={importConfiguration}
                className="hidden"
                id="config-import"
              />
              <label htmlFor="config-import" className="btn btn-secondary cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Configuratie
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Reset naar Standaardwaarden</h3>
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
          <div className="flex-1">
            <p className="text-gray-700 mb-4">
              Dit zal alle huidige instellingen overschrijven met de standaardwaarden. 
              Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="btn bg-red-600 text-white"
            >
              <RotateCcw className="w-4 h-4" />
              Reset naar Standaard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const getOperationalCostDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      rent: 'Maandelijkse huur van de ruimte',
      utilities: 'Gas, water, elektriciteit',
      insurance: 'Bedrijfs- en aansprakelijkheidsverzekering',
      maintenance: 'Onderhoud en reparaties',
      administration: 'Boekhouding en administratie',
      marketing: 'Reclame en promotie',
      bookingSystem: 'Software licenties',
      security: 'Alarm en camerasysteem',
      access: 'Toegangscontrole systeem',
      cleaning: 'Schoonmaak en hygiëne',
      copyrightFees: 'SABAM en auteursrechten',
      waste: 'Afvalverwerking',
      reserves: 'Reservefonds voor onvoorzien',
      miscellaneous: 'Overige uitgaven'
    };
    return descriptions[key] || 'Geen beschrijving beschikbaar';
  };

  const renderTabContent = () => {
    switch (activeSection) {
      case 'studios':
        return renderStudioManagement();
      case 'costs':
        return renderOperationalCosts();
      case 'lockers':
        return renderLockerConfiguration();
      case 'business':
        return renderBusinessParameters();
      case 'system':
        return renderSystemSettings();
      case 'notifications':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Notificatie Instellingen</h3>
            <p className="text-gray-600">Email templates en notificatie instellingen komen binnenkort beschikbaar.</p>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Beveiliging & Toegang</h3>
            <p className="text-gray-600">Toegangscontrole en beveiligingsinstellingen komen binnenkort beschikbaar.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Save Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">REPKOT Configuratie</h2>
            <p className="text-gray-600 text-sm mt-1">Beheer alle systeem instellingen en bedrijfsparameters</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-orange-600 text-sm font-medium">Niet opgeslagen wijzigingen</span>
            )}
            <button
              onClick={saveConfiguration}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`btn ${hasChanges ? 'btn-primary' : 'btn-secondary'}`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Opslaan...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Opgeslagen
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Configuratie Opslaan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {configSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Description */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <p className="text-sm text-gray-600">
            {configSections.find(s => s.id === activeSection)?.description}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Bevestig Reset</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Weet je zeker dat je alle instellingen wilt resetten naar de standaardwaarden? 
              Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetToDefaults}
                className="btn bg-red-600 text-white"
              >
                Ja, Reset Alles
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="btn btn-secondary"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

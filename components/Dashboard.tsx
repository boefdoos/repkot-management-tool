// components/Dashboard.tsx - Volledig herschreven versie
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
  Wrench,
  BarChart3,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { BusinessConfig, BusinessCalculator, defaultConfig } from '../lib/config';

// Type definitions
interface MaintenanceIssue {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved';
  reportedDate: string;
  resolvedDate?: string;
  reportedBy: string;
}

interface AccessCode {
  id: string;
  code: string;
  customer: string;
  studio: string;
  timeSlot: string;
  validUntil: string;
}

interface NewCodeForm {
  customerName: string;
  dateTime: string;
  studioId: string;
}

interface MaintenanceForm {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  category: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface DashboardProps {
  config?: BusinessConfig;
  onConfigChange?: (config: BusinessConfig) => void;
}

export default function Dashboard({ config = defaultConfig, onConfigChange }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [calculator] = useState(new BusinessCalculator(config));

  // Climate control state
  const [studioTemperatures, setStudioTemperatures] = useState<number[]>([21, 19, 22]);
  const [studioStatuses, setStudioStatuses] = useState<string[]>(['Actief', 'Standby', 'Actief']);

  // Maintenance state
  const [showMaintenanceForm, setShowMaintenanceForm] = useState<boolean>(false);
  const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceForm>({
    title: '',
    description: '',
    priority: 'medium',
    location: '',
    category: 'technical'
  });
  const [maintenanceErrors, setMaintenanceErrors] = useState<FormErrors>({});
  const [isSubmittingMaintenance, setIsSubmittingMaintenance] = useState<boolean>(false);

  const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>([
    {
      id: 'maint-001',
      title: 'Studio B - Thermostaat error',
      description: 'Thermostaat reageert niet op temperatuurwijzigingen',
      priority: 'high',
      location: 'studio-b',
      category: 'climate',
      status: 'open',
      reportedDate: '2025-06-25',
      reportedBy: 'Partner 1'
    },
    {
      id: 'maint-002', 
      title: 'Locker 4 - Slot klemming',
      description: 'Slot van locker 4 klemt bij openen',
      priority: 'medium',
      location: 'lockers',
      category: 'equipment',
      status: 'resolved',
      reportedDate: '2025-06-22',
      resolvedDate: '2025-06-22',
      reportedBy: 'Partner 2'
    }
  ]);

  // Access codes state
  const [activeCodes, setActiveCodes] = useState<AccessCode[]>([
    { id: 'code-001', code: '4721', customer: 'The Foxes', studio: 'Studio A', timeSlot: '13:00-15:00', validUntil: '2025-07-01' },
    { id: 'code-002', code: '8394', customer: 'DJ Mike', studio: 'Studio C', timeSlot: '14:00-17:00', validUntil: '2025-07-01' }
  ]);

  const [newCodeForm, setNewCodeForm] = useState<NewCodeForm>({
    customerName: '',
    dateTime: '',
    studioId: ''
  });

  const [codeFormErrors, setCodeFormErrors] = useState<FormErrors>({});

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

  // Form options
  const priorityOptions = [
    { value: 'low', label: 'Laag - Kan wachten', color: 'blue' },
    { value: 'medium', label: 'Gemiddeld - Binnen week', color: 'yellow' },
    { value: 'high', label: 'Hoog - Binnen 24u', color: 'orange' },
    { value: 'urgent', label: 'Urgent - Direct actie', color: 'red' }
  ];

  const locationOptions = [
    { value: 'studio-a', label: 'Studio A (20m²)' },
    { value: 'studio-b', label: 'Studio B (20m²)' },
    { value: 'studio-c', label: 'Studio C (15m²)' },
    { value: 'common', label: 'Gemeenschappelijke ruimte' },
    { value: 'lockers', label: 'Locker gebied' },
    { value: 'entrance', label: 'Ingang/Toegang' },
    { value: 'technical', label: 'Technische ruimte' },
    { value: 'exterior', label: 'Buitenkant gebouw' },
    { value: 'parking', label: 'Parkeerplaats' }
  ];

  const categoryOptions = [
    { value: 'technical', label: 'Technisch (elektra, verwarming, etc.)' },
    { value: 'acoustic', label: 'Akoestiek (geluidsisolatie, etc.)' },
    { value: 'security', label: 'Beveiliging (cameras, toegang, etc.)' },
    { value: 'structural', label: 'Bouw/Structuur (muren, vloeren, etc.)' },
    { value: 'climate', label: 'Klimaat (ventilatie, temperatuur, etc.)' },
    { value: 'cleaning', label: 'Reiniging/Hygiëne' },
    { value: 'equipment', label: 'Apparatuur (lockers, deuren, etc.)' },
    { value: 'other', label: 'Overig' }
  ];

  // Form handlers
  const handleMaintenanceInputChange = (field: keyof MaintenanceForm, value: string) => {
    setMaintenanceForm(prev => ({ ...prev, [field]: value }));
    if (maintenanceErrors[field]) {
      setMaintenanceErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCodeInputChange = (field: keyof NewCodeForm, value: string) => {
    setNewCodeForm(prev => ({ ...prev, [field]: value }));
    if (codeFormErrors[field]) {
      setCodeFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateMaintenanceForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!maintenanceForm.title.trim()) {
      errors.title = 'Titel is verplicht';
    } else if (maintenanceForm.title.trim().length < 5) {
      errors.title = 'Titel moet minimaal 5 karakters bevatten';
    }

    if (!maintenanceForm.location) {
      errors.location = 'Locatie selectie is verplicht';
    }

    if (!maintenanceForm.description.trim()) {
      errors.description = 'Beschrijving is verplicht';
    } else if (maintenanceForm.description.trim().length < 10) {
      errors.description = 'Beschrijving moet minimaal 10 karakters bevatten';
    }

    setMaintenanceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCodeForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!newCodeForm.customerName.trim()) {
      errors.customerName = 'Klant naam is verplicht';
    }

    if (!newCodeForm.dateTime) {
      errors.dateTime = 'Datum en tijd zijn verplicht';
    }

    if (!newCodeForm.studioId) {
      errors.studioId = 'Studio selectie is verplicht';
    }

    setCodeFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetMaintenanceForm = () => {
    setMaintenanceForm({
      title: '',
      description: '',
      priority: 'medium',
      location: '',
      category: 'technical'
    });
    setMaintenanceErrors({});
  };

  const resetCodeForm = () => {
    setNewCodeForm({
      customerName: '',
      dateTime: '',
      studioId: ''
    });
    setCodeFormErrors({});
  };

  const handleMaintenanceSubmit = async () => {
    if (!validateMaintenanceForm()) return;

    setIsSubmittingMaintenance(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newIssue: MaintenanceIssue = {
        id: `maint-${Date.now()}`,
        title: maintenanceForm.title.trim(),
        description: maintenanceForm.description.trim(),
        priority: maintenanceForm.priority,
        location: maintenanceForm.location,
        category: maintenanceForm.category,
        status: 'open',
        reportedDate: new Date().toISOString().split('T')[0],
        reportedBy: 'Partner Dashboard'
      };

      setMaintenanceIssues(prev => [newIssue, ...prev]);
      setShowMaintenanceForm(false);
      resetMaintenanceForm();
      alert('✅ Onderhoudsprobleem succesvol gemeld!');
      
    } catch (error) {
      alert('❌ Er ging iets mis. Probeer opnieuw.');
    } finally {
      setIsSubmittingMaintenance(false);
    }
  };

  const generateNewCode = () => {
    if (!validateCodeForm()) return;

    const newCode: AccessCode = {
      id: `code-${Date.now()}`,
      code: Math.floor(1000 + Math.random() * 9000).toString(),
      customer: newCodeForm.customerName.trim(),
      studio: newCodeForm.studioId,
      timeSlot: 'Nieuwe booking',
      validUntil: newCodeForm.dateTime.split('T')[0]
    };

    setActiveCodes(prev => [...prev, newCode]);
    resetCodeForm();
    alert(`✅ Nieuwe toegangscode gegenereerd: ${newCode.code}`);
  };

  const deactivateCode = (codeId: string) => {
    setActiveCodes(prev => prev.filter(code => code.id !== codeId));
    alert('Code gedeactiveerd');
  };

  const updateIssueStatus = (issueId: string, newStatus: MaintenanceIssue['status']) => {
    setMaintenanceIssues(prev => prev.map(item => 
      item.id === issueId 
        ? { 
            ...item, 
            status: newStatus,
            resolvedDate: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : undefined
          }
        : item
    ));
  };

  const deleteIssue = (issueId: string) => {
    if (confirm('Weet je zeker dat je dit probleem wilt verwijderen?')) {
      setMaintenanceIssues(prev => prev.filter(item => item.id !== issueId));
    }
  };

  const updateTemperature = (index: number, value: number) => {
    const newTemps = [...studioTemperatures];
    newTemps[index] = value;
    setStudioTemperatures(newTemps);
  };

  const updateStudioStatus = (index: number, status: string) => {
    const newStatuses = [...studioStatuses];
    newStatuses[index] = status;
    setStudioStatuses(newStatuses);
  };

  // Helper functions
  const getPriorityColor = (priority: string): string => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.color : 'gray';
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'open': return '🔴';
      case 'in-progress': return '🟡';
      case 'resolved': return '✅';
      default: return '⚪';
    }
  };

  const getLocationLabel = (location: string): string => {
    const option = locationOptions.find(opt => opt.value === location);
    return option ? option.label : location;
  };

  const getCategoryLabel = (category: string): string => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option ? option.label : category;
  };

  // Components
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
              {activeCodes.map(codeData => (
                <div key={codeData.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{codeData.customer}</p>
                    <p className="text-sm text-gray-500">{codeData.timeSlot} - {codeData.studio}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold">{codeData.code}</p>
                    <button 
                      onClick={() => deactivateCode(codeData.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Deactiveer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Nieuwe Code Genereren</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Klant naam <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={newCodeForm.customerName}
                  onChange={(e) => handleCodeInputChange('customerName', e.target.value)}
                  className={`form-input ${codeFormErrors.customerName ? 'border-red-300' : ''}`}
                  placeholder="Naam van de klant"
                />
                {codeFormErrors.customerName && (
                  <p className="text-red-600 text-xs mt-1">{codeFormErrors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum en tijd <span className="text-red-500">*</span>
                </label>
                <input 
                  type="datetime-local"
                  value={newCodeForm.dateTime}
                  onChange={(e) => handleCodeInputChange('dateTime', e.target.value)}
                  className={`form-input ${codeFormErrors.dateTime ? 'border-red-300' : ''}`}
                />
                {codeFormErrors.dateTime && (
                  <p className="text-red-600 text-xs mt-1">{codeFormErrors.dateTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Studio <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newCodeForm.studioId}
                  onChange={(e) => handleCodeInputChange('studioId', e.target.value)}
                  className={`form-input ${codeFormErrors.studioId ? 'border-red-300' : ''}`}
                >
                  <option value="">Selecteer studio</option>
                  <option value="Studio A">Studio A</option>
                  <option value="Studio B">Studio B</option>
                  <option value="Studio C">Studio C</option>
                  <option value="Alle Studios">Alle Studios</option>
                </select>
                {codeFormErrors.studioId && (
                  <p className="text-red-600 text-xs mt-1">{codeFormErrors.studioId}</p>
                )}
              </div>

              <button 
                onClick={generateNewCode}
                className="w-full btn btn-primary"
              >
                <Plus className="w-4 h-4" />
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
          {config.studios.map((studio, index) => (
            <div key={studio.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">{studio.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  studioStatuses[index] === 'Actief' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {studioStatuses[index]}
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
                      value={studioTemperatures[index]}
                      onChange={(e) => updateTemperature(index, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-mono text-lg w-12">{studioTemperatures[index]}°C</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => updateStudioStatus(index, studioStatuses[index] === 'Verwarming' ? 'Actief' : 'Verwarming')}
                    className={`btn text-sm ${
                      studioStatuses[index] === 'Verwarming' ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    Verwarming
                  </button>
                  <button 
                    onClick={() => updateStudioStatus(index, studioStatuses[index] === 'Koeling' ? 'Actief' : 'Koeling')}
                    className={`btn text-sm ${
                      studioStatuses[index] === 'Koeling' ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    Koeling
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Luchtvochtigheid: {52 + index}%</p>
                  <p>Ventilatie: {['Normaal', 'Laag', 'Hoog'][index]}</p>
                </div>
              </div>
            </div>
          ))}
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

  const MaintenancePanel = () => (
    <div className="space-y-6">
      {/* Header met statistieken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Open Problemen"
          value={maintenanceIssues.filter(issue => issue.status === 'open').length.toString()}
          subtitle="Actie vereist"
          icon={Wrench}
          color="red"
        />
        <MetricCard
          title="Opgelost Deze Maand"
          value={maintenanceIssues.filter(issue => issue.status === 'resolved').length.toString()}
          subtitle="Afgehandeld"
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Urgente Issues"
          value={maintenanceIssues.filter(issue => 
            ['urgent', 'high'].includes(issue.priority) && issue.status === 'open'
          ).length.toString()}
          subtitle="Hoge prioriteit"
          icon={AlertCircle}
          color="orange"
        />
        <MetricCard
          title="Gem. Oplostijd"
          value="2.3"
          subtitle="Dagen"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Onderhoud & Monitoring
          </h3>
          <button
            onClick={() => setShowMaintenanceForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Nieuw Probleem Melden
          </button>
        </div>
        
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
              {maintenanceIssues.slice(0, 2).map(issue => (
                <div key={issue.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-gray-500">
                      Gerapporteerd: {new Date(issue.reportedDate).toLocaleDateString('nl-BE')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    issue.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusIcon(issue.status)} {issue.status === 'open' ? 'Open' : 'Opgelost'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nieuwe Melding Formulier */}
      {showMaintenanceForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">🔧 Nieuw Onderhoudsprobleem Melden</h3>
            <button
              onClick={() => {
                setShowMaintenanceForm(false);
                resetMaintenanceForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Titel en Locatie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probleem Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={maintenanceForm.title}
                  onChange={(e) => handleMaintenanceInputChange('title', e.target.value)}
                  className={`form-input ${maintenanceErrors.title ? 'border-red-300' : ''}`}
                  placeholder="Korte, duidelijke beschrijving van het probleem"
                  maxLength={100}
                />
                {maintenanceErrors.title && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {maintenanceErrors.title}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {maintenanceForm.title.length}/100 karakters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locatie <span className="text-red-500">*</span>
                </label>
                <select
                  value={maintenanceForm.location}
                  onChange={(e) => handleMaintenanceInputChange('location', e.target.value)}
                  className={`form-input ${maintenanceErrors.location ? 'border-red-300' : ''}`}
                >
                  <option value="">Selecteer locatie waar probleem zich voordoet</option>
                  {locationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {maintenanceErrors.location && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {maintenanceErrors.location}
                  </p>
                )}
              </div>
            </div>

            {/* Prioriteit en Categorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioriteitslevel
                </label>
                <select
                  value={maintenanceForm.priority}
                  onChange={(e) => handleMaintenanceInputChange('priority', e.target.value as MaintenanceForm['priority'])}
                  className="form-input"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probleem Categorie
                </label>
                <select
                  value={maintenanceForm.category}
                  onChange={(e) => handleMaintenanceInputChange('category', e.target.value)}
                  className="form-input"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Beschrijving */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gedetailleerde Beschrijving <span className="text-red-500">*</span>
              </label>
              <textarea
                value={maintenanceForm.description}
                onChange={(e) => handleMaintenanceInputChange('description', e.target.value)}
                className={`form-input ${maintenanceErrors.description ? 'border-red-300' : ''}`}
                rows={4}
                placeholder="Beschrijf het probleem in detail..."
                maxLength={500}
              />
              {maintenanceErrors.description && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {maintenanceErrors.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {maintenanceForm.description.length}/500 karakters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button 
                type="button"
                onClick={handleMaintenanceSubmit}
                disabled={isSubmittingMaintenance}
                className="btn btn-primary flex-1"
              >
                {isSubmittingMaintenance ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Melden...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Probleem Melden
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowMaintenanceForm(false);
                  resetMaintenanceForm();
                }}
                className="btn btn-secondary"
                disabled={isSubmittingMaintenance}
              >
                <X className="w-4 h-4" />
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alle Onderhoudsproblemen */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Alle Onderhoudsproblemen</h3>
        
        {maintenanceIssues.length === 0 ? (
          <div className="text-center py-8">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Geen onderhoudsproblemen gemeld</p>
          </div>
        ) : (
          <div className="space-y-3">
            {maintenanceIssues.map(issue => (
              <div key={issue.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{issue.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs bg-${getPriorityColor(issue.priority)}-100 text-${getPriorityColor(issue.priority)}-800`}>
                        {priorityOptions.find(opt => opt.value === issue.priority)?.label.split(' - ')[0]}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        issue.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {getStatusIcon(issue.status)} {issue.status === 'open' ? 'Open' : 'Opgelost'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📍 {getLocationLabel(issue.location)}</span>
                      <span>👤 {issue.reportedBy}</span>
                      <span>📅 {new Date(issue.reportedDate).toLocaleDateString('nl-BE')}</span>
                      {issue.resolvedDate && (
                        <span>✅ Opgelost: {new Date(issue.resolvedDate).toLocaleDateString('nl-BE')}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    {issue.status === 'open' ? (
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'resolved')}
                        className="btn btn-success text-xs"
                      >
                        ✅ Als Opgelost Markeren
                      </button>
                    ) : (
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'open')}
                        className="btn btn-secondary text-xs"
                      >
                        🔄 Heropenen
                      </button>
                    )}
                    <button
                      onClick={() => deleteIssue(issue.id)}
                      className="btn text-xs bg-red-600 text-white hover:bg-red-700"
                    >
                      🗑️ Verwijderen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">🚨 Noodcontacten</h3>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
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
                  temperature={studioTemperatures[0]}
                />
                <StudioStatus 
                  studio={config.studios[1]} 
                  isOccupied={false}
                  nextBooking="Volgende: 16:00"
                  temperature={studioTemperatures[1]}
                />
                <StudioStatus 
                  studio={config.studios[2]} 
                  isOccupied={true}
                  currentUser="DJ Mike"
                  nextBooking="Volgende: 15:30"
                  temperature={studioTemperatures[2]}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold">🎉 REPKOT Beheertool is Live!</h3>
              <p className="text-blue-700 text-sm mt-1">
                Alle functionaliteiten zijn toegevoegd met volledig werkende formulieren en input velden.
              </p>
            </div>
          </div>
        );
      case 'access':
        return <AccessCodeManager />;
      case 'climate':
        return <ClimateControl />;
      case 'maintenance':
        return <MaintenancePanel />;
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

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'access', label: 'Toegang', icon: KeyRound },
              { id: 'climate', label: 'Klimaat', icon: Thermometer },
              { id: 'maintenance', label: 'Onderhoud', icon: Wrench }
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
}

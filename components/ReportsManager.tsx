// components/ReportsManager.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { BusinessConfig } from '../lib/config';

interface ReportsManagerProps {
  config: BusinessConfig;
}

interface MonthlyData {
  month: string;
  revenue: number;
  subscriptions: number;
  bookings: number;
  lockers: number;
  expenses: number;
  profit: number;
  occupancy: number;
}

interface StudioPerformance {
  studio: string;
  revenue: number;
  hours: number;
  bookings: number;
  occupancy: number;
  avgPrice: number;
}

interface CustomerAnalytics {
  newCustomers: number;
  returningCustomers: number;
  churnRate: number;
  avgLifetimeValue: number;
  satisfactionScore: number;
}

export default function ReportsManager({ config }: ReportsManagerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [reportType, setReportType] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // Gesimuleerde data - in productie uit Firebase
  const monthlyData: MonthlyData[] = [
    { month: 'Jan', revenue: 1850, subscriptions: 8, bookings: 12, lockers: 4, expenses: 1400, profit: 450, occupancy: 65 },
    { month: 'Feb', revenue: 1920, subscriptions: 9, bookings: 14, lockers: 5, expenses: 1400, profit: 520, occupancy: 68 },
    { month: 'Mar', revenue: 2080, subscriptions: 10, bookings: 16, lockers: 5, expenses: 1400, profit: 680, occupancy: 72 },
    { month: 'Apr', revenue: 2150, subscriptions: 11, bookings: 15, lockers: 6, expenses: 1400, profit: 750, occupancy: 75 },
    { month: 'Mei', revenue: 2020, subscriptions: 10, bookings: 18, lockers: 5, expenses: 1400, profit: 620, occupancy: 70 },
    { month: 'Jun', revenue: 2280, subscriptions: 12, bookings: 20, lockers: 6, expenses: 1400, profit: 880, occupancy: 78 }
  ];

  const studioPerformance: StudioPerformance[] = [
    { studio: 'Studio A', revenue: 820, hours: 68, bookings: 25, occupancy: 85, avgPrice: 12 },
    { studio: 'Studio B', revenue: 720, hours: 60, bookings: 22, occupancy: 75, avgPrice: 12 },
    { studio: 'Studio C', revenue: 540, hours: 54, bookings: 28, occupancy: 68, avgPrice: 10 }
  ];

  const customerAnalytics: CustomerAnalytics = {
    newCustomers: 15,
    returningCustomers: 45,
    churnRate: 8.5,
    avgLifetimeValue: 850,
    satisfactionScore: 4.6
  };

  const revenueBreakdown = [
    { name: 'Abonnementen', value: 1600, color: '#3b82f6' },
    { name: 'Losse Boekingen', value: 480, color: '#10b981' },
    { name: 'Lockers', value: 200, color: '#8b5cf6' }
  ];

  const occupancyTrend = monthlyData.map(month => ({
    month: month.month,
    occupancy: month.occupancy,
    target: 75
  }));

const generatePDFReport = async () => {
  setIsGenerating(true);
  
  try {
    // Simuleer report generatie
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In productie zou je hier een PDF genereren
    console.log('PDF Report generated for period:', selectedPeriod);
    alert(`PDF rapport voor ${selectedPeriod} is gegenereerd!`);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('PDF generatie is mislukt. Probeer opnieuw.');
  } finally {
    setIsGenerating(false);
  }
};

  const exportToCSV = () => {
    const csvData = monthlyData.map(month => ({
      Maand: month.month,
      Omzet: month.revenue,
      Abonnementen: month.subscriptions,
      Boekingen: month.bookings,
      Lockers: month.lockers,
      Kosten: month.expenses,
      Winst: month.profit,
      Bezetting: `${month.occupancy}%`
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REPKOT_rapport_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }: {
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    trend?: number;
    color?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">{subtitle}</p>
            {trend && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </div>
  );

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Totale Omzet"
          value="€12.300"
          subtitle="Laatste 6 maanden"
          icon={DollarSign}
          trend={8.5}
          color="green"
        />
        <MetricCard
          title="Gem. Bezetting"
          value="72%"
          subtitle="Alle studios"
          icon={TrendingUp}
          trend={3.2}
          color="blue"
        />
        <MetricCard
          title="Actieve Klanten"
          value="48"
          subtitle="12 abonnees, 36 losse klanten"
          icon={Users}
          trend={12.5}
          color="purple"
        />
        <MetricCard
          title="Break-even"
          value="149%"
          subtitle="Ruim boven target"
          icon={Target}
          trend={5.8}
          color="orange"
        />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Omzet Ontwikkeling</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`€${value}`, 'Omzet']} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.1}
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Breakdown & Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Omzet Verdeling</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `€${value}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}: €{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Bezettingsgraad vs Target</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Bezetting']} />
              <Line 
                type="monotone" 
                dataKey="occupancy" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Werkelijk"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderStudioReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Studio Performance Vergelijking</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studioPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="studio" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" name="Omzet (€)" />
            <Bar dataKey="hours" fill="#10b981" name="Uren" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {studioPerformance.map((studio, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="font-semibold text-lg mb-4">{studio.studio}</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Omzet:</span>
                <span className="font-semibold">€{studio.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uren:</span>
                <span className="font-semibold">{studio.hours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Boekingen:</span>
                <span className="font-semibold">{studio.bookings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bezetting:</span>
                <span className={`font-semibold ${
                  studio.occupancy >= 75 ? 'text-green-600' : 
                  studio.occupancy >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {studio.occupancy}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gem. Prijs:</span>
                <span className="font-semibold">€{studio.avgPrice}/u</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomerReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Nieuwe Klanten"
          value={customerAnalytics.newCustomers.toString()}
          subtitle="Deze maand"
          icon={Users}
          trend={8.3}
          color="green"
        />
        <MetricCard
          title="Terugkerende Klanten"
          value={customerAnalytics.returningCustomers.toString()}
          subtitle="Loyale klanten"
          icon={CheckCircle}
          color="blue"
        />
        <MetricCard
          title="Churn Rate"
          value={`${customerAnalytics.churnRate}%`}
          subtitle="Maandelijks verlies"
          icon={AlertCircle}
          trend={-2.1}
          color="red"
        />
        <MetricCard
          title="Lifetime Value"
          value={`€${customerAnalytics.avgLifetimeValue}`}
          subtitle="Gemiddeld per klant"
          icon={DollarSign}
          trend={15.2}
          color="purple"
        />
        <MetricCard
          title="Tevredenheid"
          value={`${customerAnalytics.satisfactionScore}/5`}
          subtitle="Klantbeoordeling"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Klant Acquisitie Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="subscriptions" fill="#3b82f6" name="Nieuwe Abonnees" />
            <Bar dataKey="bookings" fill="#10b981" name="Losse Klanten" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Winst & Verlies Overzicht</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#10b981" name="Omzet" />
            <Bar dataKey="expenses" fill="#ef4444" name="Kosten" />
            <Bar dataKey="profit" fill="#3b82f6" name="Winst" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold mb-4">Kosten Breakdown (Maandelijks)</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Huur:</span>
              <span>€{config.operationalCosts.rent}</span>
            </div>
            <div className="flex justify-between">
              <span>Utilities:</span>
              <span>€{config.operationalCosts.utilities}</span>
            </div>
            <div className="flex justify-between">
              <span>Verzekeringen:</span>
              <span>€{config.operationalCosts.insurance}</span>
            </div>
            <div className="flex justify-between">
              <span>Onderhoud:</span>
              <span>€{config.operationalCosts.maintenance}</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing:</span>
              <span>€{config.operationalCosts.marketing}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Totaal:</span>
              <span>€{Object.values(config.operationalCosts).reduce((sum, cost) => sum + cost, 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold mb-4">ROI & Break-even</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Break-even punt:</span>
              <span>€1.400/mnd</span>
            </div>
            <div className="flex justify-between">
              <span>Huidige omzet:</span>
              <span className="text-green-600">€2.080/mnd</span>
            </div>
            <div className="flex justify-between">
              <span>Marge:</span>
              <span className="text-green-600">€680/mnd</span>
            </div>
            <div className="flex justify-between">
              <span>ROI:</span>
              <span className="text-green-600">149%</span>
            </div>
            <div className="flex justify-between">
              <span>Per partner:</span>
              <span className="font-semibold text-green-600">€340/mnd</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (reportType) {
      case 'overview':
        return renderOverviewReport();
      case 'studios':
        return renderStudioReport();
      case 'customers':
        return renderCustomerReport();
      case 'financial':
        return renderFinancialReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rapport Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="form-input"
              >
                <option value="overview">Overzicht</option>
                <option value="studios">Studio Performance</option>
                <option value="customers">Klant Analyse</option>
                <option value="financial">Financieel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="form-input"
              >
                <option value="1month">Laatste maand</option>
                <option value="3months">Laatste 3 maanden</option>
                <option value="6months">Laatste 6 maanden</option>
                <option value="12months">Laatste 12 maanden</option>
                <option value="ytd">Dit jaar</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="btn btn-secondary"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            
            <button
              onClick={generatePDFReport}
              disabled={isGenerating}
              className="btn btn-primary"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Genereren...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  PDF Rapport
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderTabContent()}

      {/* Summary Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">📊 Belangrijkste Inzichten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Prestatie</h4>
            </div>
            <p className="text-sm text-green-700">
              Omzet ligt 49% boven break-even punt. Studio A presteert het best met 85% bezetting.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Groei</h4>
            </div>
            <p className="text-sm text-blue-700">
              Nieuwe klanten stijgen met 12.5% per maand. Abonnement model werkt goed.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">Verbeterpunten</h4>
            </div>
            <p className="text-sm text-yellow-700">
              Studio C heeft lagere bezetting (68%). Overweeg marketing focus of prijsaanpassing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

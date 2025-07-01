// components/SubscriptionManager.tsx
import React, { useState, useEffect } from 'react';
import { Users, Plus, Calendar, DollarSign, AlertCircle, CheckCircle, X } from 'lucide-react';
import { BusinessConfig } from '../lib/config';

interface Subscription {
  id: string;
  customerName: string;
  customerEmail: string;
  studioId: string;
  studioName: string;
  schedule: {
    day: string;
    timeSlot: string;
  }[];
  startDate: string;
  nextBilling: string;
  monthlyPrice: number;
  status: 'active' | 'paused' | 'cancelled' | 'overdue';
  type: 'monthly' | 'yearly' | 'student';
}

interface SubscriptionManagerProps {
  config: BusinessConfig;
}

export default function SubscriptionManager({ config }: SubscriptionManagerProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub-001',
      customerName: 'The Foxes',
      customerEmail: 'contact@thefoxes.be',
      studioId: 'studio-a',
      studioName: 'Studio A',
      schedule: [
        { day: 'Maandag', timeSlot: 'Ochtend (10:00-13:00)' },
        { day: 'Donderdag', timeSlot: 'Avond (18:00-21:00)' }
      ],
      startDate: '2025-03-15',
      nextBilling: '2025-07-15',
      monthlyPrice: 160,
      status: 'active',
      type: 'monthly'
    },
    {
      id: 'sub-002',
      customerName: 'Rock United',
      customerEmail: 'info@rockunited.be',
      studioId: 'studio-b',
      studioName: 'Studio B',
      schedule: [
        { day: 'Dinsdag', timeSlot: 'Avond (18:00-21:00)' },
        { day: 'Vrijdag', timeSlot: 'Avond (18:00-21:00)' }
      ],
      startDate: '2025-04-01',
      nextBilling: '2025-08-01',
      monthlyPrice: 160,
      status: 'active',
      type: 'monthly'
    },
    {
      id: 'sub-003',
      customerName: 'DJ Mike',
      customerEmail: 'mike@dj-mike.be',
      studioId: 'studio-c',
      studioName: 'Studio C',
      schedule: [
        { day: 'Woensdag', timeSlot: 'Middag (14:00-17:00)' },
        { day: 'Zaterdag', timeSlot: 'Ochtend (10:00-13:00)' }
      ],
      startDate: '2025-05-10',
      nextBilling: '2025-07-10',
      monthlyPrice: 128,
      status: 'overdue',
      type: 'monthly'
    },
    {
      id: 'sub-004',
      customerName: 'Student Band',
      customerEmail: 'student@band.be',
      studioId: 'studio-b',
      studioName: 'Studio B',
      schedule: [
        { day: 'Zaterdag', timeSlot: 'Middag (14:00-17:00)' },
        { day: 'Dinsdag', timeSlot: 'Ochtend (10:00-13:00)' }
      ],
      startDate: '2025-06-01',
      nextBilling: '2025-08-01',
      monthlyPrice: 144,
      status: 'active',
      type: 'student'
    }
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    studioId: '',
    type: 'monthly' as 'monthly' | 'student' | 'yearly',
    startDate: '',
    scheduleSlots: [{ day: '', timeSlot: '' }]
  });

  // Metrics - herberekend wanneer subscriptions wijzigen
  const [metrics, setMetrics] = useState({
    activeCount: 0,
    monthlyRevenue: 0,
    averagePrice: 0,
    overdueCount: 0,
    studioBreakdown: ''
  });

  // Herbereken metrics wanneer subscriptions wijzigen
  useEffect(() => {
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const monthlyRevenue = activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyPrice, 0);
    const averagePrice = activeSubscriptions.length > 0 ? Math.round(monthlyRevenue / activeSubscriptions.length) : 0;
    const overdueCount = subscriptions.filter(s => s.status === 'overdue').length;
    
    // Studio breakdown
    const studioBreakdown = activeSubscriptions.reduce((acc, sub) => {
      if (!acc[sub.studioName]) acc[sub.studioName] = 0;
      acc[sub.studioName]++;
      return acc;
    }, {} as Record<string, number>);
    
    const studioBreakdownText = Object.entries(studioBreakdown)
      .map(([studio, count]) => `${count}x ${studio}`)
      .join(', ') || 'Geen actieve abonnementen';

    setMetrics({
      activeCount: activeSubscriptions.length,
      monthlyRevenue,
      averagePrice,
      overdueCount,
      studioBreakdown: studioBreakdownText
    });
  }, [subscriptions]);

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      studioId: '',
      type: 'monthly',
      startDate: '',
      scheduleSlots: [{ day: '', timeSlot: '' }]
    });
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      scheduleSlots: [...prev.scheduleSlots, { day: '', timeSlot: '' }]
    }));
  };

  const removeScheduleSlot = (index: number) => {
    if (formData.scheduleSlots.length > 1) {
      setFormData(prev => ({
        ...prev,
        scheduleSlots: prev.scheduleSlots.filter((_, i) => i !== index)
      }));
    }
  };

  const updateScheduleSlot = (index: number, field: 'day' | 'timeSlot', value: string) => {
    setFormData(prev => ({
      ...prev,
      scheduleSlots: prev.scheduleSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const calculatePrice = () => {
    const studio = config.studios.find(s => s.id === formData.studioId);
    if (!studio) return 0;

    let price = studio.monthlyRate;
    if (formData.type === 'student') {
      price = price * (1 - config.discounts.student / 100);
    } else if (formData.type === 'yearly') {
      price = price * (1 - config.discounts.bulk / 100);
    }
    return Math.round(price);
  };

  const createSubscription = () => {
    // Eenvoudige validatie
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.studioId || !formData.startDate) {
      alert('Vul alle verplichte velden in');
      return;
    }

    // Email validatie
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      alert('Voer een geldig email adres in');
      return;
    }

    const studio = config.studios.find(s => s.id === formData.studioId);
    if (!studio) return;

    const price = calculatePrice();
    const nextBilling = new Date(formData.startDate);
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      customerName: formData.customerName.trim(),
      customerEmail: formData.customerEmail.trim(),
      studioId: formData.studioId,
      studioName: studio.name,
      schedule: formData.scheduleSlots.filter(s => s.day && s.timeSlot),
      startDate: formData.startDate,
      nextBilling: nextBilling.toISOString().split('T')[0],
      monthlyPrice: price,
      status: 'active',
      type: formData.type
    };

    setSubscriptions(prev => [...prev, newSub]);
    setShowNewForm(false);
    resetForm();
    
    // Feedback
    alert(`✅ Abonnement voor ${newSub.customerName} succesvol aangemaakt!`);
  };

  const updateSubscriptionStatus = (subscriptionId: string, status: Subscription['status']) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subscriptionId ? { ...sub, status } : sub
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }: {
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

  return (
    <div className="space-y-6">
      {/* Subscription Overview - Dynamisch herberekend */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Actieve Abonnementen"
          value={metrics.activeCount.toString()}
          subtitle={metrics.studioBreakdown}
          icon={Users}
          color="blue"
        />

        <MetricCard
          title="Maand Omzet Abo's"
          value={`€${metrics.monthlyRevenue}`}
          subtitle={`${metrics.monthlyRevenue > 0 ? Math.round((metrics.monthlyRevenue / 2080) * 100) : 0}% van totale omzet`}
          icon={DollarSign}
          color="green"
        />

        <MetricCard
          title="Gemiddelde Prijs"
          value={`€${metrics.averagePrice}`}
          subtitle="Per abonnement/maand"
          icon={Calendar}
          color="purple"
        />

        <MetricCard
          title="Uitstaande Betalingen"
          value={metrics.overdueCount.toString()}
          subtitle="Herinneringen versturen"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Abonnementenbeheer</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Nieuw Abonnement
        </button>
      </div>

      {/* New Subscription Form */}
      {showNewForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Nieuw Abonnement</h3>
            <button
              onClick={() => {
                setShowNewForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Band/Artist Naam *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="form-input"
                placeholder="Naam van de band"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="form-input"
                placeholder="contact@band.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Studio *
              </label>
              <select
                value={formData.studioId}
                onChange={(e) => setFormData(prev => ({ ...prev, studioId: e.target.value }))}
                className="form-input"
                required
              >
                <option value="">Selecteer studio</option>
                {config.studios.map(studio => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name} ({studio.size}m² - €{studio.monthlyRate}/maand)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abonnement Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="form-input"
              >
                <option value="monthly">Standaard Maandabonnement</option>
                <option value="student">Student Maandabonnement (-{config.discounts.student}%)</option>
                <option value="yearly">Jaarabonnement (-{config.discounts.bulk}%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Datum *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Schedule Slots */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Wekelijkse Planning *
            </label>
            <div className="space-y-3">
              {formData.scheduleSlots.map((slot, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Dag {index + 1}</label>
                    <select
                      value={slot.day}
                      onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                      className="form-input"
                    >
                      <option value="">Selecteer dag</option>
                      <option value="Maandag">Maandag</option>
                      <option value="Dinsdag">Dinsdag</option>
                      <option value="Woensdag">Woensdag</option>
                      <option value="Donderdag">Donderdag</option>
                      <option value="Vrijdag">Vrijdag</option>
                      <option value="Zaterdag">Zaterdag</option>
                      <option value="Zondag">Zondag</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Tijdslot {index + 1}</label>
                    <select
                      value={slot.timeSlot}
                      onChange={(e) => updateScheduleSlot(index, 'timeSlot', e.target.value)}
                      className="form-input"
                    >
                      <option value="">Selecteer tijdslot</option>
                      <option value="Ochtend (10:00-13:00)">Ochtend (10:00-13:00)</option>
                      <option value="Middag (14:00-17:00)">Middag (14:00-17:00)</option>
                      <option value="Avond (18:00-21:00)">Avond (18:00-21:00)</option>
                      <option value="Late Avond (19:00-22:00)">Late Avond (19:00-22:00)</option>
                    </select>
                  </div>
                  {formData.scheduleSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScheduleSlot(index)}
                      className="btn btn-secondary mb-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addScheduleSlot}
                className="btn btn-secondary text-sm"
              >
                + Voeg tijdslot toe
              </button>
            </div>
          </div>

          {/* Price Preview */}
          {formData.studioId && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Maandprijs:</span>
                <span className="text-xl font-bold text-blue-600">€{calculatePrice()}</span>
              </div>
              {formData.type === 'student' && (
                <p className="text-sm text-blue-600 mt-1">
                  Inclusief {config.discounts.student}% studentenkorting
                </p>
              )}
              {formData.type === 'yearly' && (
                <p className="text-sm text-blue-600 mt-1">
                  Inclusief {config.discounts.bulk}% jaarkorting
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button 
              onClick={createSubscription} 
              className="btn btn-primary"
            >
              Abonnement Aanmaken
            </button>
            <button 
              onClick={() => {
                setShowNewForm(false);
                resetForm();
              }} 
              className="btn btn-secondary"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Active Subscriptions List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Actieve Abonnementen</h3>
        </div>
        <div className="p-6 space-y-4">
          {subscriptions.map(subscription => (
            <div key={subscription.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{subscription.customerName}</h4>
                    <span className={`status-badge ${getStatusColor(subscription.status)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(subscription.status)}
                        {subscription.status}
                      </span>
                    </span>
                    {subscription.type === 'student' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Student
                      </span>
                    )}
                    {subscription.type === 'yearly' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Jaar
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {subscription.customerEmail} • {subscription.studioName} • Start: {new Date(subscription.startDate).toLocaleDateString('nl-BE')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Planning: {subscription.schedule.map(s => `${s.day} ${s.timeSlot}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">€{subscription.monthlyPrice}/maand</p>
                  <p className="text-sm text-gray-500">
                    Volgende factuur: {new Date(subscription.nextBilling).toLocaleDateString('nl-BE')}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button className="btn btn-secondary text-xs">Bewerken</button>
                    {subscription.status === 'overdue' ? (
                      <button 
                        onClick={() => updateSubscriptionStatus(subscription.id, 'active')}
                        className="btn text-xs bg-red-600 text-white"
                      >
                        Herinnering
                      </button>
                    ) : (
                      <button className="btn btn-primary text-xs">Factureren</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

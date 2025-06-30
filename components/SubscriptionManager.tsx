// components/SubscriptionManager.tsx
import React, { useState } from 'react';
import { Users, Plus, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
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
      monthlyPrice: 144, // 10% studentenkorting
      status: 'active',
      type: 'student'
    }
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    customerName: '',
    customerEmail: '',
    studioId: '',
    schedule: [{ day: '', timeSlot: '' }],
    type: 'monthly' as 'monthly' | 'student' | 'yearly',
    startDate: ''
  });

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

  const calculateMonthlyRecurringRevenue = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((sum, sub) => sum + sub.monthlyPrice, 0);
  };

  const getSubscriptionsByStudio = () => {
    const byStudio = subscriptions.reduce((acc, sub) => {
      if (!acc[sub.studioName]) acc[sub.studioName] = 0;
      if (sub.status === 'active') acc[sub.studioName]++;
      return acc;
    }, {} as Record<string, number>);
    return byStudio;
  };

  const addScheduleSlot = () => {
    setNewSubscription(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: '', timeSlot: '' }]
    }));
  };

  const updateScheduleSlot = (index: number, field: 'day' | 'timeSlot', value: string) => {
    setNewSubscription(prev => ({
      ...prev,
      schedule: prev.schedule.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const createSubscription = () => {
    const studio = config.studios.find(s => s.id === newSubscription.studioId);
    if (!studio) return;

    let price = studio.monthlyRate;
    if (newSubscription.type === 'student') {
      price = price * (1 - config.discounts.student / 100);
    } else if (newSubscription.type === 'yearly') {
      price = price * (1 - config.discounts.bulk / 100);
    }

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      customerName: newSubscription.customerName,
      customerEmail: newSubscription.customerEmail,
      studioId: newSubscription.studioId,
      studioName: studio.name,
      schedule: newSubscription.schedule.filter(s => s.day && s.timeSlot),
      startDate: newSubscription.startDate,
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyPrice: Math.round(price),
      status: 'active',
      type: newSubscription.type
    };

    setSubscriptions(prev => [...prev, newSub]);
    setShowNewForm(false);
    setNewSubscription({
      customerName: '',
      customerEmail: '',
      studioId: '',
      schedule: [{ day: '', timeSlot: '' }],
      type: 'monthly',
      startDate: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actieve Abonnementen</p>
              <p className="text-2xl font-bold text-blue-600">
                {subscriptions.filter(s => s.status === 'active').length}
              </p>
              <p className="text-sm text-gray-500">
                {Object.entries(getSubscriptionsByStudio()).map(([studio, count]) => 
                  `${count}x ${studio}`
                ).join(', ')}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maand Omzet Abo's</p>
              <p className="text-2xl font-bold text-green-600">
                €{calculateMonthlyRecurringRevenue()}
              </p>
              <p className="text-sm text-gray-500">
                {((calculateMonthlyRecurringRevenue() / 2080) * 100).toFixed(0)}% van totale omzet
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gemiddelde Prijs</p>
              <p className="text-2xl font-bold text-purple-600">
                €{Math.round(calculateMonthlyRecurringRevenue() / subscriptions.filter(s => s.status === 'active').length)}
              </p>
              <p className="text-sm text-gray-500">4 dagdelen/maand</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uitstaande Betalingen</p>
              <p className="text-2xl font-bold text-red-600">
                {subscriptions.filter(s => s.status === 'overdue').length}
              </p>
              <p className="text-sm text-gray-500">Herinneringen versturen</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
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
          <h3 className="text-lg font-semibold mb-4">Nieuw Abonnement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Band/Artist Naam
              </label>
              <input
                type="text"
                value={newSubscription.customerName}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, customerName: e.target.value }))}
                className="form-input"
                placeholder="Naam van de band"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={newSubscription.customerEmail}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="form-input"
                placeholder="contact@band.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Studio
              </label>
              <select
                value={newSubscription.studioId}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, studioId: e.target.value }))}
                className="form-input"
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
                value={newSubscription.type}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, type: e.target.value as any }))}
                className="form-input"
              >
                <option value="monthly">Standaard Maandabonnement</option>
                <option value="student">Student Maandabonnement (-{config.discounts.student}%)</option>
                <option value="yearly">Jaarabonnement (-{config.discounts.bulk}%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Datum
              </label>
              <input
                type="date"
                value={newSubscription.startDate}
                onChange={(e) => setNewSubscription(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          {/* Schedule Slots */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wekelijkse Planning
            </label>
            {newSubscription.schedule.map((slot, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-2">
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
            ))}
            <button
              type="button"
              onClick={addScheduleSlot}
              className="btn btn-secondary text-sm"
            >
              + Voeg tijdslot toe
            </button>
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={createSubscription} className="btn btn-primary">
              Abonnement Aanmaken
            </button>
            <button onClick={() => setShowNewForm(false)} className="btn btn-secondary">
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
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {subscription.studioName} • Start: {new Date(subscription.startDate).toLocaleDateString('nl-BE')}
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
                      <button className="btn text-xs bg-red-600 text-white">Herinnering</button>
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

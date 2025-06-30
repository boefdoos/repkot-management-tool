// components/SubscriptionManager.tsx (Updated with improved forms)
import React, { useState } from 'react';
import { Users, Plus, Calendar, DollarSign, AlertCircle, CheckCircle, X } from 'lucide-react';
import { BusinessConfig } from '../lib/config';
import { 
  TextInput, 
  SelectInput, 
  DateInput, 
  validators,
  FormField 
} from './FormComponents';

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'customerName':
        if (!value || value.length < 2) return 'Naam is verplicht (min. 2 karakters)';
        break;
      case 'customerEmail':
        if (!value) return 'Email is verplicht';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ongeldig email adres';
        break;
      case 'studioId':
        if (!value) return 'Studio selectie is verplicht';
        break;
      case 'startDate':
        if (!value) return 'Start datum is verplicht';
        break;
    }
    return '';
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputBlur = (name: string, value: any) => {
    const error = validateField(name, value);
    if (error) {
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'scheduleSlots') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      studioId: '',
      type: 'monthly',
      startDate: '',
      scheduleSlots: [{ day: '', timeSlot: '' }]
    });
    setFormErrors({});
  };

  const studioOptions = config.studios.map(studio => ({
    value: studio.id,
    label: `${studio.name} (${studio.size}m² - €${studio.monthlyRate}/maand)`
  }));

  const subscriptionTypeOptions = [
    { value: 'monthly', label: 'Standaard Maandabonnement' },
    { value: 'student', label: `Student Maandabonnement (-${config.discounts.student}%)` },
    { value: 'yearly', label: `Jaarabonnement (-${config.discounts.bulk}%)` }
  ];

  const dayOptions = [
    { value: 'Maandag', label: 'Maandag' },
    { value: 'Dinsdag', label: 'Dinsdag' },
    { value: 'Woensdag', label: 'Woensdag' },
    { value: 'Donderdag', label: 'Donderdag' },
    { value: 'Vrijdag', label: 'Vrijdag' },
    { value: 'Zaterdag', label: 'Zaterdag' },
    { value: 'Zondag', label: 'Zondag' }
  ];

  const timeSlotOptions = [
    { value: 'Ochtend (10:00-13:00)', label: 'Ochtend (10:00-13:00)' },
    { value: 'Middag (14:00-17:00)', label: 'Middag (14:00-17:00)' },
    { value: 'Avond (18:00-21:00)', label: 'Avond (18:00-21:00)' },
    { value: 'Late Avond (19:00-22:00)', label: 'Late Avond (19:00-22:00)' }
  ];

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

  const createSubscription = async () => {
    if (!validateForm()) {
      return;
    }

    const studio = config.studios.find(s => s.id === formData.studioId);
    if (!studio) return;

    const price = calculatePrice();
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
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
  };

  const updateSubscriptionStatus = (subscriptionId: string, status: Subscription['status']) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subscriptionId ? { ...sub, status } : sub
    ));
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
      {/* Subscription Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Actieve Abonnementen"
          value={subscriptions.filter(s => s.status === 'active').length.toString()}
          subtitle={Object.entries(getSubscriptionsByStudio()).map(([studio, count]) => 
            `${count}x ${studio}`
          ).join(', ')}
          icon={Users}
          color="blue"
        />

        <MetricCard
          title="Maand Omzet Abo's"
          value={`€${calculateMonthlyRecurringRevenue()}`}
          subtitle={`${((calculateMonthlyRecurringRevenue() / 2080) * 100).toFixed(0)}% van totale omzet`}
          icon={DollarSign}
          color="green"
        />

        <MetricCard
          title="Gemiddelde Prijs"
          value={`€${Math.round(calculateMonthlyRecurringRevenue() / subscriptions.filter(s => s.status === 'active').length)}`}
          subtitle="4 dagdelen/maand"
          icon={Calendar}
          color="purple"
        />

        <MetricCard
          title="Uitstaande Betalingen"
          value={subscriptions.filter(s => s.status === 'overdue').length.toString()}
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
            <TextInput
              label="Band/Artist Naam"
              value={values.customerName}
              onChange={(e) => setValue('customerName', e.target.value)}
              onBlur={() => setTouched('customerName')}
              error={touched.customerName ? errors.customerName : undefined}
              placeholder="Naam van de band"
              required
            />

            <TextInput
              label="Contact Email"
              type="email"
              value={values.customerEmail}
              onChange={(e) => setValue('customerEmail', e.target.value)}
              onBlur={() => setTouched('customerEmail')}
              error={touched.customerEmail ? errors.customerEmail : undefined}
              placeholder="contact@band.com"
              required
            />

            <SelectInput
              label="Studio"
              value={values.studioId}
              onChange={(e) => setValue('studioId', e.target.value)}
              onBlur={() => setFieldTouched('studioId')}
              error={touched.studioId ? errors.studioId : undefined}
              options={studioOptions}
              placeholder="Selecteer studio"
              required
            />

            <SelectInput
              label="Abonnement Type"
              value={values.type}
              onChange={(e) => setValue('type', e.target.value as any)}
              options={subscriptionTypeOptions}
            />

            <DateInput
              label="Start Datum"
              value={values.startDate}
              onChange={(e) => setValue('startDate', e.target.value)}
              onBlur={() => setFieldTouched('startDate')}
              error={touched.startDate ? errors.startDate : undefined}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="mt-6">
            <FormField label="Wekelijkse Planning" required>
              <div className="space-y-3">
                {formData.scheduleSlots.map((slot, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <SelectInput
                        label={`Dag ${index + 1}`}
                        value={slot.day}
                        onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                        options={dayOptions}
                        placeholder="Selecteer dag"
                      />
                    </div>
                    <div className="flex-1">
                      <SelectInput
                        label={`Tijdslot ${index + 1}`}
                        value={slot.timeSlot}
                        onChange={(e) => updateScheduleSlot(index, 'timeSlot', e.target.value)}
                        options={timeSlotOptions}
                        placeholder="Selecteer tijdslot"
                      />
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
            </FormField>
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

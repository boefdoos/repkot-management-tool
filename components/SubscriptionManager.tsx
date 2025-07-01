// components/SubscriptionManager.tsx - Met volledige bewerk functionaliteit
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Edit3,
  Pause,
  Play,
  Trash2,
  MessageSquare,
  History,
  Save,
  Phone,
  Mail,
  Clock,
  PauseCircle
} from 'lucide-react';
import { BusinessConfig } from '../lib/config';

interface SubscriptionHistory {
  id: string;
  action: 'created' | 'paused' | 'resumed' | 'cancelled' | 'updated' | 'note_added';
  date: string;
  by: string;
  details: string;
  oldValue?: any;
  newValue?: any;
}

interface Subscription {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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
  notes?: string;
  pauseReason?: string;
  pausedDate?: string;
  cancelledDate?: string;
  cancelReason?: string;
  history: SubscriptionHistory[];
  createdAt: string;
  updatedAt: string;
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
      customerPhone: '+32 456 78 90 12',
      studioId: 'studio-a',
      studioName: 'Studio A',
      schedule: [
        { day: 'Maandag', timeSlot: 'Ochtend (10:00-14:00)' },
        { day: 'Donderdag', timeSlot: 'Avond (18:00-22:00)' }
      ],
      startDate: '2025-03-15',
      nextBilling: '2025-07-15',
      monthlyPrice: 160,
      status: 'active',
      type: 'monthly',
      notes: 'Betrouwbare klant, altijd op tijd met betalingen.',
      history: [
        {
          id: 'hist-001',
          action: 'created',
          date: '2025-03-15',
          by: 'Partner Dashboard',
          details: 'Abonnement aangemaakt voor Studio A'
        }
      ],
      createdAt: '2025-03-15',
      updatedAt: '2025-03-15'
    },
    {
      id: 'sub-002',
      customerName: 'Rock United',
      customerEmail: 'info@rockunited.be',
      customerPhone: '+32 478 12 34 56',
      studioId: 'studio-b',
      studioName: 'Studio B',
      schedule: [
        { day: 'Dinsdag', timeSlot: 'Avond (18:00-22:00)' },
        { day: 'Vrijdag', timeSlot: 'Avond (18:00-22:00)' }
      ],
      startDate: '2025-04-01',
      nextBilling: '2025-08-01',
      monthlyPrice: 160,
      status: 'active',
      type: 'monthly',
      history: [
        {
          id: 'hist-002',
          action: 'created',
          date: '2025-04-01',
          by: 'Partner Dashboard',
          details: 'Abonnement aangemaakt voor Studio B'
        }
      ],
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01'
    },
    {
      id: 'sub-003',
      customerName: 'DJ Mike',
      customerEmail: 'mike@dj-mike.be',
      studioId: 'studio-c',
      studioName: 'Studio C',
      schedule: [
        { day: 'Woensdag', timeSlot: 'Middag (14:00-18:00)' },
        { day: 'Zaterdag', timeSlot: 'Ochtend (10:00-14:00)' }
      ],
      startDate: '2025-05-10',
      nextBilling: '2025-07-10',
      monthlyPrice: 128,
      status: 'overdue',
      type: 'monthly',
      notes: 'Betaling vaak te laat. Extra follow-up nodig.',
      history: [
        {
          id: 'hist-003',
          action: 'created',
          date: '2025-05-10',
          by: 'Partner Dashboard',
          details: 'Abonnement aangemaakt voor Studio C'
        },
        {
          id: 'hist-004',
          action: 'note_added',
          date: '2025-06-25',
          by: 'Partner 2',
          details: 'Betaalherinnering verstuurd'
        }
      ],
      createdAt: '2025-05-10',
      updatedAt: '2025-06-25'
    },
    {
      id: 'sub-004',
      customerName: 'Student Band',
      customerEmail: 'student@band.be',
      studioId: 'studio-b',
      studioName: 'Studio B',
      schedule: [
        { day: 'Zaterdag', timeSlot: 'Middag (14:00-18:00)' },
        { day: 'Dinsdag', timeSlot: 'Ochtend (10:00-14:00)' }
      ],
      startDate: '2025-06-01',
      nextBilling: '2025-08-01',
      monthlyPrice: 144,
      status: 'paused',
      type: 'student',
      pauseReason: 'Examens - hervatten in september',
      pausedDate: '2025-06-20',
      notes: 'Goede studenten, vriendelijk contact.',
      history: [
        {
          id: 'hist-005',
          action: 'created',
          date: '2025-06-01',
          by: 'Partner Dashboard',
          details: 'Student abonnement aangemaakt'
        },
        {
          id: 'hist-006',
          action: 'paused',
          date: '2025-06-20',
          by: 'Partner 1',
          details: 'Gepauzeerd voor examens',
          oldValue: 'active',
          newValue: 'paused'
        }
      ],
      createdAt: '2025-06-01',
      updatedAt: '2025-06-20'
    }
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    action: 'pause' | 'cancel' | 'resume';
    subscription: Subscription;
    reason?: string;
  } | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<Subscription | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<Subscription | null>(null);
  const [newNote, setNewNote] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    studioId: '',
    type: 'monthly' as 'monthly' | 'student' | 'yearly',
    startDate: '',
    scheduleSlots: [{ day: '', timeSlot: '' }],
    notes: ''
  });

  const [editFormData, setEditFormData] = useState<Partial<Subscription>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form validation en helper functies
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

  const addHistoryEntry = (subscription: Subscription, action: SubscriptionHistory['action'], details: string, oldValue?: any, newValue?: any): SubscriptionHistory => {
    return {
      id: `hist-${Date.now()}`,
      action,
      date: new Date().toISOString().split('T')[0],
      by: 'Partner Dashboard',
      details,
      oldValue,
      newValue
    };
  };

  // Subscription management functies
  const pauseSubscription = (subscriptionId: string, reason: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subscriptionId) {
        const historyEntry = addHistoryEntry(sub, 'paused', `Gepauzeerd: ${reason}`, 'active', 'paused');
        return {
          ...sub,
          status: 'paused' as const,
          pauseReason: reason,
          pausedDate: new Date().toISOString().split('T')[0],
          history: [...sub.history, historyEntry],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return sub;
    }));
    setShowConfirmDialog(null);
  };

  const resumeSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subscriptionId) {
        const historyEntry = addHistoryEntry(sub, 'resumed', 'Abonnement hervat', 'paused', 'active');
        const nextBilling = new Date();
        nextBilling.setMonth(nextBilling.getMonth() + 1);
        
        return {
          ...sub,
          status: 'active' as const,
          pauseReason: undefined,
          pausedDate: undefined,
          nextBilling: nextBilling.toISOString().split('T')[0],
          history: [...sub.history, historyEntry],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return sub;
    }));
  };

  const cancelSubscription = (subscriptionId: string, reason: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subscriptionId) {
        const historyEntry = addHistoryEntry(sub, 'cancelled', `Geannuleerd: ${reason}`, sub.status, 'cancelled');
        return {
          ...sub,
          status: 'cancelled' as const,
          cancelReason: reason,
          cancelledDate: new Date().toISOString().split('T')[0],
          history: [...sub.history, historyEntry],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return sub;
    }));
    setShowConfirmDialog(null);
  };

  const addNote = (subscriptionId: string, note: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subscriptionId) {
        const historyEntry = addHistoryEntry(sub, 'note_added', `Notitie toegevoegd: ${note.substring(0, 50)}...`);
        const existingNotes = sub.notes || '';
        const timestamp = new Date().toLocaleString('nl-BE');
        const newNotes = existingNotes 
          ? `${existingNotes}\n\n[${timestamp}] ${note}`
          : `[${timestamp}] ${note}`;
        
        return {
          ...sub,
          notes: newNotes,
          history: [...sub.history, historyEntry],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return sub;
    }));
    setNewNote('');
    setShowNotesModal(null);
  };

  const updateSubscription = (subscriptionId: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subscriptionId) {
        const historyEntry = addHistoryEntry(sub, 'updated', 'Abonnement gegevens bijgewerkt');
        return {
          ...sub,
          ...updates,
          history: [...sub.history, historyEntry],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return sub;
    }));
    setEditingSubscription(null);
    setEditFormData({});
  };

  // UI helper functies
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <PauseCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actief';
      case 'paused': return 'Gepauzeerd';
      case 'overdue': return 'Achterstallig';
      case 'cancelled': return 'Geannuleerd';
      default: return status;
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

  // Modals
  const ConfirmDialog = () => {
    if (!showConfirmDialog) return null;

    const { action, subscription } = showConfirmDialog;
    const [reason, setReason] = useState(showConfirmDialog.reason || '');

    const actionLabels = {
      pause: 'Pauzeren',
      cancel: 'Annuleren',
      resume: 'Hervatten'
    };

    const actionColors = {
      pause: 'bg-yellow-600',
      cancel: 'bg-red-600',
      resume: 'bg-green-600'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">
            Abonnement {actionLabels[action]}
          </h3>
          <p className="text-gray-600 mb-4">
            Weet je zeker dat je het abonnement van <strong>{subscription.customerName}</strong> wilt {actionLabels[action].toLowerCase()}?
          </p>
          
          {(action === 'pause' || action === 'cancel') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reden {action === 'pause' ? '(optioneel)' : '(verplicht)'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder={action === 'pause' 
                  ? "Bijv: Vakantie, examens, financiële problemen..."
                  : "Bijv: Niet tevreden, verhuizing, financiële redenen..."
                }
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (action === 'pause') pauseSubscription(subscription.id, reason);
                else if (action === 'cancel' && reason.trim()) cancelSubscription(subscription.id, reason);
                else if (action === 'resume') resumeSubscription(subscription.id);
              }}
              disabled={action === 'cancel' && !reason.trim()}
              className={`flex-1 px-4 py-2 ${actionColors[action]} text-white rounded-md hover:opacity-90 disabled:opacity-50`}
            >
              {actionLabels[action]}
            </button>
            <button
              onClick={() => setShowConfirmDialog(null)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotesModal = () => {
    if (!showNotesModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Notities - {showNotesModal.customerName}
            </h3>
            <button onClick={() => setShowNotesModal(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bestaande notities */}
          {showNotesModal.notes && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Bestaande notities:</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap">
                {showNotesModal.notes}
              </div>
            </div>
          )}

          {/* Nieuwe notitie toevoegen */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nieuwe notitie toevoegen:
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Voeg hier je notitie toe..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => addNote(showNotesModal.id, newNote)}
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Notitie Opslaan
            </button>
            <button
              onClick={() => setShowNotesModal(null)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HistoryModal = () => {
    if (!showHistoryModal) return null;

    const actionLabels: Record<string, string> = {
      'created': 'Aangemaakt',
      'paused': 'Gepauzeerd',
      'resumed': 'Hervat',
      'cancelled': 'Geannuleerd',
      'updated': 'Bijgewerkt',
      'note_added': 'Notitie toegevoegd'
    };

    const actionColors: Record<string, string> = {
      'created': 'text-green-600',
      'paused': 'text-yellow-600',
      'resumed': 'text-green-600',
      'cancelled': 'text-red-600',
      'updated': 'text-blue-600',
      'note_added': 'text-purple-600'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Geschiedenis - {showHistoryModal.customerName}
            </h3>
            <button onClick={() => setShowHistoryModal(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {showHistoryModal.history.map((entry) => (
              <div key={entry.id} className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r">
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${actionColors[entry.action] || 'text-gray-600'}`}>
                    {actionLabels[entry.action] || entry.action}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.date).toLocaleDateString('nl-BE')}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{entry.details}</p>
                <p className="text-xs text-gray-500 mt-1">Door: {entry.by}</p>
                {entry.oldValue && entry.newValue && (
                  <p className="text-xs text-gray-500">
                    {entry.oldValue} → {entry.newValue}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowHistoryModal(null)}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Sluiten
          </button>
        </div>
      </div>
    );
  };

  const EditModal = () => {
    if (!editingSubscription) return null;

    const saveChanges = () => {
      updateSubscription(editingSubscription.id, editFormData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Bewerk Abonnement - {editingSubscription.customerName}
            </h3>
            <button onClick={() => setEditingSubscription(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klant Naam
              </label>
              <input
                type="text"
                value={editFormData.customerName ?? editingSubscription.customerName}
                onChange={(e) => setEditFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editFormData.customerEmail ?? editingSubscription.customerEmail}
                onChange={(e) => setEditFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefoon
              </label>
              <input
                type="tel"
                value={editFormData.customerPhone ?? editingSubscription.customerPhone ?? ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                className="form-input"
                placeholder="+32 xxx xx xx xx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maandprijs
              </label>
              <input
                type="number"
                value={editFormData.monthlyPrice ?? editingSubscription.monthlyPrice}
                onChange={(e) => setEditFormData(prev => ({ ...prev, monthlyPrice: Number(e.target.value) }))}
                className="form-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abonnement Type
              </label>
              <select
                value={editFormData.type ?? editingSubscription.type}
                onChange={(e) => setEditFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="form-input"
              >
                <option value="monthly">Standaard Maandabonnement</option>
                <option value="student">Student Abonnement</option>
                <option value="yearly">Jaarabonnement</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Wijzigingen Opslaan
            </button>
            <button
              onClick={() => setEditingSubscription(null)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    );
  };

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
          title="Gepauzeerd"
          value={subscriptions.filter(s => s.status === 'paused').length.toString()}
          subtitle="Tijdelijk gestopt"
          icon={Pause}
          color="yellow"
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

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Alle Abonnementen</h3>
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
                        {getStatusLabel(subscription.status)}
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${subscription.customerEmail}`} className="hover:text-blue-600">
                        {subscription.customerEmail}
                      </a>
                    </div>
                    {subscription.customerPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${subscription.customerPhone}`} className="hover:text-blue-600">
                          {subscription.customerPhone}
                        </a>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    {subscription.studioName} • Start: {new Date(subscription.startDate).toLocaleDateString('nl-BE')}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    Planning: {subscription.schedule.map(s => `${s.day} ${s.timeSlot}`).join(', ')}
                  </p>
                  
                  <p className="text-xs text-blue-600 mt-1">
                    📅 {subscription.schedule.length} × 4u = {subscription.schedule.length * 4}u per week
                  </p>

                  {/* Status specifieke info */}
                  {subscription.status === 'paused' && subscription.pauseReason && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⏸ Gepauzeerd: {subscription.pauseReason}
                    </p>
                  )}
                  {subscription.status === 'cancelled' && subscription.cancelReason && (
                    <p className="text-xs text-red-600 mt-1">
                      ❌ Geannuleerd: {subscription.cancelReason}
                    </p>
                  )}
                  {subscription.status === 'overdue' && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠ Betaling achterstallig sinds {new Date(subscription.nextBilling).toLocaleDateString('nl-BE')}
                    </p>
                  )}

                  {subscription.notes && (
                    <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                      📝 {subscription.notes.length > 100 
                        ? subscription.notes.substring(0, 100) + '...' 
                        : subscription.notes}
                    </p>
                  )}
                </div>

                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-green-600">€{subscription.monthlyPrice}/maand</p>
                  {subscription.status === 'active' && (
                    <p className="text-sm text-gray-500">
                      Volgende: {new Date(subscription.nextBilling).toLocaleDateString('nl-BE')}
                    </p>
                  )}
                  
                  {/* Action buttons */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    <button
                      onClick={() => {
                        setEditingSubscription(subscription);
                        setEditFormData({});
                      }}
                      className="btn btn-secondary text-xs"
                      title="Bewerken"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setShowNotesModal(subscription)}
                      className="btn btn-secondary text-xs"
                      title="Notities"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setShowHistoryModal(subscription)}
                      className="btn btn-secondary text-xs"
                      title="Geschiedenis"
                    >
                      <History className="w-3 h-3" />
                    </button>

                    {subscription.status === 'active' && (
                      <>
                        <button
                          onClick={() => setShowConfirmDialog({ action: 'pause', subscription })}
                          className="btn text-xs bg-yellow-600 text-white hover:bg-yellow-700"
                          title="Pauzeren"
                        >
                          <Pause className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setShowConfirmDialog({ action: 'cancel', subscription })}
                          className="btn text-xs bg-red-600 text-white hover:bg-red-700"
                          title="Annuleren"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}

                    {subscription.status === 'paused' && (
                      <button
                        onClick={() => setShowConfirmDialog({ action: 'resume', subscription })}
                        className="btn text-xs bg-green-600 text-white hover:bg-green-700"
                        title="Hervatten"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    )}

                    {subscription.status === 'overdue' && (
                      <button
                        onClick={() => console.log('Send payment reminder')}
                        className="btn btn-primary text-xs"
                        title="Herinnering versturen"
                      >
                        Herinnering
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog />
      <NotesModal />
      <HistoryModal />
      <EditModal />
    </div>
  );
}

// components/LockerManager.tsx
import React, { useState } from 'react';
import { Lock, Unlock, User, Calendar, DollarSign, Plus, AlertCircle } from 'lucide-react';
import { BusinessConfig } from '../lib/config';

interface LockerRental {
  id: string;
  lockerNumber: number;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  monthlyRate: number;
  status: 'active' | 'expired' | 'expiring-soon';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  notes?: string;
}

interface LockerManagerProps {
  config: BusinessConfig;
}

export default function LockerManager({ config }: LockerManagerProps) {
  const [lockers, setLockers] = useState<LockerRental[]>([
    {
      id: 'lock-001',
      lockerNumber: 1,
      customerName: 'Band Eclipse',
      customerEmail: 'contact@eclipse.be',
      startDate: '2025-04-01',
      endDate: '2025-07-28',
      monthlyRate: 40,
      status: 'active',
      paymentStatus: 'paid',
      notes: 'Drumset + versterkers'
    },
    {
      id: 'lock-002',
      lockerNumber: 3,
      customerName: 'The Drummers',
      customerEmail: 'drums@band.be',
      startDate: '2025-05-15',
      endDate: '2025-08-15',
      monthlyRate: 40,
      status: 'active',
      paymentStatus: 'paid'
    },
    {
      id: 'lock-003',
      lockerNumber: 5,
      customerName: 'Jazz Collective',
      customerEmail: 'jazz@collective.be',
      startDate: '2025-03-01',
      endDate: '2025-07-15',
      monthlyRate: 40,
      status: 'expiring-soon',
      paymentStatus: 'pending',
      notes: 'Dubbele bas + piano'
    },
    {
      id: 'lock-004',
      lockerNumber: 6,
      customerName: 'Electronic Artists',
      customerEmail: 'electronic@artists.be',
      startDate: '2025-06-01',
      endDate: '2025-09-01',
      monthlyRate: 40,
      status: 'active',
      paymentStatus: 'paid',
      notes: 'Synthesizers + mixing board'
    },
    {
      id: 'lock-005',
      lockerNumber: 7,
      customerName: 'Rock Session',
      customerEmail: 'rock@session.be',
      startDate: '2025-02-01',
      endDate: '2025-07-05',
      monthlyRate: 40,
      status: 'expiring-soon',
      paymentStatus: 'overdue',
      notes: 'Gitaren + versterkers'
    }
  ]);

  const [showNewRental, setShowNewRental] = useState(false);
  const [newRental, setNewRental] = useState({
    lockerNumber: 0,
    customerName: '',
    customerEmail: '',
    startDate: '',
    duration: 3, // months
    notes: ''
  });

  const [waitingList, setWaitingList] = useState([
    { name: 'Indie Band', email: 'indie@band.be', requestDate: '2025-06-25' },
    { name: 'Folk Ensemble', email: 'folk@ensemble.be', requestDate: '2025-06-28' },
    { name: 'Metal Core', email: 'metal@core.be', requestDate: '2025-06-30' }
  ]);

  const getOccupiedLockers = () => {
    return lockers.filter(locker => 
      locker.status === 'active' || locker.status === 'expiring-soon'
    );
  };

  const getAvailableLockers = () => {
    const occupiedNumbers = getOccupiedLockers().map(l => l.lockerNumber);
    const availableNumbers = [];
    for (let i = 1; i <= config.lockers.totalCount; i++) {
      if (!occupiedNumbers.includes(i)) {
        availableNumbers.push(i);
      }
    }
    return availableNumbers;
  };

  const getMonthlyRevenue = () => {
    return getOccupiedLockers().reduce((sum, locker) => sum + locker.monthlyRate, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLockerIcon = (isOccupied: boolean) => {
    return isOccupied ? 
      <Lock className="w-5 h-5 text-blue-600" /> : 
      <Unlock className="w-5 h-5 text-gray-400" />;
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const createRental = () => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + newRental.duration);

    const rental: LockerRental = {
      id: `lock-${Date.now()}`,
      lockerNumber: newRental.lockerNumber,
      customerName: newRental.customerName,
      customerEmail: newRental.customerEmail,
      startDate: newRental.startDate,
      endDate: endDate.toISOString().split('T')[0],
      monthlyRate: config.lockers.monthlyRate,
      status: 'active',
      paymentStatus: 'pending',
      notes: newRental.notes
    };

    setLockers(prev => [...prev, rental]);
    setShowNewRental(false);
    setNewRental({
      lockerNumber: 0,
      customerName: '',
      customerEmail: '',
      startDate: '',
      duration: 3,
      notes: ''
    });
  };

  const extendRental = (lockerId: string, months: number) => {
    setLockers(prev => prev.map(locker => {
      if (locker.id === lockerId) {
        const newEndDate = new Date(locker.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + months);
        return {
          ...locker,
          endDate: newEndDate.toISOString().split('T')[0],
          status: 'active' as const
        };
      }
      return locker;
    }));
  };

  const terminateRental = (lockerId: string) => {
    setLockers(prev => prev.filter(locker => locker.id !== lockerId));
  };

  const occupancyRate = (getOccupiedLockers().length / config.lockers.totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bezettingsgraad</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(occupancyRate)}%</p>
              <p className="text-sm text-gray-500">{getOccupiedLockers().length} van {config.lockers.totalCount} lockers</p>
            </div>
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maand Omzet</p>
              <p className="text-2xl font-bold text-green-600">€{getMonthlyRevenue()}</p>
              <p className="text-sm text-gray-500">€{config.lockers.monthlyRate} per locker</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wachtlijst</p>
              <p className="text-2xl font-bold text-orange-600">{waitingList.length}</p>
              <p className="text-sm text-gray-500">Geïnteresseerden</p>
            </div>
            <User className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verlopen Binnenkort</p>
              <p className="text-2xl font-bold text-red-600">
                {lockers.filter(l => l.status === 'expiring-soon').length}
              </p>
              <p className="text-sm text-gray-500">Actie nodig</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Locker Grid */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Locker Overzicht
          </h3>
          <button
            onClick={() => setShowNewRental(true)}
            className="btn btn-primary"
            disabled={getAvailableLockers().length === 0}
          >
            <Plus className="w-4 h-4" />
            Verhuur Locker
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: config.lockers.totalCount }, (_, i) => i + 1).map(number => {
            const rental = lockers.find(l => l.lockerNumber === number && 
              (l.status === 'active' || l.status === 'expiring-soon'));
            const isOccupied = !!rental;
            const daysUntilExpiry = rental ? getDaysUntilExpiry(rental.endDate) : 0;

            return (
              <div
                key={number}
                className={`p-4 rounded-lg border-2 ${
                  isOccupied 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Locker {number}</h4>
                  {getLockerIcon(isOccupied)}
                </div>

                {isOccupied && rental ? (
                  <div>
                    <p className="text-sm font-medium text-blue-600">{rental.customerName}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      Vervalt: {new Date(rental.endDate).toLocaleDateString('nl-BE')}
                    </p>
                    
                    {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                      <p className="text-xs text-yellow-600 mb-2">
                        ⚠ Vervalt over {daysUntilExpiry} dagen
                      </p>
                    )}
                    
                    {daysUntilExpiry <= 0 && (
                      <p className="text-xs text-red-600 mb-2">
                        🚨 Verlopen
                      </p>
                    )}

                    <div className="flex gap-1">
                      <button
                        onClick={() => extendRental(rental.id, 3)}
                        className="btn btn-primary text-xs flex-1"
                      >
                        Verlengen
                      </button>
                      <button
                        onClick={() => terminateRental(rental.id)}
                        className="btn text-xs bg-red-600 text-white flex-1"
                      >
                        Beëindigen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Beschikbaar</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {config.lockers.dimensions.width}×{config.lockers.dimensions.depth}×{config.lockers.dimensions.height}cm
                    </p>
                    <button
                      onClick={() => {
                        setNewRental(prev => ({ ...prev, lockerNumber: number }));
                        setShowNewRental(true);
                      }}
                      className="btn btn-success text-xs w-full"
                    >
                      Verhuur
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Rental Form */}
      {showNewRental && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Nieuwe Locker Verhuur</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locker Nummer
              </label>
              <select
                value={newRental.lockerNumber}
                onChange={(e) => setNewRental(prev => ({ ...prev, lockerNumber: Number(e.target.value) }))}
                className="form-input"
              >
                <option value={0}>Selecteer locker</option>
                {getAvailableLockers().map(number => (
                  <option key={number} value={number}>
                    Locker {number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klant Naam
              </label>
              <input
                type="text"
                value={newRental.customerName}
                onChange={(e) => setNewRental(prev => ({ ...prev, customerName: e.target.value }))}
                className="form-input"
                placeholder="Band/Artist naam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newRental.customerEmail}
                onChange={(e) => setNewRental(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="form-input"
                placeholder="contact@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Datum
              </label>
              <input
                type="date"
                value={newRental.startDate}
                onChange={(e) => setNewRental(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duur (maanden)
              </label>
              <select
                value={newRental.duration}
                onChange={(e) => setNewRental(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="form-input"
              >
                <option value={1}>1 maand</option>
                <option value={3}>3 maanden</option>
                <option value={6}>6 maanden</option>
                <option value={12}>12 maanden</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inhoud/Notities
              </label>
              <input
                type="text"
                value={newRental.notes}
                onChange={(e) => setNewRental(prev => ({ ...prev, notes: e.target.value }))}
                className="form-input"
                placeholder="Bijv: Drumset, gitaren, versterkers..."
              />
            </div>
          </div>

          {/* Price Preview */}
          {newRental.duration > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Totaalprijs:</span>
                <span className="text-xl font-bold text-green-600">
                  €{config.lockers.monthlyRate * newRental.duration}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {newRental.duration} maanden × €{config.lockers.monthlyRate}/maand
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button 
              onClick={createRental}
              className="btn btn-primary"
              disabled={!newRental.lockerNumber || !newRental.customerName || !newRental.startDate}
            >
              Verhuur Starten
            </button>
            <button onClick={() => setShowNewRental(false)} className="btn btn-secondary">
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Waiting List */}
      {waitingList.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Wachtlijst</h3>
          <div className="space-y-3">
            {waitingList.map((person, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-gray-500">{person.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Aangevraagd: {new Date(person.requestDate).toLocaleDateString('nl-BE')}
                  </p>
                  <button className="btn btn-primary text-xs mt-1">
                    Contact opnemen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Rentals Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Actieve Verhuur</h3>
        <div className="space-y-4">
          {getOccupiedLockers().map(rental => {
            const daysUntilExpiry = getDaysUntilExpiry(rental.endDate);
            return (
              <div key={rental.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">Locker {rental.lockerNumber} - {rental.customerName}</h4>
                      <span className={`status-badge ${getStatusColor(rental.status)}`}>
                        {rental.status === 'expiring-soon' ? 'Verloopt binnenkort' : 'Actief'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {rental.customerEmail} • Start: {new Date(rental.startDate).toLocaleDateString('nl-BE')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Eindigt: {new Date(rental.endDate).toLocaleDateString('nl-BE')} 
                      {daysUntilExpiry <= 30 && ` (${daysUntilExpiry} dagen)`}
                    </p>
                    {rental.notes && (
                      <p className="text-xs text-blue-600 mt-1">📦 {rental.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">€{rental.monthlyRate}/mnd</p>
                    <p className={`text-sm ${getPaymentStatusColor(rental.paymentStatus)}`}>
                      {rental.paymentStatus === 'paid' ? '✓ Betaald' : 
                       rental.paymentStatus === 'pending' ? '⏳ In behandeling' : 
                       '⚠ Achterstallig'}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => extendRental(rental.id, 3)}
                        className="btn btn-primary text-xs"
                      >
                        Verlengen
                      </button>
                      <button 
                        onClick={() => terminateRental(rental.id)}
                        className="btn text-xs bg-red-600 text-white"
                      >
                        Beëindigen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

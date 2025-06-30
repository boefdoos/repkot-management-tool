// components/BookingManager.tsx - Updated with Quick Book feature
import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Users, AlertCircle, CheckCircle, Plus, Zap } from 'lucide-react';
import { BusinessConfig } from '../lib/config';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  studioId: string;
  studioName: string;
  date: string;
  timeSlot: string;
  duration: number; // in hours
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingType: 'hourly' | 'daily';
  notes?: string;
  createdAt: string;
}

interface AvailableSlot {
  studio: string;
  studioId: string;
  day: string;
  slot: string;
  date: string;
  timeSlot: string;
  available: boolean;
}

interface BookingManagerProps {
  config: BusinessConfig;
}

export default function BookingManager({ config }: BookingManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'book-001',
      customerName: 'Indie Startup',
      customerEmail: 'contact@indiestartup.be',
      studioId: 'studio-b',
      studioName: 'Studio B',
      date: '2025-06-25',
      timeSlot: 'Middag (14:00-17:00)',
      duration: 3,
      price: 40,
      status: 'completed',
      bookingType: 'daily',
      notes: 'Album opname sessie',
      createdAt: '2025-06-20'
    },
    {
      id: 'book-002',
      customerName: 'Solo Artist',
      customerEmail: 'artist@solo.be',
      studioId: 'studio-a',
      studioName: 'Studio A',
      date: '2025-06-28',
      timeSlot: 'Avond (18:00-21:00)',
      duration: 3,
      price: 40,
      status: 'confirmed',
      bookingType: 'daily',
      createdAt: '2025-06-25'
    },
    {
      id: 'book-003',
      customerName: 'Workshop Band',
      customerEmail: 'workshop@band.be',
      studioId: 'studio-c',
      studioName: 'Studio C',
      date: '2025-07-02',
      timeSlot: 'Ochtend+Middag (10:00-17:00)',
      duration: 6,
      price: 80,
      status: 'confirmed',
      bookingType: 'daily',
      notes: '2 dagdelen achter elkaar',
      createdAt: '2025-06-28'
    },
    {
      id: 'book-004',
      customerName: 'Jazz Session',
      customerEmail: 'jazz@session.be',
      studioId: 'studio-a',
      studioName: 'Studio A',
      date: '2025-07-05',
      timeSlot: 'Middag (14:00-16:00)',
      duration: 2,
      price: 20,
      status: 'pending',
      bookingType: 'hourly',
      createdAt: '2025-06-30'
    }
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerEmail: '',
    studioId: '',
    date: '',
    timeSlot: '',
    bookingType: 'daily' as 'hourly' | 'daily',
    duration: 3,
    notes: ''
  });

  const timeSlots = [
    { id: 'morning', label: 'Ochtend (10:00-13:00)', hours: 3 },
    { id: 'afternoon', label: 'Middag (14:00-17:00)', hours: 3 },
    { id: 'evening', label: 'Avond (18:00-21:00)', hours: 3 },
    { id: 'late', label: 'Late Avond (19:00-22:00)', hours: 3 },
    { id: 'double', label: 'Dubbel dagdeel (6 uur)', hours: 6 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const calculatePrice = () => {
    const studio = config.studios.find(s => s.id === newBooking.studioId);
    if (!studio) return 0;

    if (newBooking.bookingType === 'hourly') {
      return studio.hourlyRate * newBooking.duration;
    } else {
      return studio.dayRate * Math.ceil(newBooking.duration / 3);
    }
  };

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear;
    });

    const totalRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.price, 0);
    const totalHours = monthlyBookings.reduce((sum, booking) => sum + booking.duration, 0);

    return {
      count: monthlyBookings.length,
      revenue: totalRevenue,
      hours: totalHours,
      averageBooking: monthlyBookings.length > 0 ? totalRevenue / monthlyBookings.length : 0
    };
  };

  const getAvailableSlots = (): AvailableSlot[] => {
    // Simuleer beschikbare slots - in echte app zou dit uit database komen
    const today = new Date();
    const slots: AvailableSlot[] = [];
    
    // Genereer slots voor de komende 7 dagen
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('nl-BE', { weekday: 'long' });
      const dateStr = date.toISOString().split('T')[0];
      
      config.studios.forEach(studio => {
        timeSlots.slice(0, 4).forEach(timeSlot => { // Exclude double timeslot for availability
          // Simuleer dat sommige slots bezet zijn
          const isBooked = Math.random() > 0.7; // 30% kans dat slot bezet is
          
          if (!isBooked) {
            slots.push({
              studio: studio.name,
              studioId: studio.id,
              day: dayName,
              slot: timeSlot.label.split(' ')[0], // "Ochtend", "Middag", etc.
              date: dateStr,
              timeSlot: timeSlot.label,
              available: true
            });
          }
        });
      });
    }
    
    return slots.sort((a, b) => a.date.localeCompare(b.date));
  };

  const quickBookSlot = (slot: AvailableSlot) => {
    setNewBooking({
      customerName: '',
      customerEmail: '',
      studioId: slot.studioId,
      date: slot.date,
      timeSlot: slot.timeSlot,
      bookingType: 'daily',
      duration: 3,
      notes: `Snel geboekt slot: ${slot.day} ${slot.slot}`
    });
    setShowNewForm(true);
  };

  const createBooking = () => {
    const studio = config.studios.find(s => s.id === newBooking.studioId);
    if (!studio) return;

    const price = calculatePrice();

    const booking: Booking = {
      id: `book-${Date.now()}`,
      customerName: newBooking.customerName,
      customerEmail: newBooking.customerEmail,
      studioId: newBooking.studioId,
      studioName: studio.name,
      date: newBooking.date,
      timeSlot: newBooking.timeSlot,
      duration: newBooking.duration,
      price: price,
      status: 'pending',
      bookingType: newBooking.bookingType,
      notes: newBooking.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => [...prev, booking]);
    setShowNewForm(false);
    setNewBooking({
      customerName: '',
      customerEmail: '',
      studioId: '',
      date: '',
      timeSlot: '',
      bookingType: 'daily',
      duration: 3,
      notes: ''
    });
  };

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const monthlyStats = getMonthlyStats();
  const availableSlots = getAvailableSlots();

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-800">Losse Dagdelen - Aanvullende Inkomsten</h4>
            <p className="text-sm text-blue-700">
              Maandabonnementen vormen 77% van de studio-omzet. Losse dagdelen vullen resterende tijdsloten op.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deze Maand</p>
              <p className="text-2xl font-bold text-blue-600">{monthlyStats.count} dagdelen</p>
              <p className="text-sm text-gray-500">€{monthlyStats.revenue} omzet</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Uren</p>
              <p className="text-2xl font-bold text-green-600">{monthlyStats.hours}h</p>
              <p className="text-sm text-gray-500">{Math.round(monthlyStats.revenue / monthlyStats.hours || 0)}€/uur gem.</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gem. Boeking</p>
              <p className="text-2xl font-bold text-purple-600">€{Math.round(monthlyStats.averageBooking)}</p>
              <p className="text-sm text-gray-500">Per dagdeel</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Openstaand</p>
              <p className="text-2xl font-bold text-orange-600">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500">Te bevestigen</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Available Slots Info with Quick Book */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            Beschikbare Tijdsloten - Snel Boeken
          </h3>
          <button
            onClick={() => setShowAllSlots(!showAllSlots)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showAllSlots ? 'Toon minder' : `Toon alle ${availableSlots.length} slots`}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAllSlots ? availableSlots : availableSlots.slice(0, 6)).map((slot, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-green-800">{slot.studio}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Beschikbaar
                  </span>
                </div>
                <p className="text-sm text-gray-600">{slot.day}</p>
                <p className="text-xs text-gray-500">{slot.timeSlot}</p>
                <p className="text-xs text-gray-400">{new Date(slot.date).toLocaleDateString('nl-BE')}</p>
              </div>
              <button 
                onClick={() => quickBookSlot(slot)}
                className="btn btn-primary text-xs ml-3"
                title={`Boek ${slot.studio} - ${slot.day} ${slot.slot}`}
              >
                <Zap className="w-3 h-3 mr-1" />
                Boek Nu
              </button>
            </div>
          ))}
        </div>
        
        {availableSlots.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Geen beschikbare slots deze week</p>
            <p className="text-sm">Probeer volgende week of neem contact op</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Losse Boekingen</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Boeking
        </button>
      </div>

      {/* New Booking Form */}
      {showNewForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Nieuwe Losse Boeking</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klant Naam
              </label>
              <input
                type="text"
                value={newBooking.customerName}
                onChange={(e) => setNewBooking(prev => ({ ...prev, customerName: e.target.value }))}
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
                value={newBooking.customerEmail}
                onChange={(e) => setNewBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="form-input"
                placeholder="contact@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Studio
              </label>
              <select
                value={newBooking.studioId}
                onChange={(e) => setNewBooking(prev => ({ ...prev, studioId: e.target.value }))}
                className="form-input"
              >
                <option value="">Selecteer studio</option>
                {config.studios.map(studio => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name} ({studio.size}m² - €{studio.dayRate}/dagdeel)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking(prev => ({ ...prev, date: e.target.value }))}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tijdslot
              </label>
              <select
                value={newBooking.timeSlot}
                onChange={(e) => {
                  const selectedSlot = timeSlots.find(slot => slot.label === e.target.value);
                  setNewBooking(prev => ({ 
                    ...prev, 
                    timeSlot: e.target.value,
                    duration: selectedSlot?.hours || 3
                  }));
                }}
                className="form-input"
              >
                <option value="">Selecteer tijdslot</option>
                {timeSlots.map(slot => (
                  <option key={slot.id} value={slot.label}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Boekingstype
              </label>
              <select
                value={newBooking.bookingType}
                onChange={(e) => setNewBooking(prev => ({ ...prev, bookingType: e.target.value as any }))}
                className="form-input"
              >
                <option value="daily">Dagdeel (3 uur)</option>
                <option value="hourly">Per uur</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notities (optioneel)
              </label>
              <textarea
                value={newBooking.notes}
                onChange={(e) => setNewBooking(prev => ({ ...prev, notes: e.target.value }))}
                className="form-input"
                rows={2}
                placeholder="Bijzondere wensen of opmerkingen..."
              />
            </div>
          </div>

          {/* Price Preview */}
          {newBooking.studioId && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Totaalprijs:</span>
                <span className="text-xl font-bold text-blue-600">€{calculatePrice()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {newBooking.duration} uur × €{config.studios.find(s => s.id === newBooking.studioId)?.hourlyRate}/uur
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button onClick={createBooking} className="btn btn-primary">
              Boeking Aanmaken
            </button>
            <button onClick={() => setShowNewForm(false)} className="btn btn-secondary">
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recente Boekingen</h3>
        </div>
        <div className="p-6 space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{booking.customerName}</h4>
                    <span className={`status-badge ${getStatusColor(booking.status)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </span>
                    {booking.bookingType === 'hourly' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Per uur
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {booking.studioName} • {new Date(booking.date).toLocaleDateString('nl-BE')} • {booking.timeSlot}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.duration} uur • Geboekt op {new Date(booking.createdAt).toLocaleDateString('nl-BE')}
                  </p>
                  {booking.notes && (
                    <p className="text-xs text-blue-600 mt-1">📝 {booking.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">€{booking.price}</p>
                  <div className="mt-2 flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="btn btn-primary text-xs"
                        >
                          Bevestigen
                        </button>
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="btn text-xs bg-red-600 text-white"
                        >
                          Annuleren
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="btn btn-secondary text-xs"
                      >
                        Voltooid
                      </button>
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

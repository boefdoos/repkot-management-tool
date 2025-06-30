// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { BusinessConfig, defaultConfig } from './config';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Types for Firebase documents
export interface FirebaseSubscription {
  id?: string;
  customerName: string;
  customerEmail: string;
  studioId: string;
  studioName: string;
  schedule: Array<{ day: string; timeSlot: string; }>;
  startDate: string;
  nextBilling: string;
  monthlyPrice: number;
  status: 'active' | 'paused' | 'cancelled' | 'overdue';
  type: 'monthly' | 'yearly' | 'student';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseBooking {
  id?: string;
  customerName: string;
  customerEmail: string;
  studioId: string;
  studioName: string;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingType: 'hourly' | 'daily';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseLocker {
  id?: string;
  lockerNumber: number;
  customerName?: string;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
  monthlyRate?: number;
  status: 'available' | 'occupied' | 'maintenance';
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseAccessCode {
  id?: string;
  code: string;
  customerName: string;
  studioId?: string;
  validFrom: Timestamp;
  validUntil: Timestamp;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
  createdAt: Timestamp;
}

// Firebase Service Class
export default class FirebaseService {
  // Configuration management
  static async getConfig(): Promise<BusinessConfig> {
    try {
      const configDoc = await getDoc(doc(db, 'settings', 'business-config'));
      if (configDoc.exists()) {
        return configDoc.data() as BusinessConfig;
      } else {
        // If no config exists, create default
        await this.saveConfig(defaultConfig);
        return defaultConfig;
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      return defaultConfig;
    }
  }

  static async saveConfig(config: BusinessConfig): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', 'business-config'), {
        ...config,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  // Subscription management
  static async createSubscription(subscription: Omit<FirebaseSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'subscriptions'), {
        ...subscription,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async getSubscriptions(status?: string): Promise<FirebaseSubscription[]> {
    try {
      let q = query(collection(db, 'subscriptions'), orderBy('createdAt', 'desc'));
      
      if (status) {
        q = query(collection(db, 'subscriptions'), 
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseSubscription));
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  static async updateSubscription(id: string, updates: Partial<FirebaseSubscription>): Promise<void> {
    try {
      await updateDoc(doc(db, 'subscriptions', id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  static async deleteSubscription(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'subscriptions', id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }

  // Booking management
  static async createBooking(booking: Omit<FirebaseBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...booking,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async getBookings(studioId?: string, date?: string): Promise<FirebaseBooking[]> {
    try {
      let q = query(collection(db, 'bookings'), orderBy('date', 'desc'));
      
      if (studioId && date) {
        q = query(collection(db, 'bookings'), 
          where('studioId', '==', studioId),
          where('date', '==', date),
          orderBy('createdAt', 'desc')
        );
      } else if (studioId) {
        q = query(collection(db, 'bookings'), 
          where('studioId', '==', studioId),
          orderBy('createdAt', 'desc')
        );
      } else if (date) {
        q = query(collection(db, 'bookings'), 
          where('date', '==', date),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseBooking));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  }

  static async updateBooking(id: string, updates: Partial<FirebaseBooking>): Promise<void> {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Locker management
  static async getLockers(): Promise<FirebaseLocker[]> {
    try {
      const q = query(collection(db, 'lockers'), orderBy('lockerNumber', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseLocker));
    } catch (error) {
      console.error('Error fetching lockers:', error);
      return [];
    }
  }

  static async updateLocker(lockerNumber: number, updates: Partial<FirebaseLocker>): Promise<void> {
    try {
      const q = query(collection(db, 'lockers'), where('lockerNumber', '==', lockerNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...updates,
          updatedAt: Timestamp.now()
        });
      } else {
        // Create new locker entry
        await addDoc(collection(db, 'lockers'), {
          lockerNumber,
          ...updates,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error updating locker:', error);
      throw error;
    }
  }

  // Access code management
  static async createAccessCode(accessCode: Omit<FirebaseAccessCode, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'accessCodes'), {
        ...accessCode,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating access code:', error);
      throw error;
    }
  }

  static async getActiveAccessCodes(): Promise<FirebaseAccessCode[]> {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, 'accessCodes'),
        where('isActive', '==', true),
        where('validUntil', '>', now),
        orderBy('validUntil', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseAccessCode));
    } catch (error) {
      console.error('Error fetching access codes:', error);
      return [];
    }
  }

  static async deactivateAccessCode(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'accessCodes', id), {
        isActive: false
      });
    } catch (error) {
      console.error('Error deactivating access code:', error);
      throw error;
    }
  }

  // Analytics and reporting
  static async getMonthlyStats(year: number, month: number) {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
      
      // Get bookings for the month
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
      
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookings = bookingsSnapshot.docs.map(doc => doc.data() as FirebaseBooking);
      
      // Get active subscriptions
      const subscriptionsQuery = query(
        collection(db, 'subscriptions'),
        where('status', '==', 'active')
      );
      
      const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
      const subscriptions = subscriptionsSnapshot.docs.map(doc => doc.data() as FirebaseSubscription);
      
      // Calculate revenues
      const bookingRevenue = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
      const subscriptionRevenue = subscriptions.reduce((sum, sub) => sum + (sub.monthlyPrice || 0), 0);
      
      // Get locker revenue
      const lockersQuery = query(
        collection(db, 'lockers'),
        where('status', '==', 'occupied')
      );
      
      const lockersSnapshot = await getDocs(lockersQuery);
      const occupiedLockers = lockersSnapshot.docs.length;
      const lockerRevenue = occupiedLockers * 40; // Default locker rate
      
      const totalRevenue = bookingRevenue + subscriptionRevenue + lockerRevenue;
      const totalBookings = bookings.length;
      const studioHours = bookings.reduce((sum, booking) => sum + (booking.duration || 0), 0);

      return {
        totalRevenue,
        bookingRevenue,
        subscriptionRevenue,
        lockerRevenue,
        totalBookings,
        studioHours,
        activeSubscriptions: subscriptions.length,
        occupiedLockers,
        averageBookingValue: totalBookings > 0 ? bookingRevenue / totalBookings : 0
      };
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return {
        totalRevenue: 0,
        bookingRevenue: 0,
        subscriptionRevenue: 0,
        lockerRevenue: 0,
        totalBookings: 0,
        studioHours: 0,
        activeSubscriptions: 0,
        occupiedLockers: 0,
        averageBookingValue: 0
      };
    }
  }

  // Real-time listeners
  static subscribeToSubscriptions(callback: (subscriptions: FirebaseSubscription[]) => void) {
    const q = query(collection(db, 'subscriptions'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const subscriptions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseSubscription));
      callback(subscriptions);
    });
  }

  static subscribeToBookings(callback: (bookings: FirebaseBooking[]) => void) {
    const q = query(collection(db, 'bookings'), orderBy('date', 'desc'), limit(50));
    
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebaseBooking));
      callback(bookings);
    });
  }

  // Utility functions
  static generateAccessCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static async getAvailableTimeSlots(studioId: string, date: string): Promise<string[]> {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('studioId', '==', studioId),
        where('date', '==', date),
        where('status', 'in', ['confirmed', 'pending'])
      );
      
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookedSlots = bookingsSnapshot.docs.map(doc => doc.data().timeSlot);
      
      const allSlots = [
        'Ochtend (10:00-13:00)',
        'Middag (14:00-17:00)',
        'Avond (18:00-21:00)',
        'Late Avond (19:00-22:00)'
      ];
      
      return allSlots.filter(slot => !bookedSlots.includes(slot));
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return [];
    }
  }
}

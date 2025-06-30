// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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

// Simplified Firebase Service for now
export default class FirebaseService {
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
      await setDoc(doc(db, 'settings', 'business-config'), config);
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }
}

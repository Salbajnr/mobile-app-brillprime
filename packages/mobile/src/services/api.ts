
import { auth, db, storage } from '@brillprime/shared/config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private static instance: ApiService;

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Auth methods
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('user_token', await userCredential.user.getIdToken());
      return userCredential.user;
    } catch (error) {
      throw new Error(`Sign in failed: ${error.message}`);
    }
  }

  async signUp(email: string, password: string, userData: any): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        ...userData,
        createdAt: new Date().toISOString()
      });

      await AsyncStorage.setItem('user_token', await userCredential.user.getIdToken());
      return userCredential.user;
    } catch (error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user_token');
    } catch (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }

  // Marketplace methods
  async getProducts(): Promise<any[]> {
    try {
      const productsCollection = collection(db, 'products');
      const querySnapshot = await getDocs(productsCollection);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async createOrder(orderData: any): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('user_token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      return result.orderId;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Fuel ordering methods
  async orderFuel(fuelData: any): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/fuel/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('user_token')}`
        },
        body: JSON.stringify(fuelData)
      });

      if (!response.ok) {
        throw new Error('Failed to order fuel');
      }

      const result = await response.json();
      return result.orderId;
    } catch (error) {
      throw new Error(`Failed to order fuel: ${error.message}`);
    }
  }

  // Toll gate payment methods
  async processTollPayment(qrData: string, amount: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/toll/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('user_token')}`
        },
        body: JSON.stringify({ qrData, amount })
      });

      if (!response.ok) {
        throw new Error('Failed to process toll payment');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to process toll payment: ${error.message}`);
    }
  }

  // User profile methods
  async getUserProfile(userId: string): Promise<any> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      throw new Error('User not found');
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  async updateUserProfile(userId: string, userData: any): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }
}

export default ApiService.getInstance();

import { 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User } from '../../types/user';
import { APP_CONSTANTS } from '../../utils/constants';
import { FirebaseError } from 'firebase/app';

export const authService = {
  async login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return this.getUserData(user.uid);
  },

  async logout() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  async getUserData(id: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return { id: userDoc.id, ...userDoc.data() } as User;
  },

  validateSignupInput(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Password validation
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  },

  async signup(email: string, password: string, data: { schoolName: string }) {
    try {
      this.validateSignupInput(email, password);
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        email,
        schoolName: data.schoolName,
        createdAt: new Date(),
        role: 'admin'
      });

      // Create initial subscription
      await setDoc(doc(db, 'subscriptions', user.uid), {
        plan: 'free',
        status: 'active',
        reportCardsLimit: APP_CONSTANTS.MAX_FREE_REPORTS,
        reportCardsUsed: 0,
        startDate: new Date()
      });

      return this.getUserData(user.uid);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            throw new Error('This email is already registered');
          case 'auth/invalid-email':
            throw new Error('Please enter a valid email address');
          case 'auth/operation-not-allowed':
            throw new Error('Email/password accounts are not enabled. Please contact support.');
          case 'auth/weak-password':
            throw new Error('Password should be at least 6 characters');
          default:
            throw new Error('Failed to create account. Please try again.');
        }
      }
      throw error;
    }
  }
};
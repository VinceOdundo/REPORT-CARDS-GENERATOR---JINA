import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User } from '../../types/user';
import { APP_CONSTANTS } from '../../utils/constants';
import { FirebaseError } from 'firebase/app';

class AuthService {
  async signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user) throw new Error('No user returned from authentication');
      return userCredential.user;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error; // TypeScript knows this line is unreachable but it's good practice
    }
  }
  async signUpWithEmail(email: string, password: string, userData: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await this.createUserProfile(userCredential.user.uid, userData);
      return userCredential.user;
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }
  async signInWithGoogle(): Promise<FirebaseUser> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user) throw new Error('No user returned from Google authentication');
      return result.user;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  }

  private async createUserProfile(userId: string, userData: any) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async logout() {
    await signOut(auth);
  }

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async getUserData(id: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

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
  }

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
  private handleAuthError(error: any): void {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/wrong-password':
        throw new Error('Invalid password');
      case 'auth/user-not-found':
        throw new Error('User not found');
      case 'auth/email-already-in-use':
        throw new Error('Email already registered');
      default:
        throw new Error('Authentication failed');
    }
  }
  onAuthStateChange(callback: (user: any) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();
import { 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User } from '../../types/user';

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

  async getUserData(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
};
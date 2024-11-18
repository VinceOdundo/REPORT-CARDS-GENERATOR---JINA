import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { School } from '../../types/school';

export const schoolService = {
  async getSchool(userId: string): Promise<School> {
    const docRef = doc(db, 'schools', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('School not found');
    }
    
    return { id: docSnap.id, ...docSnap.data() } as School;
  },

  async updateSchool(schoolId: string, data: Partial<School>): Promise<void> {
    const docRef = doc(db, 'schools', schoolId);
    await updateDoc(docRef, data);
  }
};
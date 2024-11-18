import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export class RateLimiter {
  private static limitPerHour = 100;

  static async checkLimit(userId: string, action: string): Promise<boolean> {
    const rateLimitRef = doc(db, 'rateLimits', `${userId}_${action}`);
    const rateLimitDoc = await getDoc(rateLimitRef);
    const currentTime = Date.now();

    if (!rateLimitDoc.exists()) {
      await setDoc(rateLimitRef, {
        count: 1,
        lastChecked: currentTime
      });
      return true;
    } else {
      const data = rateLimitDoc.data();
      const timeElapsed = currentTime - data.lastChecked;

      if (timeElapsed > 3600000) { // Reset every hour
        await updateDoc(rateLimitRef, {
          count: 1,
          lastChecked: currentTime
        });
        return true;
      } else if (data.count < this.limitPerHour) {
        await updateDoc(rateLimitRef, {
          count: data.count + 1
        });
        return true;
      } else {
        return false;
      }
    }
  }
}

import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc, increment, arrayUnion } from 'firebase/firestore';

export interface Progress {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export class ProgressTracker {
  private readonly BASE_XP = 100;
  private readonly XP_MULTIPLIER = 1.5;

  calculateXpForLevel(level: number): number {
    return Math.floor(this.BASE_XP * Math.pow(this.XP_MULTIPLIER, level - 1));
  }

  async updateProgress(userId: string, xpGained: number): Promise<Progress> {
    const oldProgress = await this.getProgress(userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    const currentProgress: Progress = userData?.progress || { level: 1, xp: 0, xpToNextLevel: this.BASE_XP };

    let { level, xp } = currentProgress;
    xp += xpGained;
    let xpToNextLevel = this.calculateXpForLevel(level);

    // Level up while user has enough XP
    while (xp >= xpToNextLevel) {
      xp -= xpToNextLevel;
      level++;
      xpToNextLevel = this.calculateXpForLevel(level);
    }

    const newProgress: Progress = { level, xp, xpToNextLevel };
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      progress: newProgress,
      points: increment(xpGained)
    });

    // Check if leveled up
    if (newProgress.level > oldProgress.level) {
      await this.notifyLevelUp(userId, newProgress.level);
    }

    return newProgress;
  }

  async getProgress(userId: string): Promise<Progress> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const progress = userDoc.data()?.progress;
    return progress || { level: 1, xp: 0, xpToNextLevel: this.BASE_XP };
  }

  private async notifyLevelUp(userId: string, newLevel: number) {
    const notification = {
      type: 'LEVEL_UP',
      message: `Congratulations! You've reached level ${newLevel}!`,
      timestamp: new Date()
    };
    
    await updateDoc(doc(db, 'users', userId), {
      notifications: arrayUnion(notification)
    });
  }
}
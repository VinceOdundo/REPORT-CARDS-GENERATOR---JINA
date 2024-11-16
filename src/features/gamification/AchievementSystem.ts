import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  target: number;
}

export const achievements = {
  FIRST_REPORT: {
    name: 'First Report',
    description: 'Generate your first report card',
    icon: '🎉',
    points: 100,
    target: 1
  },
  REPORT_MASTER: {
    name: 'Report Master',
    description: 'Generate 100 report cards',
    icon: '🎓',
    points: 500,
    target: 100
  },
  EARLY_ADOPTER: {
    name: 'Early Adopter',
    description: 'Among first 100 schools to join',
    icon: '⭐',
    points: 200,
    target: 1
  }
};

export class AchievementSystem {
  async checkAchievements(userId: string, action: string, value: number = 1) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    const userAchievements = userData?.achievements || {};

    Object.entries(achievements).forEach(async ([id, achievement]) => {
      if (!userAchievements[id] || !userAchievements[id].unlocked) {
        const progress = (userAchievements[id]?.progress || 0) + value;
        if (progress >= achievement.target) {
          await this.unlockAchievement(userId, id);
        } else {
          await this.updateProgress(userId, id, progress);
        }
      }
    });
  }

  private async unlockAchievement(userId: string, achievementId: string) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`achievements.${achievementId}`]: {
        unlocked: true,
        unlockedAt: new Date(),
        progress: achievements[achievementId].target
      },
      points: increment(achievements[achievementId].points)
    });
  }

  private async updateProgress(userId: string, achievementId: string, progress: number) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`achievements.${achievementId}.progress`]: progress
    });
  }
}
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'REPORT_CARDS' | 'PREMIUM_DAYS' | 'AD_FREE_DAYS';
  value: number;
}

export const rewards = {
  EXTRA_REPORTS_5: {
    name: '5 Extra Reports',
    description: 'Get 5 additional report cards',
    cost: 300,
    type: 'REPORT_CARDS' as const,
    value: 5
  },
  PREMIUM_WEEK: {
    name: 'Premium Week',
    description: '7 days of premium features',
    cost: 500,
    type: 'PREMIUM_DAYS' as const,
    value: 7
  },
  AD_FREE_MONTH: {
    name: 'Ad-Free Month',
    description: '30 days without ads',
    cost: 400,
    type: 'AD_FREE_DAYS' as const,
    value: 30
  }
};

export class RewardSystem {
  async claimReward(userId: string, rewardId: string): Promise<boolean> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    const reward = rewards[rewardId];

    if (!reward || userData?.points < reward.cost) {
      return false;
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      points: increment(-reward.cost),
      [`rewards.${reward.type}`]: increment(reward.value)
    });

    return true;
  }

  async getUserRewards(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data()?.rewards || {};
  }
}
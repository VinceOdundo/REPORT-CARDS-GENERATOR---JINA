import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { analyticsService } from '../analytics/analyticsService';

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'REPORT_CARDS' | 'PREMIUM_DAYS' | 'AD_FREE_DAYS' | 'ANALYTICS_ACCESS';
  value: number;
}

export const rewards = {
  EXTRA_REPORTS_10: {
    name: '10 Extra Reports',
    description: 'Get 10 additional report cards',
    cost: 500,
    type: 'REPORT_CARDS',
    value: 10
  },
  PREMIUM_MONTH: {
    name: 'Premium Month',
    description: '30 days of premium features',
    cost: 1500,
    type: 'PREMIUM_DAYS',
    value: 30
  },
  ANALYTICS_WEEK: {
    name: 'Analytics Access',
    description: '7 days of advanced analytics',
    cost: 800,
    type: 'ANALYTICS_ACCESS',
    value: 7
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

    const updates: any = {
      points: increment(-reward.cost),
      [`rewards.${reward.type}`]: increment(reward.value)
    };

    // Add expiration for time-based rewards
    if (['PREMIUM_DAYS', 'AD_FREE_DAYS', 'ANALYTICS_ACCESS'].includes(reward.type)) {
      updates[`rewards.${reward.type}_expiry`] = new Date(Date.now() + (reward.value * 24 * 60 * 60 * 1000));
    }

    await updateDoc(doc(db, 'users', userId), updates);
    await analyticsService.trackEvent(userId, 'reward_claimed', { rewardId, cost: reward.cost });

    return true;
  }

  async getUserRewards(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data()?.rewards || {};
  }
}
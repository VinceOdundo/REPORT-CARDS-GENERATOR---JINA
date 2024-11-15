import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Subscription } from '../../types/subscription';
import { withRetry } from '../../utils/errorHandling';
import { BatchOperations } from '../../utils/batchOperations';


class BillingService {
  private readonly COLLECTION = 'subscriptions';

  async getSubscription(userId: string): Promise<Subscription> {
    return withRetry(async () => {
      const subDoc = await getDoc(doc(db, this.COLLECTION, userId));
      if (!subDoc.exists()) {
        return this.createFreeSubscription(userId);
      }
      return { id: subDoc.id, ...subDoc.data() } as Subscription;
    });
  }

  async updateSubscription(userId: string, data: Partial<Subscription>): Promise<void> {
    return withRetry(async () => {
      await BatchOperations.batchWrite([{
        collection: this.COLLECTION,
        id: userId,
        data,
        type: 'update'
      }]);
    });
  }

  async createSubscription(userId: string, plan: string): Promise<void> {
    const subscription = {
      userId,
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      reportCardsLimit: plan === 'premium' ? -1 : plan === 'basic' ? 100 : 40,
      reportCardsUsed: 0
    };
    
    await updateDoc(doc(db, 'subscriptions', userId), subscription);
  }

  async cancelSubscription(userId: string): Promise<void> {
    await updateDoc(doc(db, 'subscriptions', userId), {
      status: 'cancelled',
      endDate: new Date()
    });
  }

  async updatePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    await updateDoc(doc(db, 'subscriptions', userId), {
      paymentMethodId
    });
  }

  private async createFreeSubscription(userId: string): Promise<Subscription> {
    const subscription = {
      userId,
      plan: 'free',
      status: 'active',
      startDate: new Date(),
      endDate: null,
      reportCardsLimit: 40,
      reportCardsUsed: 0
    };
    
    await updateDoc(doc(db, 'subscriptions', userId), subscription);
    return subscription as Subscription;
  }
};
export const billingService = new BillingService();
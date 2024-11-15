import { db } from '../../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

interface AnalyticsEvent {
  userId: string;
  event: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export const analyticsService = {
  async trackEvent(userId: string, event: string, metadata: Record<string, any> = {}) {
    const eventData: AnalyticsEvent = {
      userId,
      event,
      metadata,
      timestamp: new Date()
    };
    
    await addDoc(collection(db, 'analytics'), eventData);
  },

  async trackReportGeneration(userId: string, reportCount: number) {
    await this.trackEvent(userId, 'report_generated', { reportCount });
  },

  async trackLogin(userId: string) {
    await this.trackEvent(userId, 'user_login');
  }
};

import { db } from '../../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  pendingReports: {
    key: string;
    value: {
      id: string;
      data: any;
      createdAt: number;
      syncStatus: 'pending' | 'syncing' | 'error';
    };
  };
}

export class OfflineSync {
  private db: IDBPDatabase<OfflineDB>;

  async initialize() {
    this.db = await openDB<OfflineDB>('schoolreports-offline', 1, {
      upgrade(db) {
        db.createObjectStore('pendingReports', { keyPath: 'id' });
      },
    });
  }

  async saveReportOffline(reportData: any) {
    await this.db.add('pendingReports', {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: reportData,
      createdAt: Date.now(),
      syncStatus: 'pending'
    });
  }

  async syncPendingReports() {
    const pendingReports = await this.db.getAll('pendingReports');
    
    for (const report of pendingReports) {
      try {
        await this.db.put('pendingReports', { ...report, syncStatus: 'syncing' });
        
        await setDoc(doc(collection(db, 'reports')), {
          ...report.data,
          syncedAt: new Date(),
          originalCreatedAt: new Date(report.createdAt)
        });

        await this.db.delete('pendingReports', report.id);
      } catch (error) {
        await this.db.put('pendingReports', { ...report, syncStatus: 'error' });
      }
    }
  }

  async getPendingReportsCount(): Promise<number> {
    return await this.db.count('pendingReports');
  }
}
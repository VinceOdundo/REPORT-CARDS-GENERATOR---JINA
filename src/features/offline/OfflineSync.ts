import { doc, setDoc, collection } from 'firebase/firestore';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { BatchOperations } from '../../utils/batchOperations';

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
  private db!: IDBPDatabase<OfflineDB>;

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
    const batchSize = 500;
    
    for (let i = 0; i < pendingReports.length; i += batchSize) {
      const batch = pendingReports.slice(i, i + batchSize);
      await BatchOperations.executeBatch(
        batch.map(report => ({
          type: 'set',
          path: `reports/${report.id}`,
          data: {
            ...report.data,
            syncedAt: new Date(),
            originalCreatedAt: new Date(report.createdAt)
          }
        }))
      );

      await Promise.all(
        batch.map(report => 
          this.db.delete('pendingReports', report.id)
        )
      );
    }
  }

  async getPendingReportsCount(): Promise<number> {
    return await this.db.count('pendingReports');
  }
}
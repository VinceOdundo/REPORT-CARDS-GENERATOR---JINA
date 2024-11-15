import { db } from '../config/firebase';
import { writeBatch, doc } from 'firebase/firestore';

export const BatchOperations = {
  async batchWrite(operations: Array<{
    collection: string;
    id: string;
    data: any;
    type: 'set' | 'update' | 'delete';
  }>) {
    const batch = writeBatch(db);
    
    operations.forEach(op => {
      const ref = doc(db, op.collection, op.id);
      switch (op.type) {
        case 'set':
          batch.set(ref, op.data);
          break;
        case 'update':
          batch.update(ref, op.data);
          break;
        case 'delete':
          batch.delete(ref);
          break;
      }
    });

    await batch.commit();
  }
};
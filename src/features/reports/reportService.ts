import { db, storage } from '../../config/firebase';
import { doc, collection, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Student, School } from '../../types/school';

export const reportService = {
  async generate(students: Student[], schoolInfo: School, userId: string) {
    const reportsCollection = collection(db, 'reports');
    const results = [];

    for (const student of students) {
      // Generate report data
      const reportData = {
        studentId: student.id,
        schoolId: schoolInfo.id,
        generatedBy: userId,
        createdAt: new Date(),
        status: 'completed',
        // Add other report fields
      };

      // Save to Firestore
      const docRef = await addDoc(reportsCollection, reportData);
      results.push({ id: docRef.id, ...reportData });
    }

    return results;
  },

  async getReportHistory(userId: string) {
    const reportsCollection = collection(db, 'reports');
    const q = query(
      reportsCollection,
      where('generatedBy', '==', userId),
      where('status', '==', 'completed')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async deleteReport(reportId: string) {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      status: 'deleted',
      deletedAt: new Date()
    });
  }
};
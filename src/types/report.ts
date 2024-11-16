export interface ReportCard {
  id: string;
  studentId: string;
  schoolId: string;
  classId: string;
  term: number;
  year: number;
  subjects: Subject[];
  totalScore: number;
  averageScore: number;
  rank: number;
  teacherRemarks: string;
  principalRemarks: string;
  generatedDate: Date;
  templateId: string;
}

export interface Subject {
  name: string;
  score: number;
  grade: string;
  teacher: string;
  remarks: string;
}
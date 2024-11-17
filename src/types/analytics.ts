export interface ReportData {
    studentId: string;
    scores: {
      subjectId: string;
      score: number;
      grade: string;
    }[];
    totalScore: number;
    averageScore: number;
    term: number;
    year: number;
    createdAt: Date;
  }
  
  export interface SubjectPerformance {
    subjectId: string;
    averageScore: number;
    studentCount: number;
    topScore: number;
    lowScore: number;
  }
  
  export interface TrendDataPoint {
    period: string;
    average: number;
    studentCount: number;
  }
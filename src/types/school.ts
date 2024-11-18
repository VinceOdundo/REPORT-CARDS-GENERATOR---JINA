export interface School {
  id: string;
  name: string;
  address: string;
  country: string;
  phone: string;
  email: string;
  logo?: string;
  principal: string;
  established: number;
  curriculum: string;
  reportCardsGenerated: number;
  subscriptionId: string;
}

export interface Class {
  id: string;
  name: string;
  teacher: string;
  students: string[];
  subjects: string[];
  schoolId: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  classId: string;
  guardianName: string;
  guardianContact: string;
  guardianEmail?: string;
  subjects: {
    id: string;
    name: string;
    teacher: string;
  }[];
  attendance: {
    present: number;
    absent: number;
    total: number;
  };
  performanceHistory: {
    term: number;
    year: number;
    averageScore: number;
    rank: number;
  }[];
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  enrollmentDate: Date;
  schoolId: string;
}
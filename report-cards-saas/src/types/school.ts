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
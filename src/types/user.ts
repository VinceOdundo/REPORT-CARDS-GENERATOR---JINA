import { User as FirebaseUser } from 'firebase/auth';

export interface User extends Omit<FirebaseUser, 'providerData'> {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'teacher' | 'principal';
  schoolId: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  permissions: Permission[];
  emailVerified: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}
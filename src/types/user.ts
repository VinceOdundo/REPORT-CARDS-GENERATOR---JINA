export interface User {
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
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}
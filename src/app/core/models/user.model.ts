export type UserRole = 'employee' | 'manager';

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

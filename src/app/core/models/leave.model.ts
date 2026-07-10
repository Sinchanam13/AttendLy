export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id?: string;
  uid: string;
  employeeName: string;
  from: string; // ISO date, format YYYY-MM-DD
  to: string; // ISO date, format YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  createdAt?: number;
  decidedAt?: number;
}

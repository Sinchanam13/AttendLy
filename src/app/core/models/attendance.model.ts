export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'half-day';


export interface AttendanceRecord {

  id?: string;

  uid: string;

  employeeName: string;

  date: string;

  status: AttendanceStatus;

  checkIn?: string | null;

  checkOut?: string | null;

}
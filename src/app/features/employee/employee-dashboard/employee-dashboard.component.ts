import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Unsubscribe } from 'firebase/firestore';

import { AuthService } from '../../../core/services/auth.service';
import { AttendanceService } from '../../../core/services/attendance.service';
import { LeaveService } from '../../../core/services/leave.service';

import { AttendanceRecord, AttendanceStatus } from '../../../core/models/attendance.model';
import { LeaveRequest } from '../../../core/models/leave.model';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss',
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly attendanceService = inject(AttendanceService);
  private readonly leaveService = inject(LeaveService);

  private unsubscribeAttendance?: Unsubscribe;
  private unsubscribeLeave?: Unsubscribe;

  readonly month = signal(currentMonth());
  readonly records = signal<AttendanceRecord[]>([]);
  readonly leaveRequests = signal<LeaveRequest[]>([]);

  readonly presentCount = computed(
    () => this.records().filter((r) => r.status === 'present').length,
  );

  readonly pendingCount = computed(
    () => this.leaveRequests().filter((l) => l.status === 'pending').length,
  );

  // ----- Mark / edit attendance form -----
  readonly statuses: AttendanceStatus[] = ['present', 'absent', 'half-day'];

  formDate = today();
  formStatus: AttendanceStatus = 'present';
  formCheckIn = '';
  formCheckOut = '';

  /** Id of the record currently being edited, or null when creating a new one. */
  readonly editingId = signal<string | null>(null);

  savingAttendance = signal(false);
  attendanceError = signal<string | null>(null);

  ngOnInit(): void {
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeAttendance?.();
    this.unsubscribeLeave?.();
  }

  private subscribe(): void {
    const uid = this.authService.firebaseUser()?.uid;
    if (!uid) return;

    this.unsubscribeAttendance?.();
    this.unsubscribeAttendance = this.attendanceService.watchForEmployee(uid, this.month(), (records) =>
      this.records.set(records),
    );

    this.unsubscribeLeave?.();
    this.unsubscribeLeave = this.leaveService.watchForEmployee(uid, (requests) =>
      this.leaveRequests.set(requests),
    );
  }

  onMonthChange(value: string): void {
    this.month.set(value);
    this.subscribe();
  }

  /** True while a record for `formDate` already exists (i.e. save will overwrite it). */
  readonly recordForFormDate = computed(
    () => this.records().find((r) => r.date === this.formDate) ?? null,
  );

  startEdit(record: AttendanceRecord): void {
    this.editingId.set(record.id ?? null);
    this.formDate = record.date;
    this.formStatus = record.status;
    this.formCheckIn = record.checkIn ?? '';
    this.formCheckOut = record.checkOut ?? '';
    this.attendanceError.set(null);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.formDate = today();
    this.formStatus = 'present';
    this.formCheckIn = '';
    this.formCheckOut = '';
    this.attendanceError.set(null);
  }

  async saveAttendance(): Promise<void> {
    const user = this.authService.profile();
    if (!user) return;

    this.attendanceError.set(null);

    if (!this.formDate) {
      this.attendanceError.set('Please choose a date.');
      return;
    }

    this.savingAttendance.set(true);
    try {
      await this.attendanceService.markAttendance({
        uid: user.uid,
        employeeName: user.name,
        date: this.formDate,
        status: this.formStatus,
        checkIn: this.formStatus === 'absent' ? null : this.formCheckIn || null,
        checkOut: this.formStatus === 'absent' ? null : this.formCheckOut || null,
      });
      this.resetForm();
    } finally {
      this.savingAttendance.set(false);
    }
  }

  async deleteAttendance(record: AttendanceRecord): Promise<void> {
    const confirmDelete = confirm('Delete this attendance record?');
    if (!confirmDelete) return;

    await this.attendanceService.deleteAttendance(record.uid, record.date);

    if (this.editingId() === record.id) {
      this.resetForm();
    }
  }

  // ----- Leave -----
  leaveFrom = today();
  leaveTo = today();
  leaveReason = '';
  savingLeave = signal(false);
  leaveError = signal<string | null>(null);

  async submitLeave(): Promise<void> {
    const user = this.authService.profile();
    if (!user) return;

    this.leaveError.set(null);

    if (this.leaveTo < this.leaveFrom) {
      this.leaveError.set('End date must be on or after the start date.');
      return;
    }

    if (!this.leaveReason.trim()) {
      this.leaveError.set('Please add a short reason.');
      return;
    }

    this.savingLeave.set(true);
    try {
      await this.leaveService.requestLeave({
        uid: user.uid,
        employeeName: user.name,
        from: this.leaveFrom,
        to: this.leaveTo,
        reason: this.leaveReason.trim(),
      });
      this.leaveReason = '';
    } finally {
      this.savingLeave.set(false);
    }
  }
}

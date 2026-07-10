import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Unsubscribe } from 'firebase/firestore';
import { AttendanceService } from '../../../core/services/attendance.service';
import { LeaveService } from '../../../core/services/leave.service';
import { AttendanceRecord } from '../../../core/models/attendance.model';
import { LeaveRequest, LeaveStatus } from '../../../core/models/leave.model';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss',
})
export class ManagerDashboardComponent implements OnInit, OnDestroy {
  private readonly attendanceService = inject(AttendanceService);
  private readonly leaveService = inject(LeaveService);

  private unsubscribeAttendance?: Unsubscribe;
  private unsubscribeLeave?: Unsubscribe;

  readonly month = signal(currentMonth());
  readonly employeeFilter = signal<string>('all');
  readonly allRecords = signal<AttendanceRecord[]>([]);
  readonly leaveRequests = signal<LeaveRequest[]>([]);

  readonly employeeNames = computed(() => {
    const names = new Set(this.allRecords().map((r) => r.employeeName));
    this.leaveRequests().forEach((l) => names.add(l.employeeName));
    return Array.from(names).sort();
  });

  readonly filteredRecords = computed(() =>
    this.employeeFilter() === 'all'
      ? this.allRecords()
      : this.allRecords().filter((r) => r.employeeName === this.employeeFilter()),
  );

  readonly presentCount = computed(
    () => this.filteredRecords().filter((r) => r.status === 'present').length,
  );
  readonly pendingRequests = computed(() =>
    this.leaveRequests().filter((l) => l.status === 'pending'),
  );

  ngOnInit(): void {
    this.subscribeAttendance();
    this.unsubscribeLeave = this.leaveService.watchAll((r) => this.leaveRequests.set(r));
  }

  ngOnDestroy(): void {
    this.unsubscribeAttendance?.();
    this.unsubscribeLeave?.();
  }

  private subscribeAttendance(): void {
    this.unsubscribeAttendance?.();
    this.unsubscribeAttendance = this.attendanceService.watchAll(this.month(), (r) =>
      this.allRecords.set(r),
    );
  }

  onMonthChange(value: string): void {
    this.month.set(value);
    this.subscribeAttendance();
  }

  async decide(request: LeaveRequest, status: LeaveStatus): Promise<void> {
    if (!request.id) return;
    await this.leaveService.decide(request.id, status);
  }
}

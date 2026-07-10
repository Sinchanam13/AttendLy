import { Injectable } from '@angular/core';
import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AttendanceRecord } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly collectionRef = collection(db, 'attendance');

  /** One attendance record per employee per day, keyed as "{uid}_{date}". */
  private docId(uid: string, date: string): string {
    return `${uid}_${date}`;
  }

  async markAttendance(record: AttendanceRecord): Promise<void> {
    const id = this.docId(record.uid, record.date);

    await setDoc(doc(this.collectionRef, id), {
      ...record,
      createdAt: Date.now(),
    });
  }

  async updateAttendance(
    uid: string,
    date: string,
    data: Partial<AttendanceRecord>
  ): Promise<void> {

    const id = this.docId(uid, date);

    await updateDoc(
      doc(this.collectionRef, id),
      data
    );

  }
  async deleteAttendance(uid: string, date: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef, this.docId(uid, date)));
  }

  /** Live subscription to one employee's attendance records for a given month (YYYY-MM). */
  watchForEmployee(
    uid: string,
    month: string,
    callback: (records: AttendanceRecord[]) => void,
  ): Unsubscribe {
    const q = query(
      this.collectionRef,
      where('uid', '==', uid),
      orderBy('date', 'asc')
    );

    return onSnapshot(q, (snap) => {
      const records = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as AttendanceRecord) }))
        .filter((r) => r.date.startsWith(month));

      callback(records);
    });
  }

  /** Live subscription to every employee's attendance for a given month (manager view). */
  watchAll(
    month: string,
    callback: (records: AttendanceRecord[]) => void,
  ): Unsubscribe {
    const q = query(this.collectionRef, orderBy('date', 'asc'));

    return onSnapshot(q, (snap) => {
      const records = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as AttendanceRecord) }))
        .filter((r) => r.date.startsWith(month));

      callback(records);
    });
  }
}
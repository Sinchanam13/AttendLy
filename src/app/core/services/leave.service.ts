import { Injectable } from '@angular/core';
import {
  Unsubscribe,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { LeaveRequest, LeaveStatus } from '../models/leave.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly collectionRef = collection(db, 'leave');

  async requestLeave(request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): Promise<void> {
    await addDoc(this.collectionRef, {
      ...request,
      status: 'pending' as LeaveStatus,
      createdAt: Date.now(),
    });
  }

  async decide(id: string, status: LeaveStatus): Promise<void> {
    await updateDoc(doc(this.collectionRef, id), { status, decidedAt: Date.now() });
  }

  /** Live subscription to one employee's leave requests. */
  watchForEmployee(uid: string, callback: (requests: LeaveRequest[]) => void): Unsubscribe {
    const q = query(this.collectionRef, where('uid', '==', uid), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as LeaveRequest) })));
    });
  }

  /** Live subscription to every leave request (manager view). */
  watchAll(callback: (requests: LeaveRequest[]) => void): Unsubscribe {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as LeaveRequest) })));
    });
  }
}

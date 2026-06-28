import {
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from '../config/firebase-config';

export function onAuthChange(
  callback: (user: FirebaseUser | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export function requireAuth(redirectPath = '/login'): void {
  if (typeof window === 'undefined') return;
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = redirectPath;
    }
  });
}

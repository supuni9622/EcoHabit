'use client';

import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

interface AdminState {
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  setFirebaseUser: (u: FirebaseUser | null) => void;
  setIsAdmin: (v: boolean) => void;
  setLoading: (v: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  firebaseUser: null,
  isAdmin: false,
  loading: true,
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (loading) => set({ loading }),
}));

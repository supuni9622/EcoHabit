import { User } from 'firebase/auth';

export async function isAdminUser(firebaseUser: User): Promise<boolean> {
  const token = await firebaseUser.getIdTokenResult(true);
  return token.claims['role'] === 'admin';
}

export async function signInAsAdmin(firebaseUser: User): Promise<boolean> {
  const isAdmin = await isAdminUser(firebaseUser);
  return isAdmin;
}

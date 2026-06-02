// src/api/auth.ts
// TODO(backend): replace every function here with real Supabase/API calls.

import { getItem, setItem, remove } from './storage';

// NOTE: passwords are stored plain-text here intentionally for the demo.
// Real auth MUST hash passwords (e.g. bcrypt/Argon2) before storage — never ship this stub to prod.

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  branchId: string;
  role: 'student' | 'branch_admin';
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  branchId: string;
  password: string;
}

type UserRecord = { password: string; profile: Profile };

const delay = () => new Promise(r => setTimeout(r, 400));
const uid   = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const userKey     = (email: string) => `sr:user:${email.toLowerCase()}`;
const SESSION_KEY = 'sr:session';

// TODO(backend): replace with real API call
export async function register(input: RegisterInput): Promise<Profile> {
  await delay();
  const existing = await getItem<UserRecord>(userKey(input.email));
  if (existing) throw new Error('An account with this email already exists.');

  const profile: Profile = {
    id:        uid(),
    name:      input.name.trim(),
    email:     input.email.toLowerCase().trim(),
    phone:     input.phone.trim(),
    idNumber:  input.idNumber.trim(),
    branchId:  input.branchId,
    role:      'student',
    createdAt: new Date().toISOString(),
  };
  await setItem<UserRecord>(userKey(profile.email), { password: input.password, profile });
  return profile;
}

// TODO(backend): replace with real API call
export async function login(email: string, password: string): Promise<Profile> {
  await delay();
  const record = await getItem<UserRecord>(userKey(email));
  if (!record) throw new Error('No account found with this email.');
  if (record.password !== password) throw new Error('Incorrect password.');
  await setItem<Profile>(SESSION_KEY, record.profile);
  return record.profile;
}

// TODO(backend): replace with real API call
export async function logout(): Promise<void> {
  await delay();
  await remove(SESSION_KEY);
}

// TODO(backend): replace with real API call
export async function getCurrentUser(): Promise<Profile | null> {
  return getItem<Profile>(SESSION_KEY);
}

// TODO(backend): replace with real API call — real role assignment is a backend/admin concern.
export async function setLocalRole(email: string, role: Profile['role']): Promise<Profile> {
  await delay();
  const record = await getItem<UserRecord>(userKey(email));
  if (!record) throw new Error('User not found.');
  const updated: Profile = { ...record.profile, role };
  await setItem<UserRecord>(userKey(email), { ...record, profile: updated });
  await setItem<Profile>(SESSION_KEY, updated);
  return updated;
}

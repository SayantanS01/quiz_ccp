import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface User {
  username: string; // Normalized (lowercase) used as primary key
  displayName: string; // Original casing
  passcodeHash: string; // SHA-256 hash
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Session {
  sessionId: string; // e.g. "session-uuid"
  username: string;
  startedAt: string;
  lastActivityAt: string;
  isAdmin: boolean;
}

// Minimal question representation for the bank
export interface IDBQuestion {
  id: string;
  questionCode: string;
  questionText: string;
  type: string;
  domainId: number;
  domain: string;
  topic: string;
  difficulty: string;
  requiredSelections: number;
  explanation: string;
  sourceModule?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface IDBQuestionResponse {
  questionId: string;
  displayNumber: number;
  originalQuestionId: string;
  type?: string;
  requiredSelections?: number;
  displayedOptions: { id: string; label: string; text: string; isCorrect: boolean }[];
  selectedAnswers: string[];
  correctAnswers: string[];
  isScored: boolean;
  timeSpentSeconds: number;
  flagged: boolean;
}

export interface IDBMonitoringEvent {
  timestamp: string;
  type: string;
  details?: string;
}

export interface LocalAttempt {
  attemptId: string;
  username: string;
  candidateName: string;
  mode?: string;
  startedAt: string;
  submittedAt: string | null;
  status: 'in_progress' | 'completed';
  durationSeconds: number;
  questionCount: number;
  scoredQuestionCount: number;
  unscoredQuestionCount: number;
  questions: IDBQuestionResponse[];
  incidents: IDBMonitoringEvent[];
  score: number | null;
  totalScored: number | null;
  percentage: number | null;
  passed: boolean | null;
  expiresAt: string;
  details?: any; // Extra backward compatibility
}

interface CloudPrepDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  sessions: {
    key: string;
    value: Session;
  };
  questionBank: {
    key: string;
    value: IDBQuestion;
    indexes: { 'by-domain': number };
  };
  attempts: {
    key: string;
    value: LocalAttempt;
    indexes: { 'by-username': string };
  };
}

let dbPromise: Promise<IDBPDatabase<CloudPrepDB>> | null = null;

export function getDB() {
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB<CloudPrepDB>('CloudPrepDB', 2, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'username' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'sessionId' });
        }
        if (!db.objectStoreNames.contains('attempts')) {
          const attemptsStore = db.createObjectStore('attempts', { keyPath: 'attemptId' });
          attemptsStore.createIndex('by-username', 'username');
        }
        if (!db.objectStoreNames.contains('questionBank')) {
          const bankStore = db.createObjectStore('questionBank', { keyPath: 'id' });
          bankStore.createIndex('by-domain', 'domainId');
        }
      },
    });
  }
  return dbPromise;
}

// --------------------------------------------------
// UTILS
// --------------------------------------------------

export async function hashPasscode(passcode: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(passcode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

// --------------------------------------------------
// AUTH & USERS
// --------------------------------------------------

export async function createUser(displayName: string, passcode: string): Promise<{ success: boolean; error?: string }> {
  const db = await getDB();
  if (!db) throw new Error('IndexedDB not available');

  const username = displayName.trim().toLowerCase();
  if (!username) return { success: false, error: 'Name is required' };
  
  if (username === 'admin') {
    return { success: false, error: 'This name is reserved.' };
  }

  if (!/^\d{4}$/.test(passcode)) {
    return { success: false, error: 'Passcode must be exactly 4 digits (0-9).' };
  }

  const existing = await db.get('users', username);
  if (existing) {
    return { success: false, error: 'An account with this name already exists. Please log in.' };
  }

  const hash = await hashPasscode(passcode);
  
  await db.put('users', {
    username,
    displayName: displayName.trim(),
    passcodeHash: hash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null
  });

  return { success: true };
}

export async function loginUser(displayName: string, passcode: string): Promise<{ success: boolean; error?: string; session?: Session }> {
  const db = await getDB();
  if (!db) throw new Error('IndexedDB not available');

  const username = displayName.trim().toLowerCase();
  
  // Handle Admin login specifically
  if (username === 'admin' && passcode === '0216') {
    const session: Session = {
      sessionId: generateId(),
      username: 'admin',
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      isAdmin: true,
    };
    await db.put('sessions', session);
    localStorage.setItem('cloudprep_session', session.sessionId);
    return { success: true, session };
  } else if (username === 'admin') {
    return { success: false, error: 'Incorrect name or passcode. Please try again.' };
  }

  const user = await db.get('users', username);
  if (!user) {
    return { success: false, error: 'Incorrect name or passcode. Please try again.' };
  }

  const hash = await hashPasscode(passcode);
  if (user.passcodeHash !== hash) {
    return { success: false, error: 'Incorrect name or passcode. Please try again.' };
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  await db.put('users', user);

  const session: Session = {
    sessionId: generateId(),
    username: user.username,
    startedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    isAdmin: false,
  };

  await db.put('sessions', session);
  localStorage.setItem('cloudprep_session', session.sessionId);

  return { success: true, session };
}

export async function getActiveSession(): Promise<Session | null> {
  const db = await getDB();
  if (!db) return null;

  const sessionId = localStorage.getItem('cloudprep_session');
  if (!sessionId) return null;

  const session = await db.get('sessions', sessionId);
  if (!session) {
    localStorage.removeItem('cloudprep_session');
    return null;
  }

  // Update last activity
  session.lastActivityAt = new Date().toISOString();
  await db.put('sessions', session);

  return session;
}

export async function logoutUser() {
  const db = await getDB();
  if (!db) return;

  const sessionId = localStorage.getItem('cloudprep_session');
  if (sessionId) {
    await db.delete('sessions', sessionId);
    localStorage.removeItem('cloudprep_session');
  }
}

// --------------------------------------------------
// ATTEMPTS & RETENTION
// --------------------------------------------------

export async function saveLocalAttempt(attempt: LocalAttempt) {
  const db = await getDB();
  if (!db) return;
  await db.put('attempts', attempt);
}

export async function getUserAttempts(username: string): Promise<LocalAttempt[]> {
  const db = await getDB();
  if (!db) return [];
  const attempts = await db.getAllFromIndex('attempts', 'by-username', username);
  return attempts.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getAllAttemptsAdmin(): Promise<LocalAttempt[]> {
  const db = await getDB();
  if (!db) return [];
  return (await db.getAll('attempts')).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getAllUsersAdmin(): Promise<User[]> {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll('users');
}

export async function deleteUserAndData(username: string) {
  const db = await getDB();
  if (!db) return;
  
  await db.delete('users', username);
  const attempts = await db.getAllFromIndex('attempts', 'by-username', username);
  for (const att of attempts) {
    await db.delete('attempts', att.attemptId);
  }
}

export async function purgeExpiredAttempts() {
  const db = await getDB();
  if (!db) return;
  
  const now = new Date().getTime();
  const allAttempts = await db.getAll('attempts');
  
  for (const att of allAttempts) {
    if (new Date(att.expiresAt).getTime() < now) {
      await db.delete('attempts', att.attemptId);
    }
  }
}

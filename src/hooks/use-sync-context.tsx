import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { SyncError, syncToServer } from '@/lib/sync';

interface SyncContextValue {
  keyphrase: string | null;
  setKeyphrase: (keyphrase: string) => void;
  clearKeyphrase: () => void;
  syncNow: (overrideKeyphrase?: string) => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  lastSyncError: string | null;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [keyphrase, setKeyphraseState] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const dbRef = useRef(db);
  dbRef.current = db;

  const setKeyphrase = useCallback((value: string) => {
    setKeyphraseState(value);
  }, []);

  const clearKeyphrase = useCallback(() => {
    setKeyphraseState(null);
  }, []);

  const syncNow = useCallback(async (overrideKeyphrase?: string) => {
    const phrase = overrideKeyphrase ?? keyphrase;
    if (!phrase) {
      throw new SyncError('Enter your keyphrase to sync');
    }

    setIsSyncing(true);
    setLastSyncError(null);
    try {
      await syncToServer(dbRef.current, phrase);
      if (!keyphrase) {
        setKeyphraseState(phrase);
      }
      setLastSyncedAt(new Date());
    } catch (error) {
      const message =
        error instanceof SyncError
          ? error.message
          : 'Sync failed. Check that the server is running.';
      setLastSyncError(message);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [keyphrase]);

  const value = useMemo(
    () => ({
      keyphrase,
      setKeyphrase,
      clearKeyphrase,
      syncNow,
      isSyncing,
      lastSyncedAt,
      lastSyncError,
    }),
    [
      keyphrase,
      setKeyphrase,
      clearKeyphrase,
      syncNow,
      isSyncing,
      lastSyncedAt,
      lastSyncError,
    ],
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}

export async function syncIfUnlocked(
  db: SQLiteDatabase,
  keyphrase: string | null,
): Promise<void> {
  if (!keyphrase) {
    return;
  }
  await syncToServer(db, keyphrase);
}

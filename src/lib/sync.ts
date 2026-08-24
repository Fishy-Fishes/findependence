import { SQLiteDatabase } from 'expo-sqlite';

import { getApiBaseUrl } from '@/lib/api';
import {
  decryptWithKeyphrase,
  deriveSyncId,
  encryptWithKeyphrase,
  EncryptedPayload,
} from '@/lib/crypto';

export interface AppData {
  version: number;
  entries: Record<string, string>;
}

export class SyncError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyncError';
  }
}

export async function exportAppData(db: SQLiteDatabase): Promise<AppData> {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM app',
  );
  const entries: Record<string, string> = {};
  for (const row of rows) {
    entries[row.key] = row.value;
  }
  return { version: 1, entries };
}

export async function importAppData(
  db: SQLiteDatabase,
  data: AppData,
): Promise<void> {
  for (const [key, value] of Object.entries(data.entries)) {
    await db.runAsync('REPLACE INTO app (key, value) VALUES (?, ?)', key, value);
  }
}

async function uploadPayload(
  syncId: string,
  payload: EncryptedPayload,
): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/sync/${syncId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new SyncError('Failed to upload encrypted backup');
  }
}

async function downloadPayload(syncId: string): Promise<EncryptedPayload | null> {
  const response = await fetch(`${getApiBaseUrl()}/sync/${syncId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new SyncError('Failed to download encrypted backup');
  }

  return response.json();
}

export async function syncToServer(
  db: SQLiteDatabase,
  keyphrase: string,
): Promise<void> {
  const data = await exportAppData(db);
  const payload = await encryptWithKeyphrase(keyphrase, JSON.stringify(data));
  const syncId = deriveSyncId(keyphrase);
  await uploadPayload(syncId, payload);
}

export async function restoreFromServer(
  db: SQLiteDatabase,
  keyphrase: string,
): Promise<void> {
  const syncId = deriveSyncId(keyphrase);
  const payload = await downloadPayload(syncId);

  if (!payload) {
    throw new SyncError('No backup found for this keyphrase');
  }

  let decrypted: string;
  try {
    decrypted = decryptWithKeyphrase(keyphrase, payload);
  } catch {
    throw new SyncError('Incorrect keyphrase');
  }

  let data: AppData;
  try {
    data = JSON.parse(decrypted);
  } catch {
    throw new SyncError('Incorrect keyphrase');
  }

  await importAppData(db, data);
}
